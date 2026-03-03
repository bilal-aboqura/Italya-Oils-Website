"use client";

import { useState } from "react";

interface ProductDetailsTabsProps {
  description: string | null;
  viscosity?: string | null;
  brand?: string | null;
}

export default function ProductDetailsTabs({ description, viscosity, brand }: ProductDetailsTabsProps) {
  const [activeTab, setActiveTab] = useState<"about" | "specs">("about");

  return (
    <>
      <div className="flex border-b border-slate-200 bg-slate-50/50">
        <button
          onClick={() => setActiveTab("about")}
          className={`px-8 py-5 font-bold transition-colors ${
            activeTab === "about"
              ? "text-brand-navy border-b-2 border-brand-orange bg-white"
              : "text-slate-500 hover:text-brand-orange"
          }`}
        >
          عن المنتج
        </button>
        <button
          onClick={() => setActiveTab("specs")}
          className={`px-8 py-5 font-bold transition-colors ${
            activeTab === "specs"
              ? "text-brand-navy border-b-2 border-brand-orange bg-white"
              : "text-slate-500 hover:text-brand-orange"
          }`}
        >
          المواصفات
        </button>
      </div>

      <div className="p-8 lg:p-12">
        {activeTab === "about" ? (
          <>
            <h3 className="text-2xl font-black text-brand-navy mb-4">وصف المنتج</h3>
            <p className="text-slate-600 leading-relaxed mb-6 text-lg whitespace-pre-wrap">
              {description || "لا يوجد وصف متاح لهذا المنتج حالياً. نضمن لكم أن جميع منتجاتنا أصلية وتلبي أعلى معايير الجودة العالمية لحماية محرك سيارتكم."}
            </p>

            <div className="bg-orange-50 rounded-2xl p-6 border border-orange-100 mb-8">
              <h4 className="font-bold text-brand-navy mb-3 flex items-center gap-2">
                <span className="material-symbols-outlined text-brand-orange">info</span>
                لماذا تختار هذا المنتج؟
              </h4>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-slate-700 font-medium text-sm">
                <li className="flex items-center gap-2"><span className="size-1.5 bg-brand-orange rounded-full"></span>حماية فائقة للمحرك في ظروف التشغيل القاسية</li>
                <li className="flex items-center gap-2"><span className="size-1.5 bg-brand-orange rounded-full"></span>تقليل الاحتكاك وزيادة عمر المحرك</li>
                <li className="flex items-center gap-2"><span className="size-1.5 bg-brand-orange rounded-full"></span>كفاءة عالية في درجات الحرارة المرتفعة</li>
                <li className="flex items-center gap-2"><span className="size-1.5 bg-brand-orange rounded-full"></span>متوافق مع أحدث معايير الجودة العالمية</li>
              </ul>
            </div>
          </>
        ) : (
          <>
            <h3 className="text-2xl font-black text-brand-navy mb-6">المواصفات التقنية</h3>
            <div className="space-y-3">
              {[
                { label: "اللزوجة", value: viscosity || "—", icon: "water_drop" },
                { label: "الماركة", value: brand || "—", icon: "store" },
                { label: "التركيبة", value: "تخليقي متكامل", icon: "science" },
                { label: "الجودة", value: "أصلي 100% معتمد", icon: "verified" },
                { label: "الأداء", value: "حماية عالية الكفاءة", icon: "speed" },
                { label: "الشحن", value: "تغليف آمن للشحن", icon: "local_shipping" },
              ].map(({ label, value, icon }) => (
                <div key={label} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-slate-400 text-lg">{icon}</span>
                    <span className="text-slate-600 font-medium text-sm">{label}</span>
                  </div>
                  <span className="font-bold text-brand-navy text-sm">{value}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}
