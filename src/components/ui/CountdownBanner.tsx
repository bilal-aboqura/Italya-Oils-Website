"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface Banner {
    title: string;
    subtitle: string;
    imageUrl: string | null;
    buttonText: string;
    buttonLink: string;
    endsAt: string;
    isActive: boolean;
}

const pad = (n: number) => String(n).padStart(2, "0");

function getRemaining(endTime: number) {
    const diff = Math.max(0, endTime - Date.now());
    return {
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
    };
}

export default function CountdownBanner({ banner }: { banner: Banner }) {
    const endTime = new Date(banner.endsAt).getTime();

    // Use null until mounted to avoid hydration mismatch
    const [time, setTime] = useState<ReturnType<typeof getRemaining> | null>(null);

    useEffect(() => {
        // Set initial value after mount (client-only)
        setTime(getRemaining(endTime));
        const interval = setInterval(() => setTime(getRemaining(endTime)), 1000);
        return () => clearInterval(interval);
    }, [endTime]);

    const units = [
        { label: "يوم", value: pad(time?.days ?? 0) },
        { label: "ساعة", value: pad(time?.hours ?? 0) },
        { label: "دقيقة", value: pad(time?.minutes ?? 0) },
        { label: "ثانية", value: pad(time?.seconds ?? 0) },
    ];

    return (
        <section
            className="w-full bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 flex flex-col md:flex-row min-h-[220px]"
            dir="rtl"
        >
            {/* Left: Text & Timer */}
            <div className="flex-1 flex flex-col justify-center px-8 py-10 gap-5">
                <div>
                    <h2 className="text-3xl lg:text-4xl font-black text-brand-navy leading-tight mb-2">
                        {banner.title}
                    </h2>
                    <p className="text-slate-500 text-sm font-medium">{banner.subtitle}</p>
                </div>

                {/* Countdown — suppress hydration warning on the numbers */}
                <div className="flex items-center gap-3 flex-wrap">
                    {units.map((u, i) => (
                        <div key={u.label} className="flex items-center gap-3">
                            <div className="flex flex-col items-center">
                                <span
                                    suppressHydrationWarning
                                    className="text-3xl lg:text-4xl font-black text-brand-navy tabular-nums leading-none"
                                >
                                    {time === null ? "--" : u.value}
                                </span>
                                <span className="text-xs text-slate-400 font-bold mt-1">{u.label}</span>
                            </div>
                            {i < units.length - 1 && (
                                <span className="text-2xl font-black text-brand-orange leading-none pb-4">
                                    :
                                </span>
                            )}
                        </div>
                    ))}
                </div>

                <div>
                    <Link href={banner.buttonLink} className="btn-primary inline-flex px-8 py-3 text-sm">
                        {banner.buttonText}
                    </Link>
                </div>
            </div>

            {/* Right: Image */}
            <div className="w-full md:w-[45%] flex-shrink-0 relative min-h-[220px] bg-slate-100">
                {banner.imageUrl ? (
                    <Image
                        src={banner.imageUrl}
                        alt={banner.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 45vw"
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
                        <span className="material-symbols-outlined text-[80px] text-slate-300">
                            shopping_cart
                        </span>
                    </div>
                )}
            </div>
        </section>
    );
}
