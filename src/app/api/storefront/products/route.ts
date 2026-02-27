import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const brand = searchParams.get("brand");
    const category = searchParams.get("category");
    const search = searchParams.get("search");

    const products = await prisma.product.findMany({
      where: {
        isActive: true,
        ...(brand ? { brand: { equals: brand } } : {}),
        ...(category
          ? { category: { slug: { equals: category } } }
          : {}),
        ...(search
          ? {
            OR: [
              { name: { contains: search } },
              { brand: { contains: search } },
              { description: { contains: search } },
            ],
          }
          : {}),
      },
      include: {
        category: {
          select: { name: true, slug: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ products });
  } catch (err) {
    console.error("[GET /api/storefront/products]", err);
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "Failed to fetch products." } },
      { status: 500 }
    );
  }
}
