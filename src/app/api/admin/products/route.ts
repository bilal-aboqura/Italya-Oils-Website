import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// POST — Create a single new product
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sku, name, price, brand, viscosity, categoryId, description, imageUrl } = body;

    if (!sku || !name || price === undefined || price === null) {
      return NextResponse.json(
        { error: { code: "VALIDATION_ERROR", message: "الحقول المطلوبة: رقم الصنف (sku)، اسم الصنف (name)، والسعر (price)." } },
        { status: 422 }
      );
    }

    const parsedPrice = parseFloat(String(price));
    if (isNaN(parsedPrice) || parsedPrice < 0) {
      return NextResponse.json(
        { error: { code: "VALIDATION_ERROR", message: "السعر يجب أن يكون رقماً صحيحاً." } },
        { status: 422 }
      );
    }

    // Check SKU uniqueness
    const existing = await prisma.product.findUnique({ where: { sku } });
    if (existing) {
      return NextResponse.json(
        { error: { code: "DUPLICATE_SKU", message: `رقم الصنف "${sku}" مستخدم مسبقاً.` } },
        { status: 409 }
      );
    }

    const product = await prisma.product.create({
      data: {
        sku,
        name,
        price: parsedPrice,
        brand: brand || null,
        viscosity: viscosity || null,
        description: description || null,
        imageUrl: imageUrl || null,
        categoryId: categoryId || null,
      },
      include: { category: { select: { name: true } } },
    });

    return NextResponse.json({ product }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/admin/products]", err);
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "فشل إنشاء المنتج." } },
      { status: 500 }
    );
  }
}
