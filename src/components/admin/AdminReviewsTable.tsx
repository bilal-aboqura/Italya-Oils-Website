"use client";

import { useState } from "react";
import { Check, X, Trash2, Star, Clock } from "lucide-react";

interface Review {
  id: string;
  name: string;
  content: string;
  rating: number;
  status: string;
  createdAt: string;
}

interface AdminReviewsTableProps {
  reviews: Review[];
}

export default function AdminReviewsTable({ reviews: initialReviews }: AdminReviewsTableProps) {
  const [reviews, setReviews] = useState(initialReviews);
  const [loading, setLoading] = useState<string | null>(null);

  const updateStatus = async (id: string, status: "approved" | "rejected" | "pending") => {
    setLoading(id + status);
    try {
      const res = await fetch("/api/admin/reviews", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      if (res.ok) {
        setReviews((prev) =>
          prev.map((r) => (r.id === id ? { ...r, status } : r))
        );
      }
    } finally {
      setLoading(null);
    }
  };

  const deleteReview = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا التقييم؟")) return;
    setLoading(id + "delete");
    try {
      const res = await fetch(`/api/admin/reviews?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setReviews((prev) => prev.filter((r) => r.id !== id));
      }
    } finally {
      setLoading(null);
    }
  };

  const statusBadge = (status: string) => {
    const map: Record<string, { label: string; cls: string }> = {
      pending: { label: "بانتظار الموافقة", cls: "bg-amber-50 text-amber-700 border border-amber-200" },
      approved: { label: "معتمد", cls: "bg-green-50 text-green-700 border border-green-200" },
      rejected: { label: "مرفوض", cls: "bg-red-50 text-red-700 border border-red-200" },
    };
    const s = map[status] ?? { label: status, cls: "bg-slate-100 text-slate-600" };
    return <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${s.cls}`}>{s.label}</span>;
  };

  if (reviews.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center">
        <Star className="w-12 h-12 text-slate-200 mx-auto mb-4" />
        <p className="text-slate-400 font-medium">لا توجد تقييمات حتى الآن</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {reviews.map((review) => (
        <div
          key={review.id}
          className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5"
        >
          <div className="flex flex-col md:flex-row gap-4 md:items-start justify-between">
            <div className="flex-1 space-y-2">
              {/* Header */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="w-8 h-8 bg-brand-orange/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-brand-orange text-xs font-black">
                    {review.name.charAt(0)}
                  </span>
                </div>
                <span className="font-bold text-brand-navy">{review.name}</span>
                {statusBadge(review.status)}
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {new Date(review.createdAt).toLocaleDateString("ar-EG", {
                    year: "numeric", month: "short", day: "numeric",
                  })}
                </span>
              </div>

              {/* Stars */}
              <div className="flex gap-0.5" dir="ltr">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-3.5 h-3.5 ${
                      star <= review.rating ? "fill-amber-400 text-amber-400" : "text-slate-200"
                    }`}
                  />
                ))}
              </div>

              {/* Content */}
              <p className="text-sm text-slate-600 leading-relaxed">{review.content}</p>
            </div>

            {/* Actions */}
            <div className="flex gap-2 flex-shrink-0">
              {review.status !== "approved" && (
                <button
                  onClick={() => updateStatus(review.id, "approved")}
                  disabled={!!loading}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-700 border border-green-200 rounded-xl text-xs font-bold hover:bg-green-100 transition-colors disabled:opacity-60"
                >
                  <Check className="w-3.5 h-3.5" />
                  موافقة
                </button>
              )}
              {review.status !== "rejected" && (
                <button
                  onClick={() => updateStatus(review.id, "rejected")}
                  disabled={!!loading}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-700 border border-red-200 rounded-xl text-xs font-bold hover:bg-red-100 transition-colors disabled:opacity-60"
                >
                  <X className="w-3.5 h-3.5" />
                  رفض
                </button>
              )}
              <button
                onClick={() => deleteReview(review.id)}
                disabled={!!loading}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 text-slate-600 border border-slate-200 rounded-xl text-xs font-bold hover:bg-slate-100 transition-colors disabled:opacity-60"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
