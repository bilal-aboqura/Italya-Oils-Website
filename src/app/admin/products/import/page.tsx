import ExcelUploader from "@/components/admin/ExcelUploader";
import { FileSpreadsheet } from "lucide-react";

export default function ImportProductsPage() {
  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-black flex items-center gap-3">
          <FileSpreadsheet className="w-6 h-6 text-primary-500" />
          استيراد من Excel
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          ارفع ملف XLSX أو XLS لاستيراد المنتجات بالجملة
        </p>
      </div>

      <div className="card p-5 space-y-3 text-sm">
        <h3 className="font-bold text-white">تنسيق الملف المتوقع</h3>
        <p className="text-xs text-gray-500">
          يجب أن يكون الصف الثالث في الملف هو صف العناوين، والبيانات تبدأ من الصف الرابع.
        </p>
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-dark-500 text-gray-400">
              <th className="text-start py-2">عنوان العمود</th>
              <th className="text-start py-2">مطلوب</th>
              <th className="text-start py-2">يُحفظ كـ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-dark-500 text-gray-300">
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
                <td className="py-2 font-mono text-primary-400" dir="rtl">{col}</td>
                <td className="py-2">{req}</td>
                <td className="py-2 text-gray-400">{note}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="text-xs text-gray-500 pt-1">
          💡 إذا كان رقم الصنف موجوداً مسبقاً، سيتم تحديث جميع بياناته تلقائياً.
        </p>
      </div>

      <ExcelUploader />
    </div>
  );
}
