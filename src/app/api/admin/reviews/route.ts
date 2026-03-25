import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/admin/reviews?status=pending|approved|rejected|all
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    const where = status && status !== "all" ? { status } : {};

    const reviews = await prisma.review.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ reviews });
  } catch (err) {
    console.error("[GET /api/admin/reviews]", err);
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "تعذّر تحميل التقييمات." } },
      { status: 500 }
    );
  }
}

// PATCH /api/admin/reviews — approve or reject a review
// Body: { id: string, status: "approved" | "rejected" }
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status } = body;

    if (!id || !["approved", "rejected", "pending"].includes(status)) {
      return NextResponse.json(
        { error: { code: "VALIDATION_ERROR", message: "id والحالة مطلوبان." } },
        { status: 400 }
      );
    }

    const review = await prisma.review.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json({ success: true, review });
  } catch (err) {
    console.error("[PATCH /api/admin/reviews]", err);
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "فشل تحديث التقييم." } },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/reviews — delete a review
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: { code: "VALIDATION_ERROR", message: "id مطلوب." } },
        { status: 400 }
      );
    }

    await prisma.review.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[DELETE /api/admin/reviews]", err);
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "فشل حذف التقييم." } },
      { status: 500 }
    );
  }
}
