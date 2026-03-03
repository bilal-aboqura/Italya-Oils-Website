import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { load as cheerioLoad } from "cheerio";

export async function POST(req: NextRequest) {
  try {
    const { query, count = 8 } = await req.json();

    if (!query) {
      return NextResponse.json(
        { error: "يرجى إدخال اسم المنتج" },
        { status: 400 }
      );
    }

    const images = await scrapeGoogleImages(query, count);
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

async function scrapeGoogleImages(query: string, count: number) {
  const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}&tbm=isch&ijn=0`;

  const { data: html } = await axios.get(searchUrl, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      "Accept-Language": "en-US,en;q=0.9,ar;q=0.8",
      Accept: "text/html,application/xhtml+xml",
    },
    timeout: 15000,
  });

  const images: { title: string; thumbnail: string; full: string; source: string }[] = [];
  const seen = new Set<string>();

  // Method 1: Extract from script tags (full-res URLs)
  const scriptRegex = /\["(https?:\/\/[^"]+\.(?:jpg|jpeg|png|webp|gif))",[0-9]+,[0-9]+\]/gi;
  let match;

  while ((match = scriptRegex.exec(html)) !== null && images.length < count) {
    let url = match[1];
    if (
      url.includes("gstatic.com") ||
      url.includes("google.com") ||
      url.includes("googleapis.com") ||
      url.includes("favicon")
    )
      continue;

    url = url
      .replace(/\\u003d/g, "=")
      .replace(/\\u0026/g, "&")
      .replace(/\\\//g, "/");

    if (seen.has(url)) continue;
    seen.add(url);

    try {
      images.push({
        title: `${query} - صورة ${images.length + 1}`,
        thumbnail: url,
        full: url,
        source: new URL(url).hostname,
      });
    } catch {
      // Skip invalid URLs
    }
  }

  // Method 2: Fallback — parse <img> tags
  if (images.length < count) {
    const $ = cheerioLoad(html);
    $("img").each((_: number, el: import('domhandler').Element) => {
      if (images.length >= count) return false;
      const src = $(el).attr("src") || $(el).attr("data-src") || "";
      if (
        src.startsWith("http") &&
        !src.includes("gstatic.com") &&
        !src.includes("google.com") &&
        !seen.has(src)
      ) {
        seen.add(src);
        try {
          images.push({
            title: $(el).attr("alt") || `${query} - صورة ${images.length + 1}`,
            thumbnail: src,
            full: src,
            source: new URL(src).hostname,
          });
        } catch {
          // Skip invalid URLs
        }
      }
    });
  }

  return images;
}
