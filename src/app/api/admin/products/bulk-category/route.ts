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

    // Add category association to each product (join table - skip if already exists)
    let updatedCount = 0;
    for (const productId of productIds) {
      try {
        await prisma.productCategory.create({
          data: { productId, categoryId },
        });
        updatedCount++;
      } catch {
        // Skip if duplicate (product already in this category)
      }
    }

    return NextResponse.json({ updatedCount });
  } catch (err) {
    console.error("[PATCH /api/admin/products/bulk-category]", err);
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "Bulk category update failed." } },
      { status: 500 }
    );
  }
}
