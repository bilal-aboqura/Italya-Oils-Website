import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET — list all brand logos
export async function GET() {
  const logos = await prisma.brandLogo.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
  });
  return NextResponse.json(logos);
}

// POST — create a brand logo
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, logoUrl, sortOrder } = body;

  if (!name || !logoUrl) {
    return NextResponse.json(
      { error: { message: "name and logoUrl are required" } },
      { status: 400 }
    );
  }

  const logo = await prisma.brandLogo.create({
    data: { name, logoUrl, sortOrder: sortOrder ?? 0 },
  });

  return NextResponse.json(logo, { status: 201 });
}

// DELETE — delete by ?id=
export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: { message: "id is required" } }, { status: 400 });
  }

  await prisma.brandLogo.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
