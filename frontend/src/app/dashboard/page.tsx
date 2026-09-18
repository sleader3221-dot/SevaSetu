"use client";

import { useEffect, useState } from "react";
import { UserProfile, SchemeMatch } from "@/lib/types";
import SchemeGrid from "@/components/SchemeGrid";
import PassbookModal from "@/components/PassbookModal";
import { Loader2, Award, FileText, CheckCircle, ShieldCheck, Sparkles, ArrowRight, UserCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { findSchemes, generatePassbook } from "@/lib/api-client";
import { mapMatchFromAPI, formatCurrency } from "@/lib/utils";
import confetti from "canvas-confetti";
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

          // Trigger celebratory confetti
          try {
            confetti({
              particleCount: 80,
              spread: 70,
              origin: { y: 0.6 }
            });
          } catch (e) {
            // gracefully ignore if canvas context unavailable
          }
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
        <Loader2 className="w-12 h-12 text-primary animate-spin mb-6" />
        <h2 className="text-2xl font-bold text-gray-800 animate-pulse">AI is analyzing your eligibility...</h2>
        <p className="text-gray-500 mt-2">Scanning 30+ official central & state welfare schemes against your profile</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Oops! Something went wrong.</h2>
        <p className="text-gray-600 mb-6">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-orange-600"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Hero Entitlement Banner */}
        <div className="relative overflow-hidden bg-gradient-to-r from-primary via-orange-500 to-amber-500 text-white rounded-3xl p-8 sm:p-10 shadow-2xl">
          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold mb-3">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                AI-Verified Eligibility Report
              </div>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
                🎉 You're eligible for {totalSchemes} government schemes!
              </h2>
              <p className="text-lg sm:text-xl mt-2 text-orange-100 font-medium">
                Unlocking up to <strong className="text-white underline decoration-amber-300 decoration-2">{formatCurrency(totalValue)}/year</strong> in direct benefits and subsidies
              </p>

              {profile && (
                <div className="flex flex-wrap items-center gap-2 mt-4 text-xs">
                  <span className="bg-black/20 px-3 py-1 rounded-full backdrop-blur-sm">
                    📍 {profile.state}
                  </span>
                  <span className="bg-black/20 px-3 py-1 rounded-full backdrop-blur-sm">
                    💼 {profile.occupation}
                  </span>
                  <span className="bg-black/20 px-3 py-1 rounded-full backdrop-blur-sm">
                    🏷️ {profile.category} Category
                  </span>
                  <span className="bg-black/20 px-3 py-1 rounded-full backdrop-blur-sm">
                    💰 ₹{profile.annualIncome.toLocaleString('en-IN')}/yr
                  </span>
                </div>
              )}
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              <Button
                onClick={handleOpenPassbook}
                className="bg-white text-gray-900 hover:bg-orange-50 font-bold shadow-xl flex items-center gap-2 px-6 py-6 text-sm rounded-2xl transition-all hover:scale-105"
              >
                <Award className="w-5 h-5 text-primary" />
                <span>View Citizen Passbook</span>
              </Button>
              
              <Link href="/verify">
                <Button
                  variant="outline"
                  className="w-full bg-white/10 hover:bg-white/20 text-white border-white/30 font-semibold px-5 py-6 text-sm rounded-2xl backdrop-blur-sm"
                >
                  <ShieldCheck className="w-4 h-4 mr-2 text-emerald-300" />
                  Verify with OCR Vault
                </Button>
              </Link>
            </div>
          </div>

          {/* Subtle Decorative Circle */}
          <div className="absolute -right-16 -bottom-16 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
        </div>

        {/* Section Heading */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900">Your Recommended Schemes</h1>
            <p className="text-gray-600 text-sm mt-1">
              Ranked with precision by SevaSetu Multi-Agent AI based on real-time statutory eligibility rules.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Live AWS DynamoDB Scheme Catalog (30 Schemes)
          </div>
        </div>
        
        {/* Scheme Grid with Comparison */}
        <SchemeGrid matches={matches} isLoading={false} />

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
