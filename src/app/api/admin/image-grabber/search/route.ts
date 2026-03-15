import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { query, count = 8 } = await req.json();

    if (!query) {
      return NextResponse.json(
        { error: "يرجى إدخال اسم المنتج" },
        { status: 400 }
      );
    }

    const apiKey = process.env.SERPER_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "SERPER_API_KEY غير مُعرَّف في ملف البيئة (.env)" },
        { status: 500 }
      );
    }

    const res = await fetch("https://google.serper.dev/images", {
      method: "POST",
      headers: {
        "X-API-KEY": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ q: query, num: count, gl: "sa", hl: "ar" }),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("Serper API error:", res.status, text);
      return NextResponse.json(
        { error: "فشل الاتصال بـ Serper API", details: text },
        { status: 502 }
      );
    }

    const data = await res.json();

    // Serper returns { images: [{ title, imageUrl, thumbnailUrl, source, link }] }
    const images = (data.images ?? [])
      .slice(0, count)
      .map((img: { title?: string; imageUrl?: string; thumbnailUrl?: string; source?: string }) => ({
        title: img.title ?? query,
        thumbnail: img.thumbnailUrl ?? img.imageUrl ?? "",
        full: img.imageUrl ?? "",
        source: img.source ?? "",
      }))
      .filter((img: { full: string }) => img.full);

    return NextResponse.json({ query, images });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "خطأ غير معروف";
    console.error("image-grabber search error:", msg);
    return NextResponse.json(
      { error: "حدث خطأ أثناء البحث عن الصور", details: msg },
      { status: 500 }
    );
  }
}
