"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { usePathname } from "next/navigation";

interface PromoBanner {
  id: string;
  imageUrl: string;
  linkUrl: string | null;
  title: string;
}

export default function PromoCarousel() {
  const pathname = usePathname();
  const [banners, setBanners] = useState<PromoBanner[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    fetch(`/api/storefront/promos?targetPage=${encodeURIComponent(pathname)}`)
      .then((res) => res.json())
      .then((data) => setBanners(data.banners ?? []))
      .catch(() => {});
  }, [pathname]);

  const prev = useCallback(() => {
    setCurrentIndex((i) => (i === 0 ? banners.length - 1 : i - 1));
  }, [banners.length]);

  const next = useCallback(() => {
    setCurrentIndex((i) => (i === banners.length - 1 ? 0 : i + 1));
  }, [banners.length]);

  // Auto-advance
  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [banners.length, next]);

  if (banners.length === 0) return null;

  return (
    <div className="relative rounded-xl overflow-hidden my-6 group"
      style={{ aspectRatio: "3 / 1" }}>
      {banners.map((banner, i) => (
        <div
          key={banner.id}
          className={`absolute inset-0 transition-opacity duration-500 ${
            i === currentIndex ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          {banner.linkUrl ? (
            <a href={banner.linkUrl} target="_blank" rel="noopener noreferrer">
              <Image
                src={banner.imageUrl}
                alt={banner.title}
                fill
                className="object-cover"
              />
            </a>
          ) : (
            <Image
              src={banner.imageUrl}
              alt={banner.title}
              fill
              className="object-cover"
            />
          )}
        </div>
      ))}

      {/* Controls */}
      {banners.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={next}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Dots */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {banners.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  i === currentIndex ? "bg-white" : "bg-white/40"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
