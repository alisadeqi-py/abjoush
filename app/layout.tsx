import type { Metadata } from "next";
import { Vazirmatn } from "next/font/google";
import "./globals.css";

const vazirmatn = Vazirmatn({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-vazirmatn",
});

export const metadata: Metadata = {
  title: "آبجوش · قهوه‌های ویژه",
  description: "پرفروش‌ترین قهوه‌ها و نظرات مشتریان",
};

/* Minimal root shell: each storefront (coffee "/", herb "/atar") renders its
   own header + footer, so the shared chrome never leaks across brands. */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl">
      <body className={`${vazirmatn.variable} font-sans antialiased bg-cream`}>
        {children}
      </body>
    </html>
  );
}