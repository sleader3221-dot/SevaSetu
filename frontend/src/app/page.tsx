"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { 
  ArrowRight, ShieldCheck, Zap, Languages, Award, 
  Landmark, FileCheck, CheckCircle2, Search, ExternalLink, 
  Sparkles, Layers, Cpu, Compass 
} from "lucide-react";
import BharatGlobe3D from "@/components/3d/BharatGlobe3D";
import IndiaMapExplorer from "@/components/IndiaMapExplorer";
import WelfareSimulator3D from "@/components/3d/WelfareSimulator3D";
import HoloCard3D from "@/components/3d/HoloCard3D";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col bg-slate-950 text-slate-100 overflow-hidden">
      
      {/* 3D Interactive Hero Section */}
      <section className="relative pt-12 pb-20 lg:pt-16 lg:pb-28 border-b border-slate-800 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black">
        
        {/* Ambient Glows */}
        <div className="absolute top-10 left-1/4 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-20 right-1/4 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content (6 Cols) */}
            <div className="lg:col-span-6 space-y-6 text-left">
              
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 font-bold text-xs uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
                National Citizen Welfare AI Gateway • Digital India
              </div>
              
              <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-[1.1]">
                Empowering Bharat: <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-300 to-emerald-400">
                  Every Scheme. Every Citizen. Zero Middlemen.
                </span>
              </h1>
              
              <p className="text-base sm:text-lg text-slate-300 max-w-xl leading-relaxed font-normal">
                Autonomous multi-agent intelligence evaluating your demographic parameters against 30+ official central and state welfare programs with real-time statutory guidelines.
              </p>
              
              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <Link href="/profile">
                  <Button size="lg" className="w-full sm:w-auto h-13 px-8 text-base font-bold bg-gradient-to-r from-primary to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-2xl shadow-xl shadow-orange-500/20 transition-all hover:scale-105">
                    Initiate Eligibility Assessment <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>

                <Link href="/verify">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto h-13 px-7 text-base font-semibold border-slate-700 bg-slate-900/80 hover:bg-slate-800 text-slate-200 rounded-2xl backdrop-blur-md">
                    <ShieldCheck className="mr-2 w-5 h-5 text-emerald-400" />
                    OCR Document Vault
                  </Button>
                </Link>
              </div>

              {/* Verified Trust Badges */}
              <div className="pt-4 flex flex-wrap items-center gap-5 text-xs text-slate-400 font-medium">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> 100% Real Live AWS Cloud Data
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Zero Mock Data Guarantee
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> DigiLocker & OGD Alignment
                </span>
              </div>

            </div>

            {/* Right Interactive 3D WebGL Globe of Bharat (6 Cols) */}
            <div className="lg:col-span-6 w-full">
              <BharatGlobe3D />
            </div>

          </div>
        </div>
      </section>

      {/* Official Welfare Metrics Section */}
      <section className="bg-slate-900/90 text-white py-10 border-b border-slate-800 backdrop-blur-md">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-slate-800">
            <div className="p-3">
              <div className="text-3xl sm:text-4xl font-black text-orange-400">30+</div>
              <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold mt-1">Verified Official Schemes</div>
            </div>
            <div className="p-3">
              <div className="text-3xl sm:text-4xl font-black text-emerald-400">₹1.5 Cr+</div>
              <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold mt-1">Direct Benefit Potential</div>
            </div>
            <div className="p-3">
              <div className="text-3xl sm:text-4xl font-black text-blue-400">5 Languages</div>
              <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold mt-1">Amazon Translate Neural Engine</div>
            </div>
            <div className="p-3">
              <div className="text-3xl sm:text-4xl font-black text-amber-400">Sub-Second</div>
              <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold mt-1">DynamoDB Cloud Retrieval</div>
            </div>
          </div>
        </div>
      </section>

      {/* Dedicated Interactive India State Welfare Map Section */}
      <section id="state-map" className="py-16 bg-slate-950 border-b border-slate-800 relative">
        <div className="container mx-auto px-4 max-w-7xl">
          <IndiaMapExplorer />
        </div>
      </section>

      {/* Interactive 3D Benefit Simulator Section */}
      <section className="py-16 bg-slate-950 border-b border-slate-800 relative">
        <div className="container mx-auto px-4 max-w-7xl">
          <WelfareSimulator3D />
        </div>
      </section>

      {/* System Methodology / 3D Holographic Architecture Cards */}
      <section className="py-20 bg-slate-900/60 border-b border-slate-800">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-orange-400 text-xs font-bold uppercase tracking-wider mb-3">
              <Cpu className="w-3.5 h-3.5" />
              AWS Cloud Multi-Agent Framework
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Statutory Welfare Discovery Architecture
            </h2>
            <p className="text-slate-400 text-sm mt-2 max-w-xl mx-auto">
              How SevaSetu delivers sub-second, highly accurate scheme matches without fees or bureaucratic friction.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <HoloCard3D intensity={15}>
              <div className="p-7 rounded-3xl border border-slate-800 bg-slate-950/80 hover:border-slate-700 transition-all h-full flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 bg-orange-500/10 border border-orange-500/20 text-orange-400 rounded-2xl flex items-center justify-center mb-6 font-bold text-lg">
                    01
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">Demographic Profile Ingestion</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    Captures 7 core socioeconomic parameters (age, state, occupation, income ceiling, social category, gender, special status) via a fluid guided wizard.
                  </p>
                </div>
                <div className="pt-6 mt-6 border-t border-slate-900 text-xs text-orange-400 font-semibold flex items-center gap-1">
                  Step 1: Input Analysis <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </HoloCard3D>
            
            <HoloCard3D intensity={15}>
              <div className="p-7 rounded-3xl border border-slate-800 bg-slate-950/80 hover:border-slate-700 transition-all h-full flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-2xl flex items-center justify-center mb-6 font-bold text-lg">
                    02
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">Multi-Agent Rule Evaluation</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    Deterministic algorithms and AWS Lambda compute exact eligibility percentages by evaluating statutory income ceilings and demographic quotas from DynamoDB.
                  </p>
                </div>
                <div className="pt-6 mt-6 border-t border-slate-900 text-xs text-emerald-400 font-semibold flex items-center gap-1">
                  Step 2: Cloud Matching <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </HoloCard3D>
            
            <HoloCard3D intensity={15}>
              <div className="p-7 rounded-3xl border border-slate-800 bg-slate-950/80 hover:border-slate-700 transition-all h-full flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-2xl flex items-center justify-center mb-6 font-bold text-lg">
                    03
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">Direct Official Application</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    Generates your verifiable Digital Citizen Passbook (`SEVA-2026-XX-XXXXXX`), side-by-side comparison matrices, and official application roadmap.
                  </p>
                </div>
                <div className="pt-6 mt-6 border-t border-slate-900 text-xs text-blue-400 font-semibold flex items-center gap-1">
                  Step 3: Direct Entitlement <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </HoloCard3D>
          </div>
        </div>
      </section>

      {/* Official Government Footer */}
      <footer className="bg-black text-slate-400 py-12 border-t border-slate-900 mt-auto text-xs">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 pb-8 border-b border-slate-900">
            <div>
              <div className="text-lg font-black text-white flex items-center gap-2">
                <Landmark className="w-5 h-5 text-primary" />
                SevaSetu (सेवासेतु)
              </div>
              <p className="text-slate-500 mt-1 max-w-md">
                National Citizen Welfare AI Navigator. Built on Amazon Web Services for the Bharat Builds Tour Hackathon 2026.
              </p>
            </div>
            <div className="flex flex-wrap gap-5 text-xs font-semibold text-slate-300">
              <Link href="/profile" className="hover:text-white">Scheme Finder</Link>
              <Link href="/dashboard" className="hover:text-white">Citizen Dashboard</Link>
              <Link href="/verify" className="hover:text-white">OCR Vault</Link>
              <a href="https://pgportal.gov.in" target="_blank" rel="noopener noreferrer" className="hover:text-white">CPGRAMS Grievance</a>
            </div>
          </div>
          
          <div className="pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px] text-slate-600">
            <p>© 2026 SevaSetu • Open Government Data Alignment • Non-commercial Public Service Platform</p>
            <p>13 AWS Cloud Services: Lambda, DynamoDB, Textract, Polly, Translate, Amplify, CloudFront</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
