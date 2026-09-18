export interface UserProfile {
  age: number;
  state: string;
  occupation: string;
  annualIncome: number;
  category: 'General' | 'OBC' | 'SC' | 'ST' | 'EWS';
  gender: 'Male' | 'Female' | 'Other';
  specialConditions: string[];
  education: string;
}

export interface Scheme {
  id: string;
  name: string;
  nameHindi: string;
  ministry: string;
  description: string;
  benefits: string;
  benefitValue: string;
  eligibilityCriteria: EligibilityCriteria;
  applicationSteps: string[];
  requiredDocuments: string[];
  portalUrl: string;
  deadline: string | null;
  category: SchemeCategory;
  targetGroup: string[];
}

export interface EligibilityCriteria {
  minAge?: number;
  maxAge?: number;
  incomeLimit?: number;
  categories?: string[];
  states?: string[] | 'ALL';
  gender?: string[];
  occupations?: string[];
  education?: string[];
  specialConditions?: string[];
}

export interface SchemeMatch {
  scheme: Scheme;
  eligibilityScore: number; // 0-100
  matchReasons: string[];
  missingCriteria: string[];
}

export type SchemeCategory = 'Education' | 'Health' | 'Agriculture' | 'Housing' | 'Finance' | 'Employment' | 'Women & Child' | 'Social Welfare' | 'MSME' | 'Other';

export interface DocumentVerification {
  documentType: string;
  extractedFields: Record<string, string>;
  verificationStatus: 'pending' | 'verified' | 'failed';
  matchedFields: Record<string, boolean>;
}

export type Language = 'en' | 'hi' | 'ta' | 'te' | 'bn';
