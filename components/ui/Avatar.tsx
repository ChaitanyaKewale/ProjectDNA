import Image from "next/image";

interface AvatarProps {
  src?: string | null;
  name?: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

function getInitials(name?: string) {
  if (!name) return "?";
  return name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();
}

function getColor(name?: string) {
  const colors = [
    "linear-gradient(135deg,#7c3aed,#06b6d4)",
    "linear-gradient(135deg,#ec4899,#7c3aed)",
    "linear-gradient(135deg,#06b6d4,#10b981)",
    "linear-gradient(135deg,#f59e0b,#ec4899)",
    "linear-gradient(135deg,#10b981,#06b6d4)",
  ];
  if (!name) return colors[0];
  const idx = name.charCodeAt(0) % colors.length;
  return colors[idx];
}

export default function Avatar({ src, name, size = "md", className = "" }: AvatarProps) {
  const sizeClass = `avatar avatar-${size}`;
  const sizeMap = { sm: 32, md: 44, lg: 64, xl: 96 };
  const px = sizeMap[size];

  if (src) {
    return (
      <div className={`${sizeClass} ${className}`} style={{ overflow: "hidden" }}>
        <Image src={src} alt={name || "avatar"} width={px} height={px} style={{ objectFit: "cover", borderRadius: "50%" }} />
      </div>
    );
  }

  return (
    <div
      className={`${sizeClass} ${className}`}
      style={{ background: getColor(name) }}
      title={name}
    >
      {getInitials(name)}
    </div>
  );
}
