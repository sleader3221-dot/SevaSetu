"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import LanguageSelector from "./LanguageSelector";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-orange-100 bg-white/80 backdrop-blur-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex flex-col items-start hover:opacity-90 transition-opacity">
              <span className="text-2xl font-black bg-gradient-to-r from-primary to-orange-500 bg-clip-text text-transparent leading-tight tracking-tight">
                SevaSetu
              </span>
              <span className="text-xs font-semibold text-gray-500 tracking-widest uppercase">सेवासेतु</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-sm font-semibold text-gray-600 hover:text-primary transition-colors">Home</Link>
            <Link href="/profile" className="text-sm font-semibold text-gray-600 hover:text-primary transition-colors">Find Schemes</Link>
            <Link href="/verify" className="text-sm font-semibold text-gray-600 hover:text-primary transition-colors flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Document OCR
            </Link>
            <Link href="/dashboard" className="text-sm font-semibold text-gray-600 hover:text-primary transition-colors">My Schemes</Link>
            <div className="h-6 w-px bg-gray-200 mx-2"></div>
            <LanguageSelector />
          </div>

          <div className="md:hidden flex items-center gap-4">
            <LanguageSelector />
            <Button variant="ghost" size="icon" className="text-gray-700">
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
