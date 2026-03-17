import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { v2 as cloudinary } from "cloudinary";
import axios from "axios";
import { Readable } from "stream";
import type { UploadApiResponse, UploadApiErrorResponse } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export async function POST(req: NextRequest) {
  try {
    const { productId, imageUrl } = await req.json();

    if (!productId || !imageUrl) {
      return NextResponse.json(
        { error: "productId و imageUrl مطلوبان" },
        { status: 400 }
      );
    }

    // Download image buffer from URL
    console.log(`[ImageGrabber] Attempting to download from: ${imageUrl}`);
    let imageResponse;
    try {
      imageResponse = await axios.get(imageUrl, {
        responseType: "arraybuffer",
        timeout: 30000,
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
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
    console.log(`[ImageGrabber] Downloaded ${imageBuffer.length} bytes. Uploading to Cloudinary...`);

    // Upload to Cloudinary
    const uploadResult = await new Promise<{ secure_url: string }>(
      (resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "italyaoils/products",
            resource_type: "image",
            transformation: [
              { width: 800, height: 800, crop: "fill", gravity: "center" },
              { quality: "auto:good", fetch_format: "auto" },
            ],
          },
          (error: UploadApiErrorResponse | undefined, result: UploadApiResponse | undefined) => {
            if (error || !result) {
              console.error("[ImageGrabber] Cloudinary Stream Error:", error);
              reject(error || new Error("Upload failed"));
            }
            else {
              console.log("[ImageGrabber] Cloudinary Success:", result.secure_url);
              resolve(result as { secure_url: string });
            }
          }
        );

        // Convert buffer to stream
        const readable = new Readable();
        readable.push(imageBuffer);
        readable.push(null);
        readable.pipe(stream);
      }
    );

    // Save Cloudinary URL to product in DB
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
    console.error("image-grabber assign error:", err);
    return NextResponse.json(
      { error: "فشل في رفع الصورة أو حفظها", details: err.message || "خطأ غير معروف" },
      { status: 500 }
    );
  }
}
