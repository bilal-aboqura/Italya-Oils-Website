"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Image as ImageIcon, ArrowRight, Upload, Loader2, Save } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

import ImageCropperModal from "@/components/admin/ImageCropperModal";
import SlotGuideModal from "@/components/admin/SlotGuideModal";

// Client component — we can't read server-only env vars here.
// The parent page passes the admin path via a data attribute on the wrapper div.
// Fallback: use the segment that the Next.js router currently shows us.
function getAdminBase() {
  if (typeof window === "undefined") return "/admin";
  // Extract the first two path segments, e.g. /italya-ops-2026
  const parts = window.location.pathname.split("/").filter(Boolean);
  return parts.length >= 1 ? `/${parts[0]}` : "/admin";
}

const SLOTS = [
  { id: "home_top_strip", label: "الشريط العلوي الرفيع (8:1)", aspect: 8 / 1, recommend: "يفضل 1920x240" },
  { id: "home_hero", label: "البانر الرئيسي العريض (16:9)", aspect: 16 / 9, recommend: "يفضل 1920x1080" },
  { id: "home_side", label: "البانر الجانبي المربع (1:1)", aspect: 1, recommend: "يفضل 800x800" },
  { id: "sidebar_promo", label: "بانر الفلاتر الجانبي (1:1)", aspect: 1, recommend: "يفضل 600x600" },
  { id: "home_middle", label: "بانر منتصف الصفحة (21:9)", aspect: 21 / 9, recommend: "يفضل 1920x820" },
  { id: "home_bottom", label: "البانر السفلي المستطيل (4:1)", aspect: 4 / 1, recommend: "يفضل 1200x300" },
];

interface EditPromoPageProps {
  params: Promise<{ id: string }>;
}

