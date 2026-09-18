"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UserProfile } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Check, ChevronRight, ChevronLeft, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import confetti from "canvas-confetti";

const STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana", 
  "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", 
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", 
  "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Andaman and Nicobar Islands", "Chandigarh", 
  "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"
];

const OCCUPATIONS = ["Student", "Farmer", "Self-employed", "Salaried", "Daily Wage", "Unemployed", "Retired"];
const INCOMES = ["Below ₹1L", "₹1-2.5L", "₹2.5-5L", "₹5-8L", "₹8L+"];
const CATEGORIES = ["General", "OBC", "SC", "ST", "EWS"];
const GENDERS = ["Male", "Female", "Other"];
const SPECIAL_CONDITIONS = ["BPL", "Disability", "Widow", "Senior Citizen", "Minority", "None"];

export default function ProfileWizard() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const totalSteps = 7;
  const [profile, setProfile] = useState<Partial<UserProfile>>({ specialConditions: [] });
  const [searchState, setSearchState] = useState("");

  const updateProfile = (key: keyof UserProfile, value: any) => {
    setProfile((prev) => ({ ...prev, [key]: value }));
  };

  const toggleSpecialCondition = (condition: string) => {
    if (condition === "None") {
      updateProfile("specialConditions", ["None"]);
      return;
    }
    const current = profile.specialConditions || [];
    let updated = current.includes(condition)
      ? current.filter((c) => c !== condition)
      : [...current.filter(c => c !== "None"), condition];
    updateProfile("specialConditions", updated);
  };

  const nextStep = () => { if (step < totalSteps) setStep(step + 1); };
  const prevStep = () => { if (step > 1) setStep(step - 1); };

  const submit = () => {
    try {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.5 }
      });
    } catch (e) {}
    localStorage.setItem('userProfile', JSON.stringify(profile));
    router.push('/dashboard');
  };

  const isStepValid = () => {
    switch (step) {
      case 1: return !!profile.age;
      case 2: return !!profile.state;
      case 3: return !!profile.occupation;
      case 4: return !!profile.annualIncome;
      case 5: return !!profile.category;
      case 6: return !!profile.gender;
      case 7: return (profile.specialConditions?.length || 0) > 0;
      default: return true;
    }
  };

  const slideVariants = {
    hidden: { x: 50, opacity: 0 },
    visible: { x: 0, opacity: 1 },
    exit: { x: -50, opacity: 0 }
  };

  const filteredStates = STATES.filter(s => s.toLowerCase().includes(searchState.toLowerCase()));

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="mb-8">
        <Progress value={(step / totalSteps) * 100} className="h-2 mb-2 bg-orange-100 [&>div]:bg-primary" />
        <p className="text-sm text-center text-gray-500 font-medium">Step {step} of {totalSteps}</p>
      </div>

      <div className="min-h-[400px] relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            variants={slideVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.3 }}
            className="w-full"
          >
            {step === 1 && (
              <div className="space-y-6">
                <h2 className="text-3xl font-bold text-center text-secondary">What is your age?</h2>
                <div className="flex flex-col items-center justify-center py-8">
                  <div className="text-6xl font-bold text-primary mb-6">{profile.age || 18}</div>
                  <input 
                    type="range" 
                    min="1" max="100" 
                    value={profile.age || 18} 
                    onChange={(e) => updateProfile("age", parseInt(e.target.value))}
                    className="w-full max-w-md h-2 bg-orange-200 rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <h2 className="text-3xl font-bold text-center text-secondary">Which state do you live in?</h2>
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input 
                    placeholder="Search state..." 
                    className="pl-10 py-6 text-lg rounded-xl border-gray-300"
                    value={searchState}
                    onChange={(e) => setSearchState(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[300px] overflow-y-auto p-1">
                  {filteredStates.map(state => (
                    <Card 
                      key={state}
                      className={`p-4 cursor-pointer transition-all border-2 flex items-center justify-center text-center ${profile.state === state ? 'border-primary bg-orange-50 shadow-md' : 'border-gray-100 hover:border-orange-200 hover:bg-gray-50'}`}
                      onClick={() => updateProfile("state", state)}
                    >
                      <span className={`font-medium ${profile.state === state ? 'text-primary' : 'text-gray-700'}`}>{state}</span>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <h2 className="text-3xl font-bold text-center text-secondary">What is your occupation?</h2>
                <div className="grid grid-cols-2 gap-4">
                  {OCCUPATIONS.map(occ => (
                    <Card 
                      key={occ}
                      className={`p-6 cursor-pointer transition-all border-2 text-center ${profile.occupation === occ ? 'border-primary bg-orange-50 shadow-md' : 'border-gray-100 hover:border-orange-200'}`}
                      onClick={() => updateProfile("occupation", occ)}
                    >
                      <span className={`font-semibold text-lg ${profile.occupation === occ ? 'text-primary' : 'text-gray-700'}`}>{occ}</span>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-6">
                <h2 className="text-3xl font-bold text-center text-secondary">Annual Family Income</h2>
                <p className="text-center text-gray-500 mb-6">This helps us find income-specific schemes for you.</p>
                <div className="flex flex-col gap-3">
                  {INCOMES.map((inc, i) => {
                    const value = i === 0 ? 50000 : i === 1 ? 200000 : i === 2 ? 400000 : i === 3 ? 600000 : 1000000;
                    return (
                      <Card 
                        key={inc}
                        className={`p-5 cursor-pointer transition-all border-2 flex justify-between items-center ${profile.annualIncome === value ? 'border-primary bg-orange-50 shadow-md' : 'border-gray-100 hover:border-orange-200'}`}
                        onClick={() => updateProfile("annualIncome", value)}
                      >
                        <span className={`font-semibold text-lg ${profile.annualIncome === value ? 'text-primary' : 'text-gray-700'}`}>{inc}</span>
                        {profile.annualIncome === value && <Check className="text-primary w-6 h-6" />}
                      </Card>
                    )
                  })}
                </div>
              </div>
            )}

            {step === 5 && (
              <div className="space-y-6">
                <h2 className="text-3xl font-bold text-center text-secondary">Social Category</h2>
                <div className="grid grid-cols-2 gap-4">
                  {CATEGORIES.map(cat => (
                    <Card 
                      key={cat}
                      className={`p-6 cursor-pointer transition-all border-2 text-center ${profile.category === cat ? 'border-primary bg-orange-50 shadow-md' : 'border-gray-100 hover:border-orange-200'}`}
                      onClick={() => updateProfile("category", cat)}
                    >
                      <span className={`font-semibold text-lg ${profile.category === cat ? 'text-primary' : 'text-gray-700'}`}>{cat}</span>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {step === 6 && (
              <div className="space-y-6">
                <h2 className="text-3xl font-bold text-center text-secondary">Gender</h2>
                <div className="flex flex-col gap-4">
                  {GENDERS.map(gen => (
                    <Card 
                      key={gen}
                      className={`p-6 cursor-pointer transition-all border-2 text-center ${profile.gender === gen ? 'border-primary bg-orange-50 shadow-md' : 'border-gray-100 hover:border-orange-200'}`}
                      onClick={() => updateProfile("gender", gen)}
                    >
                      <span className={`font-semibold text-lg ${profile.gender === gen ? 'text-primary' : 'text-gray-700'}`}>{gen}</span>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {step === 7 && (
              <div className="space-y-6">
                <h2 className="text-3xl font-bold text-center text-secondary">Any Special Conditions?</h2>
                <p className="text-center text-gray-500 mb-4">Select all that apply.</p>
                <div className="grid grid-cols-2 gap-4">
                  {SPECIAL_CONDITIONS.map(cond => {
                    const isSelected = (profile.specialConditions || []).includes(cond);
                    return (
                      <Card 
                        key={cond}
                        className={`p-5 cursor-pointer transition-all border-2 flex items-center gap-3 ${isSelected ? 'border-primary bg-orange-50 shadow-md' : 'border-gray-100 hover:border-orange-200'}`}
                        onClick={() => toggleSpecialCondition(cond)}
                      >
                        <div className={`w-6 h-6 rounded-md border flex items-center justify-center ${isSelected ? 'bg-primary border-primary' : 'border-gray-300'}`}>
                          {isSelected && <Check className="w-4 h-4 text-white" />}
                        </div>
                        <span className={`font-semibold ${isSelected ? 'text-primary' : 'text-gray-700'}`}>{cond}</span>
                      </Card>
                    )
                  })}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex justify-between mt-10">
        <Button 
          variant="outline" 
          size="lg"
          onClick={prevStep} 
          disabled={step === 1}
          className="w-32 border-gray-300 text-gray-600 hover:bg-gray-50"
        >
          <ChevronLeft className="w-5 h-5 mr-1" /> Back
        </Button>
        
        {step < totalSteps ? (
          <Button 
            size="lg"
            onClick={nextStep} 
            disabled={!isStepValid()}
            className="w-32 bg-primary hover:bg-orange-600 text-white shadow-md shadow-orange-200"
          >
            Next <ChevronRight className="w-5 h-5 ml-1" />
          </Button>
        ) : (
          <Button 
            size="lg"
            onClick={submit} 
            disabled={!isStepValid()}
            className="w-48 bg-accent hover:bg-emerald-700 text-white shadow-md shadow-emerald-200"
          >
            Find My Schemes 🔍
          </Button>
        )}
      </div>
    </div>
  );
}
