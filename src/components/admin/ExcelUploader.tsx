"use client";

import { useState, useRef } from "react";
import { Upload, FileSpreadsheet, CheckCircle, XCircle, Loader2 } from "lucide-react";

interface ImportResult {
  importedCount: number;
  skippedCount: number;
  errors: string[];
}

export default function ExcelUploader() {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setResult(null);
    setError(null);
    setIsUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/admin/products/import", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error?.message || "فشل الاستيراد.");
      } else {
        setResult(data);
      }
    } catch {
      setError("حدث خطأ أثناء الاتصال بالخادم.");
    } finally {
      setIsUploading(false);
    }
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  return (
    <div className="space-y-5">
      {/* Drop Zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-colors ${
          isDragging
            ? "border-primary-500 bg-primary-500/5"
            : "border-dark-500 hover:border-primary-500/50 hover:bg-dark-600/30"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".xlsx,.xls,.csv"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
        />
        <FileSpreadsheet className="w-12 h-12 text-primary-500 mx-auto mb-4" />
        <p className="font-bold text-lg mb-2">اسحب ملف Excel هنا</p>
        <p className="text-gray-500 text-sm mb-4">أو انقر للاختيار</p>
        <p className="text-xs text-dark-500">
          الأعمدة المطلوبة: SKU, Name, Price — اختيارية: Brand, Description, Viscosity
        </p>
      </div>

      {/* Loading */}
      {isUploading && (
        <div className="card p-5 flex items-center gap-4 animate-fade-in">
          <Loader2 className="w-5 h-5 text-primary-500 animate-spin" />
          <div>
            <p className="font-medium">جاري معالجة الملف...</p>
            <p className="text-xs text-gray-500 mt-0.5">قد يستغرق هذا بضع ثوانٍ</p>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="card border-red-500/30 p-5 flex items-start gap-4 animate-fade-in">
          <XCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-red-400">فشل الاستيراد</p>
            <p className="text-sm text-gray-400 mt-1">{error}</p>
          </div>
        </div>
      )}

      {/* Success */}
      {result && (
        <div className="card p-5 space-y-4 animate-fade-in">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <h3 className="font-bold">اكتمل الاستيراد</h3>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3 text-center">
              <p className="text-2xl font-black text-green-400">{result.importedCount}</p>
              <p className="text-xs text-gray-400 mt-1">تم الاستيراد</p>
            </div>
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3 text-center">
              <p className="text-2xl font-black text-yellow-400">{result.skippedCount}</p>
              <p className="text-xs text-gray-400 mt-1">تم التخطي (مكرر)</p>
            </div>
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-center">
              <p className="text-2xl font-black text-red-400">{result.errors.length}</p>
              <p className="text-xs text-gray-400 mt-1">أخطاء</p>
            </div>
          </div>
          {result.errors.length > 0 && (
            <div className="bg-dark-900 rounded-lg p-3 text-xs text-gray-400 space-y-1 max-h-40 overflow-y-auto">
              {result.errors.map((e, i) => (
                <p key={i} className="text-red-400">{e}</p>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
