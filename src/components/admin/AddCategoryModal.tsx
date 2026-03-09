"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, X, Loader2, Tag, UploadCloud } from "lucide-react";
import Image from "next/image";

interface AddCategoryModalProps {
    /** Called after a category is successfully created, useful for optimistic UI. */
    onCreated?: (category: { id: string; name: string; slug: string }) => void;
}

export default function AddCategoryModal({ onCreated }: AddCategoryModalProps) {
    const router = useRouter();

    const [isOpen, setIsOpen] = useState(false);
    const [name, setName] = useState("");
    const [description, setDesc] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    // Reset form state
    const reset = () => {
        setName("");
        setDesc("");
        setImageFile(null);
        setImagePreview(null);
        setError(null);
        setSuccess(null);
        setLoading(false);
    };

    const openModal = () => { reset(); setIsOpen(true); };
    const closeModal = () => { setIsOpen(false); reset(); };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // ── Client-side validation (FR-002, SC-002) ──────────────────────────────
        if (!name.trim()) {
            setError("اسم التصنيف مطلوب.");
            return;
        }

        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            let imageUrl: string | null = null;
            if (imageFile) {
                const uploadData = new FormData();
                uploadData.append("file", imageFile);
                const uploadRes = await fetch("/api/admin/upload", {
                    method: "POST",
                    body: uploadData,
                });
                const uploadResult = await uploadRes.json();
                if (!uploadRes.ok) throw new Error(uploadResult.error?.message);
                imageUrl = uploadResult.url;
            }

            const res = await fetch("/api/admin/categories", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: name.trim(), description: description.trim(), imageUrl }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data?.error?.message ?? "حدث خطأ أثناء الحفظ.");
                return;
            }

            setSuccess(`✅ تم إضافة التصنيف "${data.category.name}" بنجاح.`);
            onCreated?.(data.category);

            // Refresh the server component so the category shows up immediately (SC-003)
            router.refresh();

            // Close the modal after a brief feedback delay
            setTimeout(closeModal, 1200);
        } catch {
            setError("تعذّر الاتصال بالخادم. يرجى المحاولة مجدداً.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* ── Trigger Button (FR-006) ─────────────────────────────────────────── */}
            <button
                id="add-category-btn"
                type="button"
                onClick={openModal}
                className="btn-secondary gap-2 text-sm"
            >
                <Tag className="w-4 h-4" />
                إضافة تصنيف
            </button>

            {/* ── Backdrop ─────────────────────────────────────────────────────────── */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 transition-all"
                    style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(2px)" }}
                    onClick={(e) => e.target === e.currentTarget && closeModal()}
                >
                    {/* ── Modal Card ─────────────────────────────────────────────────── */}
                    <div
                        id="add-category-modal"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="modal-title"
                        className="w-full max-w-md animate-fade-in shadow-2xl relative"
                        style={{
                            background: "#161722", // matches image dark background
                            borderRadius: "24px",
                            padding: "24px",
                        }}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between mb-8">
                            <h2
                                id="modal-title"
                                className="text-xl font-bold flex items-center gap-2 text-[#0a66c2]" // Blue like image
                            >
                                <Tag className="w-5 h-5 flex-shrink-0" />
                                إضافة تصنيف جديد
                            </h2>
                            <button
                                type="button"
                                onClick={closeModal}
                                className="text-gray-400 hover:text-white transition-colors p-1"
                                aria-label="إغلاق"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Image Upload */}
                            <div className="space-y-2 text-right">
                                <label className="block text-sm font-bold text-white">صورة التصنيف</label>
                                <div className="flex items-start justify-end gap-5">
                                    <div className="flex-1">
                                        <input
                                            type="file"
                                            accept="image/jpeg,image/png,image/webp"
                                            onChange={handleImageChange}
                                            className="w-full text-sm file:ml-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-white/10 file:text-white file:font-semibold hover:file:bg-white/20 text-gray-300 cursor-pointer"
                                            disabled={loading}
                                            dir="rtl"
                                        />
                                        <p className="text-xs text-gray-400 mt-2">JPG, PNG, WebP — يفضل صورة مربعة</p>
                                    </div>
                                    <div className="w-24 h-24 rounded-2xl bg-white/5 overflow-hidden flex-shrink-0 border-2 border-dashed border-white/20 flex items-center justify-center relative">
                                        {imagePreview ? (
                                            <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                                        ) : (
                                            <UploadCloud className="w-8 h-8 text-gray-500" />
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Category Name – required */}
                            <div className="space-y-2">
                                <label
                                    htmlFor="category-name"
                                    className="block text-sm font-bold text-white relative w-fit mx-auto sm:mx-0"
                                >
                                    اسم التصنيف <span className="text-red-500 absolute -left-3 top-0">*</span>
                                </label>
                                <input
                                    id="category-name"
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    maxLength={100}
                                    placeholder="مثال: زيوت المحركات"
                                    className="w-full bg-white text-black placeholder-gray-400 rounded-2xl h-14 px-4 border-2 border-[#ff7b1c] outline-none shadow-sm block text-right"
                                    disabled={loading}
                                    autoFocus
                                    dir="rtl"
                                />
                            </div>

                            {/* Description – optional */}
                            <div className="space-y-2">
                                <label
                                    htmlFor="category-description"
                                    className="block text-sm font-bold text-white text-right"
                                >
                                    وصف مختصر{" "}
                                    <span className="text-gray-400 font-normal">(اختياري)</span>
                                </label>
                                <textarea
                                    id="category-description"
                                    value={description}
                                    onChange={(e) => setDesc(e.target.value)}
                                    maxLength={300}
                                    rows={4}
                                    placeholder="وصف مختصر عن التصنيف..."
                                    className="w-full bg-white text-black placeholder-gray-400 rounded-2xl p-4 border-2 border-transparent focus:border-[#ff7b1c] outline-none shadow-sm block text-right resize-none"
                                    disabled={loading}
                                    dir="rtl"
                                />
                            </div>

                            {/* Feedback messages */}
                            {error && (
                                <p className="text-sm text-red-500 text-center font-medium bg-red-500/10 rounded-xl py-2">
                                    {error}
                                </p>
                            )}
                            {success && (
                                <p className="text-sm text-emerald-500 text-center font-medium bg-emerald-500/10 rounded-xl py-2">
                                    {success}
                                </p>
                            )}

                            {/* Actions */}
                            <div className="flex gap-4 pt-4">
                                <button
                                    type="submit"
                                    id="submit-category-btn"
                                    disabled={loading}
                                    className="flex-1 bg-[#ff7b1c] hover:bg-[#e66c15] text-white rounded-2xl h-14 font-bold text-lg flex items-center justify-center gap-2 transition-colors"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            جاري الحفظ…
                                        </>
                                    ) : (
                                        <>
                                            <Plus className="w-5 h-5" />
                                            إضافة التصنيف
                                        </>
                                    )}
                                </button>
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    disabled={loading}
                                    className="flex-1 bg-white hover:bg-gray-100 text-black rounded-2xl h-14 font-bold text-lg transition-colors"
                                >
                                    إلغاء
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
