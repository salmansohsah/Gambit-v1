import React from 'react';

type ButtonVariant = 'primary' | 'accent' | 'text' | 'inverse' | 'outline';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  children: React.ReactNode;
}

export function Button({ variant = 'primary', children, className = '', ...props }: ButtonProps) {
  const baseClasses = "inline-flex items-center justify-center px-8 py-4 text-sm font-bold uppercase tracking-[0.1em] transition-all duration-300 ease-out rounded-[var(--radius-btn)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-gold focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none";
  
  const variantClasses = {
    primary: "bg-obsidian text-text-inverse border border-obsidian hover:translate-y-[-2px] hover:shadow-[0_4px_0_0_#0A0A0A]",
    accent: "bg-accent-gold text-obsidian border border-accent-gold hover:bg-transparent hover:text-accent-gold hover:translate-y-[-2px] hover:shadow-[0_4px_0_0_#D6B87A]",
    inverse: "bg-transparent text-obsidian border border-obsidian hover:bg-obsidian hover:text-text-inverse hover:translate-y-[-2px] hover:shadow-[0_4px_0_0_#0A0A0A]",
    outline: "bg-transparent text-obsidian border border-[#E5E5E5] hover:border-obsidian hover:translate-y-[-2px] hover:shadow-[0_4px_0_0_#0A0A0A]",
    text: "px-0 py-1 bg-transparent text-text-primary border-b border-text-primary hover:text-accent-gold hover:border-accent-gold rounded-none"
  };

  return (
    <button 
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
