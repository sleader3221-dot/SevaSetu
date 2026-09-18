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
          id: "23",
          name: "Digital India Internship Scheme",
          ministry: "Ministry of Electronics and Information Technology",
          benefitValue: "₹10,000/month",
          status: "In-Progress",
          savedAt: new Date().toLocaleDateString("en-IN"),
          portalUrl: "https://meity.gov.in/",
          notes: "Awaiting college NOC certificate upload."
        },
        {
          id: "17",
          name: "Central Sector Scheme of Scholarships",
          ministry: "Ministry of Education",
          benefitValue: "₹20,000/year",
          status: "Saved",
          savedAt: new Date().toLocaleDateString("en-IN"),
          portalUrl: "https://scholarships.gov.in/",
          notes: "Verification of marksheet required."
        }
      ];
      setTrackedSchemes(initial);
      localStorage.setItem("tracked_schemes", JSON.stringify(initial));
    }
  }, []);

  const updateStatus = (id: string, newStatus: TrackedScheme["status"]) => {
    const updated = trackedSchemes.map(s => s.id === id ? { ...s, status: newStatus } : s);
    setTrackedSchemes(updated);
    localStorage.setItem("tracked_schemes", JSON.stringify(updated));
  };

  const removeScheme = (id: string) => {
    const updated = trackedSchemes.filter(s => s.id !== id);
    setTrackedSchemes(updated);
    localStorage.setItem("tracked_schemes", JSON.stringify(updated));
  };

  const getStatusBadge = (status: TrackedScheme["status"]) => {
    switch (status) {
      case "Saved":
        return <Badge variant="outline" className="border-gray-300 text-gray-700 bg-gray-50">Bookmark</Badge>;
      case "In-Progress":
        return <Badge className="bg-amber-100 text-amber-800 border-amber-300 hover:bg-amber-100">Documents In-Progress</Badge>;
      case "Submitted":
        return <Badge className="bg-blue-100 text-blue-800 border-blue-300 hover:bg-blue-100">Application Submitted</Badge>;
      case "Sanctioned":
        return <Badge className="bg-emerald-100 text-emerald-800 border-emerald-300 hover:bg-emerald-100">Benefit Sanctioned</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-primary" />
            Citizen Welfare Application Pipeline
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Track and manage your active scheme submissions, documents, and benefit sanction statuses.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200">
          <span>Total Tracked: <strong className="text-gray-900">{trackedSchemes.length}</strong></span>
        </div>
      </div>

      {trackedSchemes.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-300 p-8">
          <Bookmark className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-gray-700">No applications currently tracked</h3>
          <p className="text-sm text-gray-500 max-w-md mx-auto mt-1 mb-6">
            Bookmark any scheme from your recommended list to monitor your submission readiness and statutory approvals.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {trackedSchemes.map((s) => (
            <Card key={s.id} className="p-5 border border-gray-200 bg-white hover:border-gray-300 shadow-sm flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-base text-gray-900 leading-snug">{s.name}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">{s.ministry}</p>
                  </div>
                  {getStatusBadge(s.status)}
                </div>

                <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-between text-xs">
                  <span className="text-gray-500">Statutory Entitlement</span>
                  <span className="font-bold text-primary text-sm">{s.benefitValue}</span>
                </div>

                {s.notes && (
                  <div className="text-xs text-gray-600 bg-orange-50/50 p-2.5 rounded-lg border border-orange-100/60">
                    <span className="font-semibold text-gray-700">Citizen Note:</span> {s.notes}
                  </div>
                )}

                {/* Status Updater Buttons */}
                <div>
                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-1.5">
                    Update Application Status
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-xs">
                    {(["Saved", "In-Progress", "Submitted", "Sanctioned"] as const).map((st) => (
                      <button
                        key={st}
                        onClick={() => updateStatus(s.id, st)}
                        className={`py-1 px-2 rounded text-[11px] font-semibold border transition-colors ${
                          s.status === st
                            ? "bg-primary text-white border-primary"
                            : "bg-white text-gray-600 border-gray-200 hover:bg-gray-100"
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="pt-4 mt-4 border-t border-gray-100 flex items-center justify-between text-xs">
                <Link href={`/scheme/${s.id}`} className="font-semibold text-primary hover:underline flex items-center gap-1">
                  View Full Guidance <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <div className="flex items-center gap-3">
                  <a
                    href={s.portalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-500 hover:text-gray-800 flex items-center gap-1 font-medium"
                  >
                    Portal <ExternalLink className="w-3 h-3" />
                  </a>
                  <button
                    onClick={() => removeScheme(s.id)}
                    className="text-gray-400 hover:text-red-600 transition-colors p-1"
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
