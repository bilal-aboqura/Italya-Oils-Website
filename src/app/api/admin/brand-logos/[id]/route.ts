import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// PATCH /api/admin/brand-logos/:id — patch isActive, sortOrder, or name
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!id) {
    return NextResponse.json(
      { error: { message: "id is required" } },
      { status: 400 }
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: { message: "Invalid JSON body" } },
      { status: 400 }
    );
  }

  const updateData: Record<string, unknown> = {};
  if (body.sortOrder !== undefined) updateData.sortOrder = Number(body.sortOrder);
  if (body.isActive !== undefined) updateData.isActive = Boolean(body.isActive);
  if (body.name !== undefined) updateData.name = body.name;

  if (Object.keys(updateData).length === 0) {
    return NextResponse.json(
      { error: { message: "No updatable fields provided" } },
      { status: 400 }
    );
  }

  try {
    const logo = await prisma.brandLogo.update({
      where: { id },
      data: updateData,
    });
    return NextResponse.json({ success: true, logo });
  } catch (err) {
    console.error("[PATCH /api/admin/brand-logos/:id]", err);
    return NextResponse.json(
      { error: { message: "Failed to update brand logo" } },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/brand-logos/:id
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!id) {
    return NextResponse.json(
      { error: { message: "id is required" } },
      { status: 400 }
    );
  }

  try {
    await prisma.brandLogo.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[DELETE /api/admin/brand-logos/:id]", err);
    return NextResponse.json(
      { error: { message: "Failed to delete brand logo" } },
      { status: 500 }
    );
  }
}
