import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger";
}

export function Button({ 
  children, 
  variant = "primary", 
  className = "", 
  ...props 
}: ButtonProps) {
  const baseStyles = "px-4 py-2 rounded-lg font-medium transition-colors focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2";
  
  const variants = {
    primary: "bg-[var(--glassmorphism-primary)] hover:bg-[var(--glassmorphism-primary-hover)] text-white",
    secondary: "bg-[var(--glassmorphism-surface)] border border-[var(--glassmorphism-border)] text-[var(--glassmorphism-text)] hover:border-[var(--glassmorphism-primary)]",
    danger: "bg-[var(--glassmorphism-danger)] hover:opacity-90 text-white",
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className}`} 
      {...props}
    >
      {children}
    </button>
  );
}
