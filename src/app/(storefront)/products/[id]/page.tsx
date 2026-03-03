import { prisma } from "@/lib/prisma";
import Navbar from "@/components/ui/Navbar";
import ProductDetailsClient from "./ProductDetailsClient";
import ProductDetailsTabs from "./ProductDetailsTabs";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/whatsapp";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductPage({ params }: PageProps) {
  const { id } = await params;

  const product = await prisma.product.findUnique({
    where: { id },
    include: { category: true },
  });

  if (!product || !product.isActive) {
    return notFound();
  }

  // Fetch related products (same brand or category)
  const relatedProducts = await prisma.product.findMany({
    where: {
      brand: product.brand,
      id: { not: product.id },
      isActive: true,
    },
    take: 4,
  });

  return (
    <div className="flex h-full grow flex-col">
      <Navbar />

      <main className="flex-1 w-full mx-auto max-w-[1400px] px-4 lg:px-8 py-6 space-y-8">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-sm font-medium text-slate-500 px-4">
          <Link className="hover:text-brand-orange transition-colors" href="/">
            الرئيسية
          </Link>
          <span className="material-symbols-outlined text-xs">chevron_left</span>
          {product.category && (
            <>
              <Link
                className="hover:text-brand-orange transition-colors"
                href={`/?category=${product.category.slug}`}
              >
                {product.category.name}
              </Link>
              <span className="material-symbols-outlined text-xs">chevron_left</span>
            </>
          )}
          <span className="text-brand-navy font-bold">{product.brand || "منتج"}</span>
        </div>

        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left Column: Image */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-white rounded-3xl p-8 lg:p-12 relative overflow-hidden flex items-center justify-center border border-slate-100 shadow-card h-[400px] lg:h-[550px] group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-brand-orange/10 blur-[100px] opacity-20 rounded-full pointer-events-none translate-x-1/2 -translate-y-1/2"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-brand-navy blur-[80px] opacity-10 rounded-full pointer-events-none -translate-x-1/2 translate-y-1/2"></div>
              
              {product.imageUrl ? (
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  width={500}
                  height={500}
                  className="relative z-10 w-auto h-full object-contain drop-shadow-2xl transition-transform duration-500 group-hover:scale-105"
                  priority
                />
              ) : (
                <div className="flex flex-col items-center justify-center gap-4 text-slate-300">
                   <span className="material-symbols-outlined text-[120px]">oil_barrel</span>
                   <span className="text-sm font-bold text-slate-400">صورة قريباً</span>
                </div>
              )}
              
              <div className="absolute top-6 left-6 z-20 flex flex-col gap-2">
                <span className="bg-brand-orange text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-lg shadow-brand-orange/20">
                  منتج أصلي
                </span>
                {product.viscosity && (
                  <span className="bg-brand-navy text-white text-xs font-bold px-3 py-1.5 rounded-lg">
                    {product.viscosity}
                  </span>
                )}
              </div>
            </div>
            
            {/* Thumbnails (Currently just the main one since we don't have multiple images) */}
            <div className="grid grid-cols-4 gap-4">
               <div className="bg-white border-2 border-brand-orange rounded-xl h-24 p-2 flex items-center justify-center overflow-hidden relative">
                  {product.imageUrl ? (
                    <Image src={product.imageUrl} alt={product.name} width={80} height={80} className="h-full w-auto object-contain" />
                  ) : (
                    <span className="material-symbols-outlined text-slate-300">oil_barrel</span>
                  )}
               </div>
            </div>
          </div>

          {/* Right Column: Details & CTA */}
          <div className="lg:col-span-5 flex flex-col">
             <ProductDetailsClient product={product} />
             
             {/* Secondary Stats Grid */}
             <div className="grid grid-cols-2 gap-3 mt-6">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex items-center gap-3">
                  <div className="size-10 bg-white rounded-lg flex items-center justify-center shadow-sm text-brand-navy">
                    <span className="material-symbols-outlined">water_drop</span>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-bold">اللزوجة</p>
                    <p className="text-brand-navy font-black">{product.viscosity || "—"}</p>
                  </div>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex items-center gap-3">
                  <div className="size-10 bg-white rounded-lg flex items-center justify-center shadow-sm text-brand-orange">
                    <span className="material-symbols-outlined">science</span>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-bold">التركيبة</p>
                    <p className="text-brand-navy font-black">تخليقي متكامل</p>
                  </div>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex items-center gap-3">
                  <div className="size-10 bg-white rounded-lg flex items-center justify-center shadow-sm text-brand-navy">
                    <span className="material-symbols-outlined">verified</span>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-bold">الجودة</p>
                    <p className="text-brand-navy font-black">أصلي 100%</p>
                  </div>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex items-center gap-3">
                  <div className="size-10 bg-white rounded-lg flex items-center justify-center shadow-sm text-green-600">
                    <span className="material-symbols-outlined">speed</span>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-bold">الأداء</p>
                    <p className="text-brand-navy font-black">عالي الكفاءة</p>
                  </div>
                </div>
             </div>
          </div>
        </section>

        {/* Detailed Info Section */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 my-8">
          <div className="lg:col-span-8">
            <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
              <ProductDetailsTabs description={product.description} viscosity={product.viscosity} brand={product.brand} />
            </div>
          </div>

          <div className="lg:col-span-4 space-y-6">
             <div className="bg-brand-navy rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl">
               <div className="absolute top-0 right-0 w-48 h-48 bg-brand-orange blur-[60px] opacity-20 rounded-full pointer-events-none"></div>
               <div className="relative z-10">
                 <h3 className="text-2xl font-black mb-6">التزامنا بالجودة</h3>
                 <ul className="space-y-6">
                    <li className="flex gap-4">
                      <div className="size-12 rounded-xl bg-white/10 flex items-center justify-center border border-white/10 shrink-0">
                        <span className="material-symbols-outlined text-brand-orange">verified_user</span>
                      </div>
                      <div>
                        <h4 className="font-bold text-lg">موزع معتمد</h4>
                        <p className="text-slate-400 text-sm">نضمن لك منتجات أصلية 100%.</p>
                      </div>
                    </li>
                    <li className="flex gap-4">
                      <div className="size-12 rounded-xl bg-white/10 flex items-center justify-center border border-white/10 shrink-0">
                        <span className="material-symbols-outlined text-brand-orange">calendar_clock</span>
                      </div>
                      <div>
                        <h4 className="font-bold text-lg">تاريخ إنتاج حديث</h4>
                        <p className="text-slate-400 text-sm">تخزين مثالي لضمان جودة الزيت.</p>
                      </div>
                    </li>
                    <li className="flex gap-4">
                      <div className="size-12 rounded-xl bg-white/10 flex items-center justify-center border border-white/10 shrink-0">
                        <span className="material-symbols-outlined text-brand-orange">local_shipping</span>
                      </div>
                      <div>
                        <h4 className="font-bold text-lg">توصيل آمن</h4>
                        <p className="text-slate-400 text-sm">تغليف احترافي يضمن وصول طلبك بسلام.</p>
                      </div>
                    </li>
                 </ul>
               </div>
             </div>

             {relatedProducts.length > 0 && (
               <div className="bg-white rounded-3xl p-6 border border-slate-200">
                  <h3 className="font-black text-brand-navy mb-4">منتجات ذات صلة</h3>
                  <div className="space-y-4">
                    {relatedProducts.map((p) => (
                      <Link key={p.id} href={`/products/${p.id}`} className="flex gap-4 group">
                        <div className="size-20 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100 p-2 overflow-hidden shrink-0">
                          {p.imageUrl ? (
                            <Image src={p.imageUrl} alt={p.name} width={64} height={64} className="object-contain" />
                          ) : (
                            <span className="material-symbols-outlined text-slate-300">oil_barrel</span>
                          )}
                        </div>
                        <div>
                          <h4 className="font-bold text-brand-navy text-sm mb-1 group-hover:text-brand-orange transition-colors line-clamp-2">
                            {p.name}
                          </h4>
                          <span className="font-black text-brand-navy text-sm">{formatPrice(p.price)} ر.س</span>
                        </div>
                      </Link>
                    ))}
                  </div>
               </div>
             )}
          </div>
        </section>
      </main>

      {/* Footer (Simplified from page.tsx) */}
      <footer className="bg-white border-t border-slate-200 mt-auto">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-12 py-12 text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
                <div className="size-8 bg-brand-orange rounded-lg flex items-center justify-center text-white">
                  <span className="material-symbols-outlined text-lg">oil_barrel</span>
                </div>
                <span className="text-xl font-black text-brand-navy">ItalyaOils</span>
            </div>
            <p className="text-slate-500 text-sm mb-8 max-w-md mx-auto">
                وجهتك الأولى للزيوت والمحركات العالمية. جودة أصلية وأداء مضمون.
            </p>
            <div className="border-t border-slate-100 pt-8 text-sm text-slate-400">
              <p>© 2025 ItalyaOils. جميع الحقوق محفوظة.</p>
            </div>
        </div>
      </footer>
    </div>
  );
}
