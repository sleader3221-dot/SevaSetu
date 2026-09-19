"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  PhoneCall, ShieldAlert, ExternalLink, Building2, HelpCircle, 
  MessageSquareWarning, CheckCircle2, Clock 
} from "lucide-react";

interface HelplineItem {
  name: string;
  scheme: string;
  number: string;
  timings: string;
  category: string;
  officialLink: string;
  isTollFree: boolean;
}

export default function HelplineDirectory() {
  const helplines: HelplineItem[] = [
    {
      name: "Ayushman Bharat PM-JAY Call Centre",
      scheme: "Ayushman Bharat Pradhan Mantri Jan Arogya Yojana",
      number: "14555",
      timings: "24x7 (Toll-Free All India)",
      category: "Healthcare",
      officialLink: "https://pmjay.gov.in/",
      isTollFree: true
    },
    {
      name: "PM-KISAN Samman Nidhi Helpline",
      scheme: "Pradhan Mantri Kisan Samman Nidhi",
      number: "155261 / 011-24300606",
      timings: "09:30 AM - 06:00 PM (Mon-Sat)",
      category: "Agriculture",
      officialLink: "https://pmkisan.gov.in/",
      isTollFree: true
    },
    {
      name: "Kisan Call Centre (KCC)",
      scheme: "Ministry of Agriculture & Farmers Welfare",
      number: "1800-180-1551",
      timings: "06:00 AM - 10:00 PM (All 7 Days)",
      category: "Agriculture",
      officialLink: "https://daccfw.gov.in/",
      isTollFree: true
    },
    {
      name: "National Scholarship Portal Helpdesk",
      scheme: "Ministry of Electronics & Information Technology",
      number: "0120-6619540",
      timings: "08:00 AM - 08:00 PM (Mon-Fri)",
      category: "Education",
      officialLink: "https://scholarships.gov.in/",
      isTollFree: false
    },
    {
      name: "National Consumer Helpline (NCH)",
      scheme: "Department of Consumer Affairs",
      number: "1915 / 1800-11-4000",
      timings: "08:00 AM - 08:00 PM (All 7 Days)",
      category: "Consumer Rights",
      officialLink: "https://consumerhelpline.gov.in/",
      isTollFree: true
    },
    {
      name: "Women Helpline (All India)",
      scheme: "Ministry of Women & Child Development",
      number: "181 / 1091",
      timings: "24x7 Emergency Services",
      category: "Women Welfare",
      officialLink: "https://wcd.nic.in/",
      isTollFree: true
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900/90 p-6 rounded-2xl border border-slate-800 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 backdrop-blur-sm">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <PhoneCall className="w-5 h-5 text-primary" />
            National Citizen Welfare Helplines & Grievance Redressal
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Direct government contact numbers, toll-free portals, and official CPGRAMS dispute resolution channels.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/30">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Verified Government Channels</span>
        </div>
      </div>

      {/* CPGRAMS Hero Callout */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white p-6 rounded-2xl shadow-xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-orange-300">
            <MessageSquareWarning className="w-3.5 h-3.5 text-orange-400" />
            Statutory Public Grievance Portal
          </div>
          <h3 className="text-lg font-bold">
            CPGRAMS (Centralized Public Grievance Redress and Monitoring System)
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            If your sanctioned welfare benefits, scholarship disbursal, or subsidy has been unjustly denied, delayed, or subject to malfeasance, you can lodge an official government grievance directly monitored by the Prime Minister's Office (PMO).
          </p>
        </div>
        <a
          href="https://pgportal.gov.in/"
          target="_blank"
          rel="noopener noreferrer"
          className="whitespace-nowrap"
        >
          <Button className="bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs px-5 py-5 rounded-xl shadow-lg shadow-orange-500/20">
            Lodge Grievance on CPGRAMS <ExternalLink className="w-3.5 h-3.5 ml-2" />
          </Button>
        </a>
      </div>

      {/* Helplines Directory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {helplines.map((hl, idx) => (
          <Card key={idx} className="p-5 border border-slate-800 bg-slate-900/90 hover:border-slate-700 transition-all flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <Badge variant="secondary" className="text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                  {hl.category}
                </Badge>
                {hl.isTollFree && (
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                    Toll-Free
                  </span>
                )}
              </div>

              <div>
                <h4 className="font-bold text-sm text-white leading-snug">{hl.name}</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">{hl.scheme}</p>
              </div>

              {/* Number Pill */}
              <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-400">Call:</span>
                <span className="font-mono font-bold text-base text-orange-400 tracking-wide">{hl.number}</span>
              </div>

              <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                <Clock className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                <span>{hl.timings}</span>
              </div>
            </div>

            <div className="pt-3 mt-3 border-t border-slate-800 flex justify-end">
              <a
                href={hl.officialLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-semibold text-primary hover:text-orange-400 hover:underline flex items-center gap-1"
              >
                Official Portal <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
