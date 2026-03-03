"use client";

import { useCartStore } from "@/lib/cart-store";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Logo from "@/components/ui/Logo";

export default function Navbar() {
  const { totalItems, setIsOpen } = useCartStore();
  const count = totalItems();
  const router = useRouter();

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  const navLinks = [
    { label: "الرئيسية", href: "/" },
    { label: "جميع المنتجات", href: "/?section=products" },
  ];

  return (
    <header className="w-full bg-white/80 backdrop-blur-lg border-b border-slate-200 sticky top-0 z-50">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-4 lg:px-12">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2">
          <Logo variant="dark" height={44} />
        </a>

        {/* Nav Links (desktop) */}
        <nav className="hidden md:flex flex-1 justify-center gap-2">
          {navLinks.map((item) => (
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
        <div className="flex items-center gap-2">
          {/* Search */}
          {searchOpen ? (
            <form onSubmit={handleSearch} className="flex items-center gap-2">
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث عن منتج..."
                className="border border-slate-200 rounded-lg px-3 py-1.5 text-sm text-brand-navy placeholder:text-slate-400 outline-none focus:border-brand-orange w-40 sm:w-52"
              />
              <button type="submit" className="p-2 text-brand-orange hover:bg-orange-50 rounded-lg transition-colors">
                <span className="material-symbols-outlined text-lg">search</span>
              </button>
              <button
                type="button"
                onClick={() => { setSearchOpen(false); setSearchQuery(""); }}
                className="p-2 text-slate-400 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </form>
          ) : (
            <button
              onClick={() => setSearchOpen(true)}
              className="p-2 text-slate-600 hover:text-brand-orange hover:bg-orange-50 rounded-lg transition-colors"
              aria-label="بحث"
            >
              <span className="material-symbols-outlined">search</span>
            </button>
          )}

          {/* Cart */}
          <button
            onClick={() => setIsOpen(true)}
            className="relative p-2 text-slate-600 hover:text-brand-orange hover:bg-orange-50 rounded-lg transition-colors"
            aria-label="فتح سلة التسوق"
          >
            <span className="material-symbols-outlined">shopping_bag</span>
            {mounted && count > 0 && (
              <span className="absolute top-0.5 right-0.5 size-4 bg-brand-orange text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-fade-in">
                {count}
              </span>
            )}
          </button>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-slate-600 hover:text-brand-orange hover:bg-orange-50 rounded-lg transition-colors"
            aria-label="قائمة التنقل"
          >
            <span className="material-symbols-outlined">{mobileOpen ? "close" : "menu"}</span>
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileOpen && (
        <nav className="md:hidden bg-white border-t border-slate-100 px-6 py-4 space-y-1">
          {navLinks.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-700 hover:bg-orange-50 hover:text-brand-orange font-bold text-sm transition-colors"
            >
              <span className="material-symbols-outlined text-lg">chevron_right</span>
              {item.label}
            </a>
          ))}
          <div className="pt-2 border-t border-slate-100">
            <form onSubmit={(e) => { handleSearch(e); setMobileOpen(false); }} className="flex gap-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث عن منتج..."
                className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-sm text-brand-navy placeholder:text-slate-400 outline-none focus:border-brand-orange"
              />
              <button type="submit" className="px-4 py-2 bg-brand-orange text-white rounded-lg text-sm font-bold hover:bg-orange-600 transition-colors">
                بحث
              </button>
            </form>
          </div>
        </nav>
      )}
    </header>
  );
}
