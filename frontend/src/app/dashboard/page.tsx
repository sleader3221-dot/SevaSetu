"use client";

import { useEffect, useState } from "react";
import { UserProfile, SchemeMatch } from "@/lib/types";
import SchemeGrid from "@/components/SchemeGrid";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { findSchemes } from "@/lib/api-client";
import { mapMatchFromAPI, formatCurrency } from "@/lib/utils";

export default function Dashboard() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [matches, setMatches] = useState<SchemeMatch[]>([]);
  const [totalSchemes, setTotalSchemes] = useState(0);
  const [totalValue, setTotalValue] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
          setError("Failed to fetch schemes from the API.");
          setIsLoading(false);
        });
    } catch (e) {
      router.push('/profile');
    }
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <Loader2 className="w-12 h-12 text-primary animate-spin mb-6" />
        <h2 className="text-2xl font-bold text-gray-800 animate-pulse">AI is analyzing your eligibility...</h2>
        <p className="text-gray-500 mt-2">Scanning 700+ government schemes against your profile</p>
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
      <div className="max-w-7xl mx-auto">
        <div className="bg-gradient-to-r from-primary to-orange-500 text-white rounded-2xl p-8 mb-8 shadow-lg">
          <h2 className="text-3xl font-bold">🎉 You're eligible for {totalSchemes} schemes</h2>
          <p className="text-xl mt-2 text-white/90">Worth up to {formatCurrency(totalValue)}/year in benefits</p>
        </div>
        
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">Your Recommended Schemes</h1>
          <p className="text-gray-600 mt-2">Based on your profile, we found these benefits for you.</p>
        </div>
        
        <SchemeGrid matches={matches} isLoading={false} />
      </div>
    </div>
  );
}
