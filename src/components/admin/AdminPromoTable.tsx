"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ToggleLeft, ToggleRight, Trash2 } from "lucide-react";

interface PromoBanner {
  id: string;
  title: string;
  imageUrl: string;
  linkUrl: string | null;
  targetPage: string;
  isActive: boolean;
  sortOrder: number;
}

interface AdminPromoTableProps {
  banners: PromoBanner[];
}

export default function AdminPromoTable({ banners }: AdminPromoTableProps) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  const toggleActive = async (banner: PromoBanner) => {
    setLoading(banner.id);
    await fetch(`/api/admin/promos/${banner.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !banner.isActive }),
    });
    setLoading(null);
    router.refresh();
  };

  const deleteBanner = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا البانر؟")) return;
    setLoading(id);
    await fetch(`/api/admin/promos/${id}`, { method: "DELETE" });
    setLoading(null);
    router.refresh();
  };

  return (
    <div className="card overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-dark-500 text-gray-400 text-xs uppercase">
            <th className="py-3 px-4 text-start">البانر</th>
            <th className="py-3 px-4 text-start">الصفحة</th>
            <th className="py-3 px-4 text-start">الترتيب</th>
            <th className="py-3 px-4 text-start">الحالة</th>
            <th className="py-3 px-4 text-start">الإجراءات</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-dark-500">
          {banners.length === 0 && (
            <tr>
              <td colSpan={5} className="py-12 text-center text-gray-500">
                لا توجد بانرات حتى الآن. أضف أول بانر!
              </td>
            </tr>
          )}
          {banners.map((banner) => (
            <tr key={banner.id} className="hover:bg-dark-700/40 transition-colors">
              <td className="py-3 px-4">
                <div className="flex items-center gap-3">
                  <div className="w-16 h-9 rounded-lg bg-dark-600 overflow-hidden flex-shrink-0">
                    <Image
                      src={banner.imageUrl}
                      alt={banner.title}
                      width={64}
                      height={36}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="font-medium truncate max-w-[160px]">{banner.title}</span>
                </div>
              </td>
              <td className="py-3 px-4 font-mono text-xs text-gray-400">{banner.targetPage}</td>
              <td className="py-3 px-4 text-gray-400">{banner.sortOrder}</td>
              <td className="py-3 px-4">
                <button
                  onClick={() => toggleActive(banner)}
                  disabled={loading === banner.id}
                  className={`transition-colors ${banner.isActive ? "text-green-400" : "text-gray-600"}`}
                  aria-label={banner.isActive ? "إيقاف" : "تفعيل"}
                >
                  {banner.isActive ? (
                    <ToggleRight className="w-6 h-6" />
                  ) : (
                    <ToggleLeft className="w-6 h-6" />
                  )}
                </button>
              </td>
              <td className="py-3 px-4">
                <button
                  onClick={() => deleteBanner(banner.id)}
                  disabled={loading === banner.id}
                  className="text-gray-500 hover:text-red-400 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
