import type { Metadata } from "next";
import { Vazirmatn } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

const vazirmatn = Vazirmatn({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-vazirmatn",
});

export const metadata: Metadata = {
  title: "آبجوش · قهوه‌های ویژه",
  description: "پرفروش‌ترین قهوه‌ها و نظرات مشتریان",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl">
      <body className={`${vazirmatn.variable} font-sans antialiased bg-[#fff8f2]`}>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}