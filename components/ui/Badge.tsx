type BadgeColor = "violet" | "cyan" | "emerald" | "amber" | "red" | "pink";

interface BadgeProps {
  children: React.ReactNode;
  color?: BadgeColor;
  className?: string;
}

export default function Badge({ children, color = "violet", className = "" }: BadgeProps) {
  return (
    <span className={`badge badge-${color} ${className}`}>
      {children}
    </span>
  );
}
