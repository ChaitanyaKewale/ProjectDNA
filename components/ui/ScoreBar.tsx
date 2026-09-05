"use client";

import { useEffect, useRef, useState } from "react";

interface ScoreBarProps {
  label: string;
  value: number; // 0-100
  color?: "violet" | "cyan" | "emerald" | "amber" | "pink";
  animated?: boolean;
  showValue?: boolean;
}

const colorMap = {
  violet:  "linear-gradient(90deg,#7c3aed,#a855f7)",
  cyan:    "linear-gradient(90deg,#06b6d4,#22d3ee)",
  emerald: "linear-gradient(90deg,#10b981,#34d399)",
  amber:   "linear-gradient(90deg,#f59e0b,#fbbf24)",
  pink:    "linear-gradient(90deg,#ec4899,#f472b6)",
};

export default function ScoreBar({
  label,
  value,
  color = "violet",
  animated = true,
  showValue = true,
}: ScoreBarProps) {
  const [width, setWidth] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!animated) { setWidth(value); return; }
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setWidth(value); },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value, animated]);

  return (
    <div className="score-bar-wrapper" ref={ref}>
      <div className="score-bar-label">
        <span>{label}</span>
        {showValue && <span style={{ color: "var(--text-primary)", fontWeight: 600 }}>{value}%</span>}
      </div>
      <div className="score-bar-track">
        <div
          className="score-bar-fill"
          style={{
            width: `${width}%`,
            background: colorMap[color],
            transition: animated ? "width 0.8s cubic-bezier(0.4,0,0.2,1)" : "none",
          }}
        />
      </div>
    </div>
  );
}
