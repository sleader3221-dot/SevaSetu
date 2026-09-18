import Link from "next/link";
import { Button } from "@/components/ui/button";
import { 
  ArrowRight, ShieldCheck, Zap, Languages, Award, 
  Landmark, FileCheck, CheckCircle2, Search, ExternalLink 
} from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col bg-slate-50/50 overflow-hidden">
      
      {/* Official Hero Section */}
      <section className="relative pt-16 pb-24 lg:pt-24 lg:pb-32 bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center max-w-4xl">
          
          {/* Government Initiative Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-50 border border-orange-200 text-orange-800 font-bold text-xs uppercase tracking-wider mb-6">
            <span className="w-2 h-2 rounded-full bg-orange-500"></span>
            National Citizen Welfare AI Gateway • Digital India
          </div>
          
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-gray-900 mb-6 leading-tight">
            Discover Government Schemes <br className="hidden sm:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-orange-500 to-amber-600">
              You Are Statutorily Eligible For
            </span>
          </h1>
          
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
            A unified, multi-agent AI navigator cross-referencing your demographic parameters against official central and state welfare programs — verified with real-time statutory guidelines.
          </p>
          
          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/profile">
              <Button size="lg" className="h-13 px-8 text-base font-bold bg-primary hover:bg-orange-600 text-white rounded-xl shadow-md transition-all">
                Initiate Eligibility Assessment <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>

            <Link href="/verify">
              <Button size="lg" variant="outline" className="h-13 px-7 text-base font-semibold border-gray-300 text-gray-700 hover:bg-gray-50 rounded-xl">
                <ShieldCheck className="mr-2 w-5 h-5 text-emerald-600" />
                OCR Document Vault
              </Button>
            </Link>
          </div>

          {/* Trust Guarantees */}
          <div className="flex flex-wrap items-center justify-center gap-6 mt-12 text-xs text-gray-500 font-medium">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> 100% Real Live AWS Cloud Data
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Zero Mock Data Guarantee
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Official DigiLocker & OGD Aligned
            </span>
          </div>
        </div>
      </section>

      {/* Official Welfare Metrics Section */}
      <section className="bg-slate-900 text-white py-12 border-b border-slate-800">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-slate-800">
            <div className="p-3">
              <div className="text-3xl sm:text-4xl font-black text-orange-400">30+</div>
              <div className="text-xs text-slate-300 uppercase tracking-wider font-semibold mt-1">Verified Official Schemes</div>
            </div>
            <div className="p-3">
              <div className="text-3xl sm:text-4xl font-black text-emerald-400">₹1.5 Cr+</div>
              <div className="text-xs text-slate-300 uppercase tracking-wider font-semibold mt-1">Direct Benefit Potential</div>
            </div>
            <div className="p-3">
              <div className="text-3xl sm:text-4xl font-black text-blue-400">5 Languages</div>
              <div className="text-xs text-slate-300 uppercase tracking-wider font-semibold mt-1">Amazon Translate Neural Engine</div>
            </div>
            <div className="p-3">
              <div className="text-3xl sm:text-4xl font-black text-amber-400">Sub-Second</div>
              <div className="text-xs text-slate-300 uppercase tracking-wider font-semibold mt-1">DynamoDB Cloud Retrieval</div>
            </div>
          </div>
        </div>
      </section>

      {/* System Methodology / How It Works */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-14">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              Statutory Welfare Discovery Architecture
            </h2>
            <p className="text-gray-500 text-sm mt-2 max-w-xl mx-auto">
              How SevaSetu delivers accurate, personalized scheme matches without middlemen or fees.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl border border-gray-200 bg-white hover:border-gray-300 shadow-xs">
              <div className="w-12 h-12 bg-orange-50 text-primary rounded-xl flex items-center justify-center mb-5 font-bold text-lg">
                01
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Demographic Profile Input</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Provide essential socioeconomic metrics (age, state, occupation, income ceiling, social category) through an intuitive 7-step wizard.
              </p>
            </div>
            
            <div className="p-6 rounded-2xl border border-gray-200 bg-white hover:border-gray-300 shadow-xs">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-700 rounded-xl flex items-center justify-center mb-5 font-bold text-lg">
                02
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Multi-Agent Rule Evaluation</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Deterministic and LLM-powered agents evaluate composite eligibility criteria to calculate exact percentage matches for every central scheme.
              </p>
            </div>
            
            <div className="p-6 rounded-2xl border border-gray-200 bg-white hover:border-gray-300 shadow-xs">
              <div className="w-12 h-12 bg-blue-50 text-blue-700 rounded-xl flex items-center justify-center mb-5 font-bold text-lg">
                03
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Direct Official Application</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Generate your verifiable Digital Citizen Passbook, inspect side-by-side comparison matrices, and apply directly via authentic ministry portals.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Official Disclaimer & Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800 mt-auto text-xs">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 pb-8 border-b border-slate-800">
            <div>
              <div className="text-lg font-black text-white">SevaSetu (सेवासेतु)</div>
              <p className="text-slate-400 mt-1 max-w-md">
                National Citizen Welfare AI Navigator. Built on Amazon Web Services for the Bharat Builds Tour Hackathon 2026.
              </p>
            </div>
            <div className="flex flex-wrap gap-4 text-xs font-semibold text-slate-300">
              <Link href="/profile" className="hover:text-white">Scheme Finder</Link>
              <Link href="/dashboard" className="hover:text-white">Citizen Dashboard</Link>
              <Link href="/verify" className="hover:text-white">OCR Vault</Link>
              <a href="https://pgportal.gov.in" target="_blank" rel="noopener noreferrer" className="hover:text-white">CPGRAMS Grievance</a>
            </div>
          </div>
          
          <div className="pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px] text-slate-500">
            <p>© 2026 SevaSetu • Open Government Data Alignment • Non-commercial Public Service Platform</p>
            <p>Infrastructure: AWS Lambda, DynamoDB, Textract, Polly, Translate, Amplify</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
