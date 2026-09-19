"use client";

import { motion } from "framer-motion";
import { SchemeMatch } from "@/lib/types";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import EligibilityRing from "./EligibilityRing";
import { getCategoryColor } from "@/lib/utils";
import Link from "next/link";
import { ArrowRight, Landmark, ExternalLink, Video, Phone } from "lucide-react";
import { Button } from "./ui/button";

interface SchemeCardProps {
  match: SchemeMatch;
  isSelectedForCompare?: boolean;
  onToggleCompare?: (id: string) => void;
}

export default function SchemeCard({ 
  match, 
  isSelectedForCompare = false, 
  onToggleCompare 
}: SchemeCardProps) {
  const { scheme, eligibilityScore } = match;

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
      className="h-full"
    >
      <Card className={`h-full flex flex-col transition-all rounded-3xl overflow-hidden bg-slate-900/90 backdrop-blur-xl border ${
        isSelectedForCompare 
          ? "border-primary ring-2 ring-primary/40 shadow-xl shadow-orange-500/10" 
          : "border-slate-800 hover:border-orange-500/50 hover:shadow-2xl hover:shadow-orange-500/10"
      }`}>
        <CardHeader className="pb-3.5 border-b border-slate-800/80 bg-slate-950/60">
          <div className="flex justify-between items-start gap-4">
            <div>
              <h3 className="font-bold text-lg text-white leading-tight mb-1">{scheme.name}</h3>
              <p className="text-xs sm:text-sm text-orange-400 font-medium mb-3">{scheme.nameHindi}</p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="bg-slate-800/80 border-slate-700 text-slate-300 flex items-center gap-1 text-[11px]">
                  <Landmark className="w-3 h-3 text-orange-400" />
                  {scheme.ministry}
                </Badge>
                <Badge className={getCategoryColor(scheme.category)} variant="secondary">
                  {scheme.category}
                </Badge>
              </div>
            </div>
            <div className="flex-shrink-0 bg-slate-950 rounded-full border border-slate-800 p-1 shadow-inner">
              <EligibilityRing score={eligibilityScore} size={54} strokeWidth={5} />
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="pt-4 flex-grow space-y-3.5">
          <div className="flex items-center justify-between">
            <div>
              <span className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5">Financial Benefit</span>
              <span className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-300 to-emerald-400">
                {scheme.benefitValue}
              </span>
            </div>
            {scheme.helpline && (
              <a 
                href={`tel:${scheme.helpline.split('/')[0].trim()}`}
                className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 px-2.5 py-1 rounded-lg border border-emerald-500/30 transition-colors"
                title="Official Helpline"
              >
                <Phone className="w-3 h-3 text-emerald-400" />
                <span>{scheme.helpline.split('/')[0].trim()}</span>
              </a>
            )}
          </div>
          <p className="text-slate-300 text-xs sm:text-sm line-clamp-2 leading-relaxed">{scheme.description}</p>

          {/* Quick Help Strip: YouTube Guide & Direct Portal Notice */}
          <div className="pt-2.5 flex flex-wrap items-center justify-between gap-2 border-t border-slate-800/80 text-[11px]">
            {scheme.youtubeGuideUrl ? (
              <a 
                href={scheme.youtubeGuideUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 font-bold text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 px-2 py-1 rounded-md border border-red-500/30 transition-colors"
              >
                <Video className="w-3.5 h-3.5 text-red-400" />
                <span>How to Apply (Video)</span>
              </a>
            ) : <span />}
            
            <span className="text-slate-500 text-[10px] font-medium">Official Government Source</span>
          </div>
        </CardContent>

        <CardFooter className="pt-3 pb-4 flex flex-col gap-2 bg-slate-950/80 border-t border-slate-800/80">
          <div className="flex flex-col sm:flex-row items-center gap-2 w-full">
            {/* Direct Official Registration Portal Button */}
            <a 
              href={scheme.registrationUrl || scheme.portalUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="w-full sm:flex-1"
            >
              <Button size="sm" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-900/30 flex items-center justify-center gap-1.5 rounded-xl cursor-pointer">
                <span>Apply / Register</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Button>
            </a>

            <div className="flex items-center gap-1.5 w-full sm:w-auto">
              <Link href={`/scheme/${scheme.id}`} prefetch={false} className="flex-1 sm:flex-initial">
                <Button variant="outline" size="sm" className="w-full border-slate-700 text-slate-200 hover:bg-slate-800 hover:text-white transition-colors text-xs font-bold px-3 rounded-xl cursor-pointer">
                  Details
                  <ArrowRight className="w-3 h-3 ml-1" />
                </Button>
              </Link>
              {onToggleCompare && (
                <Button
                  variant={isSelectedForCompare ? "default" : "secondary"}
                  size="sm"
                  onClick={() => onToggleCompare(scheme.id)}
                  className={`text-xs font-medium px-2.5 rounded-xl cursor-pointer ${
                    isSelectedForCompare 
                      ? "bg-primary text-white hover:bg-orange-600" 
                      : "bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700"
                  }`}
                >
                  {isSelectedForCompare ? "✓" : "+"}
                </Button>
              )}
            </div>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
