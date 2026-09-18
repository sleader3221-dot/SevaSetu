const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://snlktzwf6g.execute-api.us-east-1.amazonaws.com';

export interface MatchResponse {
  matches: SchemeMatchAPI[];
  total_schemes: number;
  total_annual_value: number;
}

export interface SchemeMatchAPI {
  scheme: SchemeAPI;
  eligibility_score: number;
  match_reasons: string[];
  missing_criteria: string[];
}

export interface SchemeAPI {
  id: string;
  name: string;
  name_hindi: string;
  ministry: string;
  description: string;
  benefits: string;
  benefit_value: string;
  benefit_amount: number;
  eligibility: Record<string, any>;
  application_steps: string[];
  required_documents: string[];
  portal_url: string;
  deadline: string | null;
  category: string;
  target_group: string[];
}

export async function checkHealth(): Promise<any> {
  const res = await fetch(`${API_BASE}/api/health`);
  return res.json();
}

export async function findSchemes(profile: any): Promise<MatchResponse> {
  const res = await fetch(`${API_BASE}/api/schemes/match`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(profile),
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

export async function getAllSchemes(category?: string): Promise<SchemeAPI[]> {
  const url = category ? `${API_BASE}/api/schemes?category=${category}` : `${API_BASE}/api/schemes`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

export async function getSchemeById(id: string): Promise<SchemeAPI> {
  const res = await fetch(`${API_BASE}/api/schemes/${id}`);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

export async function getApplicationGuide(schemeId: string, profile: any): Promise<any> {
  const res = await fetch(`${API_BASE}/api/agent/guide`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ schemeId, profile }),
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

export async function uploadDocument(file: File): Promise<any> {
  const formData = new FormData();
  formData.append('file', file);
  const res = await fetch(`${API_BASE}/api/documents/upload`, {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

export async function translateText(text: string, targetLang: string): Promise<string> {
  try {
    const res = await fetch(`${API_BASE}/api/translate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, targetLanguage: targetLang }),
    });
    if (!res.ok) return text;
    const data = await res.json();
    return data.translatedText;
  } catch {
    return text;
  }
}

export async function generateSpeech(text: string, language: string = 'en'): Promise<any> {
  const res = await fetch(`${API_BASE}/api/speech`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, language }),
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

export async function subscribeAlert(destination: string, schemeName: string = 'All Schemes'): Promise<any> {
  const res = await fetch(`${API_BASE}/api/alerts/subscribe`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ destination, schemeName }),
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

export async function chatWithAI(message: string, profile: any = null, language: string = 'en'): Promise<any> {
  const res = await fetch(`${API_BASE}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, profile, language }),
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

export async function compareSchemes(schemeIds: string[]): Promise<any> {
  const res = await fetch(`${API_BASE}/api/schemes/compare`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ schemeIds }),
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

export async function generatePassbook(profile: any, matchedSchemeIds: string[] = []): Promise<any> {
  const res = await fetch(`${API_BASE}/api/passbook/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ profile, matchedSchemeIds }),
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}


