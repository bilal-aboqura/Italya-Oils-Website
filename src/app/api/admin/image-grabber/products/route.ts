import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      select: {
        id: true,
        name: true,
        sku: true,
        brand: true,
        imageUrl: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ products });
  } catch (err) {
    console.error("image-grabber products error:", err);
    return NextResponse.json(
      { error: "فشل في جلب المنتجات" },
      { status: 500 }
    );
  }
}
