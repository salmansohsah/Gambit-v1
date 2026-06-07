import React from 'react';

interface PanelProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  theme?: 'light' | 'dark' | 'transparent';
}

export function Panel({ children, theme = 'light', className = '', ...props }: PanelProps) {
  const baseClasses = "p-8 md:p-12 lg:p-16 rounded-[var(--radius-panel)] transition-all duration-300";
  
  const themeClasses = {
    light: "bg-surface-card border border-surface-elevated shadow-sm",
    dark: "bg-obsidian text-text-inverse border border-[#222]",
    transparent: "bg-transparent border border-surface-elevated"
  };

  return (
    <div className={`${baseClasses} ${themeClasses[theme]} ${className}`} {...props}>
      {children}
    </div>
  );
}
