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

  // SVG Math for the semi-circle
  const radius = 80;
  const circumference = Math.PI * radius;
  const strokeDashoffset = circumference - (circumference * (animatedScore / maxScore));

  // --- Dynamic Color Math ---
  // Clamp the ratio between 0 and 1, just in case
  const scoreRatio = Math.min(Math.max(animatedScore / maxScore, 0), 1);
  
  // Map the ratio to a Hue (0 = Red, 120 = Green)
  const hue = Math.floor(scoreRatio * 120);
  
  // Construct dynamic CSS HSL strings
  const dynamicColor = `hsl(${hue}, 85%, 45%)`;
  const dynamicBgColor = `hsla(${hue}, 85%, 45%, 0.1)`; // 10% opacity for the pill background

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
          className="transition-all duration-1000 ease-out"
          stroke={dynamicColor}
          strokeWidth="16"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
        />
      </svg>

      {/* Center Text (Score) */}
      <div className="absolute top-[40%] flex flex-col items-center text-center">
        <span className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">Health Card</span>
        <span 
          className="text-5xl font-black transition-colors duration-1000 ease-out"
          style={{ color: dynamicColor }}
        >
          {animatedScore}
        </span>
        <span className="text-gray-400 text-sm mt-1">/ {maxScore}</span>
      </div>

      {/* Decision Pill */}
      <div 
        className="mt-6 px-6 py-2 rounded-full text-sm font-bold border shadow-sm transition-colors duration-1000 ease-out uppercase tracking-wide"
        style={{ 
          color: dynamicColor, 
          borderColor: dynamicColor, 
          backgroundColor: dynamicBgColor 
        }}
      >
        {decision.replace("_", " ")}
      </div>
    </div>
  );
}