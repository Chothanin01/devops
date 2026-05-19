import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
}

export function Card({ children, className = "", title }: CardProps) {
  return (
    <div className={`bg-[var(--glassmorphism-surface)] rounded-lg border border-[var(--glassmorphism-border)] overflow-hidden ${className}`}>
      {title && (
        <div className="px-6 py-4 border-b border-[var(--glassmorphism-border)]">
          <h3 className="text-lg font-semibold text-[var(--glassmorphism-text)]">{title}</h3>
        </div>
      )}
      <div className="p-6">{children}</div>
    </div>
  );
}
