import Image from "next/image";

export interface BrandLogo {
  id: string;
  name: string;
  imageUrl: string;
}

interface BrandLogosBannerProps {
  logos: BrandLogo[];
}

export default function BrandLogosBanner({ logos }: BrandLogosBannerProps) {
  if (!logos || logos.length === 0) return null;

<<<<<<< HEAD
  // Repeat logos if there are too few to fill the screen to prevent animation snapping issues
  const repeatedLogos = [...logos, ...logos, ...logos, ...logos, ...logos, ...logos].slice(
    0,
    Math.max(logos.length, 12)
  );

  return (
    <section className="py-12 relative bg-slate-50 border-y border-slate-200 overflow-hidden grid-pattern">
      {/* Decorative gradient background overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/60 to-transparent pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-4 lg:px-8 mb-8 flex flex-col items-center relative z-10">
        <h2 className="text-xs md:text-sm font-black tracking-[0.2em] text-slate-400 uppercase">
          علامات تجارية نثق بها
        </h2>
        <div className="w-12 h-1 bg-brand-orange mt-3 rounded-full opacity-50"></div>
      </div>

      {/* Marquee Container with fade masks on left and right edges */}
      <div 
        dir="ltr" 
        className="relative flex w-full gap-12 group overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)] z-10 py-4"
      >
        {/* First track */}
        <div className="flex shrink-0 animate-marquee gap-12 group-hover:[animation-play-state:paused] items-center">
          {repeatedLogos.map((logo, index) => (
            <div
              key={`${logo.id}-${index}-1`}
              className="w-36 h-20 md:w-48 md:h-24 relative flex items-center justify-center bg-white rounded-2xl border border-slate-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] hover:shadow-xl hover:shadow-brand-orange/10 hover:border-brand-orange/30 hover:-translate-y-1 transition-all duration-300 group/logo"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-brand-orange/5 to-transparent opacity-0 group-hover/logo:opacity-100 transition-opacity rounded-2xl" />
              <Image
                src={logo.imageUrl}
                alt={logo.name}
                fill
                className="object-contain p-4 md:p-6 grayscale opacity-50 group-hover/logo:grayscale-0 group-hover/logo:opacity-100 transition-all duration-300 ease-out"
                sizes="(max-width: 768px) 144px, 192px"
              />
            </div>
          ))}
        </div>

        {/* Second track (duplicate) */}
        <div
          className="flex shrink-0 animate-marquee gap-12 group-hover:[animation-play-state:paused] items-center"
          aria-hidden="true"
        >
          {repeatedLogos.map((logo, index) => (
            <div
              key={`${logo.id}-${index}-2`}
              className="w-36 h-20 md:w-48 md:h-24 relative flex items-center justify-center bg-white rounded-2xl border border-slate-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] hover:shadow-xl hover:shadow-brand-orange/10 hover:border-brand-orange/30 hover:-translate-y-1 transition-all duration-300 group/logo"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-brand-orange/5 to-transparent opacity-0 group-hover/logo:opacity-100 transition-opacity rounded-2xl" />
              <Image
                src={logo.imageUrl}
                alt={logo.name}
                fill
                className="object-contain p-4 md:p-6 grayscale opacity-50 group-hover/logo:grayscale-0 group-hover/logo:opacity-100 transition-all duration-300 ease-out"
                sizes="(max-width: 768px) 144px, 192px"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
=======
  // We duplicate the logos array to create the seamless infinite scrolling effect
  return (
    <div className="w-full overflow-hidden bg-white py-10 my-8 border-y border-slate-100 flex gap-12 group">
      <div className="flex shrink-0 animate-marquee gap-12 group-hover:[animation-play-state:paused] items-center">
        {logos.map((logo) => (
          <div
            key={logo.id}
            className="w-32 h-16 md:w-40 md:h-20 relative flex items-center justify-center grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
          >
            <Image
              src={logo.imageUrl}
              alt={logo.name}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 128px, 160px"
            />
          </div>
        ))}
      </div>
      
      {/* Duplicated list for seamless looping */}
      <div 
        className="flex shrink-0 animate-marquee gap-12 group-hover:[animation-play-state:paused] items-center" 
        aria-hidden="true"
      >
        {logos.map((logo) => (
          <div
            key={`${logo.id}-dup`}
            className="w-32 h-16 md:w-40 md:h-20 relative flex items-center justify-center grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
          >
            <Image
              src={logo.imageUrl}
              alt={logo.name}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 128px, 160px"
            />
          </div>
        ))}
      </div>
    </div>
>>>>>>> a03e08654d3f8ee86ce989def723291acab52801
  );
}
