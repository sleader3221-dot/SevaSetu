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
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-semibold mb-4">
            <ShieldCheck className="w-4 h-4" /> Powered by Amazon Textract & Amazon S3
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">AI Document Verification Vault</h1>
          <p className="mt-3 text-lg text-gray-600 max-w-2xl mx-auto">
            Upload your Aadhaar, Income, or Caste certificate. Our AWS Textract OCR extracts key details securely and verifies your welfare eligibility automatically.
          </p>
        </div>

        {/* Quick Sample Selector */}
        <div className="mb-6 p-4 bg-white rounded-2xl border border-gray-200/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-sm font-medium text-gray-600">Quick Test (Try a sample without uploading personal files):</span>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={() => loadSampleDocument("income")} className="border-orange-200 hover:bg-orange-50 text-orange-700">
              Sample Income Cert
            </Button>
            <Button variant="outline" size="sm" onClick={() => loadSampleDocument("aadhaar")} className="border-blue-200 hover:bg-blue-50 text-blue-700">
              Sample Aadhaar
            </Button>
            <Button variant="outline" size="sm" onClick={() => loadSampleDocument("caste")} className="border-purple-200 hover:bg-purple-50 text-purple-700">
              Sample Caste Cert
            </Button>
          </div>
        </div>

        {/* Upload Card */}
        <Card className="border-2 border-dashed border-gray-200 shadow-sm hover:border-primary/50 transition-colors bg-white mb-8">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-orange-50 text-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Upload className="w-8 h-8" />
            </div>
            
            <h3 className="text-lg font-bold text-gray-900 mb-1">
              {file ? file.name : "Select or drag & drop a document"}
            </h3>
            <p className="text-sm text-gray-500 mb-6">Supports PDF, PNG, JPG, or TXT documents (Max 10MB)</p>

            <input 
              type="file" 
              id="doc-upload" 
              className="hidden" 
              onChange={handleFileChange}
              accept=".pdf,.png,.jpg,.jpeg,.txt"
            />

            <div className="flex justify-center gap-4">
              <label htmlFor="doc-upload" className="cursor-pointer inline-flex items-center justify-center rounded-md text-sm font-medium border border-gray-300 bg-white hover:bg-gray-50 h-10 px-4 py-2 text-gray-700 shadow-sm transition-colors">
                Choose File
              </label>

              <Button 
                onClick={handleUpload} 
                disabled={!file || isUploading}
                className="bg-primary hover:bg-orange-600 text-white font-semibold"
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
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl mb-8 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Result Card */}
        {result && (
          <Card className="border-emerald-100 shadow-md bg-white overflow-hidden mb-8">
            <CardHeader className="bg-emerald-50/50 border-b border-emerald-100 pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <Badge className="bg-emerald-600 text-white mb-2">
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                    Verified by Amazon Textract
                  </Badge>
                  <CardTitle className="text-2xl font-bold text-gray-900">
                    {result.document_type || "Government Document"}
                  </CardTitle>
                </div>
                <Badge variant="outline" className="bg-white border-emerald-200 text-emerald-800">
                  Status: {result.verification_status}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Document Category</p>
                  <p className="text-lg font-bold text-gray-800">{result.document_type}</p>
                </div>

                {result.detected_income && (
                  <div className="p-4 rounded-xl bg-green-50 border border-green-100">
                    <p className="text-xs font-bold text-green-600 uppercase tracking-wider mb-1">Verified Annual Income</p>
                    <p className="text-lg font-black text-green-700">₹{result.detected_income}</p>
                  </div>
                )}

                {result.detected_dob && (
                  <div className="p-4 rounded-xl bg-blue-50 border border-blue-100">
                    <p className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">Date of Birth</p>
                    <p className="text-lg font-bold text-blue-700">{result.detected_dob}</p>
                  </div>
                )}

                {result.detected_aadhaar && (
                  <div className="p-4 rounded-xl bg-orange-50 border border-orange-100">
                    <p className="text-xs font-bold text-orange-600 uppercase tracking-wider mb-1">Masked Aadhaar Number</p>
                    <p className="text-lg font-mono font-bold text-orange-800">{result.detected_aadhaar}</p>
                  </div>
                )}

                {result.detected_pan && (
                  <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-100">
                    <p className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-1">PAN Card Number</p>
                    <p className="text-lg font-mono font-bold text-indigo-800">{result.detected_pan}</p>
                  </div>
                )}

                <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 sm:col-span-2">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                    <Database className="w-3.5 h-3.5 text-primary" /> AWS S3 Storage Vault Path
                  </p>
                  <p className="text-xs font-mono text-gray-600 truncate">{result.s3_location}</p>
                </div>
              </div>

              {result.raw_text_preview && result.raw_text_preview.length > 0 && (
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                    <FileText className="w-3.5 h-3.5 text-gray-500" /> OCR Text Lines Extracted ({result.total_lines_extracted} lines)
                  </p>
                  <div className="p-4 rounded-xl bg-gray-900 text-gray-200 text-xs font-mono space-y-1">
                    {result.raw_text_preview.map((line: string, i: number) => (
                      <p key={i}>&gt; {line}</p>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="text-sm text-gray-600">
                  ✅ Document verified successfully against official guidelines.
                </div>
                <Link href="/profile">
                  <Button className="bg-primary hover:bg-orange-600 text-white font-bold">
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