"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Bookmark, CheckCircle2, Clock, FileCheck, ExternalLink, Trash2, 
  ArrowRight, Landmark, AlertCircle 
} from "lucide-react";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";

export interface TrackedScheme {
  id: string;
  name: string;
  ministry: string;
  benefitValue: string;
  status: "Saved" | "In-Progress" | "Submitted" | "Sanctioned";
  savedAt: string;
  notes?: string;
  portalUrl: string;
}

interface ApplicationTrackerProps {
  onSelectScheme?: (id: string) => void;
}

export default function ApplicationTracker({ onSelectScheme }: ApplicationTrackerProps) {
  const [trackedSchemes, setTrackedSchemes] = useState<TrackedScheme[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("tracked_schemes");
    if (saved) {
      try {
        setTrackedSchemes(JSON.parse(saved));
      } catch (e) {
        setTrackedSchemes([]);
      }
    } else {
      // Initialize with default standard active tracked items if none
      const initial: TrackedScheme[] = [
        {
          id: "19",
          name: "PM Vishwakarma Scheme",
          ministry: "Ministry of Micro, Small and Medium Enterprises",
          benefitValue: "₹3,00,000 Loan + ₹15,000 Toolkit",
          status: "In-Progress",
          savedAt: new Date().toLocaleDateString("en-IN"),
          portalUrl: "https://pmvishwakarma.gov.in/",
          notes: "Awaiting artisan verification certificate upload."
        },
        {
          id: "1",
          name: "PM Kisan Samman Nidhi",
          ministry: "Ministry of Agriculture and Farmers Welfare",
          benefitValue: "₹6,000/year",
          status: "Sanctioned",
          savedAt: new Date().toLocaleDateString("en-IN"),
          portalUrl: "https://pmkisan.gov.in/",
          notes: "e-KYC verified successfully. Bank seeded with Aadhaar."
        },
        {
          id: "2",
          name: "Ayushman Bharat PM-JAY",
          ministry: "Ministry of Health and Family Welfare",
          benefitValue: "₹5,00,000/year",
          status: "Submitted",
          savedAt: new Date().toLocaleDateString("en-IN"),
          portalUrl: "https://beneficiary.nha.gov.in/",
          notes: "Golden card e-KYC completed at CSC centre."
        }
      ];
      setTrackedSchemes(initial);
      localStorage.setItem("tracked_schemes", JSON.stringify(initial));
    }
  }, []);

  const updateStatus = (id: string, newStatus: TrackedScheme["status"]) => {
    const updated = trackedSchemes.map((s) => s.id === id ? { ...s, status: newStatus } : s);
    setTrackedSchemes(updated);
    localStorage.setItem("tracked_schemes", JSON.stringify(updated));
  };

  const removeScheme = (id: string) => {
    const updated = trackedSchemes.filter((s) => s.id !== id);
    setTrackedSchemes(updated);
    localStorage.setItem("tracked_schemes", JSON.stringify(updated));
  };

  const getStatusBadge = (status: TrackedScheme["status"]) => {
    switch (status) {
      case "Saved":
        return <Badge variant="outline" className="border-slate-700 text-slate-300 bg-slate-800">Bookmark</Badge>;
      case "In-Progress":
        return <Badge className="bg-amber-500/20 text-amber-300 border border-amber-500/30">Documents In-Progress</Badge>;
      case "Submitted":
        return <Badge className="bg-blue-500/20 text-blue-300 border border-blue-500/30">Application Submitted</Badge>;
      case "Sanctioned":
        return <Badge className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">Benefit Sanctioned</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-900/90 p-6 rounded-3xl border border-slate-800 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 backdrop-blur-xl">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-primary" />
            Citizen Welfare Application Pipeline
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Track and manage your active scheme submissions, documents, and benefit sanction statuses.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-300 bg-slate-950 px-3.5 py-1.5 rounded-xl border border-slate-800">
          <span>Total Tracked: <strong className="text-orange-400">{trackedSchemes.length}</strong></span>
        </div>
      </div>

      {trackedSchemes.length === 0 ? (
        <div className="text-center py-16 bg-slate-900/60 rounded-3xl border border-dashed border-slate-800 p-8">
          <Bookmark className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-300">No applications currently tracked</h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto mt-1 mb-6">
            Bookmark any scheme from your recommended list to monitor your submission readiness and statutory approvals.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {trackedSchemes.map((s) => (
            <Card key={s.id} className="p-6 border border-slate-800 bg-slate-900/90 hover:border-slate-700 shadow-xl rounded-3xl flex flex-col justify-between backdrop-blur-xl">
              <div className="space-y-3.5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-base text-white leading-snug">{s.name}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">{s.ministry}</p>
                  </div>
                  {getStatusBadge(s.status)}
                </div>

                <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="text-slate-400">Statutory Entitlement</span>
                  <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-300 text-sm">{s.benefitValue}</span>
                </div>

                {s.notes && (
                  <div className="text-xs text-orange-200/90 bg-orange-500/10 p-3 rounded-xl border border-orange-500/20">
                    <span className="font-bold text-orange-400">Citizen Note:</span> {s.notes}
                  </div>
                )}

                {/* Status Updater Buttons */}
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
                    Update Application Status
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-xs">
                    {(["Saved", "In-Progress", "Submitted", "Sanctioned"] as const).map((st) => (
                      <button
                        key={st}
                        onClick={() => updateStatus(s.id, st)}
                        className={`py-1.5 px-2 rounded-xl text-[11px] font-semibold border transition-colors cursor-pointer ${
                          s.status === st
                            ? "bg-primary text-white border-primary shadow-sm"
                            : "bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-800 hover:text-white"
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="pt-4 mt-4 border-t border-slate-800 flex items-center justify-between text-xs">
                <Link href={`/scheme/${s.id}`} prefetch={false} className="font-bold text-orange-400 hover:text-orange-300 flex items-center gap-1">
                  View Full Guidance <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <div className="flex items-center gap-3">
                  <a
                    href={s.portalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-400 hover:text-white flex items-center gap-1 font-medium"
                  >
                    Portal <ExternalLink className="w-3 h-3" />
                  </a>
                  <button
                    onClick={() => removeScheme(s.id)}
                    className="text-slate-500 hover:text-red-400 transition-colors p-1 cursor-pointer"
                    title="Remove from tracking"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
