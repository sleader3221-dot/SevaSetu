"use client";

import React, { useState, useEffect } from "react";
import { 
  Newspaper, ChevronLeft, ChevronRight, ExternalLink, 
  Sparkles, Wheat, HeartPulse, GraduationCap, Users, Home, Hammer, ShieldCheck 
} from "lucide-react";

interface NewsItem {
  id: number;
  title: string;
  hindiTitle: string;
  description: string;
  category: "Farmers" | "Healthcare" | "Students" | "Women" | "Housing" | "Artisans";
  source: string;
  date: string;
  url: string;
  badge: string;
  gradient: string;
}

const NEWS_ITEMS: NewsItem[] = [
  {
    id: 1,
    title: "PM Kisan 18th Installment Disbursed",
    hindiTitle: "पीएम किसान 18वीं किस्त जारी",
    description: "Direct Bank Transfer of ₹20,000 Crore deposited into bank accounts of over 9.5 Crore farmers across Bharat.",
    category: "Farmers",
    source: "PIB • Ministry of Agriculture",
    date: "Latest Live Update",
    url: "https://pmkisan.gov.in",
    badge: "Direct Benefit Transfer",
    gradient: "from-amber-500/20 via-orange-500/10 to-transparent"
  },
  {
    id: 2,
    title: "Ayushman Bharat Extended to All Senior Citizens (70+)",
    hindiTitle: "70 वर्ष से अधिक के सभी वरिष्ठ नागरिकों को आयुष्मान सुरक्षा",
    description: "Universal health coverage of ₹5 Lakh per year unlocked for all citizens aged 70 and above, regardless of income.",
    category: "Healthcare",
    source: "Ministry of Health & Family Welfare",
    date: "National Policy Rollout",
    url: "https://beneficiary.nha.gov.in",
    badge: "Universal Health Cover",
    gradient: "from-emerald-500/20 via-teal-500/10 to-transparent"
  },
  {
    id: 3,
    title: "PM Vishwakarma 2.0 Toolkit & Credit Expansion",
    hindiTitle: "पीएम विश्वकर्मा: ₹15,000 टूलकिट सहायता",
    description: "Collateral-free enterprise loans up to ₹3 Lakh at 5% subsidized interest plus ₹15,000 modern toolkit grant for 18 traditional artisan trades.",
    category: "Artisans",
    source: "Ministry of MSME",
    date: "Special Artisan Scheme",
    url: "https://pmvishwakarma.gov.in",
    badge: "Artisan Enterprise",
    gradient: "from-blue-500/20 via-indigo-500/10 to-transparent"
  },
  {
    id: 4,
    title: "Central Sector Scholarship & NSP Applications Open",
    hindiTitle: "उच्च शिक्षा छात्रवृत्ति: नए आवेदन आमंत्रित",
    description: "Merit-cum-means financial assistance of up to ₹20,000/year for college and university undergraduate students.",
    category: "Students",
    source: "National Scholarship Portal (NSP)",
    date: "Academic Year 2025-26",
    url: "https://scholarships.gov.in",
    badge: "Higher Education Grant",
    gradient: "from-purple-500/20 via-pink-500/10 to-transparent"
  },
  {
    id: 5,
    title: "PMAY-Urban 2.0: 1 Crore Additional Affordable Homes",
    hindiTitle: "पीएम आवास योजना शहरी 2.0: 1 करोड़ नए पक्के घर",
    description: "Interest subsidy of up to ₹2.67 Lakh for EWS, LIG, and Middle Income Families constructing or buying their first home.",
    category: "Housing",
    source: "MoHUA • Housing for All",
    date: "Cabinet Approved",
    url: "https://pmaymis.gov.in",
    badge: "Interest Subsidy",
    gradient: "from-orange-500/20 via-red-500/10 to-transparent"
  },
  {
    id: 6,
    title: "Mahila Samman & Sukanya Samriddhi High Yield Returns",
    hindiTitle: "महिला सम्मान बचत एवं सुकन्या समृद्धि योजना",
    description: "Guaranteed 8.2% sovereign return for girl child savings with triple tax exemption under Section 80C.",
    category: "Women",
    source: "Department of Posts • Ministry of Finance",
    date: "Sovereign Guarantee",
    url: "https://www.indiapost.gov.in",
    badge: "Women Financial Security",
    gradient: "from-rose-500/20 via-pink-500/10 to-transparent"
  },
  {
    id: 7,
    title: "Kisan Credit Card (KCC) 4% Interest Subvention",
    hindiTitle: "किसान क्रेडिट कार्ड: 4% ब्याज पर ₹3 लाख का ऋण",
    description: "Short term agricultural credit up to ₹3 Lakh at effectively 4% annual interest with zero processing fee up to ₹1.6 Lakh.",
    category: "Farmers",
    source: "NABARD & RBI",
    date: "Active Credit Window",
    url: "https://pmkisan.gov.in",
    badge: "Low-Interest Credit",
    gradient: "from-lime-500/20 via-emerald-500/10 to-transparent"
  },
  {
    id: 8,
    title: "Pradhan Mantri Matru Vandana Yojana (PMMVY) Direct Grant",
    hindiTitle: "प्रधानमंत्री मातृ वंदना योजना: ₹11,000 मातृत्व सहायता",
    description: "Nutritional financial grant directly credited to mother's Aadhaar-seeded bank account for first and second girl child.",
    category: "Women",
    source: "Ministry of Women & Child Development",
    date: "DBT Mother Care",
    url: "https://pmmvy.wcd.gov.in",
    badge: "Maternity Cash Grant",
    gradient: "from-amber-500/20 via-rose-500/10 to-transparent"
  }
];

