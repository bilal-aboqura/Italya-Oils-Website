import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET all promo banners (admin listing)
export async function GET() {
  try {
    const banners = await prisma.promoBanner.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ banners });
  } catch (err) {
    console.error("[GET /api/admin/promos]", err);
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "Failed to fetch promos." } },
      { status: 500 }
    );
  }
}

// POST create a new promo banner
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, imageUrl, linkUrl, targetPage, sortOrder } = body;

    if (!title || !imageUrl || !targetPage) {
      return NextResponse.json(
        { error: { code: "VALIDATION_ERROR", message: "title, imageUrl, and targetPage are required." } },
        { status: 422 }
      );
    }

    const banner = await prisma.promoBanner.create({
      data: {
        title,
        imageUrl,
        linkUrl: linkUrl || null,
        targetPage,
        sortOrder: sortOrder ?? 0,
      },
    });

    return NextResponse.json({ banner });
  } catch (err) {
    console.error("[POST /api/admin/promos]", err);
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "Failed to create promo." } },
      { status: 500 }
    );
  }
}
