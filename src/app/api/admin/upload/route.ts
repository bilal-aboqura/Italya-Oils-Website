import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

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
            message: `File too large. Maximum size is 5MB.`,
          },
        },
        { status: 422 }
      );
    }

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      return NextResponse.json(
        { error: { code: "SERVER_ERROR", message: "Cloudinary credentials not set in .env" } },
        { status: 500 }
      );
    }

    const ext = file.type.split("/")[1];
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Data = `data:${file.type};base64,${buffer.toString("base64")}`;

    // Compute signature using crypto for signed upload
    const crypto = await import("crypto");
    const timestamp = Math.round(new Date().getTime() / 1000).toString();
    const signature = crypto.createHash("sha1").update(`timestamp=${timestamp}${apiSecret}`).digest("hex");

    // Send payload directly to Cloudinary via REST
    const cloudFormData = new FormData();
    cloudFormData.append("file", base64Data);
    cloudFormData.append("api_key", apiKey);
    cloudFormData.append("timestamp", timestamp);
    cloudFormData.append("signature", signature);

    const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
    
    const response = await fetch(cloudinaryUrl, {
      method: "POST",
      body: cloudFormData,
    });
    
    if (!response.ok) {
      const errResponse = await response.json();
      console.error("Cloudinary upload error:", errResponse);
      throw new Error(errResponse?.error?.message || "Failed to upload to Cloudinary");
    }

    const data = await response.json();

    return NextResponse.json({ url: data.secure_url });
  } catch (err) {
    console.error("[POST /api/admin/upload]", err);
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "Upload failed." } },
      { status: 500 }
    );
  }
}
