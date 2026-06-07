import React from 'react';

interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  columns?: 1 | 2 | 3 | 4 | 12;
  gap?: 'none' | 'sm' | 'md' | 'lg';
  asymmetric?: boolean;
}

export function Grid({ 
  children, 
  columns = 12, 
  gap = 'md', 
  asymmetric = false,
  className = '', 
  ...props 
}: GridProps) {
  
  const colClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-4',
    12: 'grid-cols-1 md:grid-cols-12'
  };

  const gapClasses = {
    none: 'gap-0',
    sm: 'gap-4',
    md: 'gap-8',
    lg: 'gap-12 md:gap-16'
  };

  const asymmetricClasses = asymmetric ? "items-start" : "";

  return (
    <div className={`grid ${colClasses[columns]} ${gapClasses[gap]} ${asymmetricClasses} ${className}`} {...props}>
      {children}
    </div>
  );
}
