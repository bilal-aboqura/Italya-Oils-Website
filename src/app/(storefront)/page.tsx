import { prisma } from "@/lib/prisma";
import Navbar from "@/components/ui/Navbar";
import ProductList from "@/components/ui/ProductList";
import PromoCarousel from "@/components/ui/PromoCarousel";
import Pagination from "@/components/admin/Pagination";
import BrandRows from "@/components/ui/BrandRows";
import Image from "next/image";
import Logo from "@/components/ui/Logo";

export const dynamic = "force-dynamic";
export const revalidate = 0;

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

  // Fetch brands list (always needed for the sidebar)
  const [categories, brandsRaw] = await Promise.all([
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.product.findMany({
      where: { brand: { not: null }, isActive: true },
      select: { brand: true },
      distinct: ["brand"],
      orderBy: { brand: "asc" },
    }),
  ]);

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
    // Fetch top 4 brands with the most active products
    const topBrandsQuery = await prisma.product.groupBy({
      by: ['brand'],
      _count: { brand: true },
      where: { brand: { not: null }, isActive: true },
      orderBy: { _count: { brand: 'desc' } },
      take: 4,
    });

    const brandsForRows = topBrandsQuery.map((b) => b.brand).filter(Boolean) as string[];

    brandGroups = await Promise.all(
      brandsForRows.map(async (brand) => {
        const brandProducts = await prisma.product.findMany({
          where: { brand, isActive: true },
          include: { category: { select: { name: true, slug: true } } },
          orderBy: { createdAt: "desc" },
          take: 10,
        });
        return { brand, products: brandProducts };
      })
    ).then((groups) => groups.filter((g) => g.products.length > 0));
  }

  return (
    <div className="flex h-full grow flex-col">
      <Navbar />

      {/* Top Strip Promo */}
      <div className="w-full mx-auto max-w-[1400px] px-4 lg:px-8 mt-6">
        <PromoCarousel placement="home_top_strip" aspectRatio="8/1" />
      </div>

      <main className="flex-1 w-full mx-auto max-w-[1400px] px-4 lg:px-8 py-6 space-y-10">
        {/* Main Hero Carousel */}
        <PromoCarousel placement="home_hero" aspectRatio="16/9" />

        {/* ── HERO ─────────────────────────────── */}
        {!isFiltering && (
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-auto lg:h-[580px]">
            {/* Main Hero Card */}
            <div className="lg:col-span-7 bg-brand-navy rounded-3xl p-8 lg:p-12 relative overflow-hidden flex flex-col justify-center items-start text-white shadow-2xl">
              {/* Glow effects */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-brand-orange blur-[120px] opacity-40 rounded-full pointer-events-none translate-x-1/2 -translate-y-1/2" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500 blur-[80px] opacity-30 rounded-full pointer-events-none -translate-x-1/2 translate-y-1/2" />
              <div className="relative z-10 w-full">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 text-orange-100 text-xs font-bold mb-6">
                  <span className="size-2 bg-brand-orange rounded-full animate-pulse" />
                  الرائد العالمي في الزيوت الاصطناعية
                </div>
                <h1 className="text-5xl lg:text-7xl font-black mb-6 leading-tight tracking-tight">
                  Mobil 1{" "}
                  <br />
                  <span className="text-gradient">أداء يتجاوز التوقعات</span>
                </h1>
                <p className="text-slate-300 text-lg font-medium mb-10 leading-relaxed max-w-lg">
                  حافظ على محركك كالجديد مع أفضل زيوت المحركات العالمية — موبيل 1 · شل · كاسترول · توتال
                </p>
                <div className="flex flex-wrap gap-4">
                  <a href="/?section=products" className="btn-primary text-base gap-2 group">
                    تسوق الآن
                    <span className="material-symbols-outlined text-sm group-hover:translate-x-[-4px] transition-transform">
                      arrow_back
                    </span>
                  </a>
                  <a
                    href="/?section=brands"
                    className="px-8 py-4 bg-white/10 text-white backdrop-blur-sm text-base font-bold border border-white/20 hover:bg-white/20 transition-all rounded-xl"
                  >
                    اكتشف العلامات
                  </a>
                </div>
              </div>
            </div>

            {/* Side Cards */}
            <div className="lg:col-span-5 grid grid-rows-2 gap-6 h-[480px] lg:h-full">
              {/* Promo banner card (Dynamic) */}
              <div className="row-span-1 bg-slate-100 rounded-3xl relative overflow-hidden group">
                <div className="absolute inset-0 z-20">
                  <PromoCarousel placement="home_side" aspectRatio="1/1" />
                </div>
                {/* Fallback pattern underneath */}
                <div className="absolute inset-0 bg-gradient-to-br from-slate-200 to-slate-100" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-slate-300">
                  <span className="material-symbols-outlined text-[120px]">oil_barrel</span>
                </div>
              </div>

              {/* Stat mini cards */}
              <div className="row-span-1 grid grid-cols-2 gap-6">
                <div className="bg-brand-orangeLight rounded-3xl p-6 flex flex-col justify-between group hover:bg-brand-orange hover:text-white transition-colors cursor-default relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                    <span className="material-symbols-outlined text-8xl">local_gas_station</span>
                  </div>
                  <div className="size-12 bg-white rounded-full flex items-center justify-center text-brand-orange mb-4 shadow-sm group-hover:bg-white/20 group-hover:text-white z-10">
                    <span className="material-symbols-outlined">speed</span>
                  </div>
                  <div className="z-10">
                    <h3 className="text-4xl font-black mb-1 font-sans">0W-40</h3>
                    <p className="text-sm font-bold opacity-80">اللزوجة المثالية</p>
                  </div>
                </div>
                <div className="bg-white rounded-3xl p-6 flex flex-col justify-between border border-slate-200 hover:border-brand-orange transition-colors relative overflow-hidden">
                  <div className="absolute -right-4 -top-4 size-24 bg-brand-navy/5 rounded-full" />
                  <div className="size-12 bg-brand-navy rounded-full flex items-center justify-center text-white mb-4 shadow-sm">
                    <span className="material-symbols-outlined">workspace_premium</span>
                  </div>
                  <div>
                    <h3 className="text-3xl font-black text-brand-navy mb-1 font-sans">NASCAR</h3>
                    <p className="text-slate-500 text-sm font-bold">الشريك الرسمي</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ── PRODUCT LISTING ─────────────────────── */}
        <section className="py-4" id="products">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Sidebar */}
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
                /* ── Default view: brand rows ── */
                <>
                  <BrandRows groups={brandGroups} />
                  
                  {/* Middle Banner inserted within product section */}
                  <div className="mt-10">
                    <PromoCarousel placement="home_middle" aspectRatio="21/9" />
                  </div>
                </>
              )}
            </div>
          </div>
        </section>

        {/* ── TRUST SECTION ────────────────────────── */}
        {!isFiltering && (
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

        {/* ── CTA SECTION & BOTTOM PROMO ────────────────────────── */}
        {!isFiltering && (
          <>
            <PromoCarousel placement="home_bottom" aspectRatio="4/1" />
            
            <section className="bg-brand-orange rounded-3xl p-8 lg:p-16 text-center text-white relative overflow-hidden shadow-vibrant">
            <div
              className="absolute inset-0 opacity-10"
              style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.3) 1px, transparent 1px)", backgroundSize: "24px 24px" }}
            />
            <div className="relative z-10 max-w-2xl mx-auto">
              <div className="inline-block p-4 rounded-full bg-white/20 backdrop-blur-md mb-6 animate-bounce">
                <span className="material-symbols-outlined text-[32px]">mail</span>
              </div>
              <h3 className="text-3xl lg:text-4xl font-black mb-4">
                انضم إلى مجتمع عشاق السيارات
              </h3>
              <p className="text-orange-100 mb-8 text-lg font-medium">
                اطلب عبر واتساب بسهولة وسرعة — أضف المنتجات للسلة وأرسل طلبك مباشرة.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 bg-white p-2 rounded-2xl shadow-xl max-w-lg mx-auto">
                <input
                  className="flex-1 px-4 py-3 bg-transparent border-none focus:ring-0 text-brand-navy placeholder:text-slate-400 text-right outline-none text-sm"
                  placeholder="ابحث عن زيت محركك..."
                  type="text"
                />
                <a
                  href="/?section=products"
                  className="px-8 py-3 bg-brand-navy text-white font-bold rounded-xl hover:bg-slate-800 transition-colors shadow-md text-sm"
                >
                  تسوق الآن
                </a>
              </div>
            </div>
          </section>
          </>
        )}
      </main>

      {/* ── FOOTER ───────────────────────────────────── */}
      <footer className="bg-white border-t border-slate-200 mt-10">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-12 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div className="md:col-span-1">
              <div className="mb-4">
                <Logo variant="dark" height={40} />
              </div>
              <p className="text-slate-500 text-sm leading-relaxed">
                وجهتك الأولى للزيوت والمحركات العالمية. جودة أصلية وأداء مضمون.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-brand-navy mb-4">أهم العلامات</h4>
              <ul className="space-y-2 text-sm text-slate-500">
                {["موبيل وان", "شل هيلكس", "كاسترول", "توتال", "ليكوي مولي"].map((b) => (
                  <li key={b}>
                    <a href={`/?brand=${encodeURIComponent(b)}`} className="hover:text-brand-orange transition-colors">{b}</a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-brand-navy mb-4">المساعدة</h4>
              <ul className="space-y-2 text-sm text-slate-500">
                {["دليل اختيار الزيت", "الشحن والتوصيل", "سياسة الإرجاع"].map((t) => (
                  <li key={t}>
                    <a href="#" className="hover:text-brand-orange transition-colors">{t}</a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-brand-navy mb-4">روابط سريعة</h4>
              <ul className="space-y-2 text-sm text-slate-500">
                <li><a href="/" className="hover:text-brand-orange transition-colors">الرئيسية</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-400">
            <p>© {new Date().getFullYear()} الإيطالية لزيوت السيارات. جميع الحقوق محفوظة.</p>
            <p className="text-slate-300">Developed by <span className="text-brand-orange font-semibold">Bilal Aboqura</span></p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-brand-navy transition-colors">سياسة الخصوصية</a>
              <a href="#" className="hover:text-brand-navy transition-colors">الشروط والأحكام</a>
            </div>
          </div>
        </div>
      </footer>
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
