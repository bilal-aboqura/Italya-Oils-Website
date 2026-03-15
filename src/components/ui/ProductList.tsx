"use client";

import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/lib/cart-store";
import { formatPrice } from "@/lib/whatsapp";

interface Product {
  id: string;
  name: string;
  price: number;
  brand: string | null;
  imageUrl: string | null;
  category: { name: string; slug: string } | null;
  sku?: string;
  viscosity?: string | null;
  description?: string | null;
}

interface ProductListProps {
  products: Product[];
}

export default function ProductList({ products }: ProductListProps) {
  const { addItem } = useCartStore();

  if (products.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="inline-flex items-center justify-center size-20 rounded-3xl bg-slate-100 mb-6">
          <span className="material-symbols-outlined text-slate-400 text-[48px]">inventory_2</span>
        </div>
        <p className="text-lg font-bold text-brand-navy mb-2">لا توجد منتجات متاحة حالياً</p>
        <p className="text-slate-400 text-sm">جرّب تغيير الفلتر أو ابحث عن منتج آخر</p>
        <a href="/" className="mt-6 inline-flex btn-secondary text-sm">
          عرض جميع المنتجات
        </a>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onAddToCart={() =>
            addItem({
              id: product.id,
              name: product.name,
              price: product.price,
              imageUrl: product.imageUrl,
            })
          }
        />
      ))}
    </div>
  );
}

function ProductCard({
  product,
  onAddToCart,
}: {
  product: Product;
  onAddToCart: () => void;
}) {
  const brandColors: Record<string, { badge: string; ring: string }> = {
    "Mobil 1": { badge: "bg-red-50 text-red-600 border-red-100", ring: "group-hover:border-red-200" },
    "Shell Helix": { badge: "bg-yellow-50 text-yellow-600 border-yellow-100", ring: "group-hover:border-yellow-200" },
    "Castrol": { badge: "bg-green-50 text-green-600 border-green-100", ring: "group-hover:border-green-200" },
    "TotalEnergies": { badge: "bg-blue-50 text-blue-600 border-blue-100", ring: "group-hover:border-blue-200" },
  };
  const colors = product.brand ? (brandColors[product.brand] ?? { badge: "badge-muted", ring: "group-hover:border-slate-200" }) : { badge: "badge-muted", ring: "" };

  return (
    <div className={`group bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-card hover:shadow-vibrant transition-all duration-300 flex flex-col ${colors.ring}`}>
      {/* Image */}
      <div className="relative h-52 bg-gradient-to-br from-slate-50 to-slate-100 overflow-hidden">
        <Link href={`/products/${product.id}`} className="block relative h-full">
          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full gap-2">
              <span className="material-symbols-outlined text-slate-300 text-[64px]">
                oil_barrel
              </span>
              <span className="text-xs text-slate-400 font-medium">صورة قريباً</span>
            </div>
          )}
        </Link>

        {/* Brand badge overlay */}
        {product.brand && (
          <div className="absolute top-3 right-3">
            <span className={`badge border text-[10px] font-bold px-2 py-0.5 rounded-lg ${colors.badge}`}>
              {product.brand}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        {product.category && (
          <p className="text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wide">
            {product.category.name}
          </p>
        )}
        <Link href={`/products/${product.id}`} className="block">
          <h3 className="font-black text-brand-navy text-base mb-1 leading-snug line-clamp-2 hover:text-brand-orange transition-colors">
            {product.name}
          </h3>
        </Link>
        {product.viscosity && (
          <p className="text-xs text-slate-400 mb-3">{product.viscosity}</p>
        )}

        <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-50">
          <div>
            <span className="text-2xl font-black text-brand-navy">
              {formatPrice(product.price)}
            </span>
            <span className="text-xs text-slate-400 mr-1">ج.م</span>
          </div>
          <button
            onClick={onAddToCart}
            className="size-11 rounded-xl bg-brand-orange text-white flex items-center justify-center hover:bg-orange-600 active:scale-95 transition-all shadow-lg shadow-brand-orange/30 group/btn"
            aria-label={`إضافة ${product.name} للسلة`}
          >
            <span className="material-symbols-outlined text-lg group-hover/btn:scale-110 transition-transform">
              shopping_bag
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
