import Link from "next/link";

const NAV_ITEMS = [
  { label: "لوحة التحكم", href: "/admin", icon: "grid_view" },
  { label: "المنتجات", href: "/admin/products", icon: "inventory_2" },
  { label: "استيراد Excel", href: "/admin/products/import", icon: "upload_file" },
  { label: "البانرات الترويجية", href: "/admin/promos", icon: "image" },
  { label: "الفئات", href: "/admin/categories", icon: "label" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-brand-navy flex flex-col flex-shrink-0 sticky top-0 h-screen">
        {/* Logo */}
        <div className="px-6 py-5 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="size-8 bg-brand-orange rounded-lg flex items-center justify-center text-white shadow-lg shadow-brand-orange/30">
              <span className="material-symbols-outlined text-lg">oil_barrel</span>
            </div>
            <div>
              <p className="text-white font-black text-sm leading-tight">ItalyaOils</p>
              <p className="text-slate-400 text-[10px]">لوحة الإدارة</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-300 hover:bg-white/10 hover:text-white transition-colors text-sm font-medium group"
            >
              <span className="material-symbols-outlined text-lg group-hover:text-brand-orange transition-colors">
                {item.icon}
              </span>
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-3 py-4 border-t border-white/10">
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-400 hover:bg-white/10 hover:text-white transition-colors text-sm font-medium group"
          >
            <span className="material-symbols-outlined text-lg group-hover:text-brand-orange transition-colors">
              storefront
            </span>
            عرض المتجر
          </Link>
        </div>
      </aside>

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between sticky top-0 z-10">
          <div className="text-sm text-slate-400">
            <span className="text-brand-navy font-bold">ItalyaOils</span> / الإدارة
          </div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-brand-orange transition-colors font-medium"
          >
            <span className="material-symbols-outlined text-base">open_in_new</span>
            المتجر
          </Link>
        </header>

        {/* Page content */}
        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  );
}
