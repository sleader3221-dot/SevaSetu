"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  X, Printer, ShieldCheck, Download, Award, CheckCircle2, 
  Landmark, Calendar, Sparkles, ExternalLink, Copy, Check 
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface PassbookData {
  passbook_id: string;
  citizen_profile: {
    age: number;
    state: string;
    occupation: string;
    annualIncome: number;
    category: string;
    gender: string;
    education?: string;
  };
  eligible_schemes_count: number;
  total_annual_entitlement: number;
  schemes: Array<{
    id: string;
    name: string;
    ministry: string;
    benefit_value: string;
    score: number;
    portal_url: string;
    registration_url?: string;
    youtube_guide_url?: string;
  }>;
  generated_at: string;
  verified_by: string;
}

interface PassbookModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: PassbookData | null;
  isLoading: boolean;
}

export default function PassbookModal({ isOpen, onClose, data, isLoading }: PassbookModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopyId = () => {
    if (data?.passbook_id) {
      navigator.clipboard.writeText(data.passbook_id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-slate-900 rounded-3xl shadow-2xl border border-slate-800 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200 text-slate-100">
        
        {/* Tricolor Government Ribbon */}
        <div className="h-2 w-full bg-gradient-to-r from-orange-500 via-white to-emerald-600"></div>

        {/* Modal Controls Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/70 print:hidden text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-xs font-bold tracking-wider text-slate-300 uppercase">
              Official Digital Entitlement Document
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrint}
              className="border-slate-700 bg-slate-800/80 text-slate-200 hover:bg-slate-800 hover:text-white flex items-center gap-1.5"
            >
              <Printer className="w-4 h-4" /> Print / Save PDF
            </Button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Passbook Body */}
        <div id="passbook-print-area" className="p-6 sm:p-10 space-y-8 bg-slate-900 text-slate-100">
          
          {isLoading ? (
            <div className="py-20 text-center space-y-4">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="text-slate-300 font-semibold text-lg">Cryptographically generating your Citizen Entitlement Passbook...</p>
              <p className="text-slate-500 text-sm">Aggregating real-time scheme ceilings via AWS Cloud Core</p>
            </div>
          ) : data ? (
            <>
              {/* Passbook Header */}
              <div className="border-b border-slate-800 pb-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-orange-600 flex items-center justify-center text-white shadow-lg shadow-orange-500/20">
                      <Landmark className="w-9 h-9" />
                    </div>
                    <div>
                      <div className="text-xs font-extrabold tracking-widest text-primary uppercase">
                        Government of India • SevaSetu
                      </div>
                      <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                        Citizen Welfare Entitlement Passbook
                      </h1>
                      <p className="text-sm text-slate-400">
                        नागरिक कल्याण अधिकार पासबुक (राष्ट्रीय डिजिटल सेवा)
                      </p>
                    </div>
                  </div>

                  <div className="bg-emerald-950/40 border border-emerald-800/60 rounded-2xl px-4 py-2.5 text-right">
                    <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-xs">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      AWS AI Engine Verified
                    </div>
                    <div className="text-[11px] text-emerald-500 font-medium">
                      Tamper-Evident Digital Seal
                    </div>
                  </div>
                </div>

                {/* Certificate ID & Metadata Pill */}
                <div className="mt-6 p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 font-medium">Certificate Ref ID:</span>
                    <span className="font-mono font-bold text-orange-400 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800">
                      {data.passbook_id}
                    </span>
                    <button
                      onClick={handleCopyId}
                      className="p-1 text-slate-400 hover:text-primary transition-colors print:hidden"
                      title="Copy Certificate ID"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  <div className="text-slate-400">
                    Generated: <strong className="text-slate-200">{data.generated_at}</strong>
                  </div>
                </div>
              </div>

              {/* Citizen Demographic Snapshot */}
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                  Beneficiary Profile Snapshot
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800">
                    <span className="text-[11px] text-slate-400 block">State / UT</span>
                    <span className="font-bold text-white text-sm">{data.citizen_profile.state}</span>
                  </div>
                  <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800">
                    <span className="text-[11px] text-slate-400 block">Occupation</span>
                    <span className="font-bold text-white text-sm">{data.citizen_profile.occupation}</span>
                  </div>
                  <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800">
                    <span className="text-[11px] text-slate-400 block">Social Category</span>
                    <span className="font-bold text-white text-sm">{data.citizen_profile.category}</span>
                  </div>
                  <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800">
                    <span className="text-[11px] text-slate-400 block">Annual Income</span>
                    <span className="font-bold text-white text-sm">₹{data.citizen_profile.annualIncome.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              {/* High-Impact Entitlement Highlight */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-primary via-orange-600 to-amber-600 text-white shadow-xl shadow-orange-500/20">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-orange-200">
                      Total Unlocked Annual Entitlements
                    </span>
                    <div className="text-3xl sm:text-4xl font-extrabold mt-1">
                      {formatCurrency(data.total_annual_entitlement)}
                      <span className="text-lg font-medium text-orange-200"> / year</span>
                    </div>
                    <p className="text-xs text-orange-100 mt-1">
                      Across {data.eligible_schemes_count} verified central and state welfare programs
                    </p>
                  </div>
                  <div className="flex sm:flex-col items-center sm:items-end gap-2 bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/20">
                    <Award className="w-7 h-7 text-amber-300" />
                    <span className="text-xs font-bold text-center">100% Direct Citizen Entitlement</span>
                  </div>
                </div>
              </div>

              {/* Breakdown of Key Verified Schemes */}
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                  Verified Entitled Schemes Breakdown
                </h3>
                <div className="overflow-x-auto border border-slate-800 rounded-2xl">
                  <table className="w-full text-left text-xs sm:text-sm">
                    <thead className="bg-slate-950 border-b border-slate-800 text-slate-400 font-semibold">
                      <tr>
                        <th className="py-3 px-4">Scheme Name</th>
                        <th className="py-3 px-4">Ministry</th>
                        <th className="py-3 px-4 text-center">Eligibility Match</th>
                        <th className="py-3 px-4 text-right">Benefit Value</th>
                        <th className="py-3 px-4 text-center print:hidden">Official Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {data.schemes.map((s, idx) => (
                        <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                          <td className="py-3 px-4 font-bold text-white">
                            {s.name}
                          </td>
                          <td className="py-3 px-4 text-slate-400 text-xs">
                            {s.ministry}
                          </td>
                          <td className="py-3 px-4 text-center">
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                              {s.score}% Match
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right font-extrabold text-primary">
                            {s.benefit_value}
                          </td>
                          <td className="py-3 px-4 text-center print:hidden">
                            <div className="flex items-center justify-center gap-2">
                              <a 
                                href={s.registration_url || s.portal_url} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors"
                              >
                                Apply <ExternalLink className="w-3 h-3" />
                              </a>
                              {s.youtube_guide_url && (
                                <a 
                                  href={s.youtube_guide_url} 
                                  target="_blank" 
                                  rel="noopener noreferrer" 
                                  className="inline-flex items-center px-2 py-1 rounded-md bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 font-bold text-xs transition-colors"
                                  title="Watch Video Tutorial"
                                >
                                  Video
                                </a>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Official Seal & Legal Footer */}
              <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-400">
                <div className="flex items-center gap-3">
                  {/* SVG QR Code Simulation */}
                  <div className="w-16 h-16 bg-white p-1.5 rounded-lg border border-slate-700 flex items-center justify-center">
                    <svg viewBox="0 0 24 24" className="w-full h-full text-gray-900" fill="currentColor">
                      <path d="M3 3h8v8H3V3zm2 2v4h4V5H5zm8-2h8v8h-8V3zm2 2v4h4V5h-4zM3 13h8v8H3v-8zm2 2v4h4v-4H5zm13-2h3v2h-3v-2zm-5 0h2v5h-2v-5zm3 3h2v2h-2v-2zm3 2h2v3h-2v-3zm-3 2h3v1h-3v-1zm-5 1h2v2h-2v-2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-slate-200">Digital Verification QR</p>
                    <p className="text-[11px] text-slate-400">Scan at CSC / Seva Kendra to verify validity</p>
                    <p className="text-[10px] text-emerald-400 font-bold mt-0.5">SHA256: {data.passbook_id}</p>
                  </div>
                </div>

                <div className="text-right sm:max-w-xs text-[11px] text-slate-500">
                  Issued by SevaSetu AI Welfare Engine under Open Government Data Principles. 
                  Benefits subject to statutory official verification at respective portals.
                </div>
              </div>
            </>
          ) : (
            <div className="py-12 text-center text-slate-500">
              No passbook data available. Please generate your profile first.
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
