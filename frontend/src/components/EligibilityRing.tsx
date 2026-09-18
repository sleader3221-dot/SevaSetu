"use client";

import { motion } from "framer-motion";
import { getEligibilityColor } from "@/lib/utils";

interface EligibilityRingProps {
  score: number;
  size?: number;
  strokeWidth?: number;
}

export default function EligibilityRing({
  score,
  size = 60,
  strokeWidth = 6,
}: EligibilityRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (score / 100) * circumference;

  let colorClass = "stroke-red-500";
  if (score >= 90) colorClass = "stroke-green-500";
  else if (score >= 70) colorClass = "stroke-yellow-500";

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          className="stroke-muted"
          strokeWidth={strokeWidth}
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <motion.circle
          className={colorClass}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={circumference}
          strokeLinecap="round"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center font-semibold" style={{ fontSize: size * 0.28 }}>
        <span className={getEligibilityColor(score)}>{score}%</span>
      </div>
    </div>
  );
}
