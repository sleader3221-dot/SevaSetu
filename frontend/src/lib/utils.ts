import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Scheme, SchemeMatch } from './types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    Education: 'bg-blue-100 text-blue-800',
    Health: 'bg-red-100 text-red-800',
    Agriculture: 'bg-green-100 text-green-800',
    Housing: 'bg-yellow-100 text-yellow-800',
    Finance: 'bg-purple-100 text-purple-800',
    Employment: 'bg-indigo-100 text-indigo-800',
    'Women & Child': 'bg-pink-100 text-pink-800',
    'Social Welfare': 'bg-orange-100 text-orange-800',
    MSME: 'bg-teal-100 text-teal-800',
    Other: 'bg-gray-100 text-gray-800',
  };
  return colors[category] || colors.Other;
}

export function getEligibilityColor(score: number): string {
  if (score >= 90) return 'text-green-500';
  if (score >= 70) return 'text-yellow-500';
  return 'text-red-500';
}

export function mapSchemeFromAPI(s: any): Scheme {
  return {
    id: s.id,
    name: s.name,
    nameHindi: s.name_hindi || s.nameHindi || '',
    ministry: s.ministry,
    description: s.description,
    benefits: s.benefits,
    benefitValue: s.benefit_value || s.benefitValue || '',
    eligibilityCriteria: {
      minAge: s.eligibility?.min_age,
      maxAge: s.eligibility?.max_age,
      incomeLimit: s.eligibility?.income_limit,
      categories: s.eligibility?.categories,
      states: s.eligibility?.states,
      gender: s.eligibility?.gender,
      occupations: s.eligibility?.occupations,
      education: s.eligibility?.education,
      specialConditions: s.eligibility?.special_conditions,
    },
    applicationSteps: s.application_steps || s.applicationSteps || [],
    requiredDocuments: s.required_documents || s.requiredDocuments || [],
    registrationUrl: s.registration_url || s.registrationUrl || s.portal_url || s.portalUrl || '',
    youtubeGuideUrl: s.youtube_guide_url || s.youtubeGuideUrl || '',
    helpline: s.helpline || '',
    benefitAmount: s.benefit_amount || s.benefitAmount || 0,
    portalUrl: s.portal_url || s.portalUrl || '',
    deadline: s.deadline || null,
    category: s.category || 'Other',
    targetGroup: s.target_group || s.targetGroup || [],
  };
}

export function mapMatchFromAPI(m: any): SchemeMatch {
  return {
    scheme: mapSchemeFromAPI(m.scheme),
    eligibilityScore: m.eligibility_score || m.eligibilityScore || 0,
    matchReasons: m.match_reasons || m.matchReasons || [],
    missingCriteria: m.missing_criteria || m.missingCriteria || [],
  };
}
