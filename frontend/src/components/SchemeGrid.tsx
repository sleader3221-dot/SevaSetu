"use client";

import { useState } from "react";
import { SchemeMatch } from "@/lib/types";
import SchemeCard from "./SchemeCard";
import SchemeCompareModal from "./SchemeCompareModal";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Search, Filter, SortDesc, Scale, X, ArrowRight } from "lucide-react";
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
          <div key={i} className="h-80 bg-gray-100 rounded-2xl animate-pulse"></div>
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
      <div className="bg-gradient-to-r from-orange-100 to-green-100 p-6 rounded-2xl border border-orange-200/50 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">You are eligible for {filtered.length} schemes</h2>
          <p className="text-gray-600 font-medium mt-1">Potential benefit value: <span className="text-accent font-bold">₹{totalValue.toLocaleString('en-IN')}+</span></p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input 
            placeholder="Search schemes..." 
            className="pl-9 border-gray-200"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <Select value={filter} onValueChange={(val) => val && setFilter(val)}>
              <SelectTrigger className="w-[140px] border-gray-200">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <SortDesc className="w-4 h-4 text-gray-500" />
            <Select value={sort} onValueChange={(val) => val && setSort(val)}>
              <SelectTrigger className="w-[140px] border-gray-200">
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="eligibility">Eligibility %</SelectItem>
                <SelectItem value="value">Benefit Value</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
          <p className="text-gray-500 text-lg">No schemes found matching your criteria.</p>
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
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-gray-900/95 text-white px-5 py-3 rounded-full shadow-2xl border border-gray-700 flex items-center gap-4 backdrop-blur-md animate-in slide-in-from-bottom-5">
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
              className="bg-primary hover:bg-orange-600 text-white text-xs font-bold px-4 py-1 rounded-full h-8 flex items-center gap-1"
            >
              Compare Matrix <ArrowRight className="w-3.5 h-3.5" />
            </Button>
            <button
              onClick={() => setSelectedCompareIds([])}
              className="p-1 rounded-full hover:bg-gray-800 text-gray-400 hover:text-white transition-colors"
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
