"use client";

import { useCartStore } from "@/lib/cart-store";
import { formatPrice } from "@/lib/whatsapp";
import Image from "next/image";
import Link from "next/link";

interface Product {
    id: string;
    name: string;
    price: number;
    brand: string | null;
    imageUrl: string | null;
    category: { name: string; slug: string } | null;
    viscosity?: string | null;
}

interface BrandGroup {
    brand: string;
    products: Product[];
}

export default function BrandRows({ groups }: { groups: BrandGroup[] }) {
    const { addItem } = useCartStore();

    if (groups.length === 0) {
        return (
            <div className="text-center py-20">
                <span className="material-symbols-outlined text-slate-300 text-[64px]">inventory_2</span>
                <p className="text-lg font-bold text-brand-navy mt-4">لا توجد منتجات متاحة</p>
            </div>
        );
    }

    return (
        <div className="space-y-10">
            {groups.map(({ brand, products }) => (
                <section key={brand}>
                    {/* Brand header */}
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-black text-brand-navy flex items-center gap-2">
                            <span className="size-2 bg-brand-orange rounded-full inline-block" />
                            {brand}
                            <span className="text-slate-400 font-normal text-sm">({products.length} منتج)</span>
                        </h2>
                        <a
                            href={`/?brand=${encodeURIComponent(brand)}`}
                            className="text-sm font-bold text-brand-orange hover:text-orange-600 flex items-center gap-1 transition-colors"
                        >
                            عرض الكل
                            <span className="material-symbols-outlined text-base">arrow_back_ios</span>
                        </a>
                    </div>

                    {/* Horizontal scrolling row */}
                    <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory customize-scrollbar">
                        {products.map((product) => (
                            <div
                                key={product.id}
                                className="snap-start shrink-0 w-[180px] sm:w-[220px] md:w-[240px] group bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-md hover:border-brand-orange/30 transition-all duration-300 flex flex-col"
                            >
                                {/* Image */}
                                <div className="relative h-36 bg-gradient-to-br from-slate-50 to-slate-100 overflow-hidden shrink-0">
                                    <Link href={`/products/${product.id}`} className="block relative h-full">
                                        {product.imageUrl ? (
                                            <Image
                                                src={product.imageUrl}
                                                alt={product.name}
                                                fill
                                                className="object-contain p-3 group-hover:scale-105 transition-transform duration-500"
                                            />
                                        ) : (
                                            <div className="flex items-center justify-center h-full">
                                                <span className="material-symbols-outlined text-slate-300 text-[48px]">
                                                    oil_barrel
                                                </span>
                                            </div>
                                        )}
                                    </Link>
                                </div>

                                {/* Content */}
                                <div className="p-3 flex flex-col flex-1">
                                    <Link href={`/products/${product.id}`} className="block">
                                        <h3 className="font-bold text-brand-navy text-xs leading-snug line-clamp-2 mb-1 hover:text-brand-orange transition-colors">
                                            {product.name}
                                        </h3>
                                    </Link>
                                    {product.viscosity && (
                                        <p className="text-[10px] text-slate-400 mb-2">{product.viscosity}</p>
                                    )}
                                    <div className="flex items-center justify-between mt-auto pt-2 border-t border-slate-50">
                                        <span className="text-base font-black text-brand-navy">
                                            {formatPrice(product.price)}
                                            <span className="text-[10px] text-slate-400 font-normal mr-0.5">ر.س</span>
                                        </span>
                                        <button
                                            onClick={() =>
                                                addItem({
                                                    id: product.id,
                                                    name: product.name,
                                                    price: product.price,
                                                    imageUrl: product.imageUrl,
                                                })
                                            }
                                            className="size-8 rounded-lg bg-brand-orange text-white flex items-center justify-center hover:bg-orange-600 active:scale-95 transition-all shadow-md shadow-brand-orange/30"
                                            aria-label={`إضافة ${product.name} للسلة`}
                                        >
                                            <span className="material-symbols-outlined text-sm">shopping_bag</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Divider */}
                    <div className="mt-8 border-b border-slate-100" />
                </section>
            ))}
        </div>
    );
}
