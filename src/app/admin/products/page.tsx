import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Package, Upload, Plus } from "lucide-react";
import AdminProductTable from "@/components/admin/AdminProductTable";
import AddCategoryModal from "@/components/admin/AddCategoryModal";
import Pagination from "@/components/admin/Pagination";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 50;

interface Props {
  searchParams: Promise<{ page?: string }>;
}

export default async function AdminProductsPage({ searchParams }: Props) {
  const { page: pageParam } = await searchParams;
  const currentPage = Math.max(1, parseInt(pageParam ?? "1", 10) || 1);
  const skip = (currentPage - 1) * PAGE_SIZE;

  const [products, totalCount, categories] = await Promise.all([
    prisma.product.findMany({
      include: { category: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
      skip,
      take: PAGE_SIZE,
    }),
    prisma.product.count(),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);

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
            {totalCount} منتج في قاعدة البيانات
          </p>
        </div>
        <div className="flex gap-3">
          {/* Add Category Button */}
          <AddCategoryModal />
          <Link href="/admin/products/import" className="btn-secondary gap-2 text-sm">
            <Upload className="w-4 h-4" />
            استيراد Excel
          </Link>
          <Link href="/admin/products/new" className="btn-primary gap-2 text-sm">
            <Plus className="w-4 h-4" />
            منتج جديد
          </Link>
        </div>
      </div>

      {/* Table */}
      <AdminProductTable products={products} categories={categories} />

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

