import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import ProductEditForm from "@/components/admin/ProductEditForm";

export const dynamic = "force-dynamic";

export default async function ProductEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [product, categories] = await Promise.all([
    prisma.product.findUnique({
      where: { id },
      include: { category: true },
    }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (!product) notFound();

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-black">تعديل المنتج</h1>
        <p className="text-gray-500 text-sm mt-1">SKU: {product.sku}</p>
      </div>
      <ProductEditForm product={product} categories={categories} />
    </div>
  );
}
