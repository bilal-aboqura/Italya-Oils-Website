import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { productIds, categoryId } = body;

    if (!Array.isArray(productIds) || productIds.length === 0) {
      return NextResponse.json(
        { error: { code: "VALIDATION_ERROR", message: "productIds must be a non-empty array." } },
        { status: 400 }
      );
    }

    if (!categoryId || typeof categoryId !== "string") {
      return NextResponse.json(
        { error: { code: "VALIDATION_ERROR", message: "categoryId is required." } },
        { status: 400 }
      );
    }

    // Verify category exists
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      return NextResponse.json(
        { error: { code: "NOT_FOUND", message: "Category not found." } },
        { status: 404 }
      );
    }

    const result = await prisma.product.updateMany({
      where: { id: { in: productIds } },
      data: { categoryId },
    });

    return NextResponse.json({ updatedCount: result.count });
  } catch (err) {
    console.error("[PATCH /api/admin/products/bulk-category]", err);
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "Bulk category update failed." } },
      { status: 500 }
    );
  }
}
