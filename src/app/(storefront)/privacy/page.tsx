import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";

export const metadata = {
  title: "سياسة الخصوصية | ItalyaOils",
};

export default function PrivacyPage() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Navbar />
      <main className="flex-1 w-full mx-auto max-w-[1000px] px-6 py-12">
        <div className="bg-white rounded-3xl p-8 lg:p-12 shadow-sm border border-slate-100">
          <h1 className="text-3xl lg:text-4xl font-black text-brand-navy mb-8 border-b border-slate-100 pb-6">
            سياسة الخصوصية
          </h1>
          
          <div className="space-y-6 text-slate-600 leading-relaxed">
            <section>
              <h2 className="text-xl font-bold text-brand-navy mb-3">1. مقدمة</h2>
              <p>
                نحن في ItalyaOils نولي أهمية كبرى لخصوصية زوارنا وعملائنا. توضح سياسة الخصوصية هذه كيفية جمع واستخدام وحماية معلوماتك الشخصية عند استخدامك لموقعنا الإلكتروني وخدماتنا.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-brand-navy mb-3">2. المعلومات التي نجمعها</h2>
              <p>
                قد نقوم بجمع معلومات شخصية منك عندما تقوم بزيارة موقعنا، التسجيل، تقديم طلب، أو التواصل معنا عبر الواتساب. تشمل هذه المعلومات على سبيل المثال لا الحصر:
              </p>
              <ul className="list-disc list-inside mt-2 space-y-1 pr-4">
                <li>الاسم الكامل</li>
                <li>رقم الهاتف</li>
                <li>عنوان الشحن</li>
                <li>معلومات حول سيارتك والزيوت المفضلة</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-brand-navy mb-3">3. كيف نستخدم معلوماتك</h2>
              <p>
                نستخدم المعلومات التي نجمعها لتحسين تجربتك، بما في ذلك:
              </p>
              <ul className="list-disc list-inside mt-2 space-y-1 pr-4">
                <li>معالجة طلباتك وتوصيل المنتجات إلى موقعك.</li>
                <li>التواصل معك عبر الواتساب لتأكيد وتتبع الطلبات.</li>
                <li>تحسين خدماتنا وموقعنا الإلكتروني وتجربة المستخدم.</li>
                <li>إرسال العروض الترويجية والإشعارات (إذا وافقت على ذلك).</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-brand-navy mb-3">4. حماية بياناتك</h2>
              <p>
                نتخذ مجموعة من التدابير الأمنية لضمان سلامة معلوماتك الشخصية وحمايتها من الوصول غير المصرح به أو التعديل أو الإفصاح. نحن لا نقوم بتخزين معلومات الدفع الحساسة على خوادمنا.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-brand-navy mb-3">5. مشاركة المعلومات</h2>
              <p>
                نحن لا نقوم ببيع أو تأجير أو مبادلة معلوماتك الشخصية لأطراف ثالثة. قد نشارك بعض البيانات الضرورية فقط (مثل الاسم والعنوان ورقم الهاتف) مع شركائنا في خدمات الشحن والتوصيل لضمان وصول طلباتك بنجاح.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-brand-navy mb-3">6. التعديلات على سياسة الخصوصية</h2>
              <p>
                نحتفظ بالحق في تحديث سياسة الخصوصية هذه في أي وقت. سيتم نشر أي تغييرات على هذه الصفحة، ونشجعك على مراجعتها بانتظام.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-brand-navy mb-3">7. تواصل معنا</h2>
              <p>
                إذا كان لديك أي أسئلة أو استفسارات حول سياسة الخصوصية، يرجى التواصل معنا عبر خدمة العملاء أو عبر الواتساب.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
