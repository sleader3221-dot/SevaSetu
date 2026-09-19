"use client";

import { useEffect, useState } from "react";
import { UserProfile, SchemeMatch } from "@/lib/types";
import SchemeGrid from "@/components/SchemeGrid";
import PassbookModal from "@/components/PassbookModal";
import ApplicationTracker from "@/components/ApplicationTracker";
import DocumentReadiness from "@/components/DocumentReadiness";
import HelplineDirectory from "@/components/HelplineDirectory";
import { 
  Loader2, Award, FileText, CheckCircle, ShieldCheck, 
  ArrowRight, Landmark, Layers, PhoneCall, CheckCircle2, Sparkles 
} from "lucide-react";
import { useRouter } from "next/navigation";
import { findSchemes, generatePassbook } from "@/lib/api-client";
import { mapMatchFromAPI, formatCurrency } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [matches, setMatches] = useState<SchemeMatch[]>([]);
  const [totalSchemes, setTotalSchemes] = useState(0);
  const [totalValue, setTotalValue] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Active Tab
  const [activeTab, setActiveTab] = useState<"schemes" | "tracker" | "documents" | "helplines">("schemes");

  // Passbook state
  const [isPassbookOpen, setIsPassbookOpen] = useState(false);
  const [passbookData, setPassbookData] = useState<any>(null);
  const [isPassbookLoading, setIsPassbookLoading] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('userProfile');
    if (!saved) {
      router.push('/profile');
      return;
    }
    
    try {
      const parsed = JSON.parse(saved);
      setProfile(parsed);
      
      findSchemes(parsed)
        .then(res => {
          setMatches(res.matches.map(mapMatchFromAPI));
          setTotalSchemes(res.total_schemes);
          setTotalValue(res.total_annual_value);
          setIsLoading(false);
        })
        .catch(err => {
          console.error(err);
          setError("Failed to fetch schemes from AWS Cloud.");
          setIsLoading(false);
        });
    } catch (e) {
      router.push('/profile');
    }
  }, [router]);

  const handleOpenPassbook = async () => {
    setIsPassbookOpen(true);
    if (!passbookData && profile) {
      setIsPassbookLoading(true);
      try {
        const res = await generatePassbook(profile);
        setPassbookData(res);
      } catch (err) {
        console.error(err);
      } finally {
        setIsPassbookLoading(false);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-slate-100">
        <div className="w-14 h-14 rounded-2xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center mb-4">
          <Loader2 className="w-7 h-7 text-primary animate-spin" />
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-white">Processing Statutory Welfare Assessment...</h2>
        <p className="text-slate-400 text-xs sm:text-sm mt-1">Cross-referencing citizen profile with 30+ central and state scheme guidelines</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-slate-100 p-4">
        <div className="bg-slate-900 p-8 rounded-3xl border border-red-500/30 max-w-md w-full text-center shadow-2xl">
          <h2 className="text-xl font-bold text-red-400 mb-2">Assessment Unavailable</h2>
          <p className="text-slate-400 text-sm mb-6">{error}</p>
          <Button 
            onClick={() => window.location.reload()} 
            className="w-full bg-primary hover:bg-orange-600 text-white rounded-xl h-11 font-bold cursor-pointer"
          >
            Retry Connection
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Ambient Glows */}
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-20 right-1/4 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-8 relative z-10">
        
        {/* Executive Government Header & Summary Card */}
        <div className="bg-slate-900/90 rounded-3xl border border-slate-800 shadow-2xl p-6 sm:p-8 backdrop-blur-xl">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[11px] font-black uppercase tracking-widest text-orange-400 bg-orange-500/10 px-3 py-1 rounded-lg border border-orange-500/30">
                  Government of India • SevaSetu
                </span>
                <span className="text-xs text-slate-600">•</span>
                <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Direct Benefit Verification
                </span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                Statutory Welfare Entitlement Assessment
              </h1>
              <p className="text-sm text-slate-300 mt-1.5 leading-relaxed">
                Verified eligibility across <strong className="text-white">{totalSchemes} welfare programs</strong> with estimated entitlement ceilings of{" "}
                <strong className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-300 to-emerald-400 font-extrabold text-base sm:text-lg">
                  {formatCurrency(totalValue)}/year
                </strong>.
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
              <Button
                onClick={handleOpenPassbook}
                className="bg-primary hover:bg-orange-600 text-white font-bold text-xs h-11 px-5 rounded-xl shadow-lg shadow-orange-500/20 flex items-center gap-2 cursor-pointer"
              >
                <Award className="w-4 h-4 text-white" />
                <span>View Citizen Passbook</span>
              </Button>
              <Link href="/verify" prefetch={false}>
                <Button
                  variant="outline"
                  className="border-slate-700 bg-slate-800/80 text-slate-200 hover:bg-slate-700 hover:text-white text-xs h-11 px-4 rounded-xl flex items-center gap-1.5 cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>OCR Document Vault</span>
                </Button>
              </Link>
            </div>
          </div>

          {/* Citizen Demographics Strip */}
          {profile && (
            <div className="pt-5 flex flex-wrap items-center justify-between gap-4 text-xs">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="text-slate-400 font-bold uppercase tracking-wider text-[11px]">Citizen Profile:</span>
                <span className="bg-slate-800/90 border border-slate-700 text-slate-200 font-semibold px-3 py-1 rounded-xl">
                  State: <strong className="text-white">{profile.state}</strong>
                </span>
                <span className="bg-slate-800/90 border border-slate-700 text-slate-200 font-semibold px-3 py-1 rounded-xl">
                  Occupation: <strong className="text-white">{profile.occupation}</strong>
                </span>
                <span className="bg-slate-800/90 border border-slate-700 text-slate-200 font-semibold px-3 py-1 rounded-xl">
                  Category: <strong className="text-white">{profile.category}</strong>
                </span>
                <span className="bg-slate-800/90 border border-slate-700 text-slate-200 font-semibold px-3 py-1 rounded-xl">
                  Income: <strong className="text-emerald-400">₹{profile.annualIncome ? profile.annualIncome.toLocaleString('en-IN') : 0}/yr</strong>
                </span>
              </div>
              <Link href="/profile" prefetch={false} className="text-orange-400 hover:text-orange-300 hover:underline font-bold text-xs flex items-center gap-1">
                Modify Profile Parameters <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          )}
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-slate-800">
          <nav className="flex space-x-2 sm:space-x-8 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setActiveTab("schemes")}
              className={`py-3.5 px-3 border-b-2 font-bold text-xs sm:text-sm flex items-center gap-2 whitespace-nowrap transition-colors cursor-pointer ${
                activeTab === "schemes"
                  ? "border-primary text-primary"
                  : "border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700"
              }`}
            >
              <Landmark className="w-4 h-4" />
              Recommended Schemes ({totalSchemes})
            </button>
            <button
              onClick={() => setActiveTab("tracker")}
              className={`py-3.5 px-3 border-b-2 font-bold text-xs sm:text-sm flex items-center gap-2 whitespace-nowrap transition-colors cursor-pointer ${
                activeTab === "tracker"
                  ? "border-primary text-primary"
                  : "border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700"
              }`}
            >
              <Layers className="w-4 h-4" />
              Application Pipeline
            </button>
            <button
              onClick={() => setActiveTab("documents")}
              className={`py-3.5 px-3 border-b-2 font-bold text-xs sm:text-sm flex items-center gap-2 whitespace-nowrap transition-colors cursor-pointer ${
                activeTab === "documents"
                  ? "border-primary text-primary"
                  : "border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700"
              }`}
            >
              <FileText className="w-4 h-4" />
              Document Readiness Audit
            </button>
            <button
              onClick={() => setActiveTab("helplines")}
              className={`py-3.5 px-3 border-b-2 font-bold text-xs sm:text-sm flex items-center gap-2 whitespace-nowrap transition-colors cursor-pointer ${
                activeTab === "helplines"
                  ? "border-primary text-primary"
                  : "border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700"
              }`}
            >
              <PhoneCall className="w-4 h-4" />
              Helplines & Grievances
            </button>
          </nav>
        </div>

        {/* Tab Content Display */}
        {activeTab === "schemes" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Showing all government schemes matching verified demographic parameters</span>
              <span className="flex items-center gap-1.5 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Amazon DynamoDB Live Catalog (30 Schemes)
              </span>
            </div>
            <SchemeGrid matches={matches} isLoading={false} />
          </div>
        )}

        {activeTab === "tracker" && (
          <ApplicationTracker />
        )}

        {activeTab === "documents" && (
          <DocumentReadiness />
        )}

        {activeTab === "helplines" && (
          <HelplineDirectory />
        )}

        {/* Citizen Welfare Passbook Modal */}
        <PassbookModal
          isOpen={isPassbookOpen}
          onClose={() => setIsPassbookOpen(false)}
          data={passbookData}
          isLoading={isPassbookLoading}
        />

      </div>
    </div>
  );
}
