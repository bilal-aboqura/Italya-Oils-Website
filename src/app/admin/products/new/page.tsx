import { prisma } from "@/lib/prisma";
import NewProductClient from "./NewProductClient";
import Link from "next/link";
import { ADMIN_PATH } from "@/lib/admin-config";

export default async function NewProductPage() {
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href={`${ADMIN_PATH}/products`}
          className="size-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-colors"
        >
          <span className="material-symbols-outlined text-lg">arrow_back</span>
        </Link>
        <div>
          <h1 className="text-2xl font-black text-brand-navy">إضافة منتج جديد</h1>
          <p className="text-slate-500 text-sm mt-0.5">أدخل بيانات المنتج الجديد</p>
        </div>
      </div>

      <NewProductClient categories={categories} />
    </div>
  );
}
