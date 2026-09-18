"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSchemeById, getApplicationGuide, generateSpeech, subscribeAlert } from "@/lib/api-client";
import { Scheme } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, ExternalLink, CheckCircle2, FileText, Calendar, Building2, 
  IndianRupee, Loader2, Sparkles, Volume2, Bell, Check, Radio
} from "lucide-react";
import { getCategoryColor, mapSchemeFromAPI } from "@/lib/utils";

export default function SchemeDetailClient({ id }: { id: string }) {
  const router = useRouter();
  const [scheme, setScheme] = useState<Scheme | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [isGuideLoading, setIsGuideLoading] = useState(false);
  const [guide, setGuide] = useState<any>(null);

  // Amazon Polly state
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioPlayed, setAudioPlayed] = useState(false);

  // Amazon SNS state
  const [alertDestination, setAlertDestination] = useState("");
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [alertSuccess, setAlertSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    
    getSchemeById(id)
      .then(res => {
        setScheme(mapSchemeFromAPI(res));
        setIsLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError("Failed to load scheme details from AWS Cloud.");
        setIsLoading(false);
      });
  }, [id]);

  const handleGetGuide = async () => {
    if (!scheme) return;
    setIsGuideLoading(true);
    try {
      const saved = localStorage.getItem('userProfile');
      const profile = saved ? JSON.parse(saved) : {};
      const res = await getApplicationGuide(scheme.id, profile);
      setGuide(res.guide || res);
    } catch (err) {
      console.error(err);
      alert("Failed to get AI guide.");
    } finally {
      setIsGuideLoading(false);
    }
  };

  const handlePlayVoice = async () => {
    if (!scheme) return;
    setIsPlayingAudio(true);
    try {
      const textToSpeak = `${scheme.name}. ${scheme.nameHindi}. ${scheme.description}. Benefits: ${scheme.benefits}. Maximum financial benefit: ${scheme.benefitValue}.`;
      const res = await generateSpeech(textToSpeak);
      if (res.audio_url) {
        const audio = new Audio(res.audio_url);
        audio.onended = () => setIsPlayingAudio(false);
        audio.onerror = () => setIsPlayingAudio(false);
        await audio.play();
        setAudioPlayed(true);
      }
    } catch (err: any) {
      console.error(err);
      alert("Voice assistance error: " + (err.message || "Failed to play voice"));
      setIsPlayingAudio(false);
    }
  };

  const handleSubscribeAlert = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!alertDestination || !scheme) return;
    setIsSubscribing(true);
    try {
      const res = await subscribeAlert(alertDestination, scheme.name);
      setAlertSuccess(res.message || "Successfully subscribed for alerts via Amazon SNS!");
    } catch (err: any) {
      alert("Subscription error: " + (err.message || "Failed to subscribe"));
    } finally {
      setIsSubscribing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
        <span className="ml-4 text-xl text-gray-500 font-medium">Loading scheme details from AWS Cloud...</span>
      </div>
    );
  }

  if (error || !scheme) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
        <p className="text-gray-600 mb-6">{error || "Scheme not found"}</p>
        <Button onClick={() => router.back()}>Go Back</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Button variant="ghost" onClick={() => router.back()} className="mb-6 -ml-4 text-gray-600 hover:text-primary">
          <ArrowLeft className="w-5 h-5 mr-2" /> Back to Results
        </Button>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-orange-50 to-orange-100/50 p-8 border-b border-orange-100">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
              <div className="flex flex-wrap gap-2">
                <Badge className={getCategoryColor(scheme.category)}>{scheme.category}</Badge>
                <Badge variant="outline" className="bg-white"><Building2 className="w-3 h-3 mr-1" />{scheme.ministry}</Badge>
                {scheme.deadline && <Badge variant="destructive" className="bg-red-50 text-red-600 border-red-200"><Calendar className="w-3 h-3 mr-1" /> Deadline: {scheme.deadline}</Badge>}
              </div>

              {/* Amazon Polly Voice Player */}
              <Button 
                onClick={handlePlayVoice} 
                disabled={isPlayingAudio}
                variant="outline"
                className="bg-white border-orange-200 text-orange-700 hover:bg-orange-50 hover:text-orange-800 shadow-sm font-semibold flex items-center gap-2"
              >
                {isPlayingAudio ? (
                  <>
                    <Radio className="w-4 h-4 text-primary animate-pulse" />
                    <span>Speaking (Amazon Polly)...</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-4 h-4 text-primary" />
                    <span>{audioPlayed ? "Replay Audio" : "Listen (Indian Voice)"}</span>
                  </>
                )}
              </Button>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">{scheme.name}</h1>
            <p className="text-xl text-gray-500 mb-6">{scheme.nameHindi}</p>
            
            <div className="flex items-center gap-3 bg-white w-fit px-5 py-3 rounded-xl shadow-sm border border-orange-100">
              <IndianRupee className="w-6 h-6 text-primary" />
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Financial Benefit</p>
                <p className="text-xl font-black text-primary">{scheme.benefitValue}</p>
              </div>
            </div>
          </div>

          <div className="p-8">
            <div className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">About the Scheme</h2>
              <p className="text-gray-700 text-lg leading-relaxed">{scheme.description}</p>
              <p className="text-gray-700 text-lg leading-relaxed mt-4 font-semibold text-emerald-700 bg-emerald-50 p-4 rounded-xl border border-emerald-100">
                Key Benefits: {scheme.benefits}
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-10">
              <Card className="border-gray-100 shadow-sm">
                <CardHeader className="bg-gray-50/50 pb-4 border-b border-gray-50">
                  <h3 className="font-bold text-lg flex items-center"><CheckCircle2 className="w-5 h-5 mr-2 text-primary" /> Eligibility Checker</h3>
                </CardHeader>
                <CardContent className="pt-6">
                  <ul className="space-y-3">
                    {scheme.eligibilityCriteria && Object.entries(scheme.eligibilityCriteria).map(([key, value]) => {
                      if (!value) return null;
                      return (
                        <li key={key} className="flex items-start">
                          <CheckCircle2 className="w-5 h-5 mr-3 text-green-500 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}: <span className="font-semibold">{Array.isArray(value) ? value.join(', ') : value}</span></span>
                        </li>
                      );
                    })}
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-gray-100 shadow-sm">
                <CardHeader className="bg-gray-50/50 pb-4 border-b border-gray-50">
                  <h3 className="font-bold text-lg flex items-center"><FileText className="w-5 h-5 mr-2 text-primary" /> Required Documents</h3>
                </CardHeader>
                <CardContent className="pt-6">
                  <ul className="space-y-3">
                    {scheme.requiredDocuments?.map((doc, idx) => (
                      <li key={idx} className="flex items-center text-gray-700">
                        <div className="w-2 h-2 rounded-full bg-orange-400 mr-3"></div>
                        {doc}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            <div className="mb-10">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Application Process</h2>
                <Button onClick={handleGetGuide} disabled={isGuideLoading} className="bg-indigo-600 hover:bg-indigo-700 text-white">
                  {isGuideLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Sparkles className="w-4 h-4 mr-2" />}
                  Get AI Guide
                </Button>
              </div>

              {guide && (
                <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-6 mb-8 text-indigo-900">
                  <h3 className="font-bold text-lg mb-4 flex items-center">
                    <Sparkles className="w-5 h-5 mr-2 text-indigo-600" /> AI Personalized Guide
                  </h3>
                  {guide.steps ? (
                    <div className="space-y-3">
                      {guide.steps.map((st: string, idx: number) => (
                        <div key={idx} className="p-3 bg-white/80 rounded-lg text-sm text-gray-800 border border-indigo-100">
                          {st}
                        </div>
                      ))}
                      {guide.pro_tips && (
                        <div className="mt-4 pt-4 border-t border-indigo-200/50 space-y-2">
                          <p className="font-bold text-xs uppercase tracking-wider text-indigo-700">Pro Tips from AI Agent:</p>
                          {guide.pro_tips.map((tip: string, idx: number) => (
                            <p key={idx} className="text-xs text-indigo-800">{tip}</p>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm">{typeof guide === 'string' ? guide : JSON.stringify(guide)}</p>
                  )}
                </div>
              )}

              <div className="space-y-4">
                {scheme.applicationSteps?.map((step, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-orange-100 text-primary flex items-center justify-center font-bold">
                      {idx + 1}
                    </div>
                    <div className="pt-1 text-gray-700">{step}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Amazon SNS Scheme Alert Notification Card */}
            <div className="mb-10 p-6 bg-gradient-to-r from-orange-50/70 via-amber-50/50 to-orange-50/70 border border-orange-200/80 rounded-2xl">
              <div className="flex items-center gap-2 mb-2 text-orange-800">
                <Bell className="w-5 h-5 text-primary" />
                <h3 className="font-bold text-lg">Never Miss a Deadline: Get Free Alerts</h3>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Subscribe to receive SMS or Email reminders about application deadlines and fund disbursement status via Amazon SNS.
              </p>

              {alertSuccess ? (
                <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-sm font-medium flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  {alertSuccess}
                </div>
              ) : (
                <form onSubmit={handleSubscribeAlert} className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    required
                    placeholder="Enter email or mobile (+91...)"
                    value={alertDestination}
                    onChange={(e) => setAlertDestination(e.target.value)}
                    className="flex-1 px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 bg-white"
                  />
                  <Button 
                    type="submit" 
                    disabled={isSubscribing || !alertDestination}
                    className="bg-primary hover:bg-orange-600 text-white font-semibold"
                  >
                    {isSubscribing ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Subscribing...
                      </>
                    ) : (
                      <>
                        <Bell className="w-4 h-4 mr-2" />
                        Subscribe via Amazon SNS
                      </>
                    )}
                  </Button>
                </form>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-100">
              <a href={scheme.portalUrl} target="_blank" rel="noopener noreferrer" className="flex-1">
                <Button size="lg" className="w-full h-14 text-lg bg-primary hover:bg-orange-600 shadow-lg shadow-orange-200">
                  Apply on Official Portal <ExternalLink className="w-5 h-5 ml-2" />
                </Button>
              </a>
              <Button size="lg" variant="outline" className="h-14 text-lg border-gray-200 hover:bg-gray-50" onClick={() => {
                if (navigator.share) {
                  navigator.share({ title: scheme.name, url: window.location.href });
                } else {
                  navigator.clipboard.writeText(window.location.href);
                  alert("Link copied to clipboard!");
                }
              }}>
                Share Scheme
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}