"use client";

import { useEffect, useState } from "react";
import { UserProfile, SchemeMatch } from "@/lib/types";
import SchemeGrid from "@/components/SchemeGrid";
import PassbookModal from "@/components/PassbookModal";
import ApplicationTracker from "@/components/ApplicationTracker";
import DocumentReadiness from "@/components/DocumentReadiness";
import HelplineDirectory from "@/components/HelplineDirectory";
import IndiaMapExplorer from "@/components/IndiaMapExplorer";
import { 
  Loader2, Award, FileText, CheckCircle, ShieldCheck, 
  ArrowRight, Landmark, Layers, PhoneCall, CheckCircle2, MapPin 
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
  const [activeTab, setActiveTab] = useState<"schemes" | "tracker" | "documents" | "helplines" | "map">("schemes");

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
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
        <h2 className="text-xl font-bold text-gray-800">Processing Statutory Welfare Assessment...</h2>
        <p className="text-gray-500 text-sm mt-1">Cross-referencing citizen profile with 30+ central and state scheme guidelines</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
        <div className="bg-white p-8 rounded-2xl border border-red-200 max-w-md w-full text-center shadow-sm">
          <h2 className="text-xl font-bold text-red-600 mb-2">Assessment Unavailable</h2>
          <p className="text-gray-600 text-sm mb-6">{error}</p>
          <Button 
            onClick={() => window.location.reload()} 
            className="w-full bg-primary hover:bg-orange-600 text-white"
          >
            Retry Connection
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/70 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Executive Government Header & Summary Card */}
        <div className="bg-white rounded-2xl border border-gray-200/90 shadow-sm p-6 sm:p-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-gray-100">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[11px] font-bold uppercase tracking-widest text-primary bg-orange-50 px-2.5 py-1 rounded border border-orange-200">
                  Government of India • SevaSetu
                </span>
                <span className="text-xs text-gray-400">•</span>
                <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Direct Benefit Verification
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                Statutory Welfare Entitlement Assessment
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Verified eligibility across <strong className="text-gray-900">{totalSchemes} welfare programs</strong> with estimated entitlement ceilings of <strong className="text-primary font-bold">{formatCurrency(totalValue)}/year</strong>.
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
              <Button
                onClick={handleOpenPassbook}
                className="bg-primary hover:bg-orange-600 text-white font-bold text-xs h-11 px-5 rounded-xl shadow-sm flex items-center gap-2"
              >
                <Award className="w-4 h-4 text-white" />
                <span>View Citizen Passbook</span>
              </Button>
              <Link href="/verify">
                <Button
                  variant="outline"
                  className="border-gray-300 text-gray-700 hover:bg-gray-50 text-xs h-11 px-4 rounded-xl flex items-center gap-1.5"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>OCR Document Vault</span>
                </Button>
              </Link>
            </div>
          </div>

          {/* Citizen Demographics Strip */}
          {profile && (
            <div className="pt-5 flex flex-wrap items-center justify-between gap-4 text-xs">
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-gray-400 font-semibold uppercase tracking-wider">Citizen Profile:</span>
                <span className="bg-gray-100 text-gray-800 font-semibold px-2.5 py-1 rounded-md">
                  State: {profile.state}
                </span>
                <span className="bg-gray-100 text-gray-800 font-semibold px-2.5 py-1 rounded-md">
                  Occupation: {profile.occupation}
                </span>
                <span className="bg-gray-100 text-gray-800 font-semibold px-2.5 py-1 rounded-md">
                  Category: {profile.category}
                </span>
                <span className="bg-gray-100 text-gray-800 font-semibold px-2.5 py-1 rounded-md">
                  Income: ₹{profile.annualIncome.toLocaleString('en-IN')}/yr
                </span>
              </div>
              <Link href="/profile" className="text-primary hover:underline font-semibold text-xs">
                Modify Profile Parameters
              </Link>
            </div>
          )}
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-2 sm:space-x-8 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setActiveTab("schemes")}
              className={`py-3 px-3 border-b-2 font-bold text-xs sm:text-sm flex items-center gap-2 whitespace-nowrap transition-colors ${
                activeTab === "schemes"
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <Landmark className="w-4 h-4" />
              Recommended Schemes ({totalSchemes})
            </button>
            <button
              onClick={() => setActiveTab("tracker")}
              className={`py-3 px-3 border-b-2 font-bold text-xs sm:text-sm flex items-center gap-2 whitespace-nowrap transition-colors ${
                activeTab === "tracker"
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <Layers className="w-4 h-4" />
              Application Pipeline
            </button>
            <button
              onClick={() => setActiveTab("documents")}
              className={`py-3 px-3 border-b-2 font-bold text-xs sm:text-sm flex items-center gap-2 whitespace-nowrap transition-colors ${
                activeTab === "documents"
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <FileText className="w-4 h-4" />
              Document Readiness Audit
            </button>
            <button
              onClick={() => setActiveTab("helplines")}
              className={`py-3 px-3 border-b-2 font-bold text-xs sm:text-sm flex items-center gap-2 whitespace-nowrap transition-colors ${
                activeTab === "helplines"
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <PhoneCall className="w-4 h-4" />
              Helplines & Grievances
            </button>
            <button
              onClick={() => setActiveTab("map")}
              className={`py-3 px-3 border-b-2 font-bold text-xs sm:text-sm flex items-center gap-2 whitespace-nowrap transition-colors ${
                activeTab === "map"
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <MapPin className="w-4 h-4" />
              State Explorer
            </button>
          </nav>
        </div>

        {/* Tab Content Display */}
        {activeTab === "schemes" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>Showing all government schemes matching verified demographic parameters</span>
              <span className="flex items-center gap-1.5 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
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

        {activeTab === "map" && (
          <div className="rounded-2xl border border-gray-200 overflow-hidden shadow-sm bg-slate-950">
            <IndiaMapExplorer />
          </div>
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
