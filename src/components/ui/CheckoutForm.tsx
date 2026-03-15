"use client";

import { useState } from "react";
import { useCartStore } from "@/lib/cart-store";
import {
  buildWhatsAppUrl,
  validateCheckoutDetails,
  formatPrice,
} from "@/lib/whatsapp";

interface CheckoutFormProps {
  onBack: () => void;
  onSuccess: () => void;
}

export default function CheckoutForm({ onBack, onSuccess }: CheckoutFormProps) {
  const { items, totalPrice, clearCart } = useCartStore();
  const [form, setForm] = useState({ name: "", phone: "", address: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateCheckoutDetails(form);
    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }
    const url = buildWhatsAppUrl(items, form);
    window.open(url, "_blank");
    setSubmitted(true);
    clearCart();
    setTimeout(() => {
      onSuccess();
    }, 1500);
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8 gap-4">
        <div className="size-20 bg-green-100 rounded-3xl flex items-center justify-center mb-2">
          <span className="material-symbols-outlined text-green-600 text-[48px]">check_circle</span>
        </div>
        <h3 className="text-xl font-black text-brand-navy">تم إرسال طلبك!</h3>
        <p className="text-slate-500 text-sm">
          سيتواصل معك فريقنا قريباً عبر واتساب لتأكيد الطلب.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Back + Title */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={onBack}
          className="size-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-colors"
        >
          <span className="material-symbols-outlined text-lg">arrow_forward</span>
        </button>
        <div>
          <h3 className="font-black text-brand-navy">بيانات التواصل</h3>
          <p className="text-slate-400 text-xs">لإتمام طلبك عبر واتساب</p>
        </div>
      </div>

      {/* Order Summary */}
      <div className="bg-slate-50 rounded-2xl p-4 mb-6 space-y-2">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3">ملخص الطلب</h4>
        {items.map((item) => (
          <div key={item.id} className="flex justify-between text-sm">
            <span className="text-brand-navy font-medium truncate ml-2">
              {item.name} <span className="text-slate-400">× {item.quantity}</span>
            </span>
            <span className="font-bold text-brand-navy flex-shrink-0">
              {formatPrice(item.price * item.quantity)} ج.م
            </span>
          </div>
        ))}
        <div className="border-t border-slate-200 pt-2 flex justify-between font-black text-brand-navy">
          <span>الإجمالي</span>
          <span className="text-brand-orange">{formatPrice(totalPrice())} ج.م</span>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {[
          { name: "name", label: "الاسم الكامل", type: "text", placeholder: "محمد أحمد", icon: "person" },
          { name: "phone", label: "رقم الجوال", type: "tel", placeholder: "05XXXXXXXX", icon: "phone" },
        ].map((field) => (
          <div key={field.name}>
            <label className="block text-sm font-bold text-brand-navy mb-1.5">
              {field.label}
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg pointer-events-none">
                {field.icon}
              </span>
              <input
                type={field.type}
                name={field.name}
                value={(form as Record<string, string>)[field.name]}
                onChange={handleChange}
                placeholder={field.placeholder}
                className={`input-field pr-10 ${errors[field.name] ? "border-red-400 focus:border-red-400 focus:shadow-none" : ""}`}
                inputMode={field.type === "tel" ? "tel" : "text"}
              />
            </div>
            {errors[field.name] && (
              <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                <span className="material-symbols-outlined text-xs">error</span>
                {errors[field.name]}
              </p>
            )}
          </div>
        ))}

        <div>
          <label className="block text-sm font-bold text-brand-navy mb-1.5">
            العنوان <span className="text-slate-400 font-normal">(اختياري)</span>
          </label>
          <div className="relative">
            <span className="material-symbols-outlined absolute right-3 top-3 text-slate-400 text-lg pointer-events-none">
              location_on
            </span>
            <textarea
              name="address"
              value={form.address}
              onChange={handleChange}
              rows={2}
              placeholder="المدينة، الحي..."
              className="input-field pr-10 resize-none"
            />
          </div>
        </div>

        <button type="submit" className="w-full btn-primary gap-2 justify-center mt-2">
          <span className="material-symbols-outlined">send</span>
          إرسال الطلب عبر واتساب
        </button>
        <p className="text-center text-xs text-slate-400">
          بالضغط على الزر ستُفتح محادثة واتساب مع تفاصيل طلبك
        </p>
      </form>
    </div>
  );
}
