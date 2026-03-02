"use client";

import { X } from "lucide-react";

interface SlotGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SlotGuideModal({ isOpen, onClose }: SlotGuideModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-brand-navy/60 backdrop-blur-sm flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-slate-50 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-white px-6 py-4 flex items-center justify-between border-b border-slate-100 flex-shrink-0">
          <h3 className="text-xl font-black text-brand-navy flex items-center gap-2">
            <span className="material-symbols-outlined text-brand-orange">map</span>
            خريطة أماكن عرض البانرات
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content (Scrollable Schematic) */}
        <div className="p-6 md:p-8 overflow-y-auto customize-scrollbar">
          <div className="text-center mb-8">
            <p className="text-slate-600 font-medium text-sm">
              هذا المخطط التوضيحي يوضح لك تماماً أين سيظهر البانر في الموقع عند اختيارك لأحد الأماكن.
            </p>
          </div>

          <div className="max-w-3xl mx-auto bg-white border-4 border-slate-200 rounded-2xl p-4 shadow-sm relative space-y-4">
            {/* Fake Navbar */}
            <div className="w-full h-12 bg-slate-100 rounded-lg flex items-center justify-between px-4">
               <div className="w-20 h-4 bg-slate-200 rounded"></div>
               <div className="flex gap-2">
                 <div className="w-8 h-4 bg-slate-200 rounded"></div>
                 <div className="w-8 h-4 bg-slate-200 rounded"></div>
                 <div className="w-8 h-4 bg-slate-200 rounded"></div>
               </div>
            </div>

            {/* Top Strip Slot */}
            <div className="w-full h-16 bg-brand-orange/10 border-2 border-dashed border-brand-orange text-brand-orange font-bold text-xs flex items-center justify-center rounded-xl relative group hover:bg-brand-orange/20 transition-colors">
              شريط علوي رفيع (home_top_strip)
              <span className="absolute left-2 bottom-1 text-[9px] opacity-70">المقاس: 8:1</span>
            </div>

            {/* Hero Section */}
            <div className="grid grid-cols-12 gap-4 h-48">
              {/* Main Hero Card */}
              <div className="col-span-8 bg-brand-orange/10 border-2 border-dashed border-brand-orange text-brand-orange font-bold text-xs flex items-center justify-center rounded-xl relative hover:bg-brand-orange/20 transition-colors">
                البانر الرئيسي العريض (home_hero)
                <span className="absolute left-2 bottom-1 text-[9px] opacity-70">المقاس: 16:9</span>
              </div>
              {/* Side Card */}
              <div className="col-span-4 grid grid-rows-2 gap-4">
                <div className="bg-brand-orange/10 border-2 border-dashed border-brand-orange text-brand-orange font-bold text-xs flex items-center justify-center rounded-xl relative hover:bg-brand-orange/20 transition-colors">
                  البانر الجانبي المربع (home_side)
                  <span className="absolute left-2 bottom-1 text-[9px] opacity-70">المقاس: 1:1</span>
                </div>
                <div className="bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 text-xs">
                  محتويات أخرى ثابتة
                </div>
              </div>
            </div>

            {/* Layout Split */}
            <div className="flex gap-4 min-h-[300px]">
               {/* Sidebar */}
               <div className="w-1/4 space-y-4">
                 <div className="w-full h-32 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 text-xs text-center px-2">
                   الفلاتر والأقسام
                 </div>
                 {/* Sidebar Promo */}
                 <div className="w-full h-40 bg-brand-orange/10 border-2 border-dashed border-brand-orange text-brand-orange font-bold text-xs flex items-center justify-center rounded-xl relative hover:bg-brand-orange/20 transition-colors flex-col gap-1 text-center px-1">
                  بانر الشريط الجانبي (sidebar_promo)
                  <span className="text-[9px] opacity-70">المقاس: 1:1</span>
                 </div>
               </div>

               {/* Main Content */}
               <div className="flex-1 space-y-4">
                 <div className="w-full h-24 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 text-xs">
                   المنتجات
                 </div>

                 {/* Middle Banner */}
                 <div className="w-full h-20 bg-brand-orange/10 border-2 border-dashed border-brand-orange text-brand-orange font-bold text-xs flex items-center justify-center rounded-xl relative hover:bg-brand-orange/20 transition-colors">
                    بانر منتصف الصفحة (home_middle)
                    <span className="absolute left-2 bottom-1 text-[9px] opacity-70">المقاس: 21:9</span>
                 </div>

                 <div className="w-full h-24 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 text-xs">
                   المنتجات
                 </div>
               </div>
            </div>

            {/* Fake Trust Section */}
            <div className="w-full h-24 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 text-xs">
              شركاء الموثوقية
            </div>

            {/* Bottom Banner */}
            <div className="w-full h-20 bg-brand-orange/10 border-2 border-dashed border-brand-orange text-brand-orange font-bold text-xs flex items-center justify-center rounded-xl relative hover:bg-brand-orange/20 transition-colors">
                البانر السفلي (home_bottom)
                <span className="absolute left-2 bottom-1 text-[9px] opacity-70">المقاس: 4:1</span>
            </div>

            {/* Fake Footer */}
            <div className="w-full h-16 bg-slate-800 rounded-xl flex items-center justify-center text-slate-500 text-xs">
              الفوتر (تذييل الصفحة)
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}
