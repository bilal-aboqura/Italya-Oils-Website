import Link from "next/link";
import { ArrowRight, LayoutDashboard, Plus } from "lucide-react";
import { ADMIN_PATH } from "@/lib/admin-config";

const SLOTS = [
  {
    id: "home_top_strip",
    name: "الشريط العلوي",
    aspect: "8:1",
    recommend: "1920 × 240 px",
    color: "bg-purple-100 border-purple-300 text-purple-700",
    badge: "bg-purple-100 text-purple-700",
    area: "home_top_strip",
    position: "أعلى الصفحة مباشرة أسفل القائمة الرئيسية",
  },
  {
    id: "home_hero",
    name: "البانر الرئيسي العريض",
    aspect: "16:9",
    recommend: "1920 × 1080 px",
    color: "bg-blue-100 border-blue-300 text-blue-700",
    badge: "bg-blue-100 text-blue-700",
    area: "home_hero",
    position: "قسم الهيرو الافتتاحي للصفحة الرئيسية",
  },
  {
    id: "home_side",
    name: "البانر الجانبي المربع",
    aspect: "1:1",
    recommend: "800 × 800 px",
    color: "bg-teal-100 border-teal-300 text-teal-700",
    badge: "bg-teal-100 text-teal-700",
    area: "home_side",
    position: "الكرت الجانبي بجوار البانر الرئيسي",
  },
  {
    id: "sidebar_promo",
    name: "بانر الشريط الجانبي",
    aspect: "1:1",
    recommend: "600 × 600 px",
    color: "bg-yellow-100 border-yellow-300 text-yellow-700",
    badge: "bg-yellow-100 text-yellow-700",
    area: "sidebar_promo",
    position: "أسفل فلاتر المنتجات في الشريط الجانبي",
  },
  {
    id: "home_middle",
    name: "بانر منتصف الصفحة",
    aspect: "21:9",
    recommend: "1920 × 820 px",
    color: "bg-pink-100 border-pink-300 text-pink-700",
    badge: "bg-pink-100 text-pink-700",
    area: "home_middle",
    position: "بعد قائمة المنتجات والماركات في الصفحة الرئيسية",
  },
  {
    id: "home_bottom",
    name: "البانر السفلي",
    aspect: "4:1",
    recommend: "1200 × 300 px",
    color: "bg-green-100 border-green-300 text-green-700",
    badge: "bg-green-100 text-green-700",
    area: "home_bottom",
    position: "أسفل قسم الثقة، قبل قسم التواصل",
  },
];

export default function SlotGuidePage() {
  return (
    <div className="space-y-8 pb-10 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href={`${ADMIN_PATH}/promos`} className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-500">
          <ArrowRight className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-black text-brand-navy flex items-center gap-3">
            <div className="size-10 bg-brand-orange/10 rounded-2xl flex items-center justify-center">
              <LayoutDashboard className="w-5 h-5 text-brand-orange" />
            </div>
            خريطة أماكن البانرات
          </h1>
          <p className="text-slate-500 text-sm mt-1 font-medium">
            مرجع كامل لجميع مواضع البانرات الإعلانية في الموقع وأبعادها المثالية
          </p>
        </div>
      </div>

      {/* Visual Schematic */}
      <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
        <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-5">مخطط تخطيط الصفحة</h2>
        <div className="max-w-2xl mx-auto space-y-3 font-sans">
          {/* Navbar */}
          <div className="h-10 bg-brand-navy rounded-xl flex items-center px-4 gap-2">
            <div className="size-2 rounded-full bg-brand-orange" />
            <div className="w-12 h-2 bg-white/20 rounded-full" />
            <div className="mx-auto flex gap-4">
              {[1, 2, 3].map(i => <div key={i} className="w-10 h-2 bg-white/20 rounded-full" />)}
            </div>
          </div>

          {/* Top Strip */}
          <div className="h-8 bg-purple-100 border-2 border-dashed border-purple-400 rounded-lg flex items-center justify-center">
            <span className="text-xs font-bold text-purple-600">home_top_strip · 8:1</span>
          </div>

          {/* Hero row */}
          <div className="grid grid-cols-5 gap-3 h-36">
            <div className="col-span-3 bg-blue-100 border-2 border-dashed border-blue-400 rounded-xl flex items-center justify-center">
              <span className="text-xs font-bold text-blue-600 text-center">home_hero<br />16:9</span>
            </div>
            <div className="col-span-2 grid grid-rows-2 gap-3">
              <div className="bg-teal-100 border-2 border-dashed border-teal-400 rounded-xl flex items-center justify-center">
                <span className="text-[10px] font-bold text-teal-600 text-center">home_side<br />1:1</span>
              </div>
              <div className="bg-slate-100 rounded-xl flex items-center justify-center">
                <span className="text-[10px] text-slate-400 font-bold">محتوى ثابت</span>
              </div>
            </div>
          </div>

          {/* Products + Sidebar */}
          <div className="grid grid-cols-5 gap-3">
            <div className="col-span-1 space-y-2">
              <div className="h-16 bg-slate-100 rounded-lg" />
              <div className="h-24 bg-yellow-100 border-2 border-dashed border-yellow-400 rounded-lg flex items-center justify-center">
                <span className="text-[9px] font-bold text-yellow-600 text-center">sidebar_promo<br />1:1</span>
              </div>
            </div>
            <div className="col-span-4 space-y-2">
              <div className="h-12 bg-slate-100 rounded-lg" />
              <div className="h-16 bg-pink-100 border-2 border-dashed border-pink-400 rounded-lg flex items-center justify-center">
                <span className="text-xs font-bold text-pink-600">home_middle · 21:9</span>
              </div>
              <div className="h-12 bg-slate-100 rounded-lg" />
            </div>
          </div>

          {/* Trust section */}
          <div className="h-16 bg-slate-100 rounded-xl flex items-center justify-center">
            <span className="text-xs text-slate-400 font-bold">قسم الثقة</span>
          </div>

          {/* Bottom banner */}
          <div className="h-12 bg-green-100 border-2 border-dashed border-green-400 rounded-lg flex items-center justify-center">
            <span className="text-xs font-bold text-green-600">home_bottom · 4:1</span>
          </div>

          <div className="h-10 bg-slate-800 rounded-xl flex items-center justify-center">
            <span className="text-[10px] text-slate-500 font-bold">تذييل الصفحة</span>
          </div>
        </div>
      </div>

      {/* Slot Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {SLOTS.map((slot) => (
          <div
            key={slot.id}
            className={`rounded-3xl border-2 p-6 ${slot.color} space-y-3`}
          >
            <div className="flex items-start justify-between">
              <h3 className="font-black text-base">{slot.name}</h3>
              <span className={`text-xs px-2.5 py-1 rounded-full font-bold ${slot.badge} border border-current/20`}>
                {slot.aspect}
              </span>
            </div>
            <p className="text-xs opacity-80 font-bold leading-relaxed">{slot.position}</p>
            <div className="pt-2 flex items-center justify-between border-t border-current/20">
              <code className="text-[10px] font-mono opacity-70 bg-white/50 px-2 py-0.5 rounded">
                {slot.id}
              </code>
              <span className="text-[10px] font-bold opacity-70">{slot.recommend}</span>
            </div>
            <Link
              href={`${ADMIN_PATH}/promos/new?slot=${slot.id}`}
              className="w-full mt-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-white/60 hover:bg-white text-xs font-bold transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              إضافة بانر لهذا المكان
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
