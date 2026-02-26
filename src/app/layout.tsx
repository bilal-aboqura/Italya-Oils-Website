import type { Metadata } from "next";
import "./globals.css";
import CartPanel from "@/components/ui/CartPanel";

export const metadata: Metadata = {
  title: "ItalyaOils — زيوت المحركات الاحترافية",
  description:
    "تسوق أفضل زيوت المحركات من موبيل 1، شل، كاسترول، وتوتال. اطلب بسهولة عبر واتساب.",
  keywords: "زيوت محركات، موبيل 1، شل، كاسترول، توتال، زيوت سيارات",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Kufi+Arabic:wght@100..900&family=Outfit:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-brand-light text-brand-navy min-h-screen flex flex-col overflow-x-hidden selection:bg-brand-orange selection:text-white antialiased">
        {children}
        <CartPanel />
      </body>
    </html>
  );
}
