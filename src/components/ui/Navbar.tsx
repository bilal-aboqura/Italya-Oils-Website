"use client";

import { useCartStore } from "@/lib/cart-store";

export default function Navbar() {
  const { totalItems, setIsOpen } = useCartStore();
  const count = totalItems();

  return (
    <header className="w-full bg-white/80 backdrop-blur-lg border-b border-slate-200 sticky top-0 z-50">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-4 lg:px-12">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="size-10 bg-brand-orange rounded-xl flex items-center justify-center text-white shadow-lg shadow-brand-orange/30">
            <span className="material-symbols-outlined text-[22px]">oil_barrel</span>
          </div>
          <h2 className="text-brand-navy text-2xl font-black tracking-tight font-sans">
            Italya<span className="text-brand-orange">Oils</span>
          </h2>
        </div>

        {/* Nav Links */}
        <nav className="hidden md:flex flex-1 justify-center gap-2">
          {[
            { label: "الرئيسية", href: "/" },
            { label: "الزيوت الاصطناعية", href: "/?category=engine-oils" },
            { label: "فلاتر وزيوت", href: "/?category=filters-and-parts" },
          ].map((item) => (
            <a
              key={item.label}
              className="text-slate-600 hover:text-brand-orange text-sm font-bold transition-colors bg-slate-50 hover:bg-orange-50 px-4 py-2 rounded-lg"
              href={item.href}
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button className="p-2 text-slate-600 hover:text-brand-orange hover:bg-orange-50 rounded-lg transition-colors">
            <span className="material-symbols-outlined">search</span>
          </button>

          <button
            onClick={() => setIsOpen(true)}
            className="relative p-2 text-slate-600 hover:text-brand-orange hover:bg-orange-50 rounded-lg transition-colors"
            aria-label="فتح سلة التسوق"
          >
            <span className="material-symbols-outlined">shopping_bag</span>
            {count > 0 && (
              <span className="absolute top-0.5 right-0.5 size-4 bg-brand-orange text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-fade-in">
                {count}
              </span>
            )}
          </button>

          {/* Mobile menu */}
          <button className="md:hidden p-2 text-slate-600 hover:text-brand-orange hover:bg-orange-50 rounded-lg transition-colors">
            <span className="material-symbols-outlined">menu</span>
          </button>
        </div>
      </div>
    </header>
  );
}
