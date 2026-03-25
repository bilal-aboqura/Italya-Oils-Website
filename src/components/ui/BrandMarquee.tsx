import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { unstable_noStore as noStore } from "next/cache";

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

export default async function BrandMarquee() {
  noStore(); // Force Next.js to not cache this component

  const logos = await prisma.brandLogo.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
  });

  const hasLogos = logos.length > 0;
  
  // Start with the items you want to display
  let displayItems = hasLogos ? logos : FALLBACK_BRANDS;

  // Multiply the items until we have enough to fill an ultra-wide screen (at least 20 items = ~4000px track width)
  // This guarantees that the 50% translation will never end before the loop resets
  while (displayItems.length < 20) {
    displayItems = [...displayItems, ...displayItems];
  }

  const baseItems = displayItems;

  return (
    <div className="w-full overflow-hidden py-10 relative bg-slate-50 border-y border-slate-100/60">
      {/* Decorative gradient edges for smooth fading */}
      <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-slate-50 to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-slate-50 to-transparent z-10 pointer-events-none" />

      {/* The animated wrapper moves 50% left infinitely */}
      <div className="flex w-max animate-marquee hover:[animation-play-state:paused] group">
        
        {/* Track 1 */}
        <div className="flex gap-8 pl-8">
          {baseItems.map((item, i) => (
            <div
              key={`t1-${i}`}
              className="flex items-center justify-center shrink-0 px-8 py-4 bg-white rounded-2xl shadow-[0_4px_16px_rgb(0,0,0,0.03)] hover:shadow-[0_8px_24px_rgb(0,0,0,0.08)] transition-all duration-300 w-[180px] h-[80px]"
            >
              {hasLogos ? (
                <div className="relative w-full h-full grayscale hover:grayscale-0 transition-all duration-300 opacity-80 hover:opacity-100">
                  <Image
                    src={(item as any).logoUrl}
                    alt={item.name}
                    fill
                    className="object-contain"
                    unoptimized
                  />
                </div>
              ) : (
                <span className="text-lg flex items-center h-full justify-center text-center font-black text-slate-400 group-hover:text-brand-navy transition-colors whitespace-nowrap tracking-tight">
                  {item.name}
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Track 2 (Duplicate for seamless loop) */}
        <div className="flex gap-8 pl-8" aria-hidden="true">
          {baseItems.map((item, i) => (
            <div
              key={`t2-${i}`}
              className="flex items-center justify-center shrink-0 px-8 py-4 bg-white rounded-2xl shadow-[0_4px_16px_rgb(0,0,0,0.03)] hover:shadow-[0_8px_24px_rgb(0,0,0,0.08)] transition-all duration-300 w-[180px] h-[80px]"
            >
              {hasLogos ? (
                <div className="relative w-full h-full grayscale hover:grayscale-0 transition-all duration-300 opacity-80 hover:opacity-100">
                  <Image
                    src={(item as any).logoUrl}
                    alt={item.name}
                    fill
                    className="object-contain"
                    unoptimized
                  />
                </div>
              ) : (
                <span className="text-lg flex items-center h-full justify-center text-center font-black text-slate-400 group-hover:text-brand-navy transition-colors whitespace-nowrap tracking-tight">
                  {item.name}
                </span>
              )}
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

