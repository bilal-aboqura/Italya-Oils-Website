import { prisma } from "@/lib/prisma";
import { Star } from "lucide-react";

export default async function ReviewsSection() {
  const reviews = await prisma.review.findMany({
    where: { status: "approved" },
    orderBy: { createdAt: "desc" },
    take: 12,
  });

  if (reviews.length === 0) return null;

  return (
    <div className="w-full relative py-4">
      <div className="flex overflow-x-auto gap-6 pb-8 snap-x snap-mandatory pt-4 px-4 customize-scrollbar">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="snap-center sm:snap-start shrink-0 w-[320px] sm:w-[380px] bg-white rounded-3xl border border-slate-100/50 shadow-[0_4px_20px_rgb(0,0,0,0.03)] p-6 space-y-4 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all duration-300 relative group"
          >
            {/* Quote mark decoration */}
            <div className="absolute top-6 left-6 text-6xl text-slate-100 font-serif leading-none opacity-50 group-hover:text-brand-orange/10 transition-colors">
              &quot;
            </div>

            {/* Stars */}
            <div className="flex gap-1 relative z-10" dir="ltr">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-5 h-5 ${
                    star <= review.rating
                      ? "fill-amber-400 text-amber-400 drop-shadow-sm"
                      : "fill-slate-100 text-slate-200"
                  }`}
                />
              ))}
            </div>

            {/* Content */}
            <p className="text-slate-600 text-sm leading-loose line-clamp-4 relative z-10 min-h-[96px]">
              {review.content}
            </p>

            {/* Reviewer */}
            <div className="flex items-center gap-3 pt-4 border-t border-slate-100/50 relative z-10">
              <div className="w-10 h-10 bg-gradient-to-br from-brand-orange/20 to-brand-orange/5 rounded-full flex items-center justify-center flex-shrink-0 border border-brand-orange/10">
                <span className="text-brand-orange text-sm font-black">
                  {review.name.charAt(0)}
                </span>
              </div>
              <div>
                <p className="text-sm font-bold text-brand-navy">{review.name}</p>
                <p className="text-xs text-slate-400">
                  {new Date(review.createdAt).toLocaleDateString("ar-EG", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
