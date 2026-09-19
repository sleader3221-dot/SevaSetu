"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { findSchemes } from '@/lib/api-client';
import { UserProfile, SchemeMatch } from '@/lib/types';
import { mapMatchFromAPI, formatCurrency } from '@/lib/utils';

interface StateData {
  id: string;
  name: string;
  hindi: string;
  x: number;
  y: number;
  schemes: number;
}

const STATES_DATA: StateData[] = [
  { id: 'AP', name: 'Andhra Pradesh', hindi: 'आंध्र प्रदेश', x: 430, y: 680, schemes: 42 },
  { id: 'AR', name: 'Arunachal Pradesh', hindi: 'अरुणाचल प्रदेश', x: 780, y: 280, schemes: 15 },
  { id: 'AS', name: 'Assam', hindi: 'असम', x: 740, y: 330, schemes: 28 },
  { id: 'BR', name: 'Bihar', hindi: 'बिहार', x: 550, y: 380, schemes: 51 },
  { id: 'CT', name: 'Chhattisgarh', hindi: 'छत्तीसगढ़', x: 480, y: 500, schemes: 33 },
  { id: 'GA', name: 'Goa', hindi: 'गोवा', x: 260, y: 660, schemes: 12 },
  { id: 'GJ', name: 'Gujarat', hindi: 'गुजरात', x: 180, y: 460, schemes: 45 },
  { id: 'HR', name: 'Haryana', hindi: 'हरियाणा', x: 330, y: 280, schemes: 38 },
  { id: 'HP', name: 'Himachal Pradesh', hindi: 'हिमाचल प्रदेश', x: 360, y: 200, schemes: 22 },
  { id: 'JH', name: 'Jharkhand', hindi: 'झारखंड', x: 550, y: 440, schemes: 36 },
  { id: 'KA', name: 'Karnataka', hindi: 'कर्नाटक', x: 310, y: 680, schemes: 49 },
  { id: 'KL', name: 'Kerala', hindi: 'केरल', x: 340, y: 800, schemes: 39 },
  { id: 'MP', name: 'Madhya Pradesh', hindi: 'मध्य प्रदेश', x: 380, y: 450, schemes: 54 },
  { id: 'MH', name: 'Maharashtra', hindi: 'महाराष्ट्र', x: 280, y: 550, schemes: 61 },
  { id: 'MN', name: 'Manipur', hindi: 'मणिपुर', x: 810, y: 380, schemes: 14 },
  { id: 'ML', name: 'Meghalaya', hindi: 'मेघालय', x: 700, y: 370, schemes: 16 },
  { id: 'MZ', name: 'Mizoram', hindi: 'मिज़ोरम', x: 790, y: 430, schemes: 11 },
  { id: 'NL', name: 'Nagaland', hindi: 'नागालैंड', x: 820, y: 330, schemes: 13 },
  { id: 'OR', name: 'Odisha', hindi: 'ओडिशा', x: 540, y: 530, schemes: 41 },
  { id: 'PB', name: 'Punjab', hindi: 'पंजाब', x: 300, y: 240, schemes: 32 },
  { id: 'RJ', name: 'Rajasthan', hindi: 'राजस्थान', x: 260, y: 360, schemes: 58 },
  { id: 'SK', name: 'Sikkim', hindi: 'सिक्किम', x: 640, y: 310, schemes: 9 },
  { id: 'TN', name: 'Tamil Nadu', hindi: 'तमिलनाडु', x: 400, y: 780, schemes: 53 },
  { id: 'TG', name: 'Telangana', hindi: 'तेलंगाना', x: 400, y: 600, schemes: 40 },
  { id: 'TR', name: 'Tripura', hindi: 'त्रिपुरा', x: 750, y: 420, schemes: 17 },
  { id: 'UP', name: 'Uttar Pradesh', hindi: 'उत्तर प्रदेश', x: 430, y: 340, schemes: 72 },
  { id: 'UT', name: 'Uttarakhand', hindi: 'उत्तराखण्ड', x: 410, y: 250, schemes: 24 },
  { id: 'WB', name: 'West Bengal', hindi: 'पश्चिम बंगाल', x: 620, y: 460, schemes: 48 },
  { id: 'AN', name: 'Andaman & Nicobar', hindi: 'अंडमान और निकोबार', x: 720, y: 720, schemes: 5 },
  { id: 'CH', name: 'Chandigarh', hindi: 'चंडीगढ़', x: 340, y: 230, schemes: 8 },
  { id: 'DN', name: 'Dadra Nagar Haveli & Daman Diu', hindi: 'दादरा और नगर हवेली', x: 210, y: 520, schemes: 6 },
  { id: 'DL', name: 'Delhi', hindi: 'दिल्ली', x: 350, y: 310, schemes: 20 },
  { id: 'JK', name: 'Jammu & Kashmir', hindi: 'जम्मू और कश्मीर', x: 290, y: 140, schemes: 18 },
  { id: 'LA', name: 'Ladakh', hindi: 'लद्दाख', x: 360, y: 100, schemes: 10 },
  { id: 'LD', name: 'Lakshadweep', hindi: 'लक्षद्वीप', x: 240, y: 780, schemes: 4 },
  { id: 'PY', name: 'Puducherry', hindi: 'पुडुचेरी', x: 450, y: 740, schemes: 7 },
];

