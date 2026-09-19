"use client";

import { useState } from "react";
import { SchemeMatch } from "@/lib/types";
import SchemeCard from "./SchemeCard";
import SchemeCompareModal from "./SchemeCompareModal";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Search, Filter, SortDesc, Scale, X, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "./ui/button";

interface SchemeGridProps {
  matches: SchemeMatch[];
  isLoading?: boolean;
}

export default function SchemeGrid({ matches, isLoading = false }: SchemeGridProps) {
  const [filter, setFilter] = useState("All");
  const [sort, setSort] = useState("eligibility");
  const [search, setSearch] = useState("");
  const [selectedCompareIds, setSelectedCompareIds] = useState<string[]>([]);
  const [isCompareOpen, setIsCompareOpen] = useState(false);

  const toggleCompare = (id: string) => {
    setSelectedCompareIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter(x => x !== id);
      } else {
        if (prev.length >= 3) {
          alert("You can compare up to 3 schemes at a time.");
          return prev;
        }
        return [...prev, id];
      }
    });
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-80 bg-slate-900/60 border border-slate-800 rounded-3xl animate-pulse"></div>
        ))}
      </div>
    );
  }

  const categories = ["All", ...Array.from(new Set(matches.map(m => m.scheme.category)))];

  let filtered = matches.filter(m => {
    if (filter !== "All" && m.scheme.category !== filter) return false;
    if (search && !m.scheme.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  filtered.sort((a, b) => {
    if (sort === "eligibility") return b.eligibilityScore - a.eligibilityScore;
    if (sort === "value") {
      const valA = parseInt(a.scheme.benefitValue.replace(/\D/g,'')) || 0;
      const valB = parseInt(b.scheme.benefitValue.replace(/\D/g,'')) || 0;
      return valB - valA;
    }
    return 0; // fallback
  });

  const totalValue = filtered.reduce((acc, match) => {
    const val = parseInt(match.scheme.benefitValue.replace(/\D/g,''));
    return acc + (isNaN(val) ? 0 : val);
  }, 0);

  return (
    <div className="space-y-6">
      {/* Dark Cyber-Bharat Entitlement Banner */}
      <div className="bg-gradient-to-r from-orange-950/40 via-slate-900/90 to-emerald-950/40 p-6 sm:p-7 rounded-3xl border border-slate-800 shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 backdrop-blur-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-4 h-4 text-orange-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-orange-400">Demographic Match Confirmed</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            You qualify for <span className="text-orange-400">{filtered.length} verified schemes</span>
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Total statutory financial potential:{" "}
            <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
              ₹{totalValue.toLocaleString('en-IN')}+ / year
            </span>
          </p>
        </div>

        <div className="px-4 py-2 rounded-2xl bg-slate-800/80 border border-slate-700 text-xs text-slate-300 font-medium">
          Ranked by Statutory Eligibility Algorithm
        </div>
      </div>

      {/* Dark Search & Filter Controls Bar */}
      <div className="flex flex-col sm:flex-row gap-4 bg-slate-900/90 p-4 rounded-2xl border border-slate-800 shadow-xl backdrop-blur-xl">
        <div className="relative flex-grow">
          <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
          <Input 
            placeholder="Search schemes by name or keyword..." 
            className="pl-10 bg-slate-950 border-slate-800 text-white placeholder:text-slate-500 rounded-xl h-11 focus:ring-primary/40"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-3">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <Select value={filter} onValueChange={(val) => val && setFilter(val)}>
              <SelectTrigger className="w-[140px] bg-slate-950 border-slate-800 text-white rounded-xl h-11">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-slate-800 text-white">
                {categories.map(c => <SelectItem key={c} value={c} className="hover:bg-slate-800 cursor-pointer">{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <SortDesc className="w-4 h-4 text-slate-400" />
            <Select value={sort} onValueChange={(val) => val && setSort(val)}>
              <SelectTrigger className="w-[150px] bg-slate-950 border-slate-800 text-white rounded-xl h-11">
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-slate-800 text-white">
                <SelectItem value="eligibility" className="hover:bg-slate-800 cursor-pointer">Eligibility %</SelectItem>
                <SelectItem value="value" className="hover:bg-slate-800 cursor-pointer">Benefit Value</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20 bg-slate-900/60 rounded-3xl border border-dashed border-slate-800 p-8">
          <p className="text-slate-400 text-lg font-medium">No schemes found matching your search criteria.</p>
          <button 
            onClick={() => { setFilter("All"); setSearch(""); }}
            className="mt-4 px-4 py-2 rounded-xl bg-orange-500 text-white font-bold text-xs"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((match) => (
            <SchemeCard
              key={match.scheme.id}
              match={match}
              isSelectedForCompare={selectedCompareIds.includes(match.scheme.id)}
              onToggleCompare={toggleCompare}
            />
          ))}
        </div>
      )}

      {/* Floating Compare Action Bar */}
      {selectedCompareIds.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-slate-900/95 text-white px-5 py-3 rounded-full shadow-2xl border border-slate-700 flex items-center gap-4 backdrop-blur-md animate-in slide-in-from-bottom-5">
          <div className="flex items-center gap-2">
            <Scale className="w-4 h-4 text-primary" />
            <span className="text-xs font-semibold">
              {selectedCompareIds.length} scheme{selectedCompareIds.length > 1 ? "s" : ""} selected for comparison
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              onClick={() => setIsCompareOpen(true)}
              className="bg-primary hover:bg-orange-600 text-white text-xs font-bold px-4 py-1 rounded-full h-8 flex items-center gap-1 cursor-pointer"
            >
              Compare Matrix <ArrowRight className="w-3.5 h-3.5" />
            </Button>
            <button
              onClick={() => setSelectedCompareIds([])}
              className="p-1 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
              title="Clear selection"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Scheme Comparison Modal */}
      <SchemeCompareModal
        isOpen={isCompareOpen}
        onClose={() => setIsCompareOpen(false)}
        matches={matches}
        selectedIds={selectedCompareIds}
        onRemove={toggleCompare}
      />
    </div>
  );
}
