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
    const updateData: any = {};
    if (body.name) updateData.name = body.name;
    
    if (body.price !== undefined) {
      const parsedPrice = typeof body.price === "string" ? parseFloat(body.price) : body.price;
      if (!isNaN(parsedPrice)) {
        updateData.price = parsedPrice;
      }
    }

    if (body.brand !== undefined) updateData.brand = body.brand || null;
    if (body.categoryId !== undefined) updateData.categoryId = body.categoryId || null;
    if (body.imageUrl !== undefined) updateData.imageUrl = body.imageUrl || null;
    if (body.isActive !== undefined) updateData.isActive = body.isActive;

    const product = await prisma.product.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ product });
  } catch (err: any) {
    console.error(`[PATCH /api/admin/products] Error updating:`, err);
    return NextResponse.json(
      { 
        error: { 
          code: "INTERNAL_ERROR", 
          message: err.message || "Failed to update product.",
          details: err 
        } 
      },
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
