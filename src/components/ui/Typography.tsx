import React from 'react';

type TypographyVariant = 'hero' | 'h1' | 'h2' | 'h3' | 'h4' | 'body' | 'body-sm' | 'label' | 'metric';

interface TypographyProps extends React.HTMLAttributes<HTMLElement> {
  variant?: TypographyVariant;
  as?: React.ElementType;
  children: React.ReactNode;
}

export function Typography({ 
  variant = 'body', 
  as, 
  children, 
  className = '', 
  ...props 
}: TypographyProps) {
  
  const variantMap: Record<TypographyVariant, { tag: React.ElementType, classes: string }> = {
    hero: { tag: 'h1', classes: 'text-6xl md:text-8xl font-black leading-tight tracking-tight text-text-primary uppercase' },
    h1: { tag: 'h1', classes: 'text-4xl md:text-6xl font-bold leading-tight text-text-primary' },
    h2: { tag: 'h2', classes: 'text-3xl md:text-5xl font-bold leading-snug text-text-primary' },
    h3: { tag: 'h3', classes: 'text-2xl font-bold leading-snug text-text-primary' },
    h4: { tag: 'h4', classes: 'text-xl font-bold leading-snug text-text-primary' },
    body: { tag: 'p', classes: 'text-base md:text-lg text-text-secondary leading-relaxed font-medium' },
    "body-sm": { tag: 'p', classes: 'text-sm md:text-base text-text-secondary leading-relaxed font-medium' },
    label: { tag: 'span', classes: 'text-xs md:text-sm font-bold tracking-[0.2em] uppercase text-text-muted' },
    metric: { tag: 'span', classes: 'text-5xl md:text-7xl font-mono text-text-primary' }
  };

  const Component = as || variantMap[variant].tag;
  const combinedClasses = `${variantMap[variant].classes} ${className}`;

  return (
    <Component className={combinedClasses} {...props}>
      {children}
    </Component>
  );
}
