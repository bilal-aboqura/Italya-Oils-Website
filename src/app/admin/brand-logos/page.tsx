"use client";

import { useState, useEffect } from "react";
import { Trash2, Upload, Loader2, Plus, Braces } from "lucide-react";
import Image from "next/image";

interface BrandLogo {
  id: string;
  name: string;
  logoUrl: string;
  sortOrder: number;
}

export default function AdminBrandLogosPage() {
  const [logos, setLogos] = useState<BrandLogo[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [sortOrder, setSortOrder] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const fetchLogos = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/brand-logos");
    const data = await res.json();
    setLogos(data);
    setLoading(false);
  };

  useEffect(() => { fetchLogos(); }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    setError(null);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || "Upload failed");
      setLogoUrl(data.url);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !logoUrl) {
      setError("يرجى إدخال اسم الماركة ورفع اللوجو");
      return;
    }
    setIsSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/brand-logos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), logoUrl, sortOrder }),
      });
      if (!res.ok) throw new Error("Failed to save");
      setName("");
      setLogoUrl("");
      setSortOrder(0);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      await fetchLogos();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا اللوجو؟")) return;
    setDeletingId(id);
    const res = await fetch(`/api/admin/brand-logos?id=${id}`, { method: "DELETE" });
    if (res.ok) setLogos((prev) => prev.filter((l) => l.id !== id));
    setDeletingId(null);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-brand-orange/5 blur-3xl rounded-full -translate-x-1/2 -translate-y-1/2" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-orange/10 text-brand-orange text-[10px] font-black uppercase tracking-wider mb-3">
            <span className="material-symbols-outlined text-xs">branding_watermark</span>
            شريط الماركات
          </div>
          <h1 className="text-3xl font-black text-brand-navy">لوجوهات الماركات</h1>
          <p className="text-slate-400 text-sm mt-2 font-medium">
            اللوجوهات اللي هترفعها هتظهر في الشريط المتحرك بالصفحة الرئيسية
          </p>
        </div>
        <div className="relative z-10 flex items-center gap-3">
          <div className="bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-center">
            <p className="text-2xl font-black text-brand-navy">{logos.length}</p>
            <p className="text-xs font-bold text-slate-400">لوجو مضاف</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Add Form */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
          <h2 className="text-lg font-black text-brand-navy mb-5 flex items-center gap-2">
            <Plus className="w-5 h-5 text-brand-orange" />
            إضافة لوجو جديد
          </h2>

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-xl text-sm font-bold flex items-center gap-2">
              <span className="material-symbols-outlined text-base">error</span>
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-xl text-sm font-bold flex items-center gap-2">
              <span className="material-symbols-outlined text-base">check_circle</span>
              تم حفظ اللوجو بنجاح!
            </div>
          )}

          <form onSubmit={handleAdd} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-brand-navy mb-1.5">اسم الماركة *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="مثال: Mobil 1"
                className="w-full bg-slate-50 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-brand-orange outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-brand-navy mb-1.5">لوجو الماركة *</label>
              <div className="relative border-2 border-dashed border-slate-200 hover:border-brand-orange/50 rounded-2xl transition-colors overflow-hidden bg-slate-50 h-36 flex flex-col items-center justify-center cursor-pointer group">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  disabled={isUploading}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                />
                {logoUrl ? (
                  <>
                    <Image
                      src={logoUrl}
                      alt="logo preview"
                      fill
                      className="object-contain p-4"
                      unoptimized
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity z-10 flex items-center justify-center">
                      <span className="bg-white text-brand-navy text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1">
                        <Upload className="w-3 h-3" /> تغيير اللوجو
                      </span>
                    </div>
                  </>
                ) : isUploading ? (
                  <Loader2 className="w-8 h-8 animate-spin text-brand-orange" />
                ) : (
                  <div className="text-center text-slate-400 group-hover:text-brand-orange transition-colors px-4">
                    <Upload className="w-8 h-8 mx-auto mb-2" />
                    <span className="text-xs font-bold block">ارفع اللوجو (PNG شفاف أفضل)</span>
                    <span className="text-[10px] mt-1 block opacity-70">JPG, PNG, WebP — حد أقصى 10MB</span>
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-brand-navy mb-1.5">الترتيب</label>
              <input
                type="number"
                value={sortOrder}
                onChange={(e) => setSortOrder(parseInt(e.target.value) || 0)}
                className="w-full bg-slate-50 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-brand-orange outline-none"
                placeholder="0"
              />
              <p className="text-[10px] text-slate-400 mt-1 font-medium">أرقام أقل = يظهر أول في الشريط</p>
            </div>

            <button
              type="submit"
              disabled={isSaving || isUploading}
              className="w-full py-3 bg-brand-orange text-white font-bold rounded-2xl hover:bg-orange-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              {isSaving ? "جاري الحفظ..." : "إضافة اللوجو"}
            </button>
          </form>
        </div>

        {/* Logos Grid */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
          <h2 className="text-lg font-black text-brand-navy mb-5 flex items-center gap-2">
            <span className="material-symbols-outlined text-brand-orange text-xl">grid_view</span>
            اللوجوهات المضافة
          </h2>

          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-brand-orange" />
            </div>
          ) : logos.length === 0 ? (
            <div className="text-center py-16">
              <Braces className="w-12 h-12 text-slate-200 mx-auto mb-3" />
              <p className="text-slate-400 font-medium text-sm">لم تضف أي لوجو بعد</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-3">
              {logos.map((logo) => (
                <div key={logo.id} className="relative group border border-slate-100 rounded-2xl bg-slate-50 overflow-hidden aspect-square">
                  <Image
                    src={logo.logoUrl}
                    alt={logo.name}
                    fill
                    className="object-contain p-3"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 rounded-2xl">
                    <span className="text-white text-xs font-bold text-center px-2 truncate w-full text-center">{logo.name}</span>
                    <button
                      onClick={() => handleDelete(logo.id)}
                      disabled={deletingId === logo.id}
                      className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-60"
                    >
                      {deletingId === logo.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
