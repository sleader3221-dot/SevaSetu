"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Calculator, Sparkles, ArrowRight, ShieldCheck, 
  IndianRupee, Zap, HeartPulse, GraduationCap, Wheat, Landmark 
} from "lucide-react";
import Link from "next/link";
import HoloCard3D from "./HoloCard3D";
import { formatCurrency } from "@/lib/utils";

export default function WelfareSimulator3D() {
  const [income, setIncome] = useState(150000);
  const [age, setAge] = useState(24);
  const [occupation, setOccupation] = useState("Student");
  const [isFarmer, setIsFarmer] = useState(false);
  const [isFemale, setIsFemale] = useState(true);

  // Dynamic simulation computation
  const calculateBenefits = () => {
    let total = 0;
    const schemes: { name: string; value: string; amount: number; icon: string }[] = [];

    // Health cover (Ayushman Bharat if income <= 5L)
    if (income <= 500000) {
      total += 500000;
      schemes.push({ name: "Ayushman Bharat PM-JAY", value: "₹5,00,000/yr Health Cover", amount: 500000, icon: "heart" });
    }

    // Accident & Life Cover (PMSBY / PMJJBY)
    if (age >= 18 && age <= 70) {
      total += 400000;
      schemes.push({ name: "PM Suraksha & Jeevan Jyoti", value: "₹4,00,000 Life & Accident Cover", amount: 400000, icon: "shield" });
    }

    // Student Scholarship
    if (occupation === "Student" && income <= 450000) {
      total += 20000;
      schemes.push({ name: "Central Sector Scholarship", value: "₹20,000/yr Educational Grant", amount: 20000, icon: "grad" });
    }

    // Farmer Benefit (PM Kisan + Crop Insurance)
    if (isFarmer || occupation === "Farmer") {
      total += 6000;
      schemes.push({ name: "PM-KISAN Samman Nidhi", value: "₹6,000/yr Direct Cash Transfer", amount: 6000, icon: "wheat" });
    }

    // Women Empowerment (Mahila Samman / Matru Vandana)
    if (isFemale) {
      total += 10000;
      schemes.push({ name: "Mahila Samman & Matru Vandana", value: "₹10,000 Subsidy & Interest Rebate", amount: 10000, icon: "women" });
    }

    // Housing Subsidy (PMAY if income <= 3L)
    if (income <= 300000) {
      total += 267000;
      schemes.push({ name: "PM Awas Yojana (PMAY)", value: "₹2,67,000 Interest Subsidy", amount: 267000, icon: "home" });
    }

    return { total, schemes };
  };

  const { total, schemes } = calculateBenefits();

  return (
    <div className="w-full max-w-6xl mx-auto my-12">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-50 border border-orange-200 text-primary font-bold text-xs uppercase tracking-wider mb-3">
          <Calculator className="w-3.5 h-3.5" />
          Interactive 3D Benefit Simulator
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
          Calculate Your Direct Statutory Welfare Entitlement
        </h2>
        <p className="text-sm text-gray-600 mt-2 max-w-xl mx-auto">
          Adjust the socioeconomic parameters below to dynamically simulate your family's annual central benefit potential.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Left Interactive Control Console (5 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm flex flex-col justify-between space-y-6">
          <div className="space-y-6">
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-gray-500 border-b border-gray-100 pb-3">
              Parameter Controls
            </h3>

            {/* Income Slider */}
            <div>
              <div className="flex justify-between items-center mb-2 text-xs">
                <span className="font-bold text-gray-700">Annual Household Income:</span>
                <span className="font-mono font-extrabold text-primary text-sm bg-orange-50 px-2.5 py-0.5 rounded-lg border border-orange-200">
                  ₹{income.toLocaleString('en-IN')}
                </span>
              </div>
              <input
                type="range"
                min={50000}
                max={1000000}
                step={25000}
                value={income}
                onChange={(e) => setIncome(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <div className="flex justify-between text-[10px] text-gray-400 mt-1 font-mono">
                <span>₹50K (EWS)</span>
                <span>₹5L</span>
                <span>₹10L+</span>
              </div>
            </div>

            {/* Age Slider */}
            <div>
              <div className="flex justify-between items-center mb-2 text-xs">
                <span className="font-bold text-gray-700">Beneficiary Age:</span>
                <span className="font-mono font-extrabold text-gray-900 text-sm bg-gray-100 px-2.5 py-0.5 rounded-lg">
                  {age} Years
                </span>
              </div>
              <input
                type="range"
                min={18}
                max={80}
                step={1}
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
              />
            </div>

            {/* Occupation Selector */}
            <div>
              <span className="block text-xs font-bold text-gray-700 mb-2">Primary Occupation:</span>
              <div className="grid grid-cols-3 gap-2 text-xs">
                {["Student", "Farmer", "Self-employed", "Salaried", "Daily Wage", "Senior Citizen"].map((occ) => (
                  <button
                    key={occ}
                    onClick={() => {
                      setOccupation(occ);
                      if (occ === "Farmer") setIsFarmer(true);
                    }}
                    className={`py-2 px-2.5 rounded-xl font-semibold border text-center transition-all ${
                      occupation === occ
                        ? "bg-primary text-white border-primary shadow-xs"
                        : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
                    }`}
                  >
                    {occ}
                  </button>
                ))}
              </div>
            </div>

            {/* Gender Toggle */}
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-2xl border border-gray-200">
              <span className="text-xs font-bold text-gray-700">Include Women Empowerment Schemes:</span>
              <button
                onClick={() => setIsFemale(!isFemale)}
                className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
                  isFemale ? "bg-emerald-500" : "bg-gray-300"
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    isFemale ? "translate-x-6" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </div>

          <Link href="/profile" className="block w-full pt-2">
            <Button className="w-full bg-primary hover:bg-orange-600 text-white font-bold h-12 rounded-xl text-sm shadow-md">
              Run Full 7-Step Verified Assessment <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </Link>
        </div>

        {/* Right 3D Holographic Output Card (7 Cols) */}
        <div className="lg:col-span-7">
          <HoloCard3D intensity={12} className="h-full">
            <div className="h-full rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 p-6 sm:p-10 border border-slate-700 shadow-2xl text-white flex flex-col justify-between relative overflow-hidden">
              
              {/* Background ambient radial glow */}
              <div className="absolute -right-20 -top-20 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10 space-y-6">
                {/* Header Badge */}
                <div className="flex items-center justify-between">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-emerald-400 border border-emerald-500/30">
                    <Zap className="w-3.5 h-3.5" />
                    Simulated Entitlement Projection
                  </div>
                  <span className="text-xs text-slate-400 font-mono">
                    {schemes.length} Programs Qualified
                  </span>
                </div>

                {/* Big Currency Figure */}
                <div>
                  <span className="text-xs uppercase tracking-wider text-slate-400 block font-semibold">
                    Total Estimated Annual Welfare Potential
                  </span>
                  <div className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-300 to-emerald-400 tracking-tight mt-1">
                    {formatCurrency(total)}
                    <span className="text-lg text-slate-300 font-normal"> / year</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Direct cash transfers, premium subsidies, and statutory health protection
                  </p>
                </div>

                {/* Schemes Qualified Breakdown */}
                <div className="space-y-2.5 pt-2">
                  <span className="text-[11px] uppercase tracking-wider text-slate-400 block font-semibold">
                    Identified Scheme Breakdown
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {schemes.map((s, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md flex items-center justify-between"
                      >
                        <div>
                          <h5 className="font-bold text-xs text-slate-100">{s.name}</h5>
                          <span className="text-[10px] text-emerald-400 font-semibold">{s.value}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Card Footer */}
              <div className="relative z-10 pt-6 mt-6 border-t border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Verified with Ministry Entitlement Ceilings</span>
                </div>
                <Link href="/profile" className="text-orange-400 hover:text-orange-300 font-bold flex items-center gap-1">
                  Lock in this Benefit Passbook <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

            </div>
          </HoloCard3D>
        </div>

      </div>
    </div>
  );
}
