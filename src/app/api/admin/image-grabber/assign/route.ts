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
    const imageResponse = await axios.get(imageUrl, {
      responseType: "arraybuffer",
      timeout: 30000,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    });

    const imageBuffer = Buffer.from(imageResponse.data);

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
            if (error || !result) reject(error || new Error("Upload failed"));
            else resolve(result as { secure_url: string });
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
  } catch (err) {
    const msg = err instanceof Error ? err.message : "خطأ غير معروف";
    console.error("image-grabber assign error:", msg);
    return NextResponse.json(
      { error: "فشل في رفع الصورة أو حفظها", details: msg },
      { status: 500 }
    );
  }
}
