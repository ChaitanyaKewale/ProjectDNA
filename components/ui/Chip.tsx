interface ChipProps {
  children: React.ReactNode;
  onRemove?: () => void;
  className?: string;
}

export default function Chip({ children, onRemove, className = "" }: ChipProps) {
  return (
    <span className={`chip ${className}`}>
      {children}
      {onRemove && (
        <button
          onClick={onRemove}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "0 0 0 4px",
            color: "inherit",
            fontSize: "0.9em",
            lineHeight: 1,
            opacity: 0.6,
            transition: "opacity 0.15s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.6")}
          aria-label="Remove"
        >
          ×
        </button>
      )}
    </span>
  );
}
