import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export default function Input({ label, error, hint, id, className = "", ...props }: InputProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");
  return (
    <div className="input-group">
      {label && <label className="input-label" htmlFor={inputId}>{label}</label>}
      <input
        id={inputId}
        className={`input ${error ? "input-error" : ""} ${className}`}
        style={error ? { borderColor: "var(--red)", boxShadow: "0 0 0 3px rgba(239,68,68,0.12)" } : undefined}
        {...props}
      />
      {error && <span style={{ color: "var(--red)", fontSize: "0.8rem" }}>{error}</span>}
      {hint && !error && <span style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>{hint}</span>}
    </div>
  );
}
