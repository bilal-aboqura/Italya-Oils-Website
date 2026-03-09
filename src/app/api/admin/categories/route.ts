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

    // ── Server-side validation (FR-008) ────────────────────────────────────────
    const name = typeof body.name === "string" ? body.name.trim() : "";
    if (!name) {
        return NextResponse.json(
            { error: { code: "VALIDATION_ERROR", message: "اسم التصنيف مطلوب." } },
            { status: 400 }
        );
    }

    // Optional description and image (FR-009)
    const description =
        typeof body.description === "string" ? body.description.trim() || null : null;
    const imageUrl =
        typeof body.imageUrl === "string" ? body.imageUrl.trim() || null : null;

    // ── Auto-generate slug (FR-011) ───────────────────────────────────────────
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

    // ── Persist to MongoDB via Prisma (FR-012) ────────────────────────────────
    try {
        const category = await prisma.category.create({
            data: { name, slug, description: description ?? undefined, imageUrl },
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
// Handy for refreshing the category list from the client without a full page reload.
export async function GET() {
    try {
        const categories = await prisma.category.findMany({
            orderBy: { name: "asc" },
            select: { id: true, name: true, slug: true },
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
