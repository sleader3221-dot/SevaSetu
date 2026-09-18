"use client";

import { motion } from "framer-motion";
import { SchemeMatch } from "@/lib/types";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import EligibilityRing from "./EligibilityRing";
import { getCategoryColor } from "@/lib/utils";
import Link from "next/link";
import { ArrowRight, Landmark } from "lucide-react";
import { Button } from "./ui/button";

interface SchemeCardProps {
  match: SchemeMatch;
}

export default function SchemeCard({ match }: SchemeCardProps) {
  const { scheme, eligibilityScore } = match;

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
      className="h-full"
    >
      <Card className="h-full flex flex-col hover:shadow-lg transition-shadow bg-white overflow-hidden border-orange-100">
        <CardHeader className="pb-3 border-b border-gray-50 bg-orange-50/30">
          <div className="flex justify-between items-start gap-4">
            <div>
              <h3 className="font-bold text-lg text-gray-900 leading-tight mb-1">{scheme.name}</h3>
              <p className="text-sm text-gray-500 mb-3">{scheme.nameHindi}</p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="bg-white border-gray-200 text-gray-600 flex items-center gap-1">
                  <Landmark className="w-3 h-3" />
                  {scheme.ministry}
                </Badge>
                <Badge className={getCategoryColor(scheme.category)} variant="secondary">
                  {scheme.category}
                </Badge>
              </div>
            </div>
            <div className="flex-shrink-0 bg-white rounded-full shadow-sm p-1">
              <EligibilityRing score={eligibilityScore} size={54} strokeWidth={5} />
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="pt-4 flex-grow">
          <div className="mb-4">
            <span className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Financial Benefit</span>
            <span className="text-xl font-extrabold text-primary">{scheme.benefitValue}</span>
          </div>
          <p className="text-gray-600 text-sm line-clamp-2">{scheme.description}</p>
        </CardContent>

        <CardFooter className="pt-2 pb-4">
          <Link href={`/scheme/${scheme.id}`} className="w-full">
            <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary hover:text-white transition-colors group">
              View Details
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