export default function EditPromoPage({ params }: EditPromoPageProps) {
  const router = useRouter();
  const [bannerId, setBannerId] = useState<string | null>(null);
  const [isFetching, setIsFetching] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageToCrop, setImageToCrop] = useState<string | null>(null);
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    imageUrl: "",
    linkUrl: "",
    targetPage: "home_hero",
    sortOrder: 0,
    isActive: true,
  });

  // Resolve params and fetch existing banner
  useEffect(() => {
    params.then(({ id }) => {
      setBannerId(id);
      fetch(`/api/admin/promos/${id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.banner) {
            const b = data.banner;
            setFormData({
              title: b.title,
              imageUrl: b.imageUrl,
              linkUrl: b.linkUrl ?? "",
              targetPage: b.targetPage,
              sortOrder: b.sortOrder,
              isActive: b.isActive,
            });
          }
        })
        .catch(() => setError("فشل في تحميل بيانات البانر"))
        .finally(() => setIsFetching(false));
    });
  }, [params]);

  const activeSlot = SLOTS.find((s) => s.id === formData.targetPage) || SLOTS[1];

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (imageToCrop) URL.revokeObjectURL(imageToCrop);
    setImageToCrop(URL.createObjectURL(file));
  };

  const uploadCroppedImage = async (croppedFile: File) => {
    setImageToCrop(null);
    setError(null);
    setIsUploading(true);
    const uploadData = new FormData();
    uploadData.append("file", croppedFile);
    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body: uploadData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || "Failed to upload image");
      setFormData((prev) => ({ ...prev, imageUrl: data.url }));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.imageUrl) { setError("يرجى رفع صورة للبانر"); return; }
    setIsSubmitting(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/promos/${bannerId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || "Failed to update promo");
      const adminBase = getAdminBase();
      router.push(`${adminBase}/promos`);
      router.refresh();
    } catch (err: any) {
      setError(err.message);
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox"
        ? (e.target as HTMLInputElement).checked
        : name === "sortOrder" ? parseInt(value) || 0 : value,
    }));
  };

  if (isFetching) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-brand-orange" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-10">
      <div className="flex items-center gap-4">
        <Link href={`${getAdminBase()}/promos`} className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-500">
          <ArrowRight className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-black flex items-center gap-3 text-brand-navy">
            <ImageIcon className="w-6 h-6 text-brand-orange" />
            تعديل البانر الإعلاني
          </h1>
          <div className="flex items-center gap-4 mt-1">
            <p className="text-slate-500 text-sm font-medium">تعديل بيانات وصورة البانر المختار</p>
            <button
              onClick={() => setIsGuideOpen(true)}
              className="text-xs font-bold text-brand-navy bg-slate-100 px-3 py-1 rounded-full hover:bg-slate-200 transition-colors flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[14px] text-brand-orange">map</span>
              دليل أماكن البانرات
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-sm">
        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm font-bold flex items-center gap-2">
            <span className="material-symbols-outlined">error</span>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-brand-navy mb-2">عنوان البانر *</label>
                <input
                  type="text" name="title" required value={formData.title} onChange={handleChange}
                  className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-brand-orange outline-none"
                  placeholder="مثال: خصم 20% على ماركة موبيل"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-brand-navy mb-2">الرابط المستهدف (اختياري)</label>
                <input
                  type="text" name="linkUrl" value={formData.linkUrl} onChange={handleChange}
                  className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-brand-orange outline-none"
                  placeholder="مثال: /?brand=موبيل" dir="ltr"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-brand-navy mb-2">مكان الظهور *</label>
                  <select
                    name="targetPage" required value={formData.targetPage} onChange={handleChange}
                    className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-brand-orange outline-none"
                  >
                    {SLOTS.map((slot) => (
                      <option key={slot.id} value={slot.id}>{slot.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-brand-navy mb-2">الترتيب</label>
                  <input
                    type="number" name="sortOrder" value={formData.sortOrder} onChange={handleChange}
                    className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-brand-orange outline-none"
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
                <input
                  type="checkbox" id="isActive" name="isActive" checked={formData.isActive}
                  onChange={handleChange}
                  className="w-4 h-4 rounded accent-brand-orange"
                />
                <label htmlFor="isActive" className="text-sm font-bold text-brand-navy cursor-pointer">
                  تفعيل البانر (مرئي في الموقع)
                </label>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-bold text-brand-navy">صورة البانر *</label>
              <div className="relative w-full h-48 bg-slate-50 border-2 border-dashed border-slate-200 hover:border-brand-orange/50 transition-colors rounded-2xl flex flex-col items-center justify-center overflow-hidden cursor-pointer group">
                <input
                  type="file" accept="image/*" onChange={handleFileSelect}
                  disabled={isUploading || isSubmitting}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed z-20"
                />
                {formData.imageUrl ? (
                  <Image src={formData.imageUrl} alt="Banner Preview" fill className="object-cover" unoptimized />
                ) : (
                  <div className="text-center text-slate-400 group-hover:text-brand-orange transition-colors z-10 px-4">
                    {isUploading ? (
                      <Loader2 className="w-8 h-8 mx-auto mb-2 animate-spin text-brand-orange" />
                    ) : (
                      <Upload className="w-8 h-8 mx-auto mb-2" />
                    )}
                    <span className="text-xs font-bold block">
                      {isUploading ? "جاري الرفع..." : "انقر أو اسحب لاختيار صورة"}
                    </span>
                  </div>
                )}
                {formData.imageUrl && !isUploading && (
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity z-10 flex items-center justify-center">
                    <div className="bg-white text-brand-navy px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 shadow-lg">
                      <Upload className="w-3 h-3" /> تغيير الصورة
                    </div>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2 mt-2">
                <span className="material-symbols-outlined text-[14px] text-slate-400">info</span>
                <p className="text-[10px] text-slate-400 font-medium">
                  المقاس الموصى به لهذا المكان: <strong>{activeSlot.recommend}</strong>
                </p>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 flex items-center justify-end gap-3">
            <Link
              href={`${getAdminBase()}/promos`}
              className="px-6 py-3 rounded-xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors text-sm"
            >
              إلغاء
            </Link>
            <button
              type="submit" disabled={isSubmitting || isUploading}
              className="px-6 py-3 rounded-xl font-bold text-white bg-brand-orange hover:bg-orange-600 transition-colors flex items-center gap-2 text-sm disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <><Loader2 className="w-4 h-4 animate-spin" />جاري الحفظ...</>
              ) : (
                <><Save className="w-4 h-4" />حفظ التعديلات</>
              )}
            </button>
          </div>
        </form>
      </div>

      {imageToCrop && (
        <ImageCropperModal
          imageSrc={imageToCrop}
          aspect={activeSlot.aspect}
          onCropCancel={() => setImageToCrop(null)}
          onCropComplete={uploadCroppedImage}
        />
      )}
      <SlotGuideModal isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />
    </div>
  );
}
