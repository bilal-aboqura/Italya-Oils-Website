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
  isActive: boolean;
}

interface Category {
  id: string;
  name: string;
}

interface AdminProductTableProps {
  products: (Product & { category: { name: string } | null })[];
  categories: Category[];
}

export default function AdminProductTable({ products, categories }: AdminProductTableProps) {
  const router = useRouter();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [bulkCategoryId, setBulkCategoryId] = useState("");
  const [isApplying, setIsApplying] = useState(false);
  const [message, setMessage] = useState("");

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const selectAll = () => {
    if (selected.size === products.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(products.map((p) => p.id)));
    }
  };

  const applyBulkCategory = async () => {
    if (!bulkCategoryId || selected.size === 0) return;
    setIsApplying(true);
    try {
      const res = await fetch("/api/admin/products/bulk-category", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productIds: Array.from(selected),
          categoryId: bulkCategoryId,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage(`✅ تم تعيين الفئة لـ ${data.updatedCount} منتج`);
        setSelected(new Set());
        router.refresh();
      } else {
        setMessage(`❌ ${data.error?.message}`);
      }
    } catch {
      setMessage("❌ حدث خطأ أثناء التحديث.");
    } finally {
      setIsApplying(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Bulk Actions */}
      {selected.size > 0 && (
        <div className="card p-4 flex items-center gap-4 animate-fade-in border-primary-500/30">
          <span className="text-sm font-medium">
            تم اختيار {selected.size} منتج
          </span>
          <select
            value={bulkCategoryId}
            onChange={(e) => setBulkCategoryId(e.target.value)}
            className="input-field w-48 text-sm"
          >
            <option value="">اختر فئة...</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
          <button
            onClick={applyBulkCategory}
            disabled={!bulkCategoryId || isApplying}
            className="btn-primary text-sm py-1.5 px-4"
          >
            {isApplying ? "جاري التطبيق..." : "تطبيق الفئة"}
          </button>
        </div>
      )}

      {message && (
        <p className="text-sm p-3 card animate-fade-in">{message}</p>
      )}

      {/* Table */}
      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-dark-500 text-gray-400 text-xs uppercase">
              <th className="py-3 px-4 text-start">
                <input
                  type="checkbox"
                  checked={selected.size === products.length && products.length > 0}
                  onChange={selectAll}
                  className="rounded"
                />
              </th>
              <th className="py-3 px-4 text-start">المنتج</th>
              <th className="py-3 px-4 text-start">SKU</th>
              <th className="py-3 px-4 text-start">الفئة</th>
              <th className="py-3 px-4 text-start">السعر</th>
              <th className="py-3 px-4 text-start">الصورة</th>
              <th className="py-3 px-4 text-start">الإجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-dark-500">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-dark-700/40 transition-colors">
                <td className="py-3 px-4">
                  <input
                    type="checkbox"
                    checked={selected.has(product.id)}
                    onChange={() => toggleSelect(product.id)}
                    className="rounded"
                  />
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-dark-600 overflow-hidden flex-shrink-0">
                      {product.imageUrl ? (
                        <Image src={product.imageUrl} alt={product.name} width={36} height={36} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-gray-600">🛢️</div>
                      )}
                    </div>
                    <span className="font-medium truncate max-w-[180px]">{product.name}</span>
                  </div>
                </td>
                <td className="py-3 px-4 text-gray-500 font-mono text-xs">{product.sku}</td>
                <td className="py-3 px-4">
                  {product.category ? (
                    <span className="badge badge-primary">{product.category.name}</span>
                  ) : (
                    <span className="badge badge-muted">غير محدد</span>
                  )}
                </td>
                <td className="py-3 px-4 font-bold text-primary-400">
                  {product.price.toFixed(2)} ر.س
                </td>
                <td className="py-3 px-4">
                  {product.imageUrl ? (
                    <span className="badge badge-success">✓</span>
                  ) : (
                    <span className="badge badge-muted">مفقودة</span>
                  )}
                </td>
                <td className="py-3 px-4">
                  <a
                    href={`/admin/products/${product.id}`}
                    className="text-xs text-primary-400 hover:text-primary-300 font-medium"
                  >
                    تعديل
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
