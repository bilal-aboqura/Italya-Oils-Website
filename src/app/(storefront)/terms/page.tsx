import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";

export const metadata = {
  title: "الشروط والأحكام | ItalyaOils",
};

export default function TermsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Navbar />
      <main className="flex-1 w-full mx-auto max-w-[1000px] px-6 py-12">
        <div className="bg-white rounded-3xl p-8 lg:p-12 shadow-sm border border-slate-100">
          <h1 className="text-3xl lg:text-4xl font-black text-brand-navy mb-8 border-b border-slate-100 pb-6">
            الشروط والأحكام
          </h1>
          
          <div className="space-y-6 text-slate-600 leading-relaxed">
            <section>
              <h2 className="text-xl font-bold text-brand-navy mb-3">1. مقدمة</h2>
              <p>
                مرحباً بكم في متجر ItalyaOils (الإيطالية لزيوت السيارات). باستخدامك لهذا الموقع، فإنك توافق على الالتزام بالشروط والأحكام التالية، وتحكم هذه الشروط والأحكام استخدامك للموقع وخدماتنا.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-brand-navy mb-3">2. المنتجات والخدمات</h2>
              <p>
                نحن وكلاء وموزعون معتمدون لعدة علامات تجارية رائدة في مجال زيوت المحركات. نضمن أن جميع المنتجات المعروضة على موقعنا أصلية 100%. نبذل قصارى جهدنا لعرض صور وألوان المنتجات بشكل دقيق، ولكن قد تختلف قليلاً عن الواقع.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-brand-navy mb-3">3. الطلبات والتسعير</h2>
              <p>
                جميع الأسعار قابلة للتغيير دون إشعار مسبق. نحتفظ بالحق في رفض أو إلغاء أي طلب لأي سبب، بما في ذلك أخطاء في التسعير أو معلومات المنتج. في حال إلغاء الطلب بعد الدفع، سيتم استرداد المبلغ بالكامل.
              </p>
              <p className="mt-2">
                يتم تأكيد الطلبات عبر الواتساب في معظم الحالات لتوفير خدمة أسرع وأكثر أماناً.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-brand-navy mb-3">4. الشحن والتوصيل</h2>
              <p>
                يتم شحن الطلبات إلى العنوان المحدد من قبل العميل. وقت التوصيل يعتمد على موقع العميل وشركة الشحن المعتمدة. لا نتحمل مسؤولية أي تأخير ناتج عن ظروف خارجة عن إرادتنا.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-brand-navy mb-3">5. سياسة الاسترجاع والاستبدال</h2>
              <p>
                نقبل إرجاع المنتجات غير المستخدمة في عبواتها الأصلية والمغلقة بإحكام خلال 7 أيام من تاريخ الاستلام. في حالة وجود عيب مصنعي ملحوظ، يرجى التواصل معنا على الفور. لا يشمل الاسترجاع مصاريف الشحن إلا إذا كان المنتج معيباً أو غير مطابق للمواصفات.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-brand-navy mb-3">6. حقوق الملكية الفكرية</h2>
              <p>
                جميع محتويات الموقع من نصوص وتصاميم وصور وعلامات تجارية هي ملك خاص لمتجر ItalyaOils أو وكلائنا ولا يجوز استخدامها أوتوزيعها بدون إذن كتابي مسبق.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-brand-navy mb-3">7. التعديلات على الشروط</h2>
              <p>
                نحتفظ بالحق في تحديث هذه الشروط والأحكام في أي وقت. يشكل استمرار استخدامك للموقع بعد نشر أي تغييرات موافقة منك عليها.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-brand-navy mb-3">8. تواصل معنا</h2>
              <p>
                لأي أسئلة أو استفسارات حول الشروط والأحكام، نرجو عدم التردد في التواصل معنا عبر قنوات الدعم المتاحة على الموقع.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
