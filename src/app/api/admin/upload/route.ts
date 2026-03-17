import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_SIZE_BYTES = 10 * 1024 * 1024; // Increased to 10 MB for convenience

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: { code: "BAD_REQUEST", message: "No file provided." } },
        { status: 400 }
      );
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        {
          error: {
            code: "VALIDATION_ERROR",
            message: `Unsupported file type: ${file.type}. Allowed: JPEG, PNG, WebP, GIF.`,
          },
        },
        { status: 422 }
      );
    }

    if (file.size > MAX_SIZE_BYTES) {
      return NextResponse.json(
        {
          error: {
            code: "VALIDATION_ERROR",
            message: `File too large. Maximum size is 10MB.`,
          },
        },
        { status: 422 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Data = `data:${file.type};base64,${buffer.toString("base64")}`;

    // Upload to Cloudinary using SDK
    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload(
        base64Data,
        {
          folder: "italyaoils/uploads",
          resource_type: "image",
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
    }) as any;

    return NextResponse.json({ url: uploadResult.secure_url });
  } catch (err: any) {
    console.error("[POST /api/admin/upload] Full Error:", err);
    return NextResponse.json(
      { 
        error: { 
          code: "INTERNAL_ERROR", 
          message: err.message || "Upload failed.",
          details: err
        } 
      },
      { status: 500 }
    );
  }
}
