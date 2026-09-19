"use client";

import { useState, useRef, useEffect } from "react";
import { chatWithAI, generateSpeech } from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Bot, X, Send, Sparkles, User, Volume2, ExternalLink, Loader2, MessageSquare, ArrowRight 
} from "lucide-react";
import Link from "next/link";

interface Message {
  role: "user" | "assistant";
  text: string;
  schemes?: any[];
}

export default function SevaMitraChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      text: "Namaste! 🙏 I am SevaMitra, your AI Government Scheme Navigator. Ask me anything like: 'What schemes are available for college students?' or 'How can farmers get ₹6,000 yearly?'"
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async (customMessage?: string) => {
    const textToSend = customMessage || input;
    if (!textToSend.trim() || isLoading) return;

    const newMessages: Message[] = [...messages, { role: "user", text: textToSend }];
    setMessages(newMessages);
    if (!customMessage) setInput("");
    setIsLoading(true);

    try {
      const savedProfile = localStorage.getItem("userProfile");
      const profile = savedProfile ? JSON.parse(savedProfile) : null;
      
      const res = await chatWithAI(textToSend, profile);
      setMessages([...newMessages, {
        role: "assistant",
        text: res.reply,
        schemes: res.schemes || []
      }]);
    } catch (err: any) {
      setMessages([...newMessages, {
        role: "assistant",
        text: "I apologize, I could not process your query right now. Please try again or browse our scheme categories directly."
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSpeak = async (text: string) => {
    setIsPlayingAudio(true);
    try {
      const cleanText = text.replace(/[*_#•\[\]]/g, "").slice(0, 300);
      const res = await generateSpeech(cleanText);
      if (res.audio_url) {
        const audio = new Audio(res.audio_url);
        audio.onended = () => setIsPlayingAudio(false);
        audio.onerror = () => setIsPlayingAudio(false);
        await audio.play();
      }
    } catch (e) {
      setIsPlayingAudio(false);
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-full bg-gradient-to-r from-primary to-orange-500 text-white font-bold shadow-2xl hover:shadow-orange-500/40 hover:scale-105 transition-all duration-300 group"
          aria-label="Ask SevaMitra AI"
        >
          <div className="relative">
            <Bot className="w-6 h-6 animate-bounce" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-white"></span>
          </div>
          <span className="text-sm tracking-wide">Ask SevaMitra AI</span>
          <span className="bg-white/20 text-xs px-2 py-0.5 rounded-full text-white/90 group-hover:bg-white/30">
            Live
          </span>
        </button>
      )}

      {/* Chat Drawer / Modal */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[92vw] sm:w-[420px] h-[580px] bg-white rounded-3xl shadow-2xl border border-orange-100 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-300">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary to-orange-600 p-4 text-white flex items-center justify-between shadow-md">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-base flex items-center gap-1.5">
                  SevaMitra AI <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                </h3>
                <p className="text-xs text-orange-100 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  Connected to AWS Multi-Agent Core
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-xl hover:bg-white/20 transition-colors text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Starter Chips */}
          <div className="p-2.5 bg-orange-50/50 border-b border-orange-100 flex gap-2 overflow-x-auto text-xs no-scrollbar">
            <button
              onClick={() => handleSend("Scholarships for female students")}
              className="whitespace-nowrap px-3 py-1 rounded-full bg-white border border-orange-200 text-orange-800 hover:bg-orange-100 transition-colors"
            >
              🎓 Student Scholarships
            </button>
            <button
              onClick={() => handleSend("Farmer subsidy and financial benefits")}
              className="whitespace-nowrap px-3 py-1 rounded-full bg-white border border-orange-200 text-orange-800 hover:bg-orange-100 transition-colors"
            >
              🌾 Farmer Benefits
            </button>
            <button
              onClick={() => handleSend("Free hospital and medical coverage")}
              className="whitespace-nowrap px-3 py-1 rounded-full bg-white border border-orange-200 text-orange-800 hover:bg-orange-100 transition-colors"
            >
              🏥 Health Coverage
            </button>
          </div>

          {/* Message Stream */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-50/50">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex gap-3 ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {m.role === "assistant" && (
                  <div className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div className={`max-w-[85%] space-y-2`}>
                  <div
                    className={`p-3.5 rounded-2xl text-sm leading-relaxed ${
                      m.role === "user"
                        ? "bg-primary text-white rounded-tr-sm shadow-md"
                        : "bg-white text-gray-800 border border-gray-100 shadow-sm rounded-tl-sm whitespace-pre-line"
                    }`}
                  >
                    {m.text}
                  </div>

                  {/* Schemes Attached */}
                  {m.schemes && m.schemes.length > 0 && (
                    <div className="space-y-1.5 pt-1">
                      {m.schemes.map((s, sIdx) => (
                        <Card key={sIdx} className="p-2.5 bg-white border-orange-100 shadow-xs hover:border-primary/50 transition-colors">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-xs text-gray-900 truncate max-w-[180px]">{s.name}</span>
                            <span className="text-[10px] font-bold text-primary bg-orange-50 px-1.5 py-0.5 rounded">{s.benefit_value}</span>
                          </div>
                          <div className="flex justify-between items-center mt-1.5 text-[11px]">
                            <span className="text-gray-500 truncate max-w-[120px]">{s.ministry}</span>
                            <div className="flex items-center gap-2">
                              <a 
                                href={s.registration_url || s.portal_url} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="text-emerald-700 hover:underline font-bold flex items-center gap-0.5"
                              >
                                Apply <ExternalLink className="w-2.5 h-2.5" />
                              </a>
                              {s.youtube_guide_url && (
                                <a 
                                  href={s.youtube_guide_url} 
                                  target="_blank" 
                                  rel="noopener noreferrer" 
                                  className="text-red-600 hover:underline font-bold"
                                >
                                  Video
                                </a>
                              )}
                              <Link href={`/scheme/${s.id}`} className="text-primary hover:underline font-semibold flex items-center gap-0.5">
                                Details <ArrowRight className="w-3 h-3" />
                              </Link>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}

                  {/* Audio Listen button for assistant responses */}
                  {m.role === "assistant" && (
                    <button
                      onClick={() => handleSpeak(m.text)}
                      disabled={isPlayingAudio}
                      className="inline-flex items-center gap-1 text-[11px] text-gray-500 hover:text-primary transition-colors font-medium px-2 py-0.5 rounded"
                    >
                      <Volume2 className="w-3 h-3" /> Listen via Amazon Polly
                    </button>
                  )}
                </div>

                {m.role === "user" && (
                  <div className="w-7 h-7 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-3 justify-start items-center text-gray-500 text-xs pl-2">
                <Bot className="w-5 h-5 text-primary animate-spin" />
                <span>SevaMitra is analyzing government schemes...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Footer */}
          <div className="p-3 border-t border-gray-100 bg-white">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about any scheme or need..."
                className="flex-1 px-4 py-2.5 text-sm rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/40 bg-gray-50"
              />
              <Button
                type="submit"
                size="icon"
                disabled={isLoading || !input.trim()}
                className="bg-primary hover:bg-orange-600 text-white rounded-xl h-10 w-10 flex-shrink-0 shadow-md"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </Button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}