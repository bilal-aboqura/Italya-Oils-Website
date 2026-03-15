"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Pencil, Trash2, Loader2, ExternalLink } from "lucide-react";

const SLOT_LABELS: Record<string, { label: string; color: string }> = {
  home_top_strip: { label: "شريط علوي", color: "bg-purple-100 text-purple-700" },
  home_hero: { label: "بانر رئيسي", color: "bg-blue-100 text-blue-700" },
  home_side: { label: "جانبي مربع", color: "bg-teal-100 text-teal-700" },
  sidebar_promo: { label: "شريط الفلاتر", color: "bg-yellow-100 text-yellow-700" },
  home_middle: { label: "منتصف الصفحة", color: "bg-pink-100 text-pink-700" },
  home_bottom: { label: "بانر سفلي", color: "bg-green-100 text-green-700" },
};

export interface PromoBanner {
  id: string;
  title: string;
  imageUrl: string;
  linkUrl: string | null;
  targetPage: string;
  isActive: boolean;
  sortOrder: number;
}

export default function PromoBannerCard({ banner, adminPath }: { banner: PromoBanner; adminPath: string }) {
  const router = useRouter();
  const [isActive, setIsActive] = useState(banner.isActive);
  const [loading, setLoading] = useState<"toggle" | "delete" | null>(null);

  const slot = SLOT_LABELS[banner.targetPage] ?? { label: banner.targetPage, color: "bg-slate-100 text-slate-600" };

  const handleToggle = useCallback(async () => {
    setLoading("toggle");
    const newState = !isActive;
    setIsActive(newState); // optimistic update
    try {
      const res = await fetch(`/api/admin/promos/${banner.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: newState }),
      });
      if (!res.ok) setIsActive(!newState); // rollback
    } catch {
      setIsActive(!newState);
    } finally {
      setLoading(null);
      router.refresh();
    }
  }, [banner.id, isActive, router]);

  const handleDelete = useCallback(async () => {
    if (!confirm(`هل أنت متأكد من حذف بانر "${banner.title}"؟`)) return;
    setLoading("delete");
    try {
      await fetch(`/api/admin/promos/${banner.id}`, { method: "DELETE" });
      router.refresh();
    } finally {
      setLoading(null);
    }
  }, [banner.id, banner.title, router]);

  return (
    <div
      className={`group relative rounded-3xl overflow-hidden bg-white border-2 transition-all duration-300 shadow-sm hover:shadow-xl ${
        isActive ? "border-slate-100 hover:border-brand-orange/30" : "border-slate-200 opacity-60 hover:opacity-90"
      }`}
    >
      {/* Banner Image Thumbnail */}
      <div className="relative w-full h-44 bg-gradient-to-br from-slate-100 to-slate-200 overflow-hidden">
        <Image
          src={banner.imageUrl}
          alt={banner.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          unoptimized
        />

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Status badge (top left) */}
        <div className="absolute top-3 right-3">
          <span
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${slot.color} shadow-sm`}
          >
            {slot.label}
          </span>
        </div>

        {/* Inactive overlay */}
        {!isActive && (
          <div className="absolute inset-0 bg-slate-900/50 flex items-center justify-center backdrop-blur-[1px]">
            <span className="bg-white/90 text-slate-700 font-black text-sm px-4 py-2 rounded-full shadow-lg">
              ⛶ موقوف
            </span>
          </div>
        )}

        {/* Sort order (top right) */}
        <div className="absolute top-3 left-3 bg-black/40 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded-full">
          #{banner.sortOrder}
        </div>

        {/* Action buttons (appear on hover) */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <div className="flex gap-2">
            <a
              href={`${adminPath}/promos/${banner.id}/edit`}
              className="p-2 rounded-xl bg-white text-brand-navy hover:bg-brand-orange hover:text-white transition-colors shadow-md"
              title="تعديل"
            >
              <Pencil className="w-4 h-4" />
            </a>
            <button
              onClick={handleDelete}
              disabled={loading !== null}
              className="p-2 rounded-xl bg-white text-slate-600 hover:bg-red-500 hover:text-white transition-colors shadow-md disabled:opacity-50"
              title="حذف"
            >
              {loading === "delete" ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4" />
              )}
            </button>
          </div>
          {banner.linkUrl && (
            <a
              href={banner.linkUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-xl bg-white text-slate-600 hover:bg-slate-800 hover:text-white transition-colors shadow-md"
              title="فتح الرابط"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>

      {/* Card footer */}
      <div className="p-4 flex items-center justify-between">
        <div className="min-w-0">
          <h3 className="font-bold text-brand-navy text-sm truncate">{banner.title}</h3>
          {banner.linkUrl && (
            <p className="text-[10px] text-slate-400 truncate mt-0.5 font-mono" dir="ltr">
              {banner.linkUrl}
            </p>
          )}
        </div>

        {/* Active Toggle + Status */}
        <div className="flex items-center gap-2 flex-shrink-0 mr-2">
          <span className={`text-[10px] font-bold transition-colors ${isActive ? "text-green-500" : "text-slate-400"}`}>
            {isActive ? "نشط" : "موقوف"}
          </span>
          <button
            onClick={handleToggle}
            disabled={loading !== null}
            title={isActive ? "إيقاف البانر" : "تفعيل البانر"}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors flex-shrink-0 ${
              isActive ? "bg-brand-orange" : "bg-slate-200"
            } disabled:cursor-not-allowed`}
          >
            {loading === "toggle" ? (
              <span className="absolute inset-0 flex items-center justify-center">
                <Loader2 className="w-3 h-3 text-white animate-spin" />
              </span>
            ) : (
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${
                  isActive ? "translate-x-6" : "translate-x-1"
                }`}
              />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
