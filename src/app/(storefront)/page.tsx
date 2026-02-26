import { prisma } from "@/lib/prisma";
import Navbar from "@/components/ui/Navbar";
import ProductList from "@/components/ui/ProductList";
import PromoCarousel from "@/components/ui/PromoCarousel";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface SearchParams {
  brand?: string;
  category?: string;
  search?: string;
}

export default async function StorefrontPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;

  const [products, categories, brandsRaw] = await Promise.all([
    prisma.product.findMany({
      where: {
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
      },
      include: { category: { select: { name: true, slug: true } } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.product.findMany({
      where: { brand: { not: null }, isActive: true },
      select: { brand: true },
      distinct: ["brand"],
      orderBy: { brand: "asc" },
    }),
  ]);

  const uniqueBrands = brandsRaw
    .map((b) => b.brand)
    .filter(Boolean) as string[];

  const isFiltering = !!(params.brand || params.category || params.search);

  return (
    <div className="flex h-full grow flex-col">
      <Navbar />

      <main className="flex-1 w-full mx-auto max-w-[1400px] px-4 lg:px-8 py-6 space-y-10">
        {/* Promo Carousel */}
        <PromoCarousel />

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
                  <a
                    href="/?section=products"
                    className="btn-primary text-base gap-2 group"
                  >
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
              {/* Promo banner card */}
              <div className="row-span-1 bg-slate-100 rounded-3xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-200 to-slate-100" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <div className="absolute bottom-6 right-6 text-white z-10">
                  <div className="bg-brand-orange px-4 py-2 rounded-lg shadow-lg inline-block mb-2">
                    <span className="font-bold text-sm">عرض خاص</span>
                  </div>
                  <h3 className="font-black text-xl">باقة تغيير الزيت الشاملة</h3>
                </div>
                {/* oil barrel icon decoration */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-slate-300 group-hover:scale-110 transition-transform duration-500">
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

        {/* ── BRAND CARDS ────────────────────────── */}
        {!isFiltering && (
          <section className="py-4" id="brands">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-black text-brand-navy mb-2">
                  تسوق حسب أفضل العلامات التجارية
                </h2>
                <p className="text-slate-500 font-medium">
                  أفضل الزيوت العالمية لمحرك سيارتك
                </p>
              </div>
              <a
                className="hidden md:flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border border-slate-200 text-brand-navy font-bold hover:bg-slate-50 transition-colors shadow-sm text-sm"
                href="/?section=products"
              >
                عرض كل المنتجات
                <span className="material-symbols-outlined text-sm">arrow_back_ios</span>
              </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  brand: "Shell Helix",
                  sub: "Ultra PurePlus",
                  desc: "تقنية الغاز الطبيعي لمحرك أنظف وأقوى.",
                  iconColor: "text-yellow-500",
                  bg: "bg-yellow-50 group-hover:bg-yellow-100",
                  iconBg: "bg-yellow-100 border-yellow-200",
                  cta: "bg-yellow-100",
                  icon: "water_drop",
                  dark: false,
                },
                {
                  brand: "Castrol",
                  sub: "Magnatec & Edge",
                  desc: "جزيئات ذكية تلتصق بالمحرك لحماية فورية.",
                  iconColor: "text-green-600",
                  bg: "bg-green-50 group-hover:bg-green-100",
                  iconBg: "bg-white border-slate-100",
                  cta: "bg-green-100",
                  icon: "science",
                  dark: false,
                },
                {
                  brand: "TotalEnergies",
                  sub: "Quartz Series",
                  desc: "تقنية مقاومة الشيخوخة لمحركات تدوم أطول.",
                  iconColor: "text-red-500",
                  bg: "bg-red-50 group-hover:bg-red-100",
                  iconBg: "bg-white border-slate-100",
                  cta: "bg-red-100",
                  icon: "energy_savings_leaf",
                  dark: false,
                },
                {
                  brand: "Mobil 1",
                  sub: "Advanced Full Synthetic",
                  desc: "الخيار الأول للأداء الأقصى والحماية الفائقة.",
                  iconColor: "text-white",
                  bg: "bg-brand-blue group-hover:bg-slate-700",
                  iconBg: "bg-brand-orange border-brand-orange",
                  cta: "bg-white",
                  icon: "workspace_premium",
                  dark: true,
                },
              ].map((item) => (
                <a
                  key={item.brand}
                  href={`/?brand=${encodeURIComponent(item.brand)}`}
                  className={`group relative rounded-3xl overflow-hidden border border-slate-100 shadow-card hover:shadow-vibrant transition-all duration-300 h-[360px] ${item.dark ? "bg-brand-navy" : "bg-white"}`}
                >
                  <div className="absolute inset-0 p-6 flex flex-col z-20 pointer-events-none">
                    <div
                      className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform origin-top-right border ${item.iconBg}`}
                    >
                      <span className={`material-symbols-outlined text-4xl ${item.iconColor}`}>
                        {item.icon}
                      </span>
                    </div>
                    <h3 className={`text-2xl font-black mb-1 ${item.dark ? "text-white" : "text-brand-navy"}`}>
                      {item.brand}
                    </h3>
                    <p className={`text-sm font-bold mb-2 ${item.dark ? "text-slate-300" : "text-slate-500"}`}>
                      {item.sub}
                    </p>
                    <p className={`text-xs leading-relaxed max-w-[150px] ${item.dark ? "text-slate-400" : "text-slate-400"}`}>
                      {item.desc}
                    </p>
                    <div className="mt-auto opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                      <span
                        className={`inline-flex items-center text-brand-navy font-bold text-sm px-4 py-2 rounded-lg ${item.cta}`}
                      >
                        تصفح المنتجات
                        <span className="material-symbols-outlined text-sm mr-2">
                          arrow_back
                        </span>
                      </span>
                    </div>
                  </div>
                  {/* Circle BG */}
                  <div
                    className={`absolute -bottom-10 -left-10 w-48 h-48 rounded-full transition-colors z-10 ${item.bg}`}
                  />
                  {/* Oil icon decoration */}
                  <div className="absolute right-0 bottom-0 w-3/4 h-3/4 flex items-end justify-end rounded-tl-[60px] z-0 overflow-hidden opacity-20 group-hover:opacity-30 transition-opacity duration-500">
                    <span className={`material-symbols-outlined text-[200px] ${item.iconColor}`} style={{ opacity: 0.5 }}>
                      {item.icon}
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </section>
        )}

        {/* ── PRODUCT LISTING ─────────────────────── */}
        <section className="py-4" id="products">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Sidebar */}
            <aside className="w-full md:w-60 flex-shrink-0">
              <div className="bg-white rounded-3xl border border-slate-100 shadow-card p-5 sticky top-24 space-y-6">
                {/* Categories */}
                {categories.length > 0 && (
                  <div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                      الفئات
                    </h3>
                    <div className="space-y-1">
                      <FilterLink href="/?" label="جميع المنتجات" active={!params.category && !params.brand && !params.search} />
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

                {/* Brands */}
                {uniqueBrands.length > 0 && (
                  <div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                      العلامة التجارية
                    </h3>
                    <div className="space-y-1">
                      <FilterLink href="/?" label="جميع العلامات" active={!params.brand && !params.category && !params.search} />
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

                {/* Price Range placeholder */}
                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                    السعر
                  </h3>
                  <div className="text-sm text-slate-500">
                    <div className="flex justify-between mb-2">
                      <span>0 ر.س</span>
                      <span>1000 ر.س</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={1000}
                      className="w-full accent-brand-orange"
                      readOnly
                    />
                  </div>
                </div>
              </div>
            </aside>

            {/* Products */}
            <div className="flex-1">
              {/* Header row */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-black text-xl text-brand-navy">
                  {params.search
                    ? `نتائج: "${params.search}"`
                    : params.brand || params.category
                    ? params.brand || params.category
                    : "أفضل الزيوت العالمية"}
                  <span className="text-slate-400 font-normal text-sm mr-2">
                    ({products.length})
                  </span>
                </h2>
                <form action="/" method="GET">
                  <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-4 py-2.5 shadow-sm focus-within:border-brand-orange transition-colors">
                    <span className="material-symbols-outlined text-slate-400 text-lg">search</span>
                    <input
                      type="search"
                      name="search"
                      className="bg-transparent border-none outline-none text-sm text-brand-navy placeholder:text-slate-400 w-44"
                      placeholder="ابحث عن منتج..."
                      defaultValue={params.search}
                    />
                  </div>
                </form>
              </div>

              <ProductList products={products} />
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
              {/* Image placeholder */}
              <div className="relative h-[400px] lg:h-[500px]">
                <div className="absolute top-10 right-10 w-64 h-80 bg-slate-200 rounded-2xl shadow-xl z-20 border-4 border-white hover:-translate-y-2 transition-transform duration-500 flex items-center justify-center">
                  <span className="material-symbols-outlined text-slate-400 text-[80px]">oil_barrel</span>
                </div>
                <div className="absolute bottom-10 left-10 w-56 h-56 bg-slate-100 rounded-2xl shadow-xl z-30 border-4 border-white hover:-translate-y-2 transition-transform duration-500 delay-100 flex items-center justify-center">
                  <span className="material-symbols-outlined text-slate-400 text-[60px]">local_gas_station</span>
                </div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-orange rounded-full opacity-20 blur-2xl" />
                <div className="absolute bottom-20 left-32 w-48 h-48 bg-brand-navy rounded-full opacity-10 blur-2xl" />
                <div className="absolute inset-0 border-2 border-dashed border-slate-300 rounded-3xl m-8 -z-10" />
              </div>
            </div>
          </section>
        )}

        {/* ── CTA SECTION ────────────────────────── */}
        {!isFiltering && (
          <section className="bg-brand-orange rounded-3xl p-8 lg:p-16 text-center text-white relative overflow-hidden shadow-vibrant">
            <div className="absolute inset-0 opacity-10"
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
        )}
      </main>

      {/* ── FOOTER ───────────────────────────────────── */}
      <footer className="bg-white border-t border-slate-200 mt-10">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-12 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div className="md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="size-8 bg-brand-orange rounded-lg flex items-center justify-center text-white">
                  <span className="material-symbols-outlined text-lg">oil_barrel</span>
                </div>
                <span className="text-xl font-black text-brand-navy">ItalyaOils</span>
              </div>
              <p className="text-slate-500 text-sm leading-relaxed">
                وجهتك الأولى للزيوت والمحركات العالمية. جودة أصلية وأداء مضمون.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-brand-navy mb-4">أهم العلامات</h4>
              <ul className="space-y-2 text-sm text-slate-500">
                {["Mobil 1", "Shell Helix", "Castrol", "TotalEnergies"].map((b) => (
                  <li key={b}>
                    <a href={`/?brand=${b}`} className="hover:text-brand-orange transition-colors">{b}</a>
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
                <li><a href="/admin" className="hover:text-brand-orange transition-colors">لوحة الإدارة</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-400">
            <p>© 2025 ItalyaOils. جميع الحقوق محفوظة.</p>
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

function FilterLink({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active: boolean;
}) {
  return (
    <a
      href={href}
      className={`flex items-center gap-2 text-sm px-3 py-2 rounded-xl transition-colors ${
        active
          ? "bg-orange-50 text-brand-orange font-bold border border-orange-200"
          : "text-slate-600 hover:bg-slate-50 hover:text-brand-navy font-medium"
      }`}
    >
      {active && (
        <span className="size-1.5 bg-brand-orange rounded-full flex-shrink-0" />
      )}
      {label}
    </a>
  );
}
