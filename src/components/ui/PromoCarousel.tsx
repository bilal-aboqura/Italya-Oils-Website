"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import Image from "next/image";
import { ChevronRight, ChevronLeft } from "lucide-react";

interface PromoBanner {
  id: string;
  imageUrl: string;
  linkUrl: string | null;
  title: string;
}

// Skeleton shimmer while loading
function BannerSkeleton({ aspectRatio, fullWidth }: { aspectRatio: string; fullWidth?: boolean }) {
  return (
    <div
      className={`relative overflow-hidden bg-slate-100 animate-pulse ${fullWidth ? "rounded-md w-full" : "rounded-3xl"
        }`}
      style={{ aspectRatio }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-slate-100 via-slate-200 to-slate-100 animate-shimmer" />
    </div>
  );
}

export default function PromoCarousel({
  placement = "home_hero",
  aspectRatio = "16 / 9",
  fullWidth = false,
}: {
  placement?: string;
  aspectRatio?: string;
  fullWidth?: boolean;
}) {
  const [banners, setBanners] = useState<PromoBanner[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const INTERVAL_MS = 5000;

  useEffect(() => {
    setLoading(true);
    fetch(`/api/storefront/promos?targetPage=${encodeURIComponent(placement)}`)
      .then((res) => res.json())
      .then((data) => setBanners(data.banners ?? []))
      .catch(() => { })
      .finally(() => setLoading(false));
  }, [placement]);

  const goTo = useCallback((idx: number) => {
    setCurrentIndex(idx);
  }, []);

  const prev = useCallback(() => {
    setCurrentIndex((i) => (i - 1 + banners.length) % banners.length);
  }, [banners.length]);

  const next = useCallback(() => {
    setCurrentIndex((i) => (i + 1) % banners.length);
  }, [banners.length]);

  // Auto-slide effect
  useEffect(() => {
    if (banners.length <= 1 || isPaused) return;

    const timer = setInterval(() => {
      setCurrentIndex((i) => (i + 1) % banners.length);
    }, INTERVAL_MS);

    return () => clearInterval(timer);
  }, [banners.length, isPaused]);

  // Touch swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) next();
      else prev();
    }
    touchStartX.current = null;
  };

  if (loading) return <BannerSkeleton aspectRatio={aspectRatio} fullWidth={fullWidth} />;
  if (banners.length === 0) return null;

  return (
    <div
      className={`relative overflow-hidden group select-none ${fullWidth ? "rounded-md w-full" : "rounded-3xl shadow-lg"
        }`}
      style={{ aspectRatio }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Slides */}
      {banners.map((banner, i) => {
        const offset = i - currentIndex;
        return (
          <div
            key={banner.id}
            className="absolute inset-0 transition-transform duration-500 ease-in-out will-change-transform"
            style={{
              transform: `translateX(${offset * 100}%)`,
            }}
          >
            {banner.linkUrl ? (
              <a href={banner.linkUrl} rel="noopener noreferrer">
                <Image
                  src={banner.imageUrl}
                  alt={banner.title}
                  fill
                  className="object-cover"
                  priority={i === 0}
                  unoptimized
                />
              </a>
            ) : (
              <Image
                src={banner.imageUrl}
                alt={banner.title}
                fill
                className="object-cover"
                priority={i === 0}
                unoptimized
              />
            )}
          </div>
        );
      })}

      {/* Arrow Controls */}
      {banners.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-black/40 backdrop-blur-sm text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-black/60 hover:scale-110 active:scale-95"
            aria-label="السابق"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
          <button
            onClick={next}
            className="absolute left-3 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-black/40 backdrop-blur-sm text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-black/60 hover:scale-110 active:scale-95"
            aria-label="التالي"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Dot indicators */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
            {banners.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                aria-label={`الانتقال للبانر ${i + 1}`}
                className={`rounded-full transition-all duration-300 ${i === currentIndex
                  ? "w-6 h-2 bg-white"
                  : "w-2 h-2 bg-white/50 hover:bg-white/80"
                  }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
