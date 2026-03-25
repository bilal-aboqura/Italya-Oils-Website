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
    <div className="w-full relative py-6">
      <div className="flex overflow-x-auto gap-8 pb-10 snap-x snap-mandatory pt-6 px-4 customize-scrollbar">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="snap-center sm:snap-start shrink-0 w-[340px] sm:w-[420px] bg-white rounded-[2.5rem] border border-slate-100/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgb(255,107,0,0.12)] hover:border-brand-orange/30 transition-all duration-500 relative group flex flex-col justify-between"
          >
            {/* Quote mark decoration */}
            <div className="absolute -top-4 -right-2 text-[120px] text-brand-orange/5 font-serif leading-none group-hover:text-brand-orange/15 group-hover:-rotate-12 transition-all duration-500 select-none">
              &quot;
            </div>

            <div className="relative z-10 flex-grow flex flex-col justify-center">
              {/* Stars */}
              <div className="flex gap-1.5 mb-6 bg-slate-50 w-fit p-3 rounded-2xl border border-slate-100" dir="ltr">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-6 h-6 transition-transform duration-500 group-hover:scale-110 ${
                      star <= review.rating
                        ? "fill-amber-400 text-amber-500 drop-shadow-[0_2px_10px_rgba(251,191,36,0.6)]"
                        : "fill-slate-100 text-slate-200"
                    }`}
                    style={{ transitionDelay: `${star * 50}ms` }}
                  />
                ))}
              </div>

              {/* Content */}
              <p className="text-brand-navy text-lg leading-loose line-clamp-4 font-medium mb-8">
                {review.content}
              </p>
            </div>

            {/* Reviewer */}
            <div className="flex items-center gap-4 pt-6 border-t border-slate-100 relative z-10">
              <div className="w-14 h-14 bg-gradient-to-br from-brand-orange to-[#ff8c33] rounded-[1.2rem] flex items-center justify-center flex-shrink-0 shadow-lg shadow-brand-orange/30 group-hover:rotate-6 transition-transform duration-500 border-2 border-white">
                <span className="text-white text-xl font-black mt-1">
                  {review.name.charAt(0)}
                </span>
              </div>
              <div>
                <p className="text-base font-black text-brand-navy">{review.name}</p>
                <div className="flex items-center gap-1.5 mt-1 text-xs font-bold text-slate-400">
                  <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.6)]"></span>
                  <span>عميل موثوق</span>
                  <span className="mx-0.5">&bull;</span>
                  <span>
                    {new Date(review.createdAt).toLocaleDateString("ar-EG", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
