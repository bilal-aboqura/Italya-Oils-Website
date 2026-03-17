import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { v2 as cloudinary } from "cloudinary";
import axios from "axios";
import { Readable } from "stream";
import type { UploadApiResponse, UploadApiErrorResponse } from "cloudinary";

const cloudName = process.env.CLOUDINARY_CLOUD_NAME?.trim();
const apiKey = process.env.CLOUDINARY_API_KEY?.trim();
const apiSecret = process.env.CLOUDINARY_API_SECRET?.trim();

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
});

export async function POST(req: NextRequest) {
  // Validate credentials first
  if (!cloudName || !apiKey || !apiSecret) {
    console.error("[ImageGrabber] Missing Cloudinary credentials:", {
      cloudName: !!cloudName,
      apiKey: !!apiKey,
      apiSecret: !!apiSecret,
    });
    return NextResponse.json(
      {
        error: "إعدادات Cloudinary غير مكتملة في ملف .env",
        details: "CLOUDINARY_CLOUD_NAME أو CLOUDINARY_API_KEY أو CLOUDINARY_API_SECRET غير موجودة أو فارغة",
      },
      { status: 500 }
    );
  }

  try {
    const { productId, imageUrl: rawImageUrl } = await req.json();

    if (!productId || !rawImageUrl) {
      return NextResponse.json(
        { error: "productId و imageUrl مطلوبان" },
        { status: 400 }
      );
    }

    // Extract real URL if it's a Next.js image optimizer URL (/_next/image?url=...)
    let imageUrl = rawImageUrl;
    try {
      const parsed = new URL(rawImageUrl);
      if (parsed.pathname.includes("/_next/image")) {
        const realUrl = parsed.searchParams.get("url");
        if (realUrl) {
          // If url is relative (starts with /), prepend the origin
          imageUrl = realUrl.startsWith("http") ? realUrl : `${parsed.origin}${realUrl}`;
          console.log(`[ImageGrabber] Unwrapped Next.js image URL: ${rawImageUrl} -> ${imageUrl}`);
        }
      }
    } catch {
      // keep original url if parsing fails
    }

    // Download image buffer from URL
    console.log(`[ImageGrabber] Attempting to download from: ${imageUrl}`);
    let imageResponse;
    try {
      imageResponse = await axios.get(imageUrl, {
        responseType: "arraybuffer",
        timeout: 30000,
        maxRedirects: 5,
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          "Accept": "image/webp,image/apng,image/*,*/*;q=0.8",
        },
      });
    } catch (downloadErr: any) {
      console.error(`[ImageGrabber] Download failed for ${imageUrl}:`, downloadErr.message);
      return NextResponse.json(
        { error: "تعذر تحميل الصورة من المصدر", details: downloadErr.message },
        { status: 502 }
      );
    }

    const imageBuffer = Buffer.from(imageResponse.data);
    const contentType = (imageResponse.headers["content-type"] as string) || "image/jpeg";
    console.log(`[ImageGrabber] Downloaded ${imageBuffer.length} bytes (${contentType}). Uploading to Cloudinary...`);

    if (imageBuffer.length < 100) {
      return NextResponse.json(
        { error: "الصورة المحملة صغيرة جداً أو فارغة، تحقق من رابط المصدر" },
        { status: 422 }
      );
    }

    // Upload to Cloudinary via stream
    const uploadResult = await new Promise<{ secure_url: string }>(
      (resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "italyaoils/products",
            resource_type: "image",
            transformation: [
              { width: 800, height: 800, crop: "pad", background: "white" },
              { quality: "auto:good", fetch_format: "auto" },
            ],
          },
          (
            error: UploadApiErrorResponse | undefined,
            result: UploadApiResponse | undefined
          ) => {
            if (error || !result) {
              console.error(
                "[ImageGrabber] Cloudinary Stream Error:",
                JSON.stringify(error)
              );
              reject(new Error(error?.message || "Upload to Cloudinary failed"));
            } else {
              console.log("[ImageGrabber] Cloudinary Success:", result.secure_url);
              resolve(result as { secure_url: string });
            }
          }
        );

        const readable = new Readable();
        readable.push(imageBuffer);
        readable.push(null);
        readable.pipe(stream);
      }
    );

    // Save URL to product in DB
    console.log(`[ImageGrabber] Updating DB for product ${productId}...`);
    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: { imageUrl: uploadResult.secure_url },
      select: { id: true, name: true, imageUrl: true },
    });

    return NextResponse.json({
      success: true,
      product: updatedProduct,
      cloudinaryUrl: uploadResult.secure_url,
    });
  } catch (err: any) {
    console.error("image-grabber assign error:", err.message || err);
    return NextResponse.json(
      {
        error: "فشل في رفع الصورة أو حفظها",
        details: err.message || "خطأ غير معروف",
      },
      { status: 500 }
    );
  }
}
