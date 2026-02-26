import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const targetPage = searchParams.get("targetPage");

    if (!targetPage) {
      return NextResponse.json(
        { error: { code: "BAD_REQUEST", message: "targetPage is required." } },
        { status: 400 }
      );
    }

    const banners = await prisma.promoBanner.findMany({
      where: { targetPage, isActive: true },
      orderBy: { sortOrder: "asc" },
      select: { id: true, imageUrl: true, linkUrl: true, sortOrder: true, title: true },
    });

    return NextResponse.json({ banners });
  } catch (err) {
    console.error("[GET /api/storefront/promos]", err);
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "Failed to fetch promos." } },
      { status: 500 }
    );
  }
}
