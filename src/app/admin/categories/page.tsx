import { prisma } from "@/lib/prisma";
import { Tag, Plus } from "lucide-react";
import AdminCategoryTable from "@/components/admin/AdminCategoryTable";
import AddCategoryModal from "@/components/admin/AddCategoryModal";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
    const categories = await prisma.category.findMany({
        orderBy: { sortOrder: "asc" },
        include: {
            _count: {
                select: { products: true }
            }
        }
    });

    return (
        <div className="space-y-8 max-w-6xl mx-auto">
            {/* Header section with branding style */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden group">
                {/* Decorative background elements consistent with ModernMajlis theme */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-orange/5 blur-3xl rounded-full -translate-x-1/2 -translate-y-1/2" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-500/5 blur-3xl rounded-full translate-x-1/2 translate-y-1/2" />
                
                <div className="relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 text-brand-orange text-[10px] font-black uppercase tracking-wider mb-3">
                        <Tag className="w-3 h-3" />
                        إدارة التصنيفات
                    </div>
                    <h1 className="text-3xl font-black text-brand-navy flex items-center gap-3">
                        تصنيفات المنتجات
                    </h1>
                    <p className="text-slate-400 text-sm mt-2 font-medium">
                        إجمالي <span className="text-brand-orange font-black">{categories.length}</span> فئات لتنظيم متجرك
                    </p>
                </div>
                
                <div className="flex gap-4 relative z-10 w-full md:w-auto">
                    <AddCategoryModal />
                </div>
            </div>

            {/* Main Content Table Section */}
            <div className="animate-fade-in delay-100">
                <AdminCategoryTable categories={categories} />
            </div>

            {/* Quick Tips for Admin */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                <div className="bg-brand-navy rounded-3xl p-6 text-white relative overflow-hidden group hover:shadow-xl transition-all border border-white/5">
                    <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                        <Tag className="w-20 h-20 rotate-12" />
                    </div>
                    <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
                        <span className="size-2 bg-brand-orange rounded-full" />
                        نصيحة للإدارة
                    </h3>
                    <p className="text-slate-400 text-xs leading-relaxed">
                        قم بتنظيم المنتجات في فئات واضحة لمساعدة العملاء على الوصول لمنتجاتهم المفضلة بسرعة. الفئات ذات الأسماء البسيطة تساهم في تحسين ظهور موقعك في نتائج البحث (SEO).
                    </p>
                </div>
                <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm group hover:border-brand-orange/30 transition-all">
                    <h3 className="text-lg font-bold text-brand-navy mb-2 flex items-center gap-2">
                        <span className="size-2 bg-blue-500 rounded-full" />
                        احصائيات سريعة
                    </h3>
                    <p className="text-slate-500 text-xs leading-relaxed">
                        يحتوي متجرك حالياً على {categories.length} فئات نشطة. 
                        أكثر فئة تحتوي على منتجات حالياً هي 
                        <span className="text-brand-navy font-bold mx-1">
                            {categories.reduce((prev, curr) => (prev._count.products > curr._count.products ? prev : curr), categories[0])?.name || "لا يوجد"}
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
}
