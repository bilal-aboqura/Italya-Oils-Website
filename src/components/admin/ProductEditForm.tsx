"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface Category {
  id: string;
  name: string;
}

interface ProductCategory {
  category: { id: string; name: string };
}

interface Product {
  id: string;
  sku: string;
  name: string;
  price: number;
  salePrice?: number | null;
  isOnSale?: boolean;
  brand: string | null;
  imageUrl: string | null;
  categories?: ProductCategory[];
}

interface ProductEditFormProps {
  product: Product;
  categories: Category[];
}

export default function ProductEditForm({ product, categories }: ProductEditFormProps) {
  const router = useRouter();
  const currentCategoryIds = product.categories?.map(pc => pc.category.id) ?? [];
  
  const [form, setForm] = useState({
    name: product.name,
    price: product.price,
    salePrice: product.salePrice ?? "",
    isOnSale: product.isOnSale ?? false,
    brand: product.brand ?? "",
    categoryIds: currentCategoryIds,
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

  const toggleCategory = (id: string) => {
    setForm(prev => ({
      ...prev,
      categoryIds: prev.categoryIds.includes(id)
        ? prev.categoryIds.filter(c => c !== id)
        : [...prev.categoryIds, id],
    }));
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
        body: JSON.stringify({
          ...form,
          salePrice: form.salePrice === "" ? null : parseFloat(String(form.salePrice)),
          price: typeof form.price === "string" ? parseFloat(form.price) : form.price,
          imageUrl,
        }),
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
          <label className="block text-sm font-medium text-gray-300 mb-1.5">السعر (ج.م)</label>
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

      {/* Sale Price */}
      <div className="border border-dashed border-dark-500 rounded-xl p-4 space-y-3">
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="isOnSale"
            checked={form.isOnSale}
            onChange={(e) => setForm({ ...form, isOnSale: e.target.checked })}
            className="rounded"
          />
          <label htmlFor="isOnSale" className="text-sm font-medium text-gray-300 cursor-pointer">
            تفعيل سعر الخصم
          </label>
        </div>
        {form.isOnSale && (
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">سعر الخصم (ج.م)</label>
            <input
              type="number"
              inputMode="decimal"
              className="input-field"
              placeholder="سعر ما بعد الخصم..."
              value={form.salePrice}
              onChange={(e) => setForm({ ...form, salePrice: e.target.value })}
            />
            {form.salePrice && Number(form.salePrice) < form.price && (
              <p className="text-xs text-green-400 mt-1">
                خصم {Math.round((1 - Number(form.salePrice) / form.price) * 100)}%
              </p>
            )}
          </div>
        )}
      </div>

      {/* Categories (Multi-select) */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">الفئات</label>
        <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1 customize-scrollbar">
          {categories.map((cat) => (
            <label key={cat.id} className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={form.categoryIds.includes(cat.id)}
                onChange={() => toggleCategory(cat.id)}
                className="rounded"
              />
              <span className="text-sm text-gray-300 group-hover:text-white transition-colors">
                {cat.name}
              </span>
            </label>
          ))}
        </div>
        {form.categoryIds.length === 0 && (
          <p className="text-xs text-gray-600 mt-1">لم يتم اختيار أي فئة</p>
        )}
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
