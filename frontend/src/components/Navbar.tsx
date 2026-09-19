"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, ShieldCheck, Landmark } from "lucide-react";
import LanguageSelector from "./LanguageSelector";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-200 shadow-xs">
      {/* Top Official Government Strip */}
      <div className="bg-slate-900 text-slate-300 text-[11px] py-1.5 px-4 sm:px-8 border-b border-slate-800">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-bold text-orange-400">भारत सरकार</span>
            <span className="text-slate-600">|</span>
            <span className="font-semibold text-slate-200">Government of India</span>
            <span className="hidden md:inline text-slate-600">•</span>
            <span className="hidden md:inline text-slate-400">National Citizen Welfare AI Gateway</span>
          </div>
          <div className="flex items-center gap-3 text-[11px] text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              <span className="text-emerald-400 font-semibold">Live AWS Cloud</span>
            </span>
            <span className="hidden sm:inline text-slate-600">|</span>
            <span className="hidden sm:inline text-slate-400">Digital India Initiative</span>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-3 hover:opacity-95 transition-opacity">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-orange-600 flex items-center justify-center text-white shadow-xs">
                <Landmark className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-extrabold text-gray-900 tracking-tight leading-none">
                  SevaSetu
                </span>
                <span className="text-[10px] font-bold text-gray-500 tracking-widest uppercase mt-0.5">
                  सेवासेतु • National Welfare Portal
                </span>
              </div>
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-7">
            <Link href="/" className="text-xs uppercase tracking-wider font-bold text-gray-700 hover:text-primary transition-colors">
              Home
            </Link>
            <Link href="/profile" className="text-xs uppercase tracking-wider font-bold text-gray-700 hover:text-primary transition-colors">
              Find Schemes
            </Link>
            <Link href="/dashboard" className="text-xs uppercase tracking-wider font-bold text-gray-700 hover:text-primary transition-colors">
              My Assessment & Pipeline
            </Link>
            <Link href="/verify" className="text-xs uppercase tracking-wider font-bold text-gray-700 hover:text-primary transition-colors flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Document OCR Vault
            </Link>
            <div className="h-4 w-px bg-gray-200"></div>
            <LanguageSelector />
          </div>

          <div className="md:hidden flex items-center gap-3">
            <LanguageSelector />
            <Link href="/profile">
              <Button size="sm" className="bg-primary text-white text-xs font-bold px-3">
                Find Schemes
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
