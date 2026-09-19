import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { Toaster } from "@/components/ui/toast";
import SevaMitraChat from "@/components/SevaMitraChat";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: "SevaSetu | AI Government Scheme Navigator",
  description: "Discover and apply for Indian government schemes easily with AI-powered personalized recommendations.",
};

import Script from "next/script";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* Government Portal Multi-Language Neural Translation Integration */}
        <div id="google_translate_element" style={{ display: "none" }} />
        <Script
          id="google-translate-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              function googleTranslateElementInit() {
                if (window.google && window.google.translate) {
                  new window.google.translate.TranslateElement({
                    pageLanguage: 'en',
                    includedLanguages: 'hi,ta,te,bn,mr,gu,kn,pa,en',
                    autoDisplay: false
                  }, 'google_translate_element');
                }
              }
            `,
          }}
        />
        <Script
          id="google-translate-script"
          strategy="afterInteractive"
          src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
        />

        <Navbar />
        {children}
        <SevaMitraChat />
        <Toaster />
      </body>
    </html>
  );
}
