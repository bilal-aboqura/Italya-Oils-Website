import Logo from "@/components/ui/Logo";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 mt-auto">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12 py-12">

        {/* Top section: Logo + map */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-12">
          {/* Brand & description */}
          <div className="flex flex-col items-start gap-4">
            <Logo variant="dark" height={40} />
            <p className="text-slate-500 text-sm leading-relaxed max-w-sm">
              وجهتك الأولى للزيوت والمحركات العالمية. جودة أصلية وأداء مضمون.
            </p>
            <div className="flex flex-col gap-2 text-sm text-slate-500 mt-2">
              <a href="tel:+966500000000" className="flex items-center gap-2 hover:text-brand-orange transition-colors">
                <span className="material-symbols-outlined text-base">phone</span>
                اتصل بنا
              </a>
              <a
                href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "966500000000"}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-green-500 transition-colors"
              >
                <span className="material-symbols-outlined text-base">chat</span>
                واتساب
              </a>
            </div>
          </div>

          {/* Google Maps Embed */}
          <div>
            <p className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-brand-orange">location_on</span>
              موقعنا
            </p>
            <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm h-52">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3624.3485064483047!2d46.68257831500698!3d24.685895484122093!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e2f03890d489399%3A0xba974d1c98e79fd5!2sRiyadh%20Saudi%20Arabia!5e0!3m2!1sen!2s!4v1710000000000!5m2!1sen!2s"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="موقع المتجر"
              />
            </div>
          </div>
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
