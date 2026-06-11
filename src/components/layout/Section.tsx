import React from 'react';

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  container?: boolean;
}

export function Section({ children, container = true, className = '', ...props }: SectionProps) {
  const baseClasses = "py-16 md:py-24 w-full min-h-[80vh] flex flex-col justify-center";
  const containerClasses = container ? "max-w-7xl mx-auto px-6 md:px-12 lg:px-24 w-full" : "";

  return (
    <section className={`${baseClasses} ${className}`} {...props}>
      <div className={containerClasses}>
        {children}
      </div>
    </section>
  );
}
