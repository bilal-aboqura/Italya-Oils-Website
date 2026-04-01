import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET — list ALL brand logos for admin (active + inactive), sorted by order
export async function GET() {
  try {
    const logos = await prisma.brandLogo.findMany({
      orderBy: { sortOrder: "asc" },
    });
    return NextResponse.json(logos);
  } catch (err) {
    console.error("[GET /api/admin/brand-logos]", err);
    return NextResponse.json(
      { error: { message: "Failed to fetch brand logos" } },
      { status: 500 }
    );
  }
}

// POST — create a brand logo
export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: { message: "Invalid JSON body" } },
      { status: 400 }
    );
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const logoUrl = typeof body.logoUrl === "string" ? body.logoUrl.trim() : "";

  if (!name || !logoUrl) {
    return NextResponse.json(
      { error: { message: "name and logoUrl are required" } },
      { status: 400 }
    );
  }

  try {
    // Append to end of sort order
    const last = await prisma.brandLogo.findFirst({ orderBy: { sortOrder: "desc" } });
    const nextOrder = (last?.sortOrder ?? -1) + 1;

    const logo = await prisma.brandLogo.create({
      data: { name, logoUrl, sortOrder: nextOrder },
    });
    return NextResponse.json(logo, { status: 201 });
  } catch (err) {
    console.error("[POST /api/admin/brand-logos]", err);
    return NextResponse.json(
      { error: { message: "Failed to create brand logo" } },
      { status: 500 }
    );
  }
}
