"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { UserProfile } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  Check, ChevronRight, ChevronLeft, Search, MapPin, 
  Sparkles, Landmark, Building2, User, Wallet, Users, 
  ShieldCheck, ArrowRight, RefreshCw 
} from "lucide-react";
import { useRouter } from "next/navigation";

// Dynamically import @react-map/india with SSR disabled
const India = dynamic(() => import("@react-map/india"), { 
  ssr: false,
  loading: () => (
    <div className="w-full h-[380px] flex flex-col items-center justify-center text-slate-400 gap-3">
      <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      <span className="text-xs font-semibold uppercase tracking-wider">Loading Interactive India Map...</span>
    </div>
  )
});

// Comprehensive Registry of State Iconic Landmarks & Atmospheric Backgrounds
interface StateLandmark {
  name: string;
  hindi: string;
  landmark: string;
  landmarkHindi: string;
  landmarkCity: string;
  bgUrl: string;
  themeGradient: string;
}

const STATE_LANDMARKS: Record<string, StateLandmark> = {
  "Maharashtra": {
    name: "Maharashtra",
    hindi: "महाराष्ट्र",
    landmark: "Gateway of India",
    landmarkHindi: "गेटवे ऑफ इंडिया",
    landmarkCity: "Mumbai",
    bgUrl: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?q=80&w=1600&auto=format&fit=crop",
    themeGradient: "from-orange-950/90 via-slate-950/85 to-black/95"
  },
  "Delhi": {
    name: "Delhi",
    hindi: "दिल्ली",
    landmark: "India Gate & Rashtrapati Bhavan",
    landmarkHindi: "इंडिया गेट",
    landmarkCity: "New Delhi",
    bgUrl: "https://images.unsplash.com/photo-1587474260584-136574528ed5?q=80&w=1600&auto=format&fit=crop",
    themeGradient: "from-amber-950/90 via-slate-950/85 to-black/95"
  },
  "Uttar Pradesh": {
    name: "Uttar Pradesh",
    hindi: "उत्तर प्रदेश",
    landmark: "Kashi Vishwanath Ghats & Taj Mahal",
    landmarkHindi: "काशी विश्वनाथ घाट",
    landmarkCity: "Varanasi",
    bgUrl: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?q=80&w=1600&auto=format&fit=crop",
    themeGradient: "from-orange-950/90 via-slate-950/85 to-black/95"
  },
  "Gujarat": {
    name: "Gujarat",
    hindi: "गुजरात",
    landmark: "Statue of Unity & Sabarmati",
    landmarkHindi: "स्टैच्यू ऑफ यूनिटी",
    landmarkCity: "Kevadia",
    bgUrl: "https://images.unsplash.com/photo-1609743522653-52354461cf27?q=80&w=1600&auto=format&fit=crop",
    themeGradient: "from-emerald-950/90 via-slate-950/85 to-black/95"
  },
  "Rajasthan": {
    name: "Rajasthan",
    hindi: "राजस्थान",
    landmark: "Hawa Mahal & Amer Fort",
    landmarkHindi: "हवा महल",
    landmarkCity: "Jaipur",
    bgUrl: "https://images.unsplash.com/photo-1599661046289-e31897846e41?q=80&w=1600&auto=format&fit=crop",
    themeGradient: "from-rose-950/90 via-slate-950/85 to-black/95"
  },
  "Karnataka": {
    name: "Karnataka",
    hindi: "कर्नाटक",
    landmark: "Vidhana Soudha & Mysore Palace",
    landmarkHindi: "विधान सौध",
    landmarkCity: "Bengaluru",
    bgUrl: "https://images.unsplash.com/photo-1600100397608-f010f445b9b4?q=80&w=1600&auto=format&fit=crop",
    themeGradient: "from-indigo-950/90 via-slate-950/85 to-black/95"
  },
  "Tamil Nadu": {
    name: "Tamil Nadu",
    hindi: "तमिलनाडु",
    landmark: "Meenakshi Amman Temple",
    landmarkHindi: "मीनाक्षी अम्मन मंदिर",
    landmarkCity: "Madurai",
    bgUrl: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=1600&auto=format&fit=crop",
    themeGradient: "from-amber-950/90 via-slate-950/85 to-black/95"
  },
  "West Bengal": {
    name: "West Bengal",
    hindi: "पश्चिम बंगाल",
    landmark: "Howrah Bridge & Victoria Memorial",
    landmarkHindi: "हावड़ा ब्रिज",
    landmarkCity: "Kolkata",
    bgUrl: "https://images.unsplash.com/photo-1558431382-27e303142255?q=80&w=1600&auto=format&fit=crop",
    themeGradient: "from-cyan-950/90 via-slate-950/85 to-black/95"
  },
  "Punjab": {
    name: "Punjab",
    hindi: "पंजाब",
    landmark: "Sri Harmandir Sahib (Golden Temple)",
    landmarkHindi: "स्वर्ण मंदिर",
    landmarkCity: "Amritsar",
    bgUrl: "https://images.unsplash.com/photo-1588096344356-9b5a882a201c?q=80&w=1600&auto=format&fit=crop",
    themeGradient: "from-yellow-950/90 via-slate-950/85 to-black/95"
  },
  "Kerala": {
    name: "Kerala",
    hindi: "केरल",
    landmark: "Alleppey Backwaters & Munnar Peaks",
    landmarkHindi: "अलेप्पी बैकवाटर्स",
    landmarkCity: "Alappuzha",
    bgUrl: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=1600&auto=format&fit=crop",
    themeGradient: "from-emerald-950/90 via-slate-950/85 to-black/95"
  },
  "Madhya Pradesh": {
    name: "Madhya Pradesh",
    hindi: "मध्य प्रदेश",
    landmark: "Great Stupa of Sanchi & Khajuraho",
    landmarkHindi: "सांची स्तूप",
    landmarkCity: "Sanchi",
    bgUrl: "https://images.unsplash.com/photo-1628172909886-f6d2f928f6f5?q=80&w=1600&auto=format&fit=crop",
    themeGradient: "from-orange-950/90 via-slate-950/85 to-black/95"
  },
  "Bihar": {
    name: "Bihar",
    hindi: "बिहार",
    landmark: "Nalanda Mahavihara & Mahabodhi Temple",
    landmarkHindi: "नालंदा महाविहार",
    landmarkCity: "Nalanda",
    bgUrl: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=1600&auto=format&fit=crop",
    themeGradient: "from-amber-950/90 via-slate-950/85 to-black/95"
  },
  "Telangana": {
    name: "Telangana",
    hindi: "तेलंगाना",
    landmark: "Charminar & Golconda Fort",
    landmarkHindi: "चारमीनार",
    landmarkCity: "Hyderabad",
    bgUrl: "https://images.unsplash.com/photo-1605647540924-852290f6b0d5?q=80&w=1600&auto=format&fit=crop",
    themeGradient: "from-purple-950/90 via-slate-950/85 to-black/95"
  },
  "Andhra Pradesh": {
    name: "Andhra Pradesh",
    hindi: "आंध्र प्रदेश",
    landmark: "Tirumala Venkateswara Temple",
    landmarkHindi: "तिरुपति बालाजी",
    landmarkCity: "Tirupati",
    bgUrl: "https://images.unsplash.com/photo-1627894483216-2138af692e32?q=80&w=1600&auto=format&fit=crop",
    themeGradient: "from-yellow-950/90 via-slate-950/85 to-black/95"
  },
  "Odisha": {
    name: "Odisha",
    hindi: "ओडिशा",
    landmark: "Konark Sun Temple & Puri Jagannath",
    landmarkHindi: "कोणार्क सूर्य मंदिर",
    landmarkCity: "Konark",
    bgUrl: "https://images.unsplash.com/photo-1609137144813-7d9921338f24?q=80&w=1600&auto=format&fit=crop",
    themeGradient: "from-blue-950/90 via-slate-950/85 to-black/95"
  },
  "Assam": {
    name: "Assam",
    hindi: "असम",
    landmark: "Kaziranga National Park & Brahmaputra",
    landmarkHindi: "काजीरंगा",
    landmarkCity: "Guwahati",
    bgUrl: "https://images.unsplash.com/photo-1620025219213-909244081c74?q=80&w=1600&auto=format&fit=crop",
    themeGradient: "from-emerald-950/90 via-slate-950/85 to-black/95"
  },
  "Himachal Pradesh": {
    name: "Himachal Pradesh",
    hindi: "हिमाचल प्रदेश",
    landmark: "Rohtang Pass & Himalayan Snowfields",
    landmarkHindi: "रोहतांग दर्रा",
    landmarkCity: "Manali",
    bgUrl: "https://images.unsplash.com/photo-1579618218290-24a26f6345e8?q=80&w=1600&auto=format&fit=crop",
    themeGradient: "from-sky-950/90 via-slate-950/85 to-black/95"
  },
  "Uttarakhand": {
    name: "Uttarakhand",
    hindi: "उत्तराखण्ड",
    landmark: "Kedarnath Temple & Rishikesh Ghats",
    landmarkHindi: "केदारनाथ मंदिर",
    landmarkCity: "Kedarnath",
    bgUrl: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?q=80&w=1600&auto=format&fit=crop",
    themeGradient: "from-blue-950/90 via-slate-950/85 to-black/95"
  },
  "Jammu and Kashmir": {
    name: "Jammu and Kashmir",
    hindi: "जम्मू और कश्मीर",
    landmark: "Dal Lake Shikaras & Gulmarg",
    landmarkHindi: "डल झील",
    landmarkCity: "Srinagar",
    bgUrl: "https://images.unsplash.com/photo-1595815771614-ade9d652a65d?q=80&w=1600&auto=format&fit=crop",
    themeGradient: "from-cyan-950/90 via-slate-950/85 to-black/95"
  },
  "Goa": {
    name: "Goa",
    hindi: "गोवा",
    landmark: "Basilica of Bom Jesus & Coastal Heritage",
    landmarkHindi: "बेसिलिका ऑफ बॉम जीसस",
    landmarkCity: "Old Goa",
    bgUrl: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=1600&auto=format&fit=crop",
    themeGradient: "from-teal-950/90 via-slate-950/85 to-black/95"
  },
  "Haryana": {
    name: "Haryana",
    hindi: "हरियाणा",
    landmark: "Brahma Sarovar & Kurukshetra Heritage",
    landmarkHindi: "ब्रह्म सरोवर",
    landmarkCity: "Kurukshetra",
    bgUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1600&auto=format&fit=crop",
    themeGradient: "from-orange-950/90 via-slate-950/85 to-black/95"
  },
  "Jharkhand": {
    name: "Jharkhand",
    hindi: "झारखंड",
    landmark: "Parasnath Temple & Hundru Falls",
    landmarkHindi: "पारसनाथ मंदिर",
    landmarkCity: "Ranchi",
    bgUrl: "https://images.unsplash.com/photo-1609137144813-7d9921338f24?q=80&w=1600&auto=format&fit=crop",
    themeGradient: "from-emerald-950/90 via-slate-950/85 to-black/95"
  },
  "Chhattisgarh": {
    name: "Chhattisgarh",
    hindi: "छत्तीसगढ़",
    landmark: "Chitrakote Waterfalls & Bastar Heritage",
    landmarkHindi: "चित्रकूट जलप्रपात",
    landmarkCity: "Bastar",
    bgUrl: "https://images.unsplash.com/photo-1620025219213-909244081c74?q=80&w=1600&auto=format&fit=crop",
    themeGradient: "from-emerald-950/90 via-slate-950/85 to-black/95"
  },
  "Ladakh": {
    name: "Ladakh",
    hindi: "लद्दाख",
    landmark: "Pangong Tso Lake & Thiksey Monastery",
    landmarkHindi: "पैंगोंग त्सो",
    landmarkCity: "Leh",
    bgUrl: "https://images.unsplash.com/photo-1595815771614-ade9d652a65d?q=80&w=1600&auto=format&fit=crop",
    themeGradient: "from-blue-950/90 via-slate-950/85 to-black/95"
  },
  "Sikkim": {
    name: "Sikkim",
    hindi: "सिक्किम",
    landmark: "Rumtek Monastery & Kanchenjunga",
    landmarkHindi: "रुमटेक मठ",
    landmarkCity: "Gangtok",
    bgUrl: "https://images.unsplash.com/photo-1579618218290-24a26f6345e8?q=80&w=1600&auto=format&fit=crop",
    themeGradient: "from-teal-950/90 via-slate-950/85 to-black/95"
  },
  "Meghalaya": {
    name: "Meghalaya",
    hindi: "मेघालय",
    landmark: "Double Decker Living Root Bridges",
    landmarkHindi: "जीवित जड़ पुल",
    landmarkCity: "Cherrapunji",
    bgUrl: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=1600&auto=format&fit=crop",
    themeGradient: "from-emerald-950/90 via-slate-950/85 to-black/95"
  },
  "Manipur": {
    name: "Manipur",
    hindi: "मणिपुर",
    landmark: "Loktak Floating Lake & Kangla Fort",
    landmarkHindi: "लोकटक झील",
    landmarkCity: "Imphal",
    bgUrl: "https://images.unsplash.com/photo-1620025219213-909244081c74?q=80&w=1600&auto=format&fit=crop",
    themeGradient: "from-blue-950/90 via-slate-950/85 to-black/95"
  },
  "Tripura": {
    name: "Tripura",
    hindi: "त्रिपुरा",
    landmark: "Ujjayanta Palace & Neermahal",
    landmarkHindi: "उज्जयंत पैलेस",
    landmarkCity: "Agartala",
    bgUrl: "https://images.unsplash.com/photo-1600100397608-f010f445b9b4?q=80&w=1600&auto=format&fit=crop",
    themeGradient: "from-amber-950/90 via-slate-950/85 to-black/95"
  },
  "Mizoram": {
    name: "Mizoram",
    hindi: "मिज़ोरम",
    landmark: "Vantawng Falls & Blue Mountains",
    landmarkHindi: "वानतावांग जलप्रपात",
    landmarkCity: "Aizawl",
    bgUrl: "https://images.unsplash.com/photo-1620025219213-909244081c74?q=80&w=1600&auto=format&fit=crop",
    themeGradient: "from-emerald-950/90 via-slate-950/85 to-black/95"
  },
  "Nagaland": {
    name: "Nagaland",
    hindi: "नागालैंड",
    landmark: "Dzukou Valley & Hornbill Heritage",
    landmarkHindi: "द्ज़ुको घाटी",
    landmarkCity: "Kohima",
    bgUrl: "https://images.unsplash.com/photo-1579618218290-24a26f6345e8?q=80&w=1600&auto=format&fit=crop",
    themeGradient: "from-green-950/90 via-slate-950/85 to-black/95"
  },
  "Arunachal Pradesh": {
    name: "Arunachal Pradesh",
    hindi: "अरुणाचल प्रदेश",
    landmark: "Tawang Monastery & Sela Pass",
    landmarkHindi: "तवांग मठ",
    landmarkCity: "Tawang",
    bgUrl: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?q=80&w=1600&auto=format&fit=crop",
    themeGradient: "from-sky-950/90 via-slate-950/85 to-black/95"
  },
  "Chandigarh": {
    name: "Chandigarh",
    hindi: "चंडीगढ़",
    landmark: "Rock Garden & Capitol Complex",
    landmarkHindi: "रॉक गार्डन",
    landmarkCity: "Chandigarh",
    bgUrl: "https://images.unsplash.com/photo-1588096344356-9b5a882a201c?q=80&w=1600&auto=format&fit=crop",
    themeGradient: "from-orange-950/90 via-slate-950/85 to-black/95"
  },
  "Puducherry": {
    name: "Puducherry",
    hindi: "पुडुचेरी",
    landmark: "Promenade & Auroville Matrimandir",
    landmarkHindi: "मातृमंदिर",
    landmarkCity: "Pondicherry",
    bgUrl: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=1600&auto=format&fit=crop",
    themeGradient: "from-yellow-950/90 via-slate-950/85 to-black/95"
  },
  "Andaman and Nicobar Islands": {
    name: "Andaman and Nicobar Islands",
    hindi: "अंडमान और निकोबार",
    landmark: "Cellular Jail & Radhanagar Beach",
    landmarkHindi: "सेलुलर जेल",
    landmarkCity: "Port Blair",
    bgUrl: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=1600&auto=format&fit=crop",
    themeGradient: "from-cyan-950/90 via-slate-950/85 to-black/95"
  }
};

