import { LayoutDashboard, Package, FileSpreadsheet, Image } from "lucide-react";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const dynamic = "force-dynamic";
const ADMIN_PATH = `/${process.env.ADMIN_SECRET_PATH ?? "admin-panel"}`;

export default async function AdminDashboardPage() {
  const [productCount, uncategorized, missingImages, promoCount] = await Promise.all([
    prisma.product.count(),
    prisma.product.count({ where: { categories: { none: {} } } }),
    prisma.product.count({ where: { imageUrl: null } }),
    prisma.promoBanner.count({ where: { isActive: true } }),
  ]);

  const stats = [
    { label: "المنتجات الكلية", value: productCount, icon: "inventory_2", href: `${ADMIN_PATH}/products`, color: "text-brand-orange", bg: "bg-orange-50" },
    { label: "بدون فئة", value: uncategorized, icon: "label_off", href: `${ADMIN_PATH}/products`, color: "text-yellow-500", bg: "bg-yellow-50" },
    { label: "بدون صورة", value: missingImages, icon: "hide_image", href: `${ADMIN_PATH}/products`, color: "text-red-500", bg: "bg-red-50" },
    { label: "البانرات النشطة", value: promoCount, icon: "image", href: `${ADMIN_PATH}/promos`, color: "text-green-500", bg: "bg-green-50" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black text-brand-navy">لوحة التحكم</h1>
        <p className="text-slate-500 text-sm mt-1">نظرة عامة على المتجر</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href} className="bg-white rounded-2xl border border-slate-100 shadow-card hover:shadow-vibrant hover:-translate-y-0.5 transition-all p-6 space-y-4">
            <div className={`size-12 rounded-xl ${stat.bg} flex items-center justify-center`}>
              <span className={`material-symbols-outlined text-2xl ${stat.color}`}>{stat.icon}</span>
            </div>
            <div>
              <p className={`text-4xl font-black ${stat.color}`}>{stat.value}</p>
              <p className="text-xs text-slate-400 mt-1 font-medium">{stat.label}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">إجراءات سريعة</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link href={`${ADMIN_PATH}/products/import`} className="bg-white rounded-2xl border border-slate-100 shadow-card hover:shadow-vibrant hover:border-brand-orange/30 transition-all p-6 flex items-start gap-4">
            <div className="size-12 rounded-xl bg-orange-50 flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-brand-orange text-2xl">upload_file</span>
            </div>
            <div>
              <p className="font-bold text-brand-navy">استيراد منتجات Excel</p>
              <p className="text-xs text-slate-400 mt-1">رفع ملف Excel لاستيراد المنتجات بالجملة</p>
            </div>
          </Link>
          <Link href={`${ADMIN_PATH}/promos/new`} className="bg-white rounded-2xl border border-slate-100 shadow-card hover:shadow-vibrant hover:border-brand-orange/30 transition-all p-6 flex items-start gap-4">
            <div className="size-12 rounded-xl bg-green-50 flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-green-500 text-2xl">add_photo_alternate</span>
            </div>
            <div>
              <p className="font-bold text-brand-navy">إضافة بانر ترويجي</p>
              <p className="text-xs text-slate-400 mt-1">إضافة عروض وبانرات تسويقية للمتجر</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
