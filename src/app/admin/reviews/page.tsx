import { prisma } from "@/lib/prisma";
import { Star } from "lucide-react";
import AdminReviewsTable from "@/components/admin/AdminReviewsTable";

export const dynamic = "force-dynamic";

export default async function AdminReviewsPage() {
  const [pending, approved, rejected] = await Promise.all([
    prisma.review.count({ where: { status: "pending" } }),
    prisma.review.count({ where: { status: "approved" } }),
    prisma.review.count({ where: { status: "rejected" } }),
  ]);

  const reviews = await prisma.review.findMany({
    orderBy: [{ status: "asc" }, { createdAt: "desc" }],
  });

  // Sort: pending first, then approved, then rejected
  const sorted = [
    ...reviews.filter((r) => r.status === "pending"),
    ...reviews.filter((r) => r.status === "approved"),
    ...reviews.filter((r) => r.status === "rejected"),
  ];

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 blur-3xl rounded-full -translate-x-1/2 -translate-y-1/2" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 text-amber-600 text-[10px] font-black uppercase tracking-wider mb-3">
            <Star className="w-3 h-3 fill-amber-500" />
            إدارة التقييمات
          </div>
          <h1 className="text-3xl font-black text-brand-navy">تقييمات العملاء</h1>
          <p className="text-slate-400 text-sm mt-2 font-medium">
            راجع واعتمد تقييمات عملائك لتظهر في الصفحة الرئيسية
          </p>
        </div>

        {/* Stats */}
        <div className="flex gap-3 relative z-10">
          <div className="bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3 text-center">
            <p className="text-2xl font-black text-amber-700">{pending}</p>
            <p className="text-xs font-bold text-amber-600">بانتظار</p>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-2xl px-4 py-3 text-center">
            <p className="text-2xl font-black text-green-700">{approved}</p>
            <p className="text-xs font-bold text-green-600">معتمد</p>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-2xl px-4 py-3 text-center">
            <p className="text-2xl font-black text-red-700">{rejected}</p>
            <p className="text-xs font-bold text-red-600">مرفوض</p>
          </div>
        </div>
      </div>

      {/* Reviews Table */}
      <AdminReviewsTable reviews={sorted.map((r) => ({ ...r, createdAt: r.createdAt.toISOString() }))} />
    </div>
  );
}