const getColorForSchemes = (count: number) => {
  if (count > 60) return 'bg-indigo-600';
  if (count > 40) return 'bg-indigo-700';
  if (count > 20) return 'bg-indigo-800';
  return 'bg-indigo-900';
};

export default function IndiaMapExplorer() {
  const [selectedState, setSelectedState] = useState<StateData | null>(null);
  const [hoveredState, setHoveredState] = useState<StateData | null>(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<{ matches: SchemeMatch[], total_schemes: number, total_annual_value: number } | null>(null);
  
  const [formData, setFormData] = useState({
    age: '25',
    income: '50000',
    category: 'General',
    occupation: 'Student'
  });

  const handleStateClick = (state: StateData) => {
    setSelectedState(state);
    setResults(null);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFindSchemes = async () => {
    if (!selectedState) return;
    setLoading(true);
    
    try {
      const profile: UserProfile = {
        age: parseInt(formData.age) || 25,
        state: selectedState.name,
        occupation: formData.occupation,
        annualIncome: parseInt(formData.income) || 50000,
        category: formData.category as 'General' | 'OBC' | 'SC' | 'ST' | 'EWS',
        gender: 'Male',
        specialConditions: [],
        education: '12th Pass'
      };
      
      const response = await findSchemes(profile);
      setResults({
        matches: response.matches.map(mapMatchFromAPI),
        total_schemes: response.total_schemes,
        total_annual_value: response.total_annual_value
      });
    } catch (error) {
      console.error('Error finding schemes:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalSchemesAll = STATES_DATA.reduce((acc, state) => acc + state.schemes, 0);

  return (
    <div className="flex flex-col md:flex-row w-full min-h-screen bg-slate-950 text-slate-100 overflow-hidden">
      <div className="relative flex-1 p-4 flex items-center justify-center">
        
        <div className="absolute top-6 left-6 z-10 bg-slate-900/80 p-4 rounded-xl border border-slate-800 backdrop-blur-sm">
          <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-600 mb-1">
            SevaSetu Explorer
          </h2>
          <div className="text-slate-400 text-sm">
            Total Available Schemes: <span className="text-white font-semibold">{totalSchemesAll}+</span>
          </div>
        </div>

        <div className="absolute bottom-6 left-6 z-10 bg-slate-900/80 p-3 rounded-xl border border-slate-800 backdrop-blur-sm text-xs">
          <div className="mb-2 font-semibold text-slate-300">Scheme Density</div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-3 h-3 rounded bg-indigo-900"></div> <span>&lt; 20 Schemes</span>
          </div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-3 h-3 rounded bg-indigo-800"></div> <span>20 - 40 Schemes</span>
          </div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-3 h-3 rounded bg-indigo-700"></div> <span>40 - 60 Schemes</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-indigo-600"></div> <span>&gt; 60 Schemes</span>
          </div>
        </div>

        <div className="relative w-full max-w-[800px] aspect-[8/9]">
          {STATES_DATA.map((state) => {
            const isSelected = selectedState?.id === state.id;
            const isHovered = hoveredState?.id === state.id;
            
            return (
              <motion.div
                key={state.id}
                className={`absolute w-12 h-12 -ml-6 -mt-6 rounded-full flex items-center justify-center cursor-pointer shadow-lg transition-colors border-2 ${
                  isSelected 
                    ? 'bg-gradient-to-br from-orange-500 to-amber-600 border-orange-300 z-20' 
                    : `${getColorForSchemes(state.schemes)} ${isHovered ? 'border-slate-300 z-10' : 'border-indigo-400/30'}`
                }`}
                style={{ left: `${(state.x / 900) * 100}%`, top: `${(state.y / 900) * 100}%` }}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleStateClick(state)}
                onMouseEnter={() => setHoveredState(state)}
                onMouseLeave={() => setHoveredState(null)}
              >
                <span className={`text-[10px] font-bold ${isSelected ? 'text-white' : 'text-indigo-100'}`}>
                  {state.id}
                </span>
                
                <AnimatePresence>
                  {(isHovered || isSelected) && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 5 }}
                      className="absolute top-full mt-2 bg-slate-800 border border-slate-700 text-white text-xs px-3 py-1.5 rounded-lg whitespace-nowrap z-30 pointer-events-none shadow-xl"
                    >
                      <div className="font-bold">{state.name}</div>
                      <div className="text-slate-400 font-hindi">{state.hindi}</div>
                      <div className="text-orange-400 mt-1">{state.schemes} Schemes</div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>

      <div className={`w-full md:w-96 bg-slate-900 border-l border-slate-800 transition-all duration-300 flex flex-col ${selectedState ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0 hidden md:flex md:opacity-50 md:pointer-events-none'}`}>
        {selectedState ? (
          <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold text-white">{selectedState.name}</h2>
                <h3 className="text-lg text-slate-400 font-hindi">{selectedState.hindi}</h3>
              </div>
              <button 
                onClick={() => setSelectedState(null)}
                className="p-2 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 mb-6">
              <h4 className="text-sm font-semibold text-slate-300 mb-4">Check Eligibility</h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Age</label>
                  <input type="number" name="age" value={formData.age} onChange={handleFormChange} className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-orange-500" />
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Annual Income (₹)</label>
                  <input type="number" name="income" value={formData.income} onChange={handleFormChange} className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-orange-500" />
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Category</label>
                  <select name="category" value={formData.category} onChange={handleFormChange} className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-orange-500">
                    <option value="General">General</option>
                    <option value="OBC">OBC</option>
                    <option value="SC">SC</option>
                    <option value="ST">ST</option>
                    <option value="EWS">EWS</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Occupation</label>
                  <select name="occupation" value={formData.occupation} onChange={handleFormChange} className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-orange-500">
                    <option value="Student">Student</option>
                    <option value="Farmer">Farmer</option>
                    <option value="Unemployed">Unemployed</option>
                    <option value="Employed">Employed</option>
                    <option value="Self-Employed">Self-Employed</option>
                  </select>
                </div>
                <button 
                  onClick={handleFindSchemes}
                  disabled={loading}
                  className="w-full py-2 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white rounded font-medium transition-all shadow-lg shadow-orange-900/20 disabled:opacity-70 flex justify-center items-center"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : 'Find Schemes'}
                </button>
              </div>
            </div>

            {results && (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex justify-between items-center text-sm border-b border-slate-800 pb-2">
                  <span className="text-slate-400">Found: <strong className="text-white">{results.total_schemes}</strong></span>
                  <span className="text-slate-400">Value: <strong className="text-emerald-400">{formatCurrency(results.total_annual_value)}</strong></span>
                </div>
                
                {results.matches && results.matches.length > 0 ? (
                  results.matches.map((match: SchemeMatch, idx: number) => (
                    <motion.div 
                      key={match.scheme.id || idx}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 hover:border-slate-500 transition-colors"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h5 className="font-semibold text-sm text-white leading-tight">{match.scheme.name}</h5>
                          <span className="bg-emerald-900/50 text-emerald-400 text-[10px] px-2 py-1 rounded-full font-medium whitespace-nowrap ml-2">
                            {match.eligibilityScore}% Match
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 line-clamp-2 mb-3">{match.scheme.description}</p>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-semibold text-emerald-400">{match.scheme.benefitValue}</span>
                          {match.scheme.portalUrl && (
                            <a href={match.scheme.portalUrl} target="_blank" rel="noopener noreferrer" className="text-[10px] bg-slate-700 hover:bg-slate-600 text-white px-3 py-1.5 rounded transition-colors">
                              Apply Now
                            </a>
                          )}
                        </div>
                      </motion.div>
                  ))
                ) : (
                  <div className="text-center py-8 text-slate-500 text-sm">
                    No schemes found matching these criteria in {selectedState.name}.
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-500">
            <svg className="w-16 h-16 mb-4 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-lg font-medium text-slate-400 mb-2">Select a State</p>
            <p className="text-sm">Click on any state or union territory on the map to explore available government schemes.</p>
          </div>
        )}
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #334155;
          border-radius: 20px;
        }
      `}} />
    </div>
  );
}
