import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  gradient?: boolean;
  padding?: "sm" | "md" | "lg" | "none";
  onClick?: () => void;
}

export default function Card({
  children,
  className = "",
  hover = true,
  gradient = false,
  padding = "md",
  onClick,
}: CardProps) {
  const paddingMap = { none: "0", sm: "1rem", md: "1.5rem", lg: "2rem" };

  return (
    <div
      className={`glass-card ${gradient ? "gradient-border" : ""} ${className}`}
      style={{
        padding: paddingMap[padding],
        cursor: onClick ? "pointer" : undefined,
        transition: "all 0.25s ease",
      }}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
