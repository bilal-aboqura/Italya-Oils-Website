"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const FALLBACK_BRANDS = [
  { name: "Mobil 1" },
  { name: "Shell" },
  { name: "Castrol" },
  { name: "Total" },
  { name: "Valvoline" },
  { name: "Liqui Moly" },
  { name: "Motul" },
  { name: "Gulf" },
  { name: "Havoline" },
  { name: "Pennzoil" },
];

interface BrandLogo {
  id: string;
  name: string;
  logoUrl: string;
}

export default function BrandMarquee() {
  const [logos, setLogos] = useState<BrandLogo[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch("/api/admin/brand-logos")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setLogos(data);
      })
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, []);

  const hasLogos = logos.length > 0;

  // Duplicate items for seamless infinite loop
  const items = hasLogos ? [...logos, ...logos] : [...FALLBACK_BRANDS, ...FALLBACK_BRANDS];

  return (
    <div className="w-full overflow-hidden py-6 relative">
      {/* Fade edges */}
      <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-slate-50 to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-slate-50 to-transparent z-10 pointer-events-none" />

      <div className="flex animate-marquee gap-8 w-max">
        {items.map((item, i) => (
          <div
            key={i}
            className="flex items-center justify-center shrink-0 px-6 py-3 bg-white rounded-2xl border border-slate-100 shadow-[0_2px_12px_rgb(0,0,0,0.04)] hover:shadow-[0_4px_20px_rgb(0,0,0,0.08)] transition-shadow duration-300 group"
            style={{ minWidth: hasLogos ? 100 : "auto" }}
          >
            {hasLogos ? (
              <div className="relative w-20 h-10">
                <Image
                  src={(item as BrandLogo).logoUrl}
                  alt={item.name}
                  fill
                  className="object-contain"
                  unoptimized
                />
              </div>
            ) : (
              <span className="text-base font-black text-slate-700 group-hover:text-brand-navy transition-colors whitespace-nowrap tracking-tight">
                {item.name}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

