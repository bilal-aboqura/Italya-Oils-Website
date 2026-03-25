import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    console.log(`[PATCH /api/admin/products/${id}] Updating with body:`, body);

    // Sanitize data
    const updateData: Record<string, unknown> = {};
    if (body.name) updateData.name = body.name;
    
    if (body.price !== undefined) {
      const parsedPrice = typeof body.price === "string" ? parseFloat(body.price) : body.price;
      if (!isNaN(parsedPrice)) {
        updateData.price = parsedPrice;
      }
    }

    if (body.salePrice !== undefined) {
      const parsedSalePrice = body.salePrice === null || body.salePrice === "" 
        ? null 
        : (typeof body.salePrice === "string" ? parseFloat(body.salePrice) : body.salePrice);
      updateData.salePrice = (parsedSalePrice !== null && !isNaN(parsedSalePrice)) ? parsedSalePrice : null;
    }

    if (body.isOnSale !== undefined) updateData.isOnSale = Boolean(body.isOnSale);
    if (body.brand !== undefined) updateData.brand = body.brand || null;
    if (body.imageUrl !== undefined) updateData.imageUrl = body.imageUrl || null;
    if (body.isActive !== undefined) updateData.isActive = body.isActive;
    if (body.sortOrder !== undefined) updateData.sortOrder = body.sortOrder;

    // Handle multi-category assignment (categoryIds: string[])
    if (body.categoryIds !== undefined && Array.isArray(body.categoryIds)) {
      const categoryIds: string[] = body.categoryIds.filter(Boolean);
      
      // Update the product
      const product = await prisma.product.update({
        where: { id },
        data: updateData,
      });

      // Sync ProductCategory join records
      await prisma.productCategory.deleteMany({ where: { productId: id } });
      if (categoryIds.length > 0) {
        await prisma.productCategory.createMany({
          data: categoryIds.map((categoryId) => ({ productId: id, categoryId })),
        });
      }

      return NextResponse.json({ product });
    }

    // Legacy: single categoryId support (backward compat)
    if (body.categoryId !== undefined) {
      const categoryId: string | null = body.categoryId || null;
      await prisma.productCategory.deleteMany({ where: { productId: id } });
      if (categoryId) {
        await prisma.productCategory.create({ data: { productId: id, categoryId } });
      }
    }

    const product = await prisma.product.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ product });
  } catch (err: unknown) {
    const errMsg = err instanceof Error ? err.message : "Failed to update product.";
    console.error(`[PATCH /api/admin/products] Error updating:`, err);
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: errMsg } },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    // Delete join records first
    await prisma.productCategory.deleteMany({ where: { productId: id } });
    await prisma.product.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[DELETE /api/admin/products/[id]]", err);
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "Failed to delete product." } },
      { status: 500 }
    );
  }
}
