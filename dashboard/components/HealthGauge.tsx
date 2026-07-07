// dashboard/components/HealthGauge.tsx
import React, { useEffect, useState } from 'react';

interface HealthGaugeProps {
  score: number;
  decision: string;
  maxScore?: number;
}

export default function HealthGauge({ score, decision, maxScore = 100 }: HealthGaugeProps) {
  const [animatedScore, setAnimatedScore] = useState(0);

  // Animate the gauge on load
  useEffect(() => {
    const timer = setTimeout(() => setAnimatedScore(score), 100);
    return () => clearTimeout(timer);
  }, [score]);

  // Determine colors based on the decision
  const isApproved = decision === "APPROVED";
  const isRejected = decision === "REJECTED";
  
  const colorClass = isApproved ? "text-green-500" : isRejected ? "text-red-500" : "text-yellow-500";
  const bgClass = isApproved ? "bg-green-50 border-green-200 text-green-700" : isRejected ? "bg-red-50 border-red-200 text-red-700" : "bg-yellow-50 border-yellow-200 text-yellow-700";

  // SVG Math for the semi-circle
  const radius = 80;
  const circumference = Math.PI * radius; // Half circle length
  const strokeDashoffset = circumference - (circumference * (animatedScore / maxScore));

  return (
    <div className="flex flex-col items-center justify-center relative w-full max-w-xs mx-auto">
      {/* SVG Semi-Circle */}
      <svg className="w-full overflow-visible" viewBox="0 0 200 110">
        {/* Background Arc */}
        <path
          d="M 20 100 a 80 80 0 0 1 160 0"
          fill="none"
          stroke="#f3f4f6"
          strokeWidth="16"
          strokeLinecap="round"
        />
        {/* Foreground Colored Arc */}
        <path
          d="M 20 100 a 80 80 0 0 1 160 0"
          fill="none"
          className={`${colorClass} transition-all duration-1000 ease-out`}
          stroke="currentColor"
          strokeWidth="16"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
        />
      </svg>

      {/* Center Text (Score) */}
      <div className="absolute top-[40%] flex flex-col items-center text-center">
        <span className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">Health Card</span>
        <span className={`text-5xl font-black ${colorClass}`}>
          {animatedScore}
        </span>
        <span className="text-gray-400 text-sm mt-1">/ {maxScore}</span>
      </div>

      {/* Decision Pill */}
      <div className={`mt-6 px-6 py-2 rounded-full text-sm font-bold border shadow-sm ${bgClass}`}>
        {decision.replace("_", " ")}
      </div>
    </div>
  );
}