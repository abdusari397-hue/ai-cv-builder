import type { Metadata } from "next";
import { Inter, Cairo } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: 'swap' });
const cairo = Cairo({ subsets: ["arabic"], variable: "--font-cairo", display: 'swap' });

export const metadata: Metadata = {
  title: "صانع السيرة الذاتية الذكي",
  description: "ابنِ سيرتك الذاتية باحترافية بضغطة زر باستخدام الذكاء الاصطناعي",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className={`h-full antialiased ${inter.variable} ${cairo.variable}`}>
      <body suppressHydrationWarning className="min-h-full flex flex-col bg-slate-50 text-slate-900">{children}</body>
    </html>
  );
}
