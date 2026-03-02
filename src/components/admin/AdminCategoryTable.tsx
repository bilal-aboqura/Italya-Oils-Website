"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Edit2, Loader2, AlertCircle } from "lucide-react";

interface Category {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    _count?: {
        products: number;
    };
}

interface AdminCategoryTableProps {
    categories: Category[];
}

export default function AdminCategoryTable({ categories }: AdminCategoryTableProps) {
    const router = useRouter();
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [editName, setEditName] = useState("");
    const [editDescription, setEditDescription] = useState("");
    const [isSaving, setIsSaving] = useState(false);

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`هل أنت متأكد من حذف التصنيف "${name}"؟`)) return;

        setDeletingId(id);
        setError(null);

        try {
            const res = await fetch(`/api/admin/categories/${id}`, {
                method: "DELETE",
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error?.message || "حدث خطأ أثناء الحذف.");
            } else {
                router.refresh();
            }
        } catch {
            setError("تعذّر الاتصال بالخادم.");
        } finally {
            setDeletingId(null);
        }
    };

    const handleEdit = (category: Category) => {
        setEditingCategory(category);
        setEditName(category.name);
        setEditDescription(category.description || "");
        setError(null);
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingCategory || !editName.trim()) return;

        setIsSaving(true);
        setError(null);

        try {
            const res = await fetch(`/api/admin/categories/${editingCategory.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: editName.trim(),
                    description: editDescription.trim(),
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error?.message || "حدث خطأ أثناء التحديث.");
            } else {
                setEditingCategory(null);
                router.refresh();
            }
        } catch {
            setError("تعذّر الاتصال بالخادم.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="space-y-4">
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl flex items-center gap-3 animate-fade-in">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <p className="text-sm font-medium">{error}</p>
                    <button onClick={() => setError(null)} className="mr-auto text-xs font-bold underline">إغلاق</button>
                </div>
            )}

            <div className="card overflow-hidden">
                <table className="w-full text-sm text-right">
                    <thead>
                        <tr className="border-b border-slate-100 bg-slate-50/50 text-slate-500 text-xs uppercase tracking-wider">
                            <th className="py-4 px-6 font-bold">التصنيف</th>
                            <th className="py-4 px-6 font-bold">الرابط (Slug)</th>
                            <th className="py-4 px-6 font-bold">الوصف</th>
                            <th className="py-4 px-6 font-bold text-center">الإجراءات</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {categories.map((category) => (
                            <tr key={category.id} className="hover:bg-slate-50/50 transition-colors group">
                                <td className="py-4 px-6">
                                    <span className="font-bold text-brand-navy">{category.name}</span>
                                </td>
                                <td className="py-4 px-6">
                                    <code className="text-xs bg-slate-100 px-2 py-1 rounded text-slate-500 font-mono">
                                        {category.slug}
                                    </code>
                                </td>
                                <td className="py-4 px-6">
                                    <p className="text-slate-500 truncate max-w-xs" title={category.description || ""}>
                                        {category.description || <span className="text-slate-300 italic">بدون وصف</span>}
                                    </p>
                                </td>
                                <td className="py-4 px-6">
                                    <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => handleEdit(category)}
                                            className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                                            title="تعديل"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(category.id, category.name)}
                                            disabled={deletingId === category.id}
                                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                                            title="حذف"
                                        >
                                            {deletingId === category.id ? (
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                            ) : (
                                                <Trash2 className="w-4 h-4" />
                                            )}
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {categories.length === 0 && (
                            <tr>
                                <td colSpan={4} className="py-12 text-center text-slate-400 italic">
                                    لا يوجد تصنيفات حالياً.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Edit Modal */}
            {editingCategory && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={() => setEditingCategory(null)}>
                    <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-2xl relative" onClick={e => e.stopPropagation()}>
                        <h2 className="text-xl font-black text-brand-navy mb-6 flex items-center gap-2">
                            <Edit2 className="w-5 h-5 text-brand-orange" />
                            تعديل التصنيف
                        </h2>
                        
                        <form onSubmit={handleUpdate} className="space-y-6">
                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-brand-navy">اسم التصنيف</label>
                                <input
                                    type="text"
                                    value={editName}
                                    onChange={e => setEditName(e.target.value)}
                                    className="input-field"
                                    placeholder="مثال: زيوت المحركات"
                                    required
                                    autoFocus
                                    dir="rtl"
                                />
                            </div>
                            
                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-brand-navy">الوصف</label>
                                <textarea
                                    value={editDescription}
                                    onChange={e => setEditDescription(e.target.value)}
                                    className="input-field min-h-[100px] resize-none"
                                    placeholder="وصف مختصر..."
                                    dir="rtl"
                                />
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="submit"
                                    disabled={isSaving}
                                    className="flex-1 btn-primary py-3"
                                >
                                    {isSaving ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            جاري الحفظ…
                                        </>
                                    ) : "حفظ التعديلات"}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setEditingCategory(null)}
                                    className="flex-1 btn-secondary py-3"
                                >
                                    إلغاء
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
