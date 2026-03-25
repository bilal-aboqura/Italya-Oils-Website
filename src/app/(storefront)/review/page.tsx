import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import ReviewForm from "@/components/ui/ReviewForm";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'أضف تقييمك | إيطاليا أويلز',
  description: 'أخبرنا عن تجربتك معنا، رأيك يصنع الفرق ويساعدنا لتقديم الأفضل دائماً',
};

export default function ReviewPage() {
  return (
    <div className="flex h-full min-h-screen grow flex-col bg-white">
      <Navbar />

      <main className="flex-1 w-full mx-auto max-w-[1400px] px-4 lg:px-8 py-10 lg:py-20 flex flex-col items-center justify-center">
        <div className="w-full max-w-2xl mx-auto">
          <div className="relative bg-white rounded-[2.5rem] p-8 lg:p-12 border border-slate-100 shadow-[0_8px_40px_rgb(0,0,0,0.04)] overflow-hidden group">
            {/* Background decorative gradients */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-orange/5 blur-[80px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/4 group-hover:bg-brand-orange/10 transition-colors duration-700" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-navy/5 blur-[80px] rounded-full pointer-events-none translate-y-1/4 -translate-x-1/4 group-hover:bg-brand-navy/10 transition-colors duration-700" />
            
            <div className="relative z-10 mb-8 text-center text-balance">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-orange-50 text-brand-orange mb-4 shadow-sm">
                <span className="material-symbols-outlined text-2xl">rate_review</span>
              </div>
              <h1 className="text-3xl font-black text-brand-navy mb-3">أضف تقييمك</h1>
              <p className="text-slate-500 text-sm leading-relaxed max-w-sm mx-auto">
                أخبرنا عن تجربتك معنا، رأيك يصنع الفرق ويساعدنا لتقديم الأفضل دائماً
              </p>
            </div>
            
            <div className="relative z-10">
              <ReviewForm />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
