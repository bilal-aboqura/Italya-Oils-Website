"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Image as ImageIcon, ArrowRight, Upload, Loader2, Save } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

import ImageCropperModal from "@/components/admin/ImageCropperModal";
import SlotGuideModal from "@/components/admin/SlotGuideModal";

const ADMIN = process.env.NEXT_PUBLIC_ADMIN_PATH ?? "/admin-panel";

const SLOTS = [
  { id: "home_top_strip", label: "الشريط العلوي الرفيع (8:1)", aspect: 8 / 1, recommend: "يفضل 1920x240" },
  { id: "home_hero", label: "البانر الرئيسي العريض (16:9)", aspect: 16 / 9, recommend: "يفضل 1920x1080" },
  { id: "home_side", label: "البانر الجانبي المربع (1:1)", aspect: 1, recommend: "يفضل 800x800" },
  { id: "sidebar_promo", label: "بانر الفلاتر الجانبي (1:1)", aspect: 1, recommend: "يفضل 600x600" },
  { id: "home_middle", label: "بانر منتصف الصفحة (21:9)", aspect: 21 / 9, recommend: "يفضل 1920x820" },
  { id: "home_bottom", label: "البانر السفلي المستطيل (4:1)", aspect: 4 / 1, recommend: "يفضل 1200x300" },
];

// ── Inner component that safely uses useSearchParams ──────────────────────────
function NewPromoForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cropper states
  const [imageToCrop, setImageToCrop] = useState<string | null>(null);

  // Guide state
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    imageUrl: "",
    linkUrl: "",
    targetPage: "home_hero",
    sortOrder: 0,
  });

  // Pre-select slot if coming from the guide page via ?slot=...
  useEffect(() => {
    const slotParam = searchParams.get("slot");
    if (slotParam && SLOTS.some((s) => s.id === slotParam)) {
      setFormData((prev) => ({ ...prev, targetPage: slotParam }));
    }
  }, [searchParams]);

  const activeSlot = SLOTS.find((s) => s.id === formData.targetPage) || SLOTS[0];

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset old cropper instance if selecting new file
    if (imageToCrop) {
      URL.revokeObjectURL(imageToCrop);
    }
    setImageToCrop(URL.createObjectURL(file));
  };

  const uploadCroppedImage = async (croppedFile: File) => {
    setImageToCrop(null); // Close modal
    setError(null);
    setIsUploading(true);

    const uploadData = new FormData();
    uploadData.append("file", croppedFile);

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: uploadData,
      });

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
    if (!formData.imageUrl) {
      setError("يرجى رفع صورة للبانر");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/promos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || "Failed to create promo");

      router.push(`${ADMIN}/promos`);
      router.refresh();
    } catch (err: any) {
      setError(err.message);
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "sortOrder" ? parseInt(value) || 0 : value,
    }));
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-10">
      <div className="flex items-center gap-4">
        <Link
          href={`${ADMIN}/promos`}
          className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-500"
        >
          <ArrowRight className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-black flex items-center gap-3 text-brand-navy">
            <ImageIcon className="w-6 h-6 text-brand-orange" />
            إضافة بانر إعلاني جديد
          </h1>
          <div className="flex items-center gap-4 mt-1">
            <p className="text-slate-500 text-sm font-medium">
              قم بإضافة بانر ترويجي لعرضه في واجهة المتجر
            </p>
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
                  type="text"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-brand-orange outline-none"
                  placeholder="مثال: خصم 20% على ماركة موبيل"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-brand-navy mb-2">الرابط المستهدف (اختياري)</label>
                <input
                  type="text"
                  name="linkUrl"
                  value={formData.linkUrl}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-brand-orange outline-none"
                  placeholder="مثال: /?brand=موبيل"
                  dir="ltr"
                />
                <p className="text-[10px] text-slate-400 mt-1 font-medium">
                  الرابط الذي سينتقل إليه المستخدم عند الضغط على البانر
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-brand-navy mb-2">مكان الظهور *</label>
                  <select
                    name="targetPage"
                    required
                    value={formData.targetPage}
                    onChange={handleChange}
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
                    type="number"
                    name="sortOrder"
                    value={formData.sortOrder}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-brand-orange outline-none"
                    placeholder="0"
                  />
                  <p className="text-[10px] text-slate-400 mt-1 font-medium text-left">
                    (أرقام أقل = يظهر أولاً)
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-bold text-brand-navy">صورة البانر *</label>

              <div className="relative w-full h-48 bg-slate-50 border-2 border-dashed border-slate-200 hover:border-brand-orange/50 transition-colors rounded-2xl flex flex-col items-center justify-center overflow-hidden cursor-pointer group">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  disabled={isUploading || isSubmitting}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed z-20"
                />

                {formData.imageUrl ? (
                  <Image
                    src={formData.imageUrl}
                    alt="Banner Preview"
                    fill
                    className="object-cover"
                    unoptimized
                  />
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
                    <span className="text-[10px] font-normal mt-1 opacity-70 block">
                      يدعم: JPG, PNG, WebP (بحد أقصى 5MB)
                    </span>
                  </div>
                )}

                {formData.imageUrl && !isUploading && (
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity z-10 flex items-center justify-center">
                    <div className="bg-white text-brand-navy px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 shadow-lg">
                      <Upload className="w-3 h-3" />
                      تغيير الصورة
                    </div>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2 mt-2">
                <span className="material-symbols-outlined text-[14px] text-slate-400">info</span>
                <p className="text-[10px] text-slate-400 font-medium">
                  يُفضل استخدام صور أفقية (Landscape) للحصول على أفضل عرض للتصاميم.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 flex items-center justify-end gap-3">
            <Link
              href={`${ADMIN}/promos`}
              className="px-6 py-3 rounded-xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors text-sm"
              onClick={(e) => {
                if (isSubmitting) e.preventDefault();
              }}
            >
              إلغاء
            </Link>
            <button
              type="submit"
              disabled={isSubmitting || isUploading}
              className="px-6 py-3 rounded-xl font-bold text-white bg-brand-orange hover:bg-orange-600 transition-colors flex items-center gap-2 text-sm disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  جاري الحفظ...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  حفظ البانر
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Cropper Modal */}
      {imageToCrop && (
        <ImageCropperModal
          imageSrc={imageToCrop}
          aspect={activeSlot.aspect}
          onCropCancel={() => setImageToCrop(null)}
          onCropComplete={uploadCroppedImage}
        />
      )}

      {/* Guide Modal */}
      <SlotGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />
    </div>
  );
}

// ── Page export: wraps the form in Suspense for useSearchParams ───────────────
export default function NewPromoPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-brand-orange" />
      </div>
    }>
      <NewPromoForm />
    </Suspense>
  );
}
