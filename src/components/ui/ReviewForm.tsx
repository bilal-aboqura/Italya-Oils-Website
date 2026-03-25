"use client";

import { useState } from "react";
import { Star, Send, CheckCircle, User, MessageCircleHeart } from "lucide-react";

export default function ReviewForm() {
  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [rating, setRating] = useState(5);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !content.trim()) {
      setError("يرجى ملء جميع الحقول المطلوبة.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/storefront/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), content: content.trim(), rating }),
      });

      if (res.ok) {
        setSubmitted(true);
        setName("");
        setContent("");
        setRating(5);
      } else {
        const data = await res.json();
        throw new Error(data.error?.message || "حدث خطأ، يرجى المحاولة مجدداً.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "حدث خطأ في الاتصال، يرجى المحاولة مجدداً.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-gradient-to-br from-green-50 to-green-100/30 border border-green-200/60 rounded-3xl p-8 text-center flex flex-col items-center gap-5 shadow-inner">
        <div className="relative">
          <div className="absolute inset-0 bg-green-400 blur-xl opacity-20 rounded-full animate-pulse" />
          <div className="w-20 h-20 bg-white shadow-xl shadow-green-200/50 rounded-full flex flex-col items-center justify-center relative z-10 border border-green-100">
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-black text-green-800">شكراً على تقييمك!</h3>
          <p className="text-green-600/80 text-sm leading-relaxed max-w-[250px] mx-auto">
            تم استلام تقييمك بنجاح. سيظهر في الموقع فور مراجعته من قِبَل الإدارة.
          </p>
        </div>
        <button
          onClick={() => setSubmitted(false)}
          className="mt-2 text-sm font-bold text-green-700 bg-white/60 hover:bg-white px-6 py-2.5 rounded-full transition-all duration-300 shadow-sm border border-green-200/50 hover:shadow-md"
        >
          إضافة تقييم آخر
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Star Rating Section */}
      <div className="bg-slate-50/50 border border-slate-100 rounded-2xl p-5 flex flex-col items-center gap-3 transition-colors hover:bg-slate-50">
        <span className="text-sm font-black text-slate-700">كيف تقيم تجربتك؟</span>
        <div className="flex gap-2 flex-row-reverse justify-center" dir="ltr">
          {[1, 2, 3, 4, 5].map((star) => {
            const isActive = star <= (hoveredStar || rating);
            return (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredStar(star)}
                onMouseLeave={() => setHoveredStar(0)}
                className="group relative transition-transform duration-300 hover:scale-125 focus:outline-none"
              >
                {isActive && (
                  <div className="absolute inset-0 bg-amber-400 blur-md opacity-30 rounded-full scale-150 transition-all duration-300" />
                )}
                <Star
                  className={`relative z-10 w-9 h-9 transition-all duration-300 ${
                    isActive
                      ? "fill-amber-400 text-amber-400 drop-shadow-[0_2px_4px_rgba(251,191,36,0.3)]"
                      : "fill-slate-100 text-slate-300 group-hover:text-slate-400"
                  }`}
                />
              </button>
            );
          })}
        </div>
        <span className="text-xs font-bold text-amber-500 bg-amber-50 px-3 py-1 rounded-full border border-amber-100/50">
          {rating === 5 ? "ممتاز جداً" : rating === 4 ? "جيد جداً" : rating === 3 ? "جيد" : rating === 2 ? "مقبول" : "سيء"}
        </span>
      </div>

      {/* Input Fields */}
      <div className="space-y-4">
        {/* Name */}
        <div className="relative group">
          <label className="block text-xs font-bold text-slate-600 mb-1.5 ml-1">
            الاسم <span className="text-brand-orange">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-slate-400 group-focus-within:text-brand-orange transition-colors">
              <User className="w-5 h-5" />
            </div>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="اكتب اسمك..."
              className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl pr-12 pl-4 py-3.5 text-sm text-brand-navy placeholder:text-slate-400 outline-none focus:bg-white focus:border-brand-orange focus:ring-4 focus:ring-brand-orange/10 transition-all duration-300"
              required
            />
          </div>
        </div>

        {/* Content */}
        <div className="relative group">
          <label className="block text-xs font-bold text-slate-600 mb-1.5 ml-1">
            رأيك في المتجر <span className="text-brand-orange">*</span>
          </label>
          <div className="relative">
            <div className="absolute top-3.5 right-0 flex items-start pr-4 pointer-events-none text-slate-400 group-focus-within:text-brand-orange transition-colors">
              <MessageCircleHeart className="w-5 h-5" />
            </div>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="شاركنا تجربتك بكل شفافية..."
              rows={4}
              className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl pr-12 pl-4 py-3.5 text-sm leading-relaxed text-brand-navy placeholder:text-slate-400 outline-none focus:bg-white focus:border-brand-orange focus:ring-4 focus:ring-brand-orange/10 transition-all duration-300 resize-none customize-scrollbar"
              required
            />
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-100 rounded-2xl p-4 flex items-center gap-3 animate-fade-in text-sm text-red-700">
          <div className="min-w-8 h-8 rounded-full bg-red-100 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-red-600 text-sm">priority_high</span>
          </div>
          <p>{error}</p>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="group relative w-full overflow-hidden rounded-2xl bg-brand-navy font-bold text-white shadow-[0_8px_30px_rgb(13,38,59,0.2)] transition-all hover:shadow-[0_8px_30px_rgb(255,107,0,0.3)] disabled:opacity-70 disabled:cursor-not-allowed"
      >
        <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-brand-orange to-[#ff8c33] opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out" />
        <div className="relative flex items-center justify-center gap-2 py-4 px-6 z-10 transform group-hover:-translate-y-0.5 transition-transform duration-300">
          <Send className={`w-5 h-5 ${isSubmitting ? 'animate-bounce' : 'group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300'}`} />
          <span className="text-[15px] tracking-wide">
            {isSubmitting ? "جاري الإرسال..." : "إرسال التقييم"}
          </span>
        </div>
      </button>
    </form>
  );
}
