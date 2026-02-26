"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface Product {
  id: string;
  sku: string;
  name: string;
  price: number;
  brand: string | null;
  imageUrl: string | null;
  categoryId: string | null;
}

interface Category {
  id: string;
  name: string;
}

interface ProductEditFormProps {
  product: Product;
  categories: Category[];
}

export default function ProductEditForm({ product, categories }: ProductEditFormProps) {
  const router = useRouter();
  const [form, setForm] = useState({
    name: product.name,
    price: product.price,
    brand: product.brand ?? "",
    categoryId: product.categoryId ?? "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(product.imageUrl);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setMessage("");
    try {
      let imageUrl = product.imageUrl;

      // Upload image first if selected
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

      // Save product
      const res = await fetch(`/api/admin/products/${product.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, imageUrl }),
      });

      if (res.ok) {
        setMessage("✅ تم حفظ التغييرات");
        router.refresh();
      } else {
        const d = await res.json();
        throw new Error(d.error?.message ?? "خطأ في الحفظ");
      }
    } catch (err) {
      setMessage(`❌ ${err instanceof Error ? err.message : "خطأ"}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="card p-6 space-y-6">
      {/* Image Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-3">صورة المنتج</label>
        <div className="flex items-start gap-5">
          <div className="w-28 h-28 rounded-xl bg-dark-600 overflow-hidden flex-shrink-0 border-2 border-dashed border-dark-400">
            {imagePreview ? (
              <Image src={imagePreview} alt="Preview" width={112} height={112} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-gray-600 text-xs text-center p-2">
                <span className="text-3xl mb-1">🛢️</span>
                Image Coming Soon
              </div>
            )}
          </div>
          <div className="flex-1">
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleImageChange}
              className="input-field text-sm file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:bg-dark-600 file:text-gray-300 file:text-xs file:cursor-pointer"
            />
            <p className="text-xs text-gray-500 mt-2">JPG, PNG, WebP — حتى 5MB</p>
          </div>
        </div>
      </div>

      {/* Name */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1.5">اسم المنتج</label>
        <input
          type="text"
          className="input-field"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
      </div>

      {/* Price & Brand */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">السعر (ر.س)</label>
          <input
            type="number"
            inputMode="decimal"
            className="input-field"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">العلامة التجارية</label>
          <input
            type="text"
            className="input-field"
            value={form.brand}
            onChange={(e) => setForm({ ...form, brand: e.target.value })}
          />
        </div>
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1.5">الفئة</label>
        <select
          className="input-field"
          value={form.categoryId}
          onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
        >
          <option value="">بدون فئة</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </div>

      {/* Actions */}
      {message && <p className="text-sm p-3 card animate-fade-in">{message}</p>}
      <div className="flex gap-3">
        <button onClick={() => router.back()} className="btn-secondary flex-1">
          رجوع
        </button>
        <button onClick={handleSave} disabled={isSaving} className="btn-primary flex-1">
          {isSaving ? "جاري الحفظ..." : "حفظ التغييرات"}
        </button>
      </div>
    </div>
  );
}
