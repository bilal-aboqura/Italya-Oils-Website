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
  );
}
