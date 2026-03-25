import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/storefront/reviews — public approved reviews
export async function GET() {
  try {
    const reviews = await prisma.review.findMany({
      where: { status: "approved" },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ reviews });
  } catch (err) {
    console.error("[GET /api/storefront/reviews]", err);
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "تعذّر تحميل التقييمات." } },
      { status: 500 }
    );
  }
}

// POST /api/storefront/reviews — submit a new review (pending)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, content, rating } = body;

    if (!name || !content) {
      return NextResponse.json(
        { error: { code: "VALIDATION_ERROR", message: "الاسم والمحتوى مطلوبان." } },
        { status: 400 }
      );
    }

    const parsedRating = Math.min(5, Math.max(1, parseInt(rating ?? "5", 10) || 5));

    const review = await prisma.review.create({
      data: {
        name: String(name).trim(),
        content: String(content).trim(),
        rating: parsedRating,
        status: "pending",
      },
    });

    return NextResponse.json({ success: true, review }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/storefront/reviews]", err);
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "فشل إرسال التقييم." } },
      { status: 500 }
    );
  }
}
