"use client";

import { useState } from "react";
import { useCartStore } from "@/lib/cart-store";
import { formatPrice } from "@/lib/whatsapp";

interface Product {
  id: string;
  name: string;
  price: number;
  brand: string | null;
  imageUrl: string | null;
  sku: string;
}

export default function ProductDetailsClient({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCartStore();

  const handleAddToCart = () => {
    addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
    }, quantity);
  };

  return (
    <div className="bg-white rounded-3xl p-6 lg:p-8 border border-slate-100 shadow-card flex-1">
      <div className="mb-6">
        <div className="flex items-center gap-2 text-brand-orange font-bold text-sm mb-2">
          <span className="material-symbols-outlined text-lg">workspace_premium</span>
          <span>منتج أصلي معتمد</span>
        </div>
        <h1 className="text-3xl lg:text-4xl font-black text-brand-navy mb-2 leading-tight">
          {product.name}
        </h1>
        <p className="text-slate-500 font-medium text-lg">SKU: {product.sku}</p>
        
        <div className="flex items-center gap-4 mt-4 pb-6 border-b border-slate-100">
          <div className="flex items-center text-brand-orange gap-1">
            <span className="material-symbols-outlined fill-current text-xl">star</span>
            <span className="material-symbols-outlined fill-current text-xl">star</span>
            <span className="material-symbols-outlined fill-current text-xl">star</span>
            <span className="material-symbols-outlined fill-current text-xl">star</span>
            <span className="material-symbols-outlined fill-current text-xl">star</span>
          </div>
          <span className="text-slate-400 text-sm font-bold">(تقييمات متميزة)</span>
        </div>
      </div>

      <div className="mb-8">
        <div className="flex items-end gap-3 mb-6">
          <h3 className="text-4xl font-black text-brand-navy">
            {formatPrice(product.price)} ج.م
          </h3>
        </div>

        <div className="space-y-4 mb-8">
          <div>
            <label className="block text-brand-navy font-bold text-sm mb-3">اختر العبوة</label>
            <div className="flex gap-3">
              <button className="flex-1 py-3 px-4 border-2 border-brand-orange bg-orange-50 text-brand-orange font-bold rounded-xl shadow-sm">
                عبوة واحدة
              </button>
              <button disabled className="flex-1 py-3 px-4 border border-slate-200 text-slate-300 font-bold rounded-xl cursor-not-allowed">
                كرتون (قريباً)
              </button>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 w-32">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-3 text-slate-500 hover:text-brand-orange transition-colors"
                type="button"
              >
                <span className="material-symbols-outlined text-sm">remove</span>
              </button>
              <input
                className="w-full bg-transparent border-none text-center font-bold text-brand-navy focus:ring-0 p-0"
                type="number"
                value={quantity}
                readOnly
              />
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="p-3 text-slate-500 hover:text-brand-orange transition-colors"
                type="button"
              >
                <span className="material-symbols-outlined text-sm">add</span>
              </button>
            </div>
            <p className="text-sm text-green-600 font-bold flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">check_circle</span>
              متوفر وجاهز للشحن
            </p>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={handleAddToCart}
            className="flex-1 bg-brand-orange text-white font-bold text-lg py-4 px-6 rounded-xl hover:bg-orange-600 transition-all shadow-lg shadow-brand-orange/20 flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined">shopping_cart</span>
            إضافة للسلة
          </button>
          <button className="bg-slate-100 text-brand-navy p-4 rounded-xl hover:bg-slate-200 transition-colors border border-slate-200">
            <span className="material-symbols-outlined">favorite</span>
          </button>
        </div>
      </div>
    </div>
  );
}