const DEFAULT_LANDMARK: StateLandmark = {
  name: "National Capital Territory",
  hindi: "भारत",
  landmark: "India Gate & Rashtrapati Bhavan",
  landmarkHindi: "इंडिया गेट एवं राष्ट्रपति भवन",
  landmarkCity: "New Delhi",
  bgUrl: "https://images.unsplash.com/photo-1587474260584-136574528ed5?q=80&w=1920&auto=format&fit=crop",
  themeGradient: "from-amber-950/90 via-slate-950/85 to-black/95"
};

const POPULAR_STATES = [
  "Maharashtra", "Uttar Pradesh", "Gujarat", "Karnataka", 
  "Tamil Nadu", "Rajasthan", "West Bengal", "Madhya Pradesh", 
  "Bihar", "Delhi", "Kerala", "Punjab"
];

const OCCUPATIONS = [
  "Farmer", "Student", "Self-Employed", "Salaried Employee", 
  "Street Vendor", "Artisan / Craftsman", "Unemployed", "Retired Senior"
];

const INCOMES = [
  { label: "Below ₹1,00,000", value: 80000, desc: "BPL / Antyodaya Category" },
  { label: "₹1,00,000 – ₹2,50,000", value: 180000, desc: "EWS / Low Income Bracket" },
  { label: "₹2,50,000 – ₹5,00,000", value: 350000, desc: "Middle Income Group I" },
  { label: "₹5,00,000 – ₹8,00,000", value: 650000, desc: "Middle Income Group II" },
  { label: "Above ₹8,00,000", value: 1000000, desc: "General Taxpayer Bracket" }
];

