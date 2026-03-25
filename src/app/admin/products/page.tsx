import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Package, Upload, Plus } from "lucide-react";
import AdminProductTable from "@/components/admin/AdminProductTable";
import AddCategoryModal from "@/components/admin/AddCategoryModal";
import Pagination from "@/components/admin/Pagination";

export const dynamic = "force-dynamic";
const ADMIN_PATH = `/${process.env.ADMIN_SECRET_PATH ?? "admin-panel"}`;

const PAGE_SIZE = 50;

interface Props {
  searchParams: Promise<{ page?: string; category?: string }>;
}

export default async function AdminProductsPage({ searchParams }: Props) {
  const { page: pageParam, category: categoryParam } = await searchParams;
  const currentPage = Math.max(1, parseInt(pageParam ?? "1", 10) || 1);
  const skip = (currentPage - 1) * PAGE_SIZE;

  const categories = await prisma.category.findMany({ orderBy: { sortOrder: "asc" } });

  // Build category filter for the query
  const categoryFilter = categoryParam
    ? {
        categories: {
          some: { categoryId: categoryParam },
        },
      }
    : {};

  const [products, totalCount] = await Promise.all([
    prisma.product.findMany({
      where: categoryFilter,
      include: { categories: { include: { category: { select: { name: true } } } } },
      orderBy: { sortOrder: "asc" },
      skip,
      take: PAGE_SIZE,
    }),
    prisma.product.count({ where: categoryFilter }),
  ]);

  // Count per category (for pills)
  const categoryCounts = await Promise.all(
    categories.map((cat) =>
      prisma.product.count({ where: { categories: { some: { categoryId: cat.id } } } })
    )
  );

  const totalAllProducts = await prisma.product.count();
  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black flex items-center gap-3">
            <Package className="w-6 h-6 text-primary-500" />
            المنتجات
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {totalCount} منتج{categoryParam ? " في هذا التصنيف" : " في قاعدة البيانات"}
          </p>
        </div>
        <div className="flex gap-3">
          <AddCategoryModal />
          <Link href={`${ADMIN_PATH}/products/import`} className="btn-secondary gap-2 text-sm">
            <Upload className="w-4 h-4" />
            استيراد Excel
          </Link>
          <Link href={`${ADMIN_PATH}/products/new`} className="btn-primary gap-2 text-sm">
            <Plus className="w-4 h-4" />
            منتج جديد
          </Link>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-xs font-bold text-gray-400">تصفية:</span>
        <Link
          href={`${ADMIN_PATH}/products`}
          className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all border ${
            !categoryParam
              ? "bg-brand-orange text-white border-brand-orange shadow-md shadow-brand-orange/20"
              : "bg-slate-50 text-slate-500 border-slate-200 hover:text-brand-navy hover:bg-slate-100 hover:border-slate-300"
          }`}
        >
          الكل ({totalAllProducts})
        </Link>
        {categories.map((cat, i) => (
          <Link
            key={cat.id}
            href={`${ADMIN_PATH}/products?category=${cat.id}`}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all border ${
              categoryParam === cat.id
                ? "bg-brand-orange text-white border-brand-orange shadow-md shadow-brand-orange/20"
                : "bg-slate-50 text-slate-500 border-slate-200 hover:text-brand-navy hover:bg-slate-100 hover:border-slate-300"
            }`}
          >
            {cat.name} ({categoryCounts[i]})
          </Link>
        ))}
      </div>

      {/* Table */}
      <AdminProductTable products={products} categories={categories} adminPath={ADMIN_PATH} />

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalCount}
        pageSize={PAGE_SIZE}
      />
    </div>
  );
}
