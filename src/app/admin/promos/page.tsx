import { prisma } from "@/lib/prisma";
import { Image as ImageIcon, Plus, LayoutDashboard } from "lucide-react";
import PromoBannerCard from "@/components/admin/PromoBannerCard";
import Link from "next/link";
import { ADMIN_PATH } from "@/lib/admin-config";

export const dynamic = "force-dynamic";

const SLOT_ORDER = [
  "home_top_strip",
  "home_hero",
  "home_side",
  "sidebar_promo",
  "home_middle",
  "home_bottom",
];

const SLOT_NAMES: Record<string, string> = {
  home_top_strip: "الشريط العلوي",
  home_hero: "البانر الرئيسي",
  home_side: "البانر الجانبي المربع",
  sidebar_promo: "بانر الشريط الجانبي",
  home_middle: "بانر منتصف الصفحة",
  home_bottom: "البانر السفلي",
};

export default async function AdminPromosPage() {
  const banners = await prisma.promoBanner.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });

  const activeBanners = banners.filter((b) => b.isActive).length;

  // Group banners by slot
  const grouped: Record<string, typeof banners> = {};
  for (const banner of banners) {
    if (!grouped[banner.targetPage]) grouped[banner.targetPage] = [];
    grouped[banner.targetPage].push(banner);
  }

  // Sort slot groups according to SLOT_ORDER
  const slotKeys = [
    ...SLOT_ORDER.filter((s) => grouped[s]),
    ...Object.keys(grouped).filter((k) => !SLOT_ORDER.includes(k)),
  ];

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-brand-navy flex items-center gap-3">
            <div className="size-10 bg-brand-orange/10 rounded-2xl flex items-center justify-center">
              <ImageIcon className="w-5 h-5 text-brand-orange" />
            </div>
            البانرات الترويجية
          </h1>
          <div className="flex items-center gap-3 mt-2">
            <p className="text-slate-500 text-sm font-medium">
              {banners.length} بانر إجمالاً ·{" "}
              <span className="text-green-600 font-bold">{activeBanners} نشط</span>·{" "}
              <span className="text-slate-400">{banners.length - activeBanners} موقوف</span>
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <Link
            href={`${ADMIN_PATH}/promos/guide`}
            className="px-4 py-2.5 rounded-xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors flex items-center gap-2 text-sm"
          >
            <LayoutDashboard className="w-4 h-4" />
            خريطة الأماكن
          </Link>
          <Link
            href={`${ADMIN_PATH}/promos/new`}
            className="px-4 py-2.5 rounded-xl font-bold text-white bg-brand-orange hover:bg-orange-600 transition-colors flex items-center gap-2 text-sm shadow-md shadow-brand-orange/30"
          >
            <Plus className="w-4 h-4" />
            بانر جديد
          </Link>
        </div>
      </div>

      {/* Empty state */}
      {banners.length === 0 && (
        <div className="bg-white rounded-3xl border-2 border-dashed border-slate-200 py-20 text-center">
          <div className="size-16 bg-slate-100 rounded-3xl flex items-center justify-center mx-auto mb-4">
            <ImageIcon className="w-8 h-8 text-slate-300" />
          </div>
          <h3 className="text-lg font-black text-brand-navy mb-2">لا توجد بانرات حتى الآن</h3>
          <p className="text-slate-400 text-sm mb-6 font-medium">
            أضف أول بانر ترويجي لتظهر في واجهة المتجر
          </p>
          <Link
            href={`${ADMIN_PATH}/promos/new`}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white bg-brand-orange hover:bg-orange-600 transition-colors text-sm shadow-md shadow-brand-orange/30"
          >
            <Plus className="w-4 h-4" />
            إضافة أول بانر
          </Link>
        </div>
      )}

      {/* Grouped Sections */}
      {slotKeys.map((slotId) => {
        const slotBanners = grouped[slotId];
        const slotName = SLOT_NAMES[slotId] ?? slotId;
        return (
          <section key={slotId} className="space-y-4">
            {/* Slot Section Header */}
            <div className="flex items-center gap-3">
              <h2 className="text-base font-black text-brand-navy">{slotName}</h2>
              <code className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-lg font-mono">
                {slotId}
              </code>
              <div className="flex-1 border-t border-slate-100" />
              <span className="text-xs bg-slate-100 text-slate-500 px-2.5 py-1 rounded-full font-bold">
                {slotBanners.length} {slotBanners.length === 1 ? "بانر" : "بانرات"}
              </span>
              <a
                href={`${ADMIN_PATH}/promos/new?slot=${slotId}`}
                className="text-xs font-bold text-brand-orange hover:text-orange-600 transition-colors flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                إضافة
              </a>
            </div>

            {/* Cards Grid */}
            <div
              dir="ltr"
              className="grid gap-6"
              style={{ gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))" }}
            >
              {slotBanners.map((banner) => (
                <PromoBannerCard key={banner.id} banner={banner} adminPath={ADMIN_PATH} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
