"use client";

import { useState } from "react";
import { uploadDocument } from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Upload, FileCheck, AlertCircle, Loader2, ArrowRight, ShieldCheck, Database, FileText } from "lucide-react";
import Link from "next/link";

export default function VerifyPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setResult(null);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setIsUploading(true);
    setError(null);
    try {
      const res = await uploadDocument(file);
      setResult(res.extracted);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to process document with Amazon Textract.");
    } finally {
      setIsUploading(false);
    }
  };

  const loadSampleDocument = async (sampleType: string) => {
    let content = "";
    let name = "";
    if (sampleType === "income") {
      name = "Income_Certificate_Sample.txt";
      content = `GOVERNMENT OF MAHARASHTRA\nREVENUE DEPARTMENT\nINCOME CERTIFICATE\nCertificate No: IC-MH-2026-987654\nThis is to certify that Shri Rajesh Sharma, resident of Pune.\nAnnual Family Income from all sources: Rs. 1,80,000/- (One Lakh Eighty Thousand Only).\nDate of Birth: 15/08/1998\nDate of Issue: 10/01/2026\nIssued by: Tahsildar Pune`;
    } else if (sampleType === "aadhaar") {
      name = "Aadhaar_Card_Sample.txt";
      content = `GOVERNMENT OF INDIA\nUNIQUE IDENTIFICATION AUTHORITY OF INDIA (UIDAI)\nAadhaar - Common Citizen Identification\nName: Priya Patel\nDOB: 24/04/2001\nGender: Female\nAadhaar Number: 4532 8901 2345\nAddress: Sector 4, Gandhinagar, Gujarat 382010`;
    } else {
      name = "Caste_Certificate_Sample.txt";
      content = `GOVERNMENT OF UTTAR PRADESH\nDEPARTMENT OF SOCIAL WELFARE\nCASTE / COMMUNITY CERTIFICATE\nCertificate No: CC-UP-2026-112233\nThis is to certify that Amit Kumar belongs to Other Backward Class (OBC).\nDate of Issue: 05/02/2026`;
    }

    const sampleFile = new File([content], name, { type: "text/plain" });
    setFile(sampleFile);
    setResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm font-semibold mb-4">
            <ShieldCheck className="w-4 h-4" /> Powered by Amazon Textract & Amazon S3
          </div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight">AI Document Verification Vault</h1>
          <p className="mt-3 text-lg text-slate-400 max-w-2xl mx-auto">
            Upload your Aadhaar, Income, or Caste certificate. Our AWS Textract OCR extracts key details securely and verifies your welfare eligibility automatically.
          </p>
        </div>

        {/* Quick Sample Selector */}
        <div className="mb-6 p-4 bg-slate-900/90 rounded-2xl border border-slate-800 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-sm font-medium text-slate-300">Quick Test (Try a sample without uploading personal files):</span>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={() => loadSampleDocument("income")} className="border-orange-500/30 bg-orange-500/10 text-orange-400 hover:bg-orange-500/20 font-semibold">
              Sample Income Cert
            </Button>
            <Button variant="outline" size="sm" onClick={() => loadSampleDocument("aadhaar")} className="border-blue-500/30 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 font-semibold">
              Sample Aadhaar
            </Button>
            <Button variant="outline" size="sm" onClick={() => loadSampleDocument("caste")} className="border-purple-500/30 bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 font-semibold">
              Sample Caste Cert
            </Button>
          </div>
        </div>

        {/* Upload Card */}
        <Card className="border-2 border-dashed border-slate-800 shadow-2xl hover:border-primary/50 transition-colors bg-slate-900/90 mb-8">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-orange-500/10 text-primary rounded-2xl flex items-center justify-center mx-auto mb-4 border border-orange-500/20">
              <Upload className="w-8 h-8" />
            </div>
            
            <h3 className="text-lg font-bold text-white mb-1">
              {file ? file.name : "Select or drag & drop a document"}
            </h3>
            <p className="text-sm text-slate-400 mb-6">Supports PDF, PNG, JPG, or TXT documents (Max 10MB)</p>

            <input 
              type="file" 
              id="doc-upload" 
              className="hidden" 
              onChange={handleFileChange}
              accept=".pdf,.png,.jpg,.jpeg,.txt"
            />

            <div className="flex justify-center gap-4">
              <label htmlFor="doc-upload" className="cursor-pointer inline-flex items-center justify-center rounded-md text-sm font-medium border border-slate-700 bg-slate-800 hover:bg-slate-700 h-10 px-4 py-2 text-slate-200 shadow-sm transition-colors">
                Choose File
              </label>

              <Button 
                onClick={handleUpload} 
                disabled={!file || isUploading}
                className="bg-primary hover:bg-orange-600 text-white font-semibold shadow-md"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Extracting via Textract...
                  </>
                ) : (
                  <>
                    <FileCheck className="w-4 h-4 mr-2" />
                    Verify with AWS OCR
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl mb-8 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Result Card */}
        {result && (
          <Card className="border-emerald-800/60 shadow-2xl bg-slate-900/90 overflow-hidden mb-8">
            <CardHeader className="bg-slate-950/60 border-b border-slate-800 pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <Badge className="bg-emerald-600 text-white mb-2">
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                    Verified by Amazon Textract
                  </Badge>
                  <CardTitle className="text-2xl font-bold text-white">
                    {result.document_type || "Government Document"}
                  </CardTitle>
                </div>
                <Badge variant="outline" className="bg-slate-800 border-emerald-500/30 text-emerald-400">
                  Status: {result.verification_status}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Document Category</p>
                  <p className="text-lg font-bold text-white">{result.document_type}</p>
                </div>

                {result.detected_income && (
                  <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-800/60">
                    <p className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1">Verified Annual Income</p>
                    <p className="text-lg font-black text-emerald-300">₹{result.detected_income}</p>
                  </div>
                )}

                {result.detected_dob && (
                  <div className="p-4 rounded-xl bg-blue-950/40 border border-blue-800/60">
                    <p className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-1">Date of Birth</p>
                    <p className="text-lg font-bold text-blue-300">{result.detected_dob}</p>
                  </div>
                )}

                {result.detected_aadhaar && (
                  <div className="p-4 rounded-xl bg-orange-950/40 border border-orange-800/60">
                    <p className="text-xs font-bold text-orange-400 uppercase tracking-wider mb-1">Masked Aadhaar Number</p>
                    <p className="text-lg font-mono font-bold text-orange-300">{result.detected_aadhaar}</p>
                  </div>
                )}

                {result.detected_pan && (
                  <div className="p-4 rounded-xl bg-indigo-950/40 border border-indigo-800/60">
                    <p className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-1">PAN Card Number</p>
                    <p className="text-lg font-mono font-bold text-indigo-300">{result.detected_pan}</p>
                  </div>
                )}

                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 sm:col-span-2">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                    <Database className="w-3.5 h-3.5 text-primary" /> AWS S3 Storage Vault Path
                  </p>
                  <p className="text-xs font-mono text-slate-400 truncate">{result.s3_location}</p>
                </div>
              </div>

              {result.raw_text_preview && result.raw_text_preview.length > 0 && (
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                    <FileText className="w-3.5 h-3.5 text-slate-500" /> OCR Text Lines Extracted ({result.total_lines_extracted} lines)
                  </p>
                  <div className="p-4 rounded-xl bg-slate-950 text-slate-300 text-xs font-mono space-y-1 border border-slate-800">
                    {result.raw_text_preview.map((line: string, i: number) => (
                      <p key={i}>&gt; {line}</p>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="text-sm text-emerald-400">
                  ✅ Document verified successfully against official guidelines.
                </div>
                <Link href="/profile" prefetch={false}>
                  <Button className="bg-primary hover:bg-orange-600 text-white font-bold shadow-md">
                    Check Eligible Schemes <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

function CheckCircle2(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>
    </svg>
  );
}