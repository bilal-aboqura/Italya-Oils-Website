"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChevronUp, ChevronDown, Loader2 } from "lucide-react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ProductWithCategory = any;

interface Category {
  id: string;
  name: string;
}

interface AdminProductTableProps {
  products: ProductWithCategory[];
  categories: Category[];
  adminPath: string;
}

export default function AdminProductTable({ products: initialProducts, categories, adminPath }: AdminProductTableProps) {
  const router = useRouter();
  const [products, setProducts] = useState(initialProducts);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [bulkCategoryId, setBulkCategoryId] = useState("");
  const [isApplying, setIsApplying] = useState(false);
  const [message, setMessage] = useState("");
  const [movingId, setMovingId] = useState<string | null>(null);

  // ── Move product up or down ──────────────────────────────
  const moveProduct = async (index: number, direction: "up" | "down") => {
    const swapIndex = direction === "up" ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= products.length) return;

    const reordered = [...products];
    [reordered[index], reordered[swapIndex]] = [reordered[swapIndex], reordered[index]];
    setProducts(reordered);

    const id = products[index].id;
    setMovingId(id);
    try {
      await Promise.all(
        reordered.map((p, idx) =>
          fetch(`/api/admin/products/${p.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ sortOrder: idx }),
          })
        )
      );
    } catch {
      setMessage("❌ تعذّر حفظ الترتيب");
    } finally {
      setMovingId(null);
    }
  };
  // ────────────────────────────────────────────────────────────

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

  const fmt = (n: number | null, decimals = 2) =>
    n != null ? n.toFixed(decimals) : <span className="text-gray-600">—</span>;

  const str = (s: string | null) =>
    s ?? <span className="text-gray-600">—</span>;

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

      {/* Table – horizontally scrollable */}
      <div className="card overflow-x-auto">
        <table className="w-full text-sm whitespace-nowrap">
          <thead>
            <tr className="border-b border-dark-500 text-gray-400 text-xs uppercase">
              <th className="py-3 px-3 text-start">ترتيب</th>
              <th className="py-3 px-3 text-start sticky left-0 bg-dark-800 z-10">
                <input
                  type="checkbox"
                  checked={selected.size === products.length && products.length > 0}
                  onChange={selectAll}
                  className="rounded"
                />
              </th>
              {/* Core */}
              <th className="py-3 px-3 text-start">المنتج</th>
              <th className="py-3 px-3 text-start">رقم الصنف</th>
              <th className="py-3 px-3 text-start">التصنيف</th>
              {/* Quantities & Prices */}
              <th className="py-3 px-3 text-start">الكمية</th>
              <th className="py-3 px-3 text-start">KM</th>
              <th className="py-3 px-3 text-start">سعر البيع</th>
              <th className="py-3 px-3 text-start">م. سعر الشراء</th>
              <th className="py-3 px-3 text-start">آخر سعر شراء</th>
              {/* Meta */}
              <th className="py-3 px-3 text-start">باركود</th>
              <th className="py-3 px-3 text-start">كود الصنف 1</th>
              <th className="py-3 px-3 text-start">بلد المنشأ</th>
              <th className="py-3 px-3 text-start">الوحدة</th>
              {/* Actions */}
              <th className="py-3 px-3 text-start">صورة</th>
              <th className="py-3 px-3 text-start">إجراء</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-dark-500">
            {products.map((product, index) => (
              <tr key={product.id} className="hover:bg-dark-700/40 transition-colors">
                {/* Sort buttons */}
                <td className="py-3 px-2">
                  <div className="flex flex-col gap-0.5">
                    <button
                      onClick={() => moveProduct(index, "up")}
                      disabled={index === 0 || movingId === product.id}
                      className="p-0.5 text-slate-400 hover:text-brand-orange disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                      title="تحريك للأعلى"
                    >
                      {movingId === product.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ChevronUp className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      onClick={() => moveProduct(index, "down")}
                      disabled={index === products.length - 1 || movingId === product.id}
                      className="p-0.5 text-slate-400 hover:text-brand-orange disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                      title="تحريك للأسفل"
                    >
                      <ChevronDown className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
                {/* Checkbox */}
                <td className="py-3 px-3 sticky left-0 bg-dark-800">
                  <input
                    type="checkbox"
                    checked={selected.has(product.id)}
                    onChange={() => toggleSelect(product.id)}
                    className="rounded"
                  />
                </td>

                {/* Product name + image */}
                <td className="py-3 px-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-dark-600 overflow-hidden flex-shrink-0">
                      {product.imageUrl ? (
                        <Image src={product.imageUrl} alt={product.name} width={32} height={32} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-gray-600">🛢️</div>
                      )}
                    </div>
                    <span className="font-medium truncate max-w-[160px]">{product.name}</span>
                  </div>
                </td>

                {/* SKU */}
                <td className="py-3 px-3 text-gray-400 font-mono text-xs">{product.sku}</td>

                {/* Category */}
                <td className="py-3 px-3">
                  {product.category ? (
                    <span className="badge badge-primary">{product.category.name}</span>
                  ) : (
                    <span className="badge badge-muted">غير محدد</span>
                  )}
                </td>

                {/* Total Quantity */}
                <td className="py-3 px-3 text-gray-300">{fmt(product.totalQuantity, 0)}</td>

                {/* KM / Viscosity */}
                <td className="py-3 px-3 text-gray-400 text-xs">{str(product.viscosity)}</td>

                {/* Sale Price */}
                <td className="py-3 px-3 font-bold text-primary-400">{product.price.toFixed(2)}</td>

                {/* Avg Purchase Price */}
                <td className="py-3 px-3 text-gray-300">{fmt(product.avgPurchasePrice)}</td>

                {/* Last Purchase Price */}
                <td className="py-3 px-3 text-gray-300">{fmt(product.lastPurchasePrice)}</td>

                {/* Barcode */}
                <td className="py-3 px-3 font-mono text-xs text-gray-400">{str(product.barcode)}</td>

                {/* Item Code */}
                <td className="py-3 px-3 font-mono text-xs text-gray-400">{str(product.itemCode)}</td>

                {/* Country of Origin */}
                <td className="py-3 px-3 text-gray-400 text-xs">{str(product.countryOfOrigin)}</td>

                {/* Unit */}
                <td className="py-3 px-3 text-gray-400 text-xs">{str(product.unit)}</td>

                {/* Image badge */}
                <td className="py-3 px-3">
                  {product.imageUrl ? (
                    <span className="badge badge-success">✓</span>
                  ) : (
                    <span className="badge badge-muted">مفقودة</span>
                  )}
                </td>

                {/* Actions */}
                <td className="py-3 px-3">
                  <a
                    href={`${adminPath}/products/${product.id}`}
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
