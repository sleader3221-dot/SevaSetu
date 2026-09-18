"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  FileText, CheckCircle2, AlertTriangle, ShieldCheck, 
  ExternalLink, Upload, ArrowRight, HelpCircle 
} from "lucide-react";
import Link from "next/link";

interface DocumentItem {
  id: string;
  name: string;
  authority: string;
  importance: "Mandatory" | "Conditional" | "Supporting";
  purpose: string;
  status: "Ready" | "Missing" | "Verified via OCR";
  officialPortal: string;
  portalName: string;
}

export default function DocumentReadiness() {
  const [documents, setDocuments] = useState<DocumentItem[]>([
    {
      id: "aadhaar",
      name: "Aadhaar Card (UIDAI)",
      authority: "Unique Identification Authority of India",
      importance: "Mandatory",
      purpose: "Universal direct benefit transfer (DBT) and citizen biometric identity verification",
      status: "Ready",
      officialPortal: "https://myaadhaar.uidai.gov.in/",
      portalName: "myAadhaar Portal"
    },
    {
      id: "income",
      name: "Income Certificate / Tehsildar Affidavit",
      authority: "Revenue Department / District Magistrate",
      importance: "Mandatory",
      purpose: "Validating economic ceiling eligibility across scholarships, subsidies, and grants",
      status: "Missing",
      officialPortal: "https://edistrict.delhi.gov.in/",
      portalName: "State e-District Portal"
    },
    {
      id: "bank",
      name: "Bank Passbook / Jan Dhan Account Details",
      authority: "Scheduled Commercial Bank / NPCI",
      importance: "Mandatory",
      purpose: "Direct credit of funds into Aadhaar-seeded bank account under DBT protocols",
      status: "Ready",
      officialPortal: "https://pmjdy.gov.in/",
      portalName: "PM Jan Dhan Yojana"
    },
    {
      id: "caste",
      name: "Caste / Social Category Certificate (OBC/SC/ST/EWS)",
      authority: "Competent District Authority (SDM/Tehsildar)",
      importance: "Conditional",
      purpose: "Access to reserved welfare allotments, fee waivers, and preferential scholarships",
      status: "Missing",
      officialPortal: "https://serviceonline.gov.in/",
      portalName: "ServicePlus India"
    },
    {
      id: "domicile",
      name: "Domicile / State Residence Certificate",
      authority: "State Revenue Department",
      importance: "Conditional",
      purpose: "Verifying state-specific scheme residency quotas and educational concessions",
      status: "Ready",
      officialPortal: "https://serviceonline.gov.in/",
      portalName: "ServicePlus India"
    },
    {
      id: "ration",
      name: "Ration Card (NFSA / BPL / Antyodaya)",
      authority: "Department of Food & Public Distribution",
      importance: "Supporting",
      purpose: "Availing food grains (PMGKAY), LPG subsidy (Ujjwala), and housing priority",
      status: "Missing",
      officialPortal: "https://nfsa.gov.in/",
      portalName: "National Food Security Portal"
    }
  ]);

  const toggleStatus = (id: string) => {
    setDocuments(prev => prev.map(d => {
      if (d.id === id) {
        const nextStatus = d.status === "Ready" ? "Missing" : d.status === "Missing" ? "Verified via OCR" : "Ready";
        return { ...d, status: nextStatus };
      }
      return d;
    }));
  };

  const readyCount = documents.filter(d => d.status === "Ready" || d.status === "Verified via OCR").length;
  const readinessPercent = Math.round((readyCount / documents.length) * 100);

  return (
    <div className="space-y-6">
      {/* Overview Card */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-primary" />
            <h2 className="text-xl font-bold text-gray-900">
              Citizen Document Readiness & Deficiency Audit
            </h2>
          </div>
          <p className="text-sm text-gray-600 mt-1 max-w-2xl">
            Most welfare applications are delayed or rejected due to missing or mismatched documents. 
            Ensure your statutory identity and economic records are ready for 1-click filing.
          </p>
        </div>

        <div className="flex flex-col sm:items-end bg-gray-50 p-4 rounded-xl border border-gray-100 min-w-[200px]">
          <span className="text-xs font-semibold text-gray-500 uppercase">Application Readiness</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-gray-900">{readinessPercent}%</span>
            <span className="text-xs text-gray-500 font-medium">({readyCount}/{documents.length} verified)</span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full mt-2 overflow-hidden">
            <div 
              className={`h-full transition-all duration-500 ${readinessPercent >= 70 ? "bg-emerald-500" : readinessPercent >= 40 ? "bg-amber-500" : "bg-red-500"}`}
              style={{ width: `${readinessPercent}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Action Prompt */}
      <div className="p-4 bg-blue-50/70 border border-blue-100 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-blue-900">
          <HelpCircle className="w-4 h-4 text-blue-600 flex-shrink-0" />
          <span>
            Need automated document validation? Test your certificates against Amazon Textract OCR in our live verification vault.
          </span>
        </div>
        <Link href="/verify">
          <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-xs">
            Open OCR Vault <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Button>
        </Link>
      </div>

      {/* Document Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {documents.map((doc) => (
          <Card key={doc.id} className="p-5 border border-gray-200 bg-white hover:border-gray-300 transition-all flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-bold text-sm text-gray-900 leading-snug">{doc.name}</h3>
                  <p className="text-[11px] text-gray-500">{doc.authority}</p>
                </div>
                <Badge
                  variant="outline"
                  className={`text-[10px] uppercase font-bold tracking-wider ${
                    doc.importance === "Mandatory" 
                      ? "border-red-200 bg-red-50 text-red-700" 
                      : doc.importance === "Conditional"
                      ? "border-amber-200 bg-amber-50 text-amber-700"
                      : "border-gray-200 bg-gray-50 text-gray-600"
                  }`}
                >
                  {doc.importance}
                </Badge>
              </div>

              <p className="text-xs text-gray-600 leading-relaxed bg-gray-50/80 p-2.5 rounded-lg border border-gray-100">
                {doc.purpose}
              </p>

              {/* Status Switcher */}
              <div className="flex items-center justify-between pt-1">
                <span className="text-xs text-gray-500">Citizen Readiness:</span>
                <button
                  onClick={() => toggleStatus(doc.id)}
                  className={`px-3 py-1 rounded-full text-xs font-bold border transition-colors flex items-center gap-1.5 ${
                    doc.status === "Verified via OCR"
                      ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                      : doc.status === "Ready"
                      ? "bg-blue-50 text-blue-800 border-blue-200"
                      : "bg-red-50 text-red-700 border-red-200"
                  }`}
                  title="Click to cycle status"
                >
                  {doc.status === "Verified via OCR" ? (
                    <>
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      Verified via OCR
                    </>
                  ) : doc.status === "Ready" ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                      Document Ready
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
                      Missing / Required
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Official Portal Link */}
            <div className="pt-3 mt-3 border-t border-gray-100 flex items-center justify-between text-[11px]">
              <span className="text-gray-400">Official Issuance:</span>
              <a
                href={doc.officialPortal}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-primary hover:underline flex items-center gap-1"
              >
                {doc.portalName} <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </Card>
        ))}
      </div>

      {/* DigiLocker Callout */}
      <div className="p-4 rounded-2xl bg-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center font-bold text-lg text-primary">
            DL
          </div>
          <div>
            <h4 className="font-bold text-sm">Need to fetch your verified government certificates?</h4>
            <p className="text-xs text-slate-300">
              Access your Aadhaar, Class 10/12 marksheets, and caste certificates via national DigiLocker.
            </p>
          </div>
        </div>
        <a
          href="https://www.digilocker.gov.in"
          target="_blank"
          rel="noopener noreferrer"
          className="whitespace-nowrap"
        >
          <Button size="sm" className="bg-primary hover:bg-orange-600 text-white text-xs font-bold px-4">
            Open DigiLocker <ExternalLink className="w-3 h-3 ml-1.5" />
          </Button>
        </a>
      </div>
    </div>
  );
}