const CATEGORIES = ["General", "OBC", "SC", "ST", "EWS"];
const GENDERS = ["Male", "Female", "Other"];
const SPECIAL_CONDITIONS = [
  "BPL Family Card Holder",
  "Divyangjan (Person with Disability)",
  "Single Mother / Widow",
  "Senior Citizen (Age 60+)",
  "Minority Community",
  "None of the Above"
];

export default function ProfileWizard() {
  const router = useRouter();
  
  // Step 1: State Selection (India Map appears)
  // Steps 2-7: Further Questions with State Landmark Background
  const [step, setStep] = useState(1);
  const totalSteps = 7;
  
  const [profile, setProfile] = useState<Partial<UserProfile>>({
    age: 28,
    state: "",
    occupation: "Farmer",
    annualIncome: 180000,
    category: "OBC",
    gender: "Male",
    specialConditions: ["None of the Above"]
  });

  const [stateConfirmedNotice, setStateConfirmedNotice] = useState(false);

  // Active landmark is always defined: defaults to India Gate (National Capital), then switches to state landmark
  const activeLandmark = (profile.state && STATE_LANDMARKS[profile.state]) 
    ? STATE_LANDMARKS[profile.state] 
    : DEFAULT_LANDMARK;

  const updateProfile = (key: keyof UserProfile, value: any) => {
    setProfile((prev) => ({ ...prev, [key]: value }));
  };

  const handleSelectStateOnMap = (stateName: string | null) => {
    if (!stateName) return;
    updateProfile("state", stateName);
    setStateConfirmedNotice(true);

    // Smoothly auto-advance to Step 2 so further questions appear immediately
    setTimeout(() => {
      setStateConfirmedNotice(false);
      setStep(2);
    }, 700);
  };

  const toggleSpecialCondition = (condition: string) => {
    if (condition === "None of the Above") {
      updateProfile("specialConditions", ["None of the Above"]);
      return;
    }
    const current = profile.specialConditions || [];
    let updated = current.includes(condition)
      ? current.filter((c) => c !== condition)
      : [...current.filter(c => c !== "None of the Above"), condition];
    
    if (updated.length === 0) updated = ["None of the Above"];
    updateProfile("specialConditions", updated);
  };

  const nextStep = () => { if (step < totalSteps) setStep(step + 1); };
  const prevStep = () => { if (step > 1) setStep(step - 1); };

  const submitAssessment = () => {
    localStorage.setItem("userProfile", JSON.stringify(profile));
    router.push("/dashboard");
  };

  const isStepValid = () => {
    switch (step) {
      case 1: return !!profile.state;
      case 2: return !!profile.age;
      case 3: return !!profile.occupation;
      case 4: return profile.annualIncome !== undefined;
      case 5: return !!profile.category;
      case 6: return !!profile.gender;
      case 7: return (profile.specialConditions?.length || 0) > 0;
      default: return true;
    }
  };

  const slideVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
    exit: { y: -20, opacity: 0 }
  };

  return (
    <>
      {/* 🌆 FULL-SCREEN DYNAMIC STATE LANDMARK BACKGROUND */}
      <div className="fixed inset-0 w-full h-full -z-10 pointer-events-none overflow-hidden select-none">
        <div 
          key={activeLandmark.name}
          className="absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-out transform scale-105"
          style={{ backgroundImage: `url(${activeLandmark.bgUrl})` }}
        />
        {/* Balanced, translucent dark scrim so the landmark architecture is clearly, vividly visible */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/45 via-slate-950/55 to-slate-950/75 backdrop-blur-[1px]" />
      </div>

      {/* 🏛️ Prominent Global Landmark Status Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 sm:px-5 rounded-2xl bg-black/65 backdrop-blur-md border border-white/20 mb-6 shadow-2xl">
        <div className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-200">
          <span className="flex h-3 w-3 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-orange-500"></span>
          </span>
          <Landmark className="w-4 h-4 text-orange-400 shrink-0" />
          <span>
            <span className="text-slate-400 font-medium">State Landmark:</span>{" "}
            <strong className="text-white font-bold">{activeLandmark.landmark}</strong>{" "}
            <span className="text-orange-400 font-semibold">({activeLandmark.landmarkCity}, {activeLandmark.name})</span>
          </span>
        </div>

        <div className="flex items-center gap-2.5 text-xs">
          <span className="px-2.5 py-1 rounded-xl bg-orange-500/20 text-orange-300 font-bold border border-orange-500/30 font-mono">
            {activeLandmark.hindi}
          </span>
          {profile.state && step > 1 && (
            <button
              onClick={() => setStep(1)}
              className="text-[11px] text-slate-300 hover:text-white underline cursor-pointer bg-slate-900/60 px-2.5 py-1 rounded-lg border border-slate-700 hover:border-orange-500 transition-colors"
            >
              Change State
            </button>
          )}
        </div>
      </div>

      {/* Main Glassmorphic Assessment Card */}
      <div className="relative w-full min-h-[640px] rounded-3xl overflow-hidden bg-slate-950/80 backdrop-blur-xl border border-white/15 shadow-2xl transition-all duration-700 p-6 sm:p-10 flex flex-col justify-between">
        
        {/* Top Header & Progress */}
        <div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-[11px] font-bold uppercase tracking-wider mb-1">
                <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
                National Welfare Scheme Discovery • 100% Live AWS Data
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                {step === 1 ? "Select Your State on the India Map" : "Complete Your Citizen Assessment"}
              </h1>
            </div>

            {/* If state already selected, show persistent state & landmark pill */}
            {profile.state && (
              <div className="flex items-center gap-2 bg-slate-900/90 backdrop-blur-md px-3.5 py-1.5 rounded-2xl border border-orange-500/30 text-xs text-slate-200">
                <MapPin className="w-4 h-4 text-primary" />
                <span>
                  <strong className="text-white">{profile.state}</strong>
                  <span className="text-slate-400 ml-1">({activeLandmark.landmark})</span>
                </span>
                <button
                  onClick={() => setStep(1)}
                  className="ml-2 text-[10px] text-orange-400 hover:text-orange-300 font-bold underline cursor-pointer"
                >
                  Change
                </button>
              </div>
            )}
          </div>

          <div className="space-y-1 mb-8">
            <Progress value={(step / totalSteps) * 100} className="h-2 bg-slate-800 [&>div]:bg-gradient-to-r [&>div]:from-primary [&>div]:to-orange-500" />
            <div className="flex justify-between text-[11px] text-slate-400 font-semibold pt-1">
              <span>Step {step} of {totalSteps}</span>
              <span>{Math.round((step / totalSteps) * 100)}% Completed</span>
            </div>
          </div>
        </div>

        {/* Dynamic Question Steps */}
        <div className="my-auto py-2">
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
              
              {/* ================= STEP 1: INTERACTIVE INDIA MAP ================= */}
              {step === 1 && (
                <div className="space-y-4">
                  <div className="text-center max-w-xl mx-auto mb-3">
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                      Which state or union territory do you reside in?
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-300 mt-1">
                      Click directly on your state in the vector map below. Welfare guidelines vary by state.
                    </p>
                  </div>

                  {/* Quick State Pills */}
                  <div className="flex items-center justify-center gap-1.5 flex-wrap max-w-3xl mx-auto pb-2">
                    {POPULAR_STATES.slice(0, 8).map((st) => (
                      <button
                        key={st}
                        onClick={() => handleSelectStateOnMap(st)}
                        className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all border ${
                          profile.state === st
                            ? "bg-primary text-white border-primary shadow-md"
                            : "bg-slate-900/80 text-slate-300 border-slate-700 hover:bg-slate-800 hover:text-white"
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>

                  {/* State Selection Confirmation Overlay Notification */}
                  {stateConfirmedNotice && (
                    <div className="text-center py-2 bg-emerald-500/20 border border-emerald-500/40 rounded-2xl text-emerald-400 font-bold text-xs animate-in fade-in zoom-in-95">
                      ✓ State Selected: {profile.state}! Loading questions with {activeLandmark.landmark} landmark backdrop...
                    </div>
                  )}

                  {/* Vector SVG India Map */}
                  <div className="w-full max-w-[480px] mx-auto aspect-square flex items-center justify-center p-1 bg-slate-950/60 rounded-3xl border border-slate-800 backdrop-blur-md shadow-inner">
                    <India
                      type="select-single"
                      size={440}
                      mapColor="#1e293b"
                      strokeColor="#475569"
                      strokeWidth={1}
                      hoverColor="#f97316"
                      selectColor="#ea580c"
                      hints={true}
                      hintTextColor="#ffffff"
                      hintBackgroundColor="#0f172a"
                      hintPadding="6px 12px"
                      hintBorderRadius={8}
                      onSelect={(st) => {
                        if (st) handleSelectStateOnMap(st);
                      }}
                    />
                  </div>

                  <p className="text-center text-[11px] text-slate-400">
                    Click any state path above to automatically advance to further questions.
                  </p>
                </div>
              )}

              {/* ================= STEP 2: AGE ================= */}
              {step === 2 && (
                <div className="max-w-xl mx-auto space-y-6 text-center">
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-white">What is your current age?</h2>
                    <p className="text-xs sm:text-sm text-slate-300 mt-1">
                      Schemes like PM-KISAN, Sukanya Samriddhi, and Old Age Pension use statutory age brackets.
                    </p>
                  </div>

                  <div className="py-6 bg-slate-900/80 backdrop-blur-xl border border-slate-700/80 rounded-3xl p-6 shadow-xl">
                    <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary via-amber-300 to-orange-400 mb-6">
                      {profile.age} <span className="text-xl text-slate-400 font-bold">Years</span>
                    </div>

                    <input
                      type="range"
                      min="18"
                      max="90"
                      value={profile.age || 28}
                      onChange={(e) => updateProfile("age", parseInt(e.target.value))}
                      className="w-full max-w-md h-3 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-orange-500"
                    />

                    {/* Quick Age Brackets */}
                    <div className="grid grid-cols-4 gap-2 mt-6 max-w-md mx-auto">
                      {[18, 25, 35, 60].map((quickAge) => (
                        <button
                          key={quickAge}
                          type="button"
                          onClick={() => updateProfile("age", quickAge)}
                          className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                            profile.age === quickAge
                              ? "bg-primary text-white border-primary"
                              : "bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-700"
                          }`}
                        >
                          {quickAge === 60 ? "60+ (Senior)" : `${quickAge} Yrs`}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ================= STEP 3: OCCUPATION ================= */}
              {step === 3 && (
                <div className="max-w-2xl mx-auto space-y-6">
                  <div className="text-center">
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-white">What is your primary occupation?</h2>
                    <p className="text-xs sm:text-sm text-slate-300 mt-1">
                      Direct benefits target specific sectors such as Agriculture, Artisans, Students, or Street Vendors.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {OCCUPATIONS.map((occ) => (
                      <button
                        key={occ}
                        type="button"
                        onClick={() => updateProfile("occupation", occ)}
                        className={`p-4 rounded-2xl border transition-all text-left flex flex-col justify-between h-28 backdrop-blur-xl ${
                          profile.occupation === occ
                            ? "bg-gradient-to-br from-primary/20 to-orange-600/30 border-primary text-white shadow-lg shadow-orange-900/30"
                            : "bg-slate-900/80 border-slate-800 text-slate-300 hover:bg-slate-800/90 hover:border-slate-700"
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <User className={`w-5 h-5 ${profile.occupation === occ ? "text-primary" : "text-slate-400"}`} />
                          {profile.occupation === occ && <Check className="w-4 h-4 text-primary" />}
                        </div>
                        <span className="font-bold text-xs sm:text-sm leading-snug">{occ}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* ================= STEP 4: ANNUAL INCOME ================= */}
              {step === 4 && (
                <div className="max-w-2xl mx-auto space-y-6">
                  <div className="text-center">
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Annual Household Income</h2>
                    <p className="text-xs sm:text-sm text-slate-300 mt-1">
                      Official ceiling thresholds qualify you for Ayushman Bharat, PMAY Housing, and scholarships.
                    </p>
                  </div>

                  <div className="space-y-3">
                    {INCOMES.map((inc) => (
                      <button
                        key={inc.label}
                        type="button"
                        onClick={() => updateProfile("annualIncome", inc.value)}
                        className={`w-full p-4 rounded-2xl border transition-all flex items-center justify-between backdrop-blur-xl ${
                          profile.annualIncome === inc.value
                            ? "bg-gradient-to-r from-primary/20 to-orange-600/20 border-primary text-white shadow-lg"
                            : "bg-slate-900/80 border-slate-800 text-slate-300 hover:bg-slate-800/90 hover:border-slate-700"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${profile.annualIncome === inc.value ? "bg-primary text-white" : "bg-slate-800 text-slate-400"}`}>
                            <Wallet className="w-4 h-4" />
                          </div>
                          <div className="text-left">
                            <span className="font-bold text-sm block text-white">{inc.label}</span>
                            <span className="text-xs text-slate-400">{inc.desc}</span>
                          </div>
                        </div>
                        {profile.annualIncome === inc.value && <Check className="w-5 h-5 text-primary" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* ================= STEP 5: SOCIAL CATEGORY ================= */}
              {step === 5 && (
                <div className="max-w-xl mx-auto space-y-6">
                  <div className="text-center">
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Select Social Category</h2>
                    <p className="text-xs sm:text-sm text-slate-300 mt-1">
                      As recognized by Central and State Government reservation guidelines.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => updateProfile("category", cat)}
                        className={`p-4 rounded-2xl border transition-all flex items-center justify-between backdrop-blur-xl ${
                          profile.category === cat
                            ? "bg-gradient-to-br from-primary/20 to-orange-600/30 border-primary text-white shadow-lg"
                            : "bg-slate-900/80 border-slate-800 text-slate-300 hover:bg-slate-800 hover:border-slate-700"
                        }`}
                      >
                        <span className="font-bold text-base">{cat}</span>
                        {profile.category === cat && <Check className="w-4 h-4 text-primary" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* ================= STEP 6: GENDER ================= */}
              {step === 6 && (
                <div className="max-w-xl mx-auto space-y-6">
                  <div className="text-center">
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Select Your Gender</h2>
                    <p className="text-xs sm:text-sm text-slate-300 mt-1">
                      Schemes like PM Matru Vandana, Ladli Behna, and Sukanya Samriddhi target women empowerment.
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    {GENDERS.map((gen) => (
                      <button
                        key={gen}
                        type="button"
                        onClick={() => updateProfile("gender", gen)}
                        className={`p-6 rounded-2xl border transition-all text-center flex flex-col items-center justify-center gap-2 backdrop-blur-xl ${
                          profile.gender === gen
                            ? "bg-gradient-to-br from-primary/20 to-orange-600/30 border-primary text-white shadow-lg"
                            : "bg-slate-900/80 border-slate-800 text-slate-300 hover:bg-slate-800 hover:border-slate-700"
                        }`}
                      >
                        <span className="font-bold text-lg">{gen}</span>
                        {profile.gender === gen && <Check className="w-4 h-4 text-primary" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* ================= STEP 7: SPECIAL CONDITIONS ================= */}
              {step === 7 && (
                <div className="max-w-2xl mx-auto space-y-6">
                  <div className="text-center">
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Any Special Eligibility Factors?</h2>
                    <p className="text-xs sm:text-sm text-slate-300 mt-1">
                      Select all that apply to unlock special priority quotas and subsidies.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {SPECIAL_CONDITIONS.map((cond) => {
                      const isSelected = profile.specialConditions?.includes(cond);
                      return (
                        <button
                          key={cond}
                          type="button"
                          onClick={() => toggleSpecialCondition(cond)}
                          className={`p-3.5 rounded-2xl border transition-all text-left flex items-center justify-between backdrop-blur-xl ${
                            isSelected
                              ? "bg-gradient-to-r from-primary/20 to-orange-600/20 border-primary text-white shadow-lg"
                              : "bg-slate-900/80 border-slate-800 text-slate-300 hover:bg-slate-800 hover:border-slate-700"
                          }`}
                        >
                          <span className="font-bold text-xs leading-snug">{cond}</span>
                          <div className={`w-5 h-5 rounded-lg border flex items-center justify-center ${isSelected ? "bg-primary border-primary text-white" : "border-slate-700"}`}>
                            {isSelected && <Check className="w-3 h-3" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bottom Navigation Buttons */}
        <div className="pt-6 border-t border-slate-800/80 flex items-center justify-between">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={step === 1}
            className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white rounded-xl text-xs font-bold"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Previous
          </Button>

          <div className="flex items-center gap-3">
            {step < totalSteps ? (
              <Button
                onClick={nextStep}
                disabled={!isStepValid()}
                className="bg-gradient-to-r from-primary to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-xl px-6 text-xs font-bold shadow-lg transition-all"
              >
                <span>Continue</span>
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            ) : (
              <Button
                onClick={submitAssessment}
                disabled={!isStepValid()}
                className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-xl px-8 text-xs font-black shadow-xl shadow-emerald-950/40"
              >
                <ShieldCheck className="w-4 h-4 mr-1.5" />
                <span>Unlock Eligible Schemes</span>
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            )}
          </div>
        </div>

      </div>
    </>
  );
}
