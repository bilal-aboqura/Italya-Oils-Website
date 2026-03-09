import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET: fetch current banner
export async function GET() {
    const banner = await prisma.countdownBanner.findFirst({
        orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(banner);
}

// PUT: upsert the banner
export async function PUT(req: Request) {
    try {
        const body = await req.json();
        const { title, subtitle, imageUrl, buttonText, buttonLink, endsAt, isActive } = body;

        if (!endsAt) {
            return NextResponse.json({ error: { message: "يجب تحديد تاريخ انتهاء العرض" } }, { status: 400 });
        }

        const existing = await prisma.countdownBanner.findFirst({ orderBy: { createdAt: "desc" } });

        let banner;
        if (existing) {
            banner = await prisma.countdownBanner.update({
                where: { id: existing.id },
                data: {
                    title: title?.trim() || existing.title,
                    subtitle: subtitle?.trim() ?? existing.subtitle,
                    imageUrl: imageUrl ?? existing.imageUrl,
                    buttonText: buttonText?.trim() || existing.buttonText,
                    buttonLink: buttonLink?.trim() || existing.buttonLink,
                    endsAt: new Date(endsAt),
                    isActive: isActive ?? existing.isActive,
                },
            });
        } else {
            banner = await prisma.countdownBanner.create({
                data: {
                    title: title?.trim() || "خصومات ما تتفوت",
                    subtitle: subtitle?.trim() || "استمتع بخصومات مميزة على مختلف المنتجات طوال العام",
                    imageUrl: imageUrl || null,
                    buttonText: buttonText?.trim() || "تسوق الآن",
                    buttonLink: buttonLink?.trim() || "/?section=products",
                    endsAt: new Date(endsAt),
                    isActive: isActive ?? true,
                },
            });
        }

        return NextResponse.json(banner);
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: { message: "حدث خطأ في الخادم" } }, { status: 500 });
    }
}
