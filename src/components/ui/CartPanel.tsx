"use client";

import { useCartStore } from "@/lib/cart-store";
import CheckoutForm from "./CheckoutForm";
import { formatPrice } from "@/lib/whatsapp";
import Image from "next/image";
import { useState } from "react";

export default function CartPanel() {
  const { items, isOpen, setIsOpen, removeItem, updateQuantity, totalPrice } =
    useCartStore();
  const [showCheckout, setShowCheckout] = useState(false);

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-brand-navy/40 backdrop-blur-sm z-40 transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Drawer */}
      <aside
        className={`fixed top-0 left-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-brand-orange">shopping_bag</span>
            <h2 className="text-lg font-black text-brand-navy">عربة التسوق</h2>
            {items.length > 0 && (
              <span className="size-5 bg-brand-orange text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {items.reduce((s, i) => s + i.quantity, 0)}
              </span>
            )}
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-500"
            aria-label="إغلاق السلة"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Content */}
        {showCheckout ? (
          <div className="flex-1 overflow-y-auto">
            <CheckoutForm
              onBack={() => setShowCheckout(false)}
              onSuccess={() => {
                setShowCheckout(false);
                setIsOpen(false);
              }}
            />
          </div>
        ) : items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
            <div className="size-24 bg-slate-50 rounded-3xl flex items-center justify-center mb-5">
              <span className="material-symbols-outlined text-slate-300 text-[56px]">
                remove_shopping_cart
              </span>
            </div>
            <p className="font-bold text-brand-navy text-lg mb-2">السلة فارغة</p>
            <p className="text-slate-400 text-sm mb-6">أضف منتجات من المتجر للبدء</p>
            <button
              onClick={() => setIsOpen(false)}
              className="btn-primary text-sm gap-2"
            >
              <span className="material-symbols-outlined text-base">storefront</span>
              تصفح المنتجات
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 bg-slate-50 rounded-2xl p-3 group"
                >
                  {/* Image */}
                  <div className="w-16 h-16 rounded-xl bg-white border border-slate-100 flex-shrink-0 overflow-hidden flex items-center justify-center">
                    {item.imageUrl ? (
                      <Image
                        src={item.imageUrl}
                        alt={item.name}
                        width={60}
                        height={60}
                        className="object-contain"
                      />
                    ) : (
                      <span className="material-symbols-outlined text-slate-300 text-2xl">
                        oil_barrel
                      </span>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-brand-navy text-sm line-clamp-1">
                      {item.name}
                    </p>
                    <p className="text-brand-orange font-black text-sm">
                      {formatPrice(item.price)} ر.س
                    </p>
                  </div>

                  {/* Qty */}
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="size-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:border-brand-orange hover:text-brand-orange transition-colors"
                    >
                      <span className="material-symbols-outlined text-sm">remove</span>
                    </button>
                    <span className="w-6 text-center text-sm font-bold text-brand-navy">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="size-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:border-brand-orange hover:text-brand-orange transition-colors"
                    >
                      <span className="material-symbols-outlined text-sm">add</span>
                    </button>
                  </div>

                  {/* Remove */}
                  <button
                    onClick={() => removeItem(item.id)}
                    className="p-1 text-slate-300 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <span className="material-symbols-outlined text-lg">delete</span>
                  </button>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="px-6 py-5 border-t border-slate-100 space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-slate-500">
                  <span>المجموع الفرعي</span>
                  <span>{formatPrice(totalPrice())} ر.س</span>
                </div>
                <div className="flex justify-between text-sm text-slate-400">
                  <span>الشحن</span>
                  <span className="text-green-600 font-bold">يُحدد عند الطلب</span>
                </div>
                <div className="flex justify-between font-black text-brand-navy pt-2 border-t border-slate-100">
                  <span>الإجمالي</span>
                  <span className="text-brand-orange text-lg">
                    {formatPrice(totalPrice())} ر.س
                  </span>
                </div>
              </div>
              <button
                onClick={() => setShowCheckout(true)}
                className="w-full btn-primary gap-2 justify-center text-base"
              >
                <span className="material-symbols-outlined">send</span>
                إتمام الشراء عبر واتساب
              </button>
              <p className="text-center text-xs text-slate-400">
                سيتم إرسال طلبك مباشرةً عبر واتساب
              </p>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
