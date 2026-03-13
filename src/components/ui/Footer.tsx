import Logo from "@/components/ui/Logo";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 mt-auto">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12 py-12">
        <div className="flex flex-col items-center justify-center gap-6 mb-12 text-center">
          <div className="flex justify-center w-full">
            <Logo variant="dark" height={40} />
          </div>
          <p className="text-slate-500 text-sm leading-relaxed max-w-sm mx-auto">
            وجهتك الأولى للزيوت والمحركات العالمية. جودة أصلية وأداء مضمون.
          </p>
        </div>
        <div className="border-t border-slate-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-400">
          <p>© {new Date().getFullYear()} الإيطالية لزيوت السيارات. جميع الحقوق محفوظة.</p>
          <p className="text-slate-300">Developed by <span className="text-brand-orange font-semibold">Bilal Aboqura</span></p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-brand-navy transition-colors">سياسة الخصوصية</Link>
            <Link href="/terms" className="hover:text-brand-navy transition-colors">الشروط والأحكام</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
