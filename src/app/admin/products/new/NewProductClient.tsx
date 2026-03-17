"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const ADMIN = process.env.NEXT_PUBLIC_ADMIN_PATH ?? "/italya-ops-2026";

interface Category {
  id: string;
  name: string;
}

export default function NewProductClient({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const [form, setForm] = useState({
    sku: "",
    name: "",
    price: "",
    brand: "",
    viscosity: "",
    description: "",
    categoryId: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          price: parseFloat(form.price),
          categoryId: form.categoryId || null,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error?.message || "حدث خطأ أثناء إنشاء المنتج.");
        setLoading(false);
        return;
      }

      router.push(`${ADMIN}/products`);
      router.refresh();
    } catch {
      setError("فشل الاتصال بالخادم. يرجى المحاولة مجدداً.");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 p-8 space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-sm flex items-center gap-2">
          <span className="material-symbols-outlined text-lg">error</span>
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* SKU */}
        <div>
          <label className="block text-sm font-bold text-brand-navy mb-1.5">
            رقم الصنف (SKU) <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="sku"
            value={form.sku}
            onChange={handleChange}
            required
            placeholder="مثال: MOB-5W30-1L"
            className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:border-brand-orange focus:ring-1 focus:ring-brand-orange outline-none"
          />
        </div>

        {/* Name */}
        <div>
          <label className="block text-sm font-bold text-brand-navy mb-1.5">
            اسم المنتج <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            placeholder="مثال: موبيل 1 5W-30"
            className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:border-brand-orange focus:ring-1 focus:ring-brand-orange outline-none"
          />
        </div>

        {/* Price */}
        <div>
          <label className="block text-sm font-bold text-brand-navy mb-1.5">
            السعر (ج.م) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="price"
            value={form.price}
            onChange={handleChange}
            required
            min="0"
            step="0.01"
            placeholder="0.00"
            className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:border-brand-orange focus:ring-1 focus:ring-brand-orange outline-none"
          />
        </div>

        {/* Brand */}
        <div>
          <label className="block text-sm font-bold text-brand-navy mb-1.5">الماركة</label>
          <input
            type="text"
            name="brand"
            value={form.brand}
            onChange={handleChange}
            placeholder="مثال: Mobil, Shell, Castrol"
            className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:border-brand-orange focus:ring-1 focus:ring-brand-orange outline-none"
          />
        </div>

        {/* Viscosity */}
        <div>
          <label className="block text-sm font-bold text-brand-navy mb-1.5">اللزوجة (KM)</label>
          <input
            type="text"
            name="viscosity"
            value={form.viscosity}
            onChange={handleChange}
            placeholder="مثال: 5W-30, 10W-40"
            className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:border-brand-orange focus:ring-1 focus:ring-brand-orange outline-none"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-bold text-brand-navy mb-1.5">الفئة</label>
          <select
            name="categoryId"
            value={form.categoryId}
            onChange={handleChange}
            className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:border-brand-orange focus:ring-1 focus:ring-brand-orange outline-none bg-white"
          >
            <option value="">— بدون فئة —</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-bold text-brand-navy mb-1.5">وصف المنتج</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          rows={3}
          placeholder="وصف تفصيلي للمنتج..."
          className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:border-brand-orange focus:ring-1 focus:ring-brand-orange outline-none resize-none"
        />
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-brand-orange text-white font-bold py-3 px-6 rounded-xl hover:bg-orange-600 transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <span className="material-symbols-outlined animate-spin text-lg">refresh</span>
              جاري الحفظ...
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-lg">save</span>
              حفظ المنتج
            </>
          )}
        </button>
        <a
          href={`${ADMIN}/products`}
          className="px-6 py-3 border border-slate-200 rounded-xl text-slate-600 font-bold hover:bg-slate-50 transition-colors text-sm flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-lg">close</span>
          إلغاء
        </a>
      </div>
    </form>
  );
}
