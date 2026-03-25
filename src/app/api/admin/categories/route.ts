import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

/** Converts an arbitrary string (including Arabic) into a URL-safe slug. */
function generateSlug(name: string): string {
    return name
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "-")        // spaces → hyphens
        .replace(/[^\u0600-\u06FFa-z0-9-]/g, "") // remove unsupported chars
        .replace(/-+/g, "-")         // collapse consecutive hyphens
        .replace(/^-|-$/g, "");      // strip leading/trailing hyphens
}

// ── POST /api/admin/categories ────────────────────────────────────────────────
export async function POST(request: NextRequest) {
    let body: Record<string, unknown>;

    try {
        body = await request.json();
    } catch {
        return NextResponse.json(
            { error: { code: "BAD_REQUEST", message: "الطلب غير صالح." } },
            { status: 400 }
        );
    }

    const name = typeof body.name === "string" ? body.name.trim() : "";
    if (!name) {
        return NextResponse.json(
            { error: { code: "VALIDATION_ERROR", message: "اسم التصنيف مطلوب." } },
            { status: 400 }
        );
    }

    const description =
        typeof body.description === "string" ? body.description.trim() || null : null;
    const imageUrl =
        typeof body.imageUrl === "string" ? body.imageUrl.trim() || null : null;

    const slug = generateSlug(name);

    if (!slug) {
        return NextResponse.json(
            {
                error: {
                    code: "VALIDATION_ERROR",
                    message: "لم يتمكن النظام من توليد رابط صالح من الاسم المُدخل.",
                },
            },
            { status: 400 }
        );
    }

    try {
        // Get the max sortOrder to append new categories at the end
        const lastCat = await prisma.category.findFirst({
            orderBy: { sortOrder: "desc" },
            select: { sortOrder: true },
        });
        const nextSortOrder = (lastCat?.sortOrder ?? -1) + 1;

        const category = await prisma.category.create({
            data: { name, slug, description: description ?? undefined, imageUrl, sortOrder: nextSortOrder },
        });

        return NextResponse.json({ success: true, category }, { status: 201 });
    } catch (err) {
        if (
            err instanceof Prisma.PrismaClientKnownRequestError &&
            err.code === "P2002"
        ) {
            return NextResponse.json(
                {
                    error: {
                        code: "CONFLICT",
                        message: "يوجد تصنيف بهذا الاسم بالفعل. يرجى اختيار اسم مختلف.",
                    },
                },
                { status: 409 }
            );
        }

        console.error("[POST /api/admin/categories]", err);
        return NextResponse.json(
            {
                error: {
                    code: "INTERNAL_ERROR",
                    message: "حدث خطأ داخلي أثناء حفظ التصنيف.",
                },
            },
            { status: 500 }
        );
    }
}

// ── GET /api/admin/categories ─────────────────────────────────────────────────
export async function GET() {
    try {
        const categories = await prisma.category.findMany({
            orderBy: { sortOrder: "asc" },
            select: { id: true, name: true, slug: true, sortOrder: true },
        });
        return NextResponse.json({ categories });
    } catch (err) {
        console.error("[GET /api/admin/categories]", err);
        return NextResponse.json(
            { error: { code: "INTERNAL_ERROR", message: "تعذّر تحميل التصنيفات." } },
            { status: 500 }
        );
    }
}

// ── PATCH /api/admin/categories ───────────────────────────────────────────────
// Body: { id: string, sortOrder: number } — update sort order of a category
// OR: { id: string, name?, description?, imageUrl? } — update category fields
export async function PATCH(request: NextRequest) {
    try {
        const body = await request.json();
        const { id } = body;

        if (!id) {
            return NextResponse.json(
                { error: { code: "VALIDATION_ERROR", message: "id مطلوب." } },
                { status: 400 }
            );
        }

        const updateData: Record<string, unknown> = {};
        if (body.sortOrder !== undefined) updateData.sortOrder = body.sortOrder;
        if (body.name !== undefined) updateData.name = body.name;
        if (body.description !== undefined) updateData.description = body.description || null;
        if (body.imageUrl !== undefined) updateData.imageUrl = body.imageUrl || null;

        const category = await prisma.category.update({
            where: { id },
            data: updateData,
        });

        return NextResponse.json({ success: true, category });
    } catch (err) {
        console.error("[PATCH /api/admin/categories]", err);
        return NextResponse.json(
            { error: { code: "INTERNAL_ERROR", message: "تعذّر تحديث التصنيف." } },
            { status: 500 }
        );
    }
}