const CATEGORIES = ["All", "Farmers", "Healthcare", "Students", "Women", "Housing", "Artisans"] as const;

export default function NewsCarousel() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const filteredItems = selectedCategory === "All" 
    ? NEWS_ITEMS 
    : NEWS_ITEMS.filter(item => item.category === selectedCategory);

  // Auto-swipe interval
  useEffect(() => {
    if (isPaused || filteredItems.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % filteredItems.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [isPaused, filteredItems.length]);

  // Reset index on category change
  useEffect(() => {
    setCurrentIndex(0);
  }, [selectedCategory]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % filteredItems.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length);
  };

  return (
    <div className="w-full">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-[11px] font-bold uppercase tracking-wider mb-2">
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
            Live Press Information Bureau & Official Portals
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2.5">
            <Newspaper className="w-6 h-6 text-primary" />
            Official Welfare Announcements & News
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time policy updates, direct benefit disbursements, and national welfare notifications.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={prevSlide}
            aria-label="Previous Announcement"
            className="w-10 h-10 rounded-xl border border-slate-800 flex items-center justify-center bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800 hover:border-orange-500/50 transition-all cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button 
            onClick={nextSlide}
            aria-label="Next Announcement"
            className="w-10 h-10 rounded-xl border border-slate-800 flex items-center justify-center bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800 hover:border-orange-500/50 transition-all cursor-pointer"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-2 no-scrollbar">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === cat
                ? "bg-primary text-white shadow-lg shadow-orange-500/25 scale-105"
                : "bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Swiping Carousel Card Deck */}
      <div 
        className="relative overflow-hidden rounded-3xl"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div 
          className="flex transition-transform duration-700 ease-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {filteredItems.map((item) => (
            <div key={item.id} className="min-w-full md:min-w-[50%] lg:min-w-[33.333%] p-2.5 shrink-0">
              <div className="h-full rounded-3xl p-[1px] bg-gradient-to-b from-slate-700 via-slate-800 to-slate-900 hover:from-orange-500 hover:via-amber-500 hover:to-emerald-500 transition-all duration-300 group shadow-xl">
                <div className={`h-full bg-slate-950 rounded-[23px] p-6 flex flex-col justify-between relative overflow-hidden bg-gradient-to-br ${item.gradient}`}>
                  
                  {/* Top Badges */}
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="px-2.5 py-1 rounded-lg bg-orange-500/10 border border-orange-500/30 text-[10px] font-black text-orange-400 tracking-wider uppercase">
                        {item.badge}
                      </span>
                      <span className="text-[11px] text-slate-500 font-medium">
                        {item.date}
                      </span>
                    </div>

                    <h3 className="text-base sm:text-lg font-bold text-white mb-1 group-hover:text-orange-300 transition-colors line-clamp-2">
                      {item.title}
                    </h3>
                    <p className="text-xs text-orange-400/90 font-medium mb-3">
                      {item.hindiTitle}
                    </p>

                    <p className="text-xs sm:text-sm text-slate-300 line-clamp-3 leading-relaxed mb-6">
                      {item.description}
                    </p>
                  </div>

                  {/* Card Bottom CTA Strip */}
                  <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs">
                    <span className="text-[11px] text-slate-400 font-medium truncate max-w-[170px]">
                      {item.source}
                    </span>

                    <a 
                      href={item.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 font-bold text-xs px-3 py-1.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white shadow-md shadow-orange-500/20 transition-all hover:scale-105"
                    >
                      <span>Official Portal</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>

                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination Dots */}
      <div className="flex items-center justify-center gap-2 mt-4">
        {filteredItems.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentIndex(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`h-1.5 rounded-full transition-all cursor-pointer ${
              currentIndex === i 
                ? "w-6 bg-orange-500" 
                : "w-1.5 bg-slate-800 hover:bg-slate-700"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
