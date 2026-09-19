"use client";

import { SchemeMatch } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Check, ArrowRight, ExternalLink, Scale, CheckCircle2 } from "lucide-react";
import { getCategoryColor } from "@/lib/utils";
import Link from "next/link";

interface SchemeCompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  matches: SchemeMatch[];
  selectedIds: string[];
  onRemove: (id: string) => void;
}

export default function SchemeCompareModal({
  isOpen,
  onClose,
  matches,
  selectedIds,
  onRemove,
}: SchemeCompareModalProps) {
  if (!isOpen) return null;

  const selectedMatches = matches.filter(m => selectedIds.includes(m.scheme.id));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-slate-900 rounded-3xl shadow-2xl border border-slate-800 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh] text-slate-100">
        
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-orange-950/40 via-slate-900 to-amber-950/40 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary/20 text-orange-400 flex items-center justify-center border border-orange-500/20">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Side-by-Side Scheme Comparison</h2>
              <p className="text-xs text-slate-400">
                Comparing {selectedMatches.length} welfare schemes side-by-side to help you choose the best benefits
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Comparison Table / Grid */}
        <div className="flex-1 overflow-auto p-6 bg-slate-900">
          {selectedMatches.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              No schemes selected for comparison. Please select 2 or more schemes from the dashboard.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {selectedMatches.map((m) => (
                <div
                  key={m.scheme.id}
                  className="rounded-2xl border border-slate-800 bg-slate-950/80 p-5 flex flex-col justify-between hover:border-slate-700 shadow-xl relative"
                >
                  <button
                    onClick={() => onRemove(m.scheme.id)}
                    className="absolute top-3 right-3 text-slate-400 hover:text-red-400 p-1 rounded-full hover:bg-slate-800 transition-colors"
                    title="Remove from comparison"
                  >
                    <X className="w-4 h-4" />
                  </button>

                  <div className="space-y-4">
                    {/* Header */}
                    <div>
                      <Badge className={getCategoryColor(m.scheme.category)} variant="secondary">
                        {m.scheme.category}
                      </Badge>
                      <h3 className="font-bold text-lg text-white mt-2 leading-snug">
                        {m.scheme.name}
                      </h3>
                      <p className="text-xs text-slate-400">{m.scheme.nameHindi}</p>
                      <p className="text-xs text-slate-500 mt-1 font-medium">{m.scheme.ministry}</p>
                    </div>

                    {/* Eligibility Match */}
                    <div className="p-3 bg-emerald-950/40 rounded-xl border border-emerald-800/60 flex items-center justify-between">
                      <span className="text-xs font-semibold text-emerald-300">Your Eligibility</span>
                      <span className="text-sm font-extrabold text-emerald-400">
                        {m.eligibilityScore}% Match
                      </span>
                    </div>

                    {/* Benefit Value */}
                    <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800">
                      <span className="text-[11px] font-bold text-orange-400 uppercase block mb-0.5">
                        Direct Financial Benefit
                      </span>
                      <span className="text-xl font-black text-primary">
                        {m.scheme.benefitValue}
                      </span>
                      <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                        {m.scheme.benefits}
                      </p>
                    </div>

                    {/* Target Groups */}
                    <div>
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                        Target Beneficiaries
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {m.scheme.targetGroup.map((tg, idx) => (
                          <span
                            key={idx}
                            className="text-[11px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-md font-medium border border-slate-700"
                          >
                            {tg}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Required Documents */}
                    <div>
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                        Required Documents
                      </span>
                      <ul className="text-xs space-y-1 text-slate-300">
                        {m.scheme.requiredDocuments.map((doc, idx) => (
                          <li key={idx} className="flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                            <span>{doc}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Footer Actions */}
                  <div className="pt-5 border-t border-slate-800 mt-5 space-y-2">
                    <Link href={`/scheme/${m.scheme.id}`} prefetch={false} className="block w-full">
                      <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary hover:text-white text-xs font-bold">
                        View Step-by-Step Guide
                        <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                      </Button>
                    </Link>
                    <a
                      href={m.scheme.portalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-1 text-[11px] text-slate-400 hover:text-orange-400 font-medium w-full text-center py-1 transition-colors"
                    >
                      Official Portal <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex justify-end">
          <Button onClick={onClose} variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white">
            Close Comparison
          </Button>
        </div>

      </div>
    </div>
  );
}
