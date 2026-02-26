import { prisma } from "@/lib/prisma";
import { Image as ImageIcon, Plus } from "lucide-react";
import AdminPromoTable from "@/components/admin/AdminPromoTable";

export const dynamic = "force-dynamic";

export default async function AdminPromosPage() {
  const banners = await prisma.promoBanner.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black flex items-center gap-3">
            <ImageIcon className="w-6 h-6 text-primary-500" />
            البانرات الترويجية
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {banners.length} بانر نشط
          </p>
        </div>
        <a href="/admin/promos/new" className="btn-primary gap-2 text-sm">
          <Plus className="w-4 h-4" />
          بانر جديد
        </a>
      </div>
      <AdminPromoTable banners={banners} />
    </div>
  );
}
