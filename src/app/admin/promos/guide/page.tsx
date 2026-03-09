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
