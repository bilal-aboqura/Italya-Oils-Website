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
        <h3 className="font-bold text-white">تنسيق الملف المطلوب</h3>
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-dark-500 text-gray-400">
              <th className="text-start py-2">العمود</th>
              <th className="text-start py-2">مطلوب</th>
              <th className="text-start py-2">ملاحظة</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-dark-500 text-gray-300">
            {[
              ["SKU", "نعم ✓", "رمز فريد لكل منتج"],
              ["Name", "نعم ✓", "اسم المنتج"],
              ["Price", "نعم ✓", "السعر بالأرقام (مثال: 45.99)"],
              ["Brand", "لا", "العلامة التجارية"],
              ["Description", "لا", "وصف المنتج"],
              ["Viscosity", "لا", "اللزوجة (مثال: 5W-30)"],
            ].map(([col, req, note]) => (
              <tr key={col}>
                <td className="py-2 font-mono text-primary-400">{col}</td>
                <td className="py-2">{req}</td>
                <td className="py-2 text-gray-400">{note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ExcelUploader />
    </div>
  );
}
