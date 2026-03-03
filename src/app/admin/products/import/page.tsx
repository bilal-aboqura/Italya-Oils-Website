import ExcelUploader from "@/components/admin/ExcelUploader";

export default function ImportProductsPage() {
  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-black text-brand-navy flex items-center gap-3">
          <span className="material-symbols-outlined text-brand-orange text-2xl">upload_file</span>
          استيراد من Excel
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          ارفع ملف XLSX أو XLS لاستيراد المنتجات بالجملة
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
        <h3 className="font-bold text-brand-navy">تنسيق الملف المتوقع</h3>
        <p className="text-xs text-slate-500">
          يجب أن يكون الصف الثالث في الملف هو صف العناوين، والبيانات تبدأ من الصف الرابع.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500">
                <th className="text-right py-2 font-bold">عنوان العمود</th>
                <th className="text-right py-2 font-bold">مطلوب</th>
                <th className="text-right py-2 font-bold">يُحفظ كـ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-600">
              {[
                ["رقم الصنف", "نعم ✓", "sku — رمز فريد لكل منتج"],
                ["اسم الصنف", "نعم ✓", "name — اسم المنتج"],
                ["سعر البيع", "نعم ✓", "price — السعر بالأرقام"],
                ["إجمالى الكمية", "لا", "totalQuantity — الكمية الإجمالية"],
                ["KM", "لا", "viscosity — اللزوجة (مثال: 5000KM)"],
                ["متوسط سعر الشراء", "لا", "avgPurchasePrice — متوسط سعر الشراء"],
                ["آخر سعر شراء", "لا", "lastPurchasePrice — آخر سعر شراء"],
                ["باركود", "لا", "barcode — الباركود"],
                ["كود الصنف 1", "لا", "itemCode — كود الصنف"],
                ["بلد المنشاءة", "لا", "countryOfOrigin — بلد المنشأ"],
                ["التصنيف", "لا", "category — تصنيف المنتج (يُنشأ تلقائياً)"],
                ["الوحدة", "لا", "unit — وحدة القياس"],
              ].map(([col, req, note]) => (
                <tr key={col}>
                  <td className="py-2 font-mono text-brand-orange font-bold" dir="rtl">{col}</td>
                  <td className="py-2 text-slate-600">{req}</td>
                  <td className="py-2 text-slate-400">{note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 pt-1 border-t border-slate-100">
          💡 إذا كان رقم الصنف موجوداً مسبقاً، سيتم تحديث جميع بياناته تلقائياً.
        </p>
      </div>

      <ExcelUploader />
    </div>
  );
}
