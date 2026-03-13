import { prisma } from "@/lib/prisma";
import Navbar from "@/components/ui/Navbar";
import ProductList from "@/components/ui/ProductList";
import PromoCarousel from "@/components/ui/PromoCarousel";
import Pagination from "@/components/admin/Pagination";
import BrandRows from "@/components/ui/BrandRows";
import Image from "next/image";
import Logo from "@/components/ui/Logo";
import CountdownBanner from "@/components/ui/CountdownBanner";
import Footer from "@/components/ui/Footer";

export const dynamic = "force-dynamic";
export const revalidate = 60; // ISR: rebuild in background every 60 seconds

const PAGE_SIZE = 24;

interface SearchParams {
  brand?: string;
  category?: string;
  search?: string;
  page?: string;
}

export default async function StorefrontPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const isFiltering = !!(params.brand || params.category || params.search);
  const currentPage = Math.max(1, parseInt(params.page ?? "1", 10) || 1);
  const skip = (currentPage - 1) * PAGE_SIZE;

  const where = {
    isActive: true,
    ...(params.brand ? { brand: params.brand } : {}),
    ...(params.category ? { category: { slug: params.category } } : {}),
    ...(params.search
      ? {
        OR: [
          { name: { contains: params.search } },
          { brand: { contains: params.search } },
        ],
      }
      : {}),
  };

  // Fetch categories and brands
  const [categoriesRaw, brandsRaw, countdownBanner] = await Promise.all([
    prisma.category.findMany({
      orderBy: { name: "asc" },
      include: {
        products: {
          where: { imageUrl: { not: null } },
          select: { imageUrl: true },
          take: 1,
        }
      }
    }),
    prisma.product.findMany({
      where: { brand: { not: null }, isActive: true },
      select: { brand: true },
      distinct: ["brand"],
      orderBy: { brand: "asc" },
    }),
    prisma.countdownBanner.findFirst({ where: { isActive: true }, orderBy: { createdAt: "desc" } }),
  ]);

  // For the grid we want the imageUrl from the categories or its first product
  const categories = categoriesRaw.map(cat => ({
    ...cat,
    displayImageUrl: cat.imageUrl || cat.products[0]?.imageUrl || null
  }));

  const uniqueBrands = brandsRaw.map((b) => b.brand).filter(Boolean) as string[];

  // ── When filtering: paginated list ────────────────────────────────
  type StorefrontProduct = Awaited<ReturnType<typeof prisma.product.findMany>>[0] & {
    category: { name: string; slug: string } | null;
  };

  let products: StorefrontProduct[] = [];
  let totalCount = 0;
  let totalPages = 0;

  // ── When no filter: grouped brand rows (5 per brand) ─────────────
  let brandGroups: { brand: string; products: StorefrontProduct[] }[] = [];

  if (isFiltering) {
    [products, totalCount] = await Promise.all([
      prisma.product.findMany({
        where,
        include: { category: { select: { name: true, slug: true } } },
        orderBy: { createdAt: "desc" },
        skip,
        take: PAGE_SIZE,
      }),
      prisma.product.count({ where }),
    ]);
    totalPages = Math.ceil(totalCount / PAGE_SIZE);
  } else {
    // When not filtering, we don't query top brands anymore,
    // we just use the Categories array for the main grid view.
  }

  return (
    <div className="flex h-full grow flex-col bg-slate-50">
      <Navbar />

      {/* Top Strip Promo */}
      <div className="w-[95%] mx-auto mt-6">
        <PromoCarousel placement="home_top_strip" aspectRatio="5/1" fullWidth={true} />
      </div>

      <main className="flex-1 w-full mx-auto max-w-[1400px] px-4 lg:px-8 py-6 space-y-10">
        {/* Main Hero Carousel removed */}

        {/* ── CATEGORY GRID (HERO) ─────────────────────────────── */}
        {!isFiltering && (
          <section className="py-2">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-6">
              {categories.map((cat) => (
                <a
                  key={cat.id}
                  href={`/?category=${cat.slug}`}
                  className="bg-white rounded-xl lg:rounded-2xl p-4 lg:p-6 flex flex-col items-center justify-between shadow-sm hover:shadow-md transition-shadow border border-slate-100 group gap-4 aspect-square"
                >
                  <div className="flex-1 w-full relative mb-2 flex items-center justify-center overflow-hidden">
                    {cat.displayImageUrl ? (
                      <Image
                        src={cat.displayImageUrl}
                        alt={cat.name}
                        fill
                        className="object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
                      />
                    ) : (
                      <div className="w-full h-full bg-slate-50 flex items-center justify-center rounded-lg">
                        <span className="material-symbols-outlined text-4xl text-slate-300">image</span>
                      </div>
                    )}
                  </div>
                  <h3 className="text-sm md:text-base font-bold text-center text-brand-navy group-hover:text-brand-orange transition-colors">
                    {cat.name}
                  </h3>
                </a>
              ))}
            </div>
          </section>
        )}

        {/* ── PRODUCT LISTING ─────────────────────── */}
        <section className="py-4" id="products">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Sidebar */}
            {isFiltering && (
              <aside className="w-full md:w-64 flex-shrink-0">
                <div className="bg-white rounded-3xl border border-slate-100 shadow-card p-6 sticky top-24 space-y-8">

                  {/* 1. Main Categories Section */}
                  {categories.length > 0 && (
                    <div>
                      <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4 px-1">
                        الأقسام الرئيسية
                      </h3>
                      <div className="space-y-1">
                        <FilterLink
                          href="/?"
                          label="كل المعروض"
                          active={!params.brand && !params.category && !params.search}
                        />
                        {categories.map((cat) => (
                          <FilterLink
                            key={cat.id}
                            href={`/?category=${cat.slug}`}
                            label={cat.name}
                            active={params.category === cat.slug}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 2. Brands Section */}
                  {uniqueBrands.length > 0 && (
                    <div className="pt-2 border-t border-slate-50">
                      <div className="flex items-center justify-between mb-4 px-1">
                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">
                          العلامات التجارية
                        </h3>
                        <span className="text-[10px] bg-slate-100 text-slate-400 px-1.5 py-0.5 rounded-md font-bold">
                          {uniqueBrands.length}
                        </span>
                      </div>

                      <div className="space-y-1 max-h-[400px] overflow-y-auto pr-2 customize-scrollbar">
                        {uniqueBrands.map((brand) => (
                          <FilterLink
                            key={brand}
                            href={`/?brand=${encodeURIComponent(brand)}`}
                            label={brand}
                            active={params.brand === brand}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Helpful Hint */}
                  <div className="p-4 bg-brand-navy/5 rounded-2xl border border-brand-navy/5">
                    <p className="text-[10px] text-brand-navy/40 leading-relaxed font-bold text-center">
                      itallyaOils · جودة أصلية
                    </p>
                  </div>

                  {/* Sidebar Promo */}
                  <div className="pt-2">
                    <PromoCarousel placement="sidebar_promo" aspectRatio="1/1" />
                  </div>
                </div>
              </aside>
            )}

            {/* Products area */}
            <div className="flex-1 min-w-0">


              {/* ── Filtered view: normal paginated grid ── */}
              {isFiltering ? (
                <>
                  <ProductList products={products} />
                  <div className="mt-8">
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      totalItems={totalCount}
                      pageSize={PAGE_SIZE}
                      theme="light"
                    />
                  </div>
                </>
              ) : (
                /* ── Default view: Nothing, grid is above ── */
                <>

                </>
              )}
            </div>
          </div>
        </section>

        {/* Countdown banner moved to match full 95% width outside main */}

        {/* Trust/CTA sections removed */}
        {false && (
          <section className="grid-pattern bg-slate-50 rounded-3xl p-8 lg:p-16 relative overflow-hidden border border-slate-200">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
              <div>
                <div className="inline-block p-3 rounded-2xl bg-brand-navy text-white mb-6 shadow-lg rotate-3 hover:rotate-0 transition-transform duration-300">
                  <span className="material-symbols-outlined text-[32px]">verified</span>
                </div>
                <h2 className="text-4xl lg:text-5xl font-black text-brand-navy mb-6 tracking-tight">
                  شركاء{" "}
                  <span className="text-brand-orange underline decoration-4 decoration-brand-orange/30 underline-offset-4">
                    الموثوقية
                  </span>
                </h2>
                <p className="text-slate-600 text-lg leading-relaxed mb-8">
                  نحن وكلاء معتمدون لأكبر العلامات التجارية العالمية في زيوت المحركات. نضمن لك منتجات أصلية 100% تحمي استثمارك في سيارتك وتضمن أفضل أداء على الطرقات.
                </p>
                <div className="space-y-4">
                  {[
                    { icon: "check_circle", bg: "bg-green-100 text-green-600", title: "منتجات أصلية", sub: "ضمان المصنع مباشرة إليك" },
                    { icon: "local_shipping", bg: "bg-blue-100 text-blue-600", title: "توصيل سريع وآمن", sub: "شحن لجميع المناطق مع التغليف الآمن" },
                  ].map((item) => (
                    <div
                      key={item.title}
                      className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-100 hover:border-brand-orange/50 transition-colors"
                    >
                      <div className={`size-10 rounded-full ${item.bg} flex items-center justify-center flex-shrink-0`}>
                        <span className="material-symbols-outlined">{item.icon}</span>
                      </div>
                      <div>
                        <h4 className="font-bold text-brand-navy">{item.title}</h4>
                        <p className="text-sm text-slate-500">{item.sub}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-10">
                  <a href="/" className="btn-navy inline-flex text-sm">
                    تعرف على المنتجات
                  </a>
                </div>
              </div>
              {/* Visual composition using icons instead of missing images */}
              <div className="relative h-[400px] lg:h-[500px]">
                <div className="absolute top-10 right-10 w-64 h-80 bg-gradient-to-br from-brand-navy to-slate-700 rounded-2xl shadow-xl z-20 border-4 border-white hover:-translate-y-2 transition-transform duration-500 overflow-hidden flex flex-col items-center justify-center gap-4 p-6 text-white">
                  <div className="size-20 bg-white/10 rounded-2xl flex items-center justify-center border border-white/20">
                    <span className="material-symbols-outlined text-[48px] text-brand-orange">oil_barrel</span>
                  </div>
                  <div className="text-center">
                    <p className="font-black text-lg">زيوت أصلية</p>
                    <p className="text-slate-300 text-sm mt-1">ضمان المصنع 100%</p>
                  </div>
                  <div className="flex gap-2 flex-wrap justify-center">
                    {["Mobil", "Shell", "Castrol"].map(b => (
                      <span key={b} className="bg-white/10 text-white text-xs font-bold px-2 py-1 rounded-md">{b}</span>
                    ))}
                  </div>
                </div>
                <div className="absolute bottom-10 left-10 w-56 h-56 bg-gradient-to-br from-brand-orange to-orange-600 rounded-2xl shadow-xl z-30 border-4 border-white hover:-translate-y-2 transition-transform duration-500 delay-100 overflow-hidden flex flex-col items-center justify-center gap-3 p-6 text-white">
                  <div className="size-16 bg-white/20 rounded-xl flex items-center justify-center border border-white/20">
                    <span className="material-symbols-outlined text-[40px]">local_shipping</span>
                  </div>
                  <div className="text-center">
                    <p className="font-black">توصيل سريع</p>
                    <p className="text-orange-100 text-sm mt-1">لجميع المناطق</p>
                  </div>
                </div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-orange rounded-full opacity-20 blur-2xl" />
                <div className="absolute bottom-20 left-32 w-48 h-48 bg-brand-navy rounded-full opacity-10 blur-2xl" />
                <div className="absolute inset-0 border-2 border-dashed border-slate-300 rounded-3xl m-8 -z-10" />
              </div>
            </div>
          </section>
        )}


      </main>

      {/* ── COUNTDOWN BANNER (BOTTOM) ─────────────────────────── */}
      {countdownBanner && (
        <div className="w-[95%] mx-auto mb-6">
          <CountdownBanner banner={{
            title: countdownBanner.title,
            subtitle: countdownBanner.subtitle,
            imageUrl: countdownBanner.imageUrl,
            buttonText: countdownBanner.buttonText,
            buttonLink: countdownBanner.buttonLink,
            endsAt: countdownBanner.endsAt.toISOString(),
            isActive: countdownBanner.isActive,
          }} />
        </div>
      )}

      {/* ── FOOTER ───────────────────────────────────── */}
      <Footer />
    </div>
  );
}

function FilterLink({ href, label, active }: { href: string; label: string; active: boolean }) {
  return (
    <a
      href={href}
      className={`flex items-center gap-2 text-sm px-3 py-2 rounded-xl transition-colors ${active
        ? "bg-orange-50 text-brand-orange font-bold border border-orange-200"
        : "text-slate-600 hover:bg-slate-50 hover:text-brand-navy font-medium"
        }`}
    >
      {active && <span className="size-1.5 bg-brand-orange rounded-full flex-shrink-0" />}
      {label}
    </a>
  );
}
