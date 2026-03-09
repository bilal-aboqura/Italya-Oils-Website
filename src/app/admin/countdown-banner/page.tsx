"use client";

import { useState, useEffect } from "react";
import { Loader2, Save, UploadCloud, Timer } from "lucide-react";
import Image from "next/image";

interface Banner {
    id?: string;
    title: string;
    subtitle: string;
    imageUrl: string | null;
    buttonText: string;
    buttonLink: string;
    endsAt: string;
    isActive: boolean;
}

export default function CountdownBannerPage() {
    const [form, setForm] = useState<Banner>({
        title: "خصومات ما تتفوت",
        subtitle: "استمتع بخصومات مميزة على مختلف المنتجات طوال العام",
        imageUrl: null,
        buttonText: "تسوق الآن",
        buttonLink: "/?section=products",
        endsAt: "",
        isActive: true,
    });
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetch("/api/admin/countdown-banner")
            .then((r) => r.json())
            .then((data) => {
                if (data) {
                    setForm({
                        ...data,
                        endsAt: data.endsAt ? new Date(data.endsAt).toISOString().slice(0, 16) : "",
                    });
                    if (data.imageUrl) setImagePreview(data.imageUrl);
                }
            })
            .finally(() => setIsLoading(false));
    }, []);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setError(null);
        setSuccess(false);

        try {
            let finalImageUrl = form.imageUrl;

            if (imageFile) {
                const uploadData = new FormData();
                uploadData.append("file", imageFile);
                const uploadRes = await fetch("/api/admin/upload", { method: "POST", body: uploadData });
                const uploadResult = await uploadRes.json();
                if (!uploadRes.ok) throw new Error(uploadResult.error?.message);
                finalImageUrl = uploadResult.url;
            }

            const res = await fetch("/api/admin/countdown-banner", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...form, imageUrl: finalImageUrl }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error?.message);

            setForm({ ...data, endsAt: data.endsAt ? new Date(data.endsAt).toISOString().slice(0, 16) : "" });
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        } catch (err) {
            setError(err instanceof Error ? err.message : "حدث خطأ غير متوقع");
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-brand-orange" />
            </div>
        );
    }

    return (
        <div className="space-y-8 max-w-3xl">
            <div className="flex items-center gap-3">
                <div className="size-10 bg-brand-orange/10 rounded-2xl flex items-center justify-center">
                    <Timer className="w-5 h-5 text-brand-orange" />
                </div>
                <div>
                    <h1 className="text-2xl font-black text-brand-navy">الشريط السفلي</h1>
                    <p className="text-slate-500 text-sm mt-0.5">بانر العروض مع العداد التنازلي</p>
                </div>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm font-medium">
                    {error}
                </div>
            )}
            {success && (
                <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-xl text-sm font-medium">
                    ✓ تم الحفظ بنجاح
                </div>
            )}

            <form onSubmit={handleSubmit} className="card p-8 space-y-6">
                {/* Image Upload */}
                <div className="space-y-3">
                    <label className="block text-sm font-bold text-brand-navy">صورة البانر</label>
                    <div className="flex items-start gap-6">
                        <div className="w-40 h-28 rounded-2xl bg-slate-50 overflow-hidden flex-shrink-0 border-2 border-dashed border-slate-200 flex items-center justify-center relative">
                            {imagePreview ? (
                                <Image src={imagePreview} alt="Preview" fill className="object-cover rounded-xl" />
                            ) : (
                                <UploadCloud className="w-8 h-8 text-slate-300" />
                            )}
                        </div>
                        <div className="flex-1 space-y-2">
                            <input
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                                onChange={handleImageChange}
                                className="w-full text-sm file:ml-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-brand-navy/5 file:text-brand-navy file:font-bold hover:file:bg-brand-navy/10 text-slate-500 cursor-pointer"
                                disabled={isSaving}
                            />
                            <p className="text-xs text-slate-400">JPG, PNG, WebP — نسبة 2:1 مثالية (مثل 1200×600)</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                        <label className="block text-sm font-bold text-brand-navy">العنوان الرئيسي</label>
                        <input
                            type="text"
                            value={form.title}
                            onChange={(e) => setForm({ ...form, title: e.target.value })}
                            className="input-field"
                            dir="rtl"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="block text-sm font-bold text-brand-navy">العنوان الفرعي</label>
                        <input
                            type="text"
                            value={form.subtitle}
                            onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                            className="input-field"
                            dir="rtl"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="block text-sm font-bold text-brand-navy">نص الزر</label>
                        <input
                            type="text"
                            value={form.buttonText}
                            onChange={(e) => setForm({ ...form, buttonText: e.target.value })}
                            className="input-field"
                            dir="rtl"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="block text-sm font-bold text-brand-navy">رابط الزر</label>
                        <input
                            type="text"
                            value={form.buttonLink}
                            onChange={(e) => setForm({ ...form, buttonLink: e.target.value })}
                            className="input-field"
                            dir="ltr"
                        />
                    </div>
                </div>

                {/* Timer End Date */}
                <div className="space-y-2">
                    <label className="block text-sm font-bold text-brand-navy flex items-center gap-2">
                        <Timer className="w-4 h-4 text-brand-orange" />
                        تاريخ ووقت انتهاء العرض
                    </label>
                    <input
                        type="datetime-local"
                        value={form.endsAt}
                        onChange={(e) => setForm({ ...form, endsAt: e.target.value })}
                        className="input-field"
                        required
                    />
                    <p className="text-xs text-slate-400">العداد التنازلي سيحسب من الآن حتى هذا التاريخ</p>
                </div>

                <div className="flex items-center gap-3">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                            type="checkbox"
                            checked={form.isActive}
                            onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                            className="w-4 h-4 accent-brand-orange"
                        />
                        <span className="text-sm font-bold text-brand-navy">البانر مفعّل (يظهر في الموقع)</span>
                    </label>
                </div>

                <div className="pt-2">
                    <button type="submit" disabled={isSaving} className="btn-primary py-3 px-10">
                        {isSaving ? <><Loader2 className="w-4 h-4 animate-spin" /> جاري الحفظ…</> : <><Save className="w-4 h-4" /> حفظ الإعدادات</>}
                    </button>
                </div>
            </form>
        </div>
    );
}
