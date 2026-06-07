import React from 'react';

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  container?: boolean;
}

export function Section({ children, container = true, className = '', ...props }: SectionProps) {
  const baseClasses = "py-24 md:py-32 w-full";
  const containerClasses = container ? "max-w-7xl mx-auto px-6 md:px-12 lg:px-24" : "";

  return (
    <section className={`${baseClasses} ${containerClasses} ${className}`} {...props}>
      {children}
    </section>
  );
}
