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

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();

        // Server-side validation
        const name = typeof body.name === "string" ? body.name.trim() : undefined;
        const description = typeof body.description === "string" ? body.description.trim() || null : undefined;
        const imageUrl = typeof body.imageUrl === "string" ? body.imageUrl.trim() || null : undefined;

        let updateData: any = {};
        if (name !== undefined) {
            if (!name) {
                return NextResponse.json(
                    { error: { code: "VALIDATION_ERROR", message: "اسم التصنيف مطلوب." } },
                    { status: 400 }
                );
            }
            updateData.name = name;
            updateData.slug = generateSlug(name);
        }

        if (description !== undefined) {
            updateData.description = description;
        }

        if (imageUrl !== undefined) {
            updateData.imageUrl = imageUrl;
        }

        const category = await prisma.category.update({
            where: { id },
            data: updateData,
        });

        return NextResponse.json({ success: true, category });
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

        console.error("[PATCH /api/admin/categories/[id]]", err);
        return NextResponse.json(
            {
                error: {
                    code: "INTERNAL_ERROR",
                    message: "حدث خطأ داخلي أثناء تحديث التصنيف.",
                },
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

        // Check if there are products linked to this category via join table
        const productCount = await prisma.product.count({
            where: { categories: { some: { categoryId: id } } }
        });

        if (productCount > 0) {
            return NextResponse.json(
                {
                    error: {
                        code: "CONFLICT",
                        message: `لا يمكن حذف هذا التصنيف لأنه مرتبط بـ ${productCount} منتج. يرجى حذف المنتجات أو تغيير تصنيفها أولاً.`
                    }
                },
                { status: 409 }
            );
        }

        await prisma.category.delete({ where: { id } });
        return NextResponse.json({ success: true });
    } catch (err) {
        console.error("[DELETE /api/admin/categories/[id]]", err);
        return NextResponse.json(
            {
                error: {
                    code: "INTERNAL_ERROR",
                    message: "حدث خطأ داخلي أثناء حذف التصنيف.",
                },
            },
            { status: 500 }
        );
    }
}
