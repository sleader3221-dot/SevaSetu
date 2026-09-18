import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, ShieldCheck, Zap, Languages } from "lucide-react";
import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col bg-white overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 lg:pt-32 lg:pb-40 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] pointer-events-none"></div>
        <div className="absolute top-0 right-0 -mr-40 -mt-40 w-[600px] h-[600px] rounded-full bg-orange-100/50 blur-3xl opacity-60 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-40 -mb-40 w-[600px] h-[600px] rounded-full bg-emerald-100/40 blur-3xl opacity-60 pointer-events-none"></div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center max-w-5xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-50 border border-orange-200 text-orange-700 font-semibold text-sm mb-8">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-orange-500"></span>
            </span>
            AI-Powered Government Scheme Discovery
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900 mb-8 leading-tight">
            Discover Government Schemes <br className="hidden md:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-orange-500 to-amber-500">
              You're Eligible For
            </span>
          </h1>
          
          <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto mb-10 leading-relaxed">
            Answer a few simple questions and let our AI engine find the perfect government benefits for you out of 700+ central and state schemes.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/profile">
              <Button size="lg" className="h-14 px-8 text-lg font-bold bg-primary hover:bg-orange-600 text-white rounded-xl shadow-xl shadow-orange-200/50 transition-all hover:scale-105">
                Find My Schemes <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-secondary text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-white/20">
            <div className="p-4">
              <div className="text-4xl font-black text-orange-400 mb-2">700+</div>
              <div className="text-white/80 font-medium">Government Schemes</div>
            </div>
            <div className="p-4">
              <div className="text-4xl font-black text-emerald-400 mb-2">₹1 Crore+</div>
              <div className="text-white/80 font-medium">in Benefits Unlocked</div>
            </div>
            <div className="p-4">
              <div className="text-4xl font-black text-blue-400 mb-2">10</div>
              <div className="text-white/80 font-medium">Languages Supported</div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How SevaSetu Works</h2>
            <p className="text-gray-600">Three simple steps to unlock your benefits</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 text-center relative">
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 rotate-3">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">1. Answer Questions</h3>
              <p className="text-gray-600">Provide basic details like age, income, and state in our simple wizard.</p>
            </div>
            
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 text-center relative">
              <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-6 -rotate-3">
                <Zap className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">2. AI Matches Schemes</h3>
              <p className="text-gray-600">Our engine instantly cross-references your profile against hundreds of schemes.</p>
            </div>
            
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 text-center relative">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6 rotate-3">
                <Languages className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">3. Apply with Guide</h3>
              <p className="text-gray-600">Get step-by-step application instructions in your preferred language.</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-gray-900 text-white py-12 border-t border-gray-800 mt-auto">
        <div className="container mx-auto px-4 text-center">
          <div className="text-2xl font-black text-white mb-4">SevaSetu</div>
          <p className="text-gray-400 mb-8 max-w-md mx-auto">Bridging the gap between citizens and government benefits through AI.</p>
          <div className="flex justify-center items-center gap-4 text-sm text-gray-500 font-medium">
            <span>Built with AWS</span>
            <span className="w-1.5 h-1.5 rounded-full bg-gray-600"></span>
            <span>Next.js</span>
            <span className="w-1.5 h-1.5 rounded-full bg-gray-600"></span>
            <span>Tailwind</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
