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
    hero: { tag: 'h1', classes: 'text-5xl md:text-6xl font-black leading-tight tracking-tight text-text-primary uppercase' },
    h1: { tag: 'h1', classes: 'text-3xl md:text-4xl font-bold leading-tight text-text-primary' },
    h2: { tag: 'h2', classes: 'text-2xl md:text-3xl font-bold leading-snug text-text-primary' },
    h3: { tag: 'h3', classes: 'text-xl md:text-2xl font-bold leading-snug text-text-primary' },
    h4: { tag: 'h4', classes: 'text-lg md:text-xl font-bold leading-snug text-text-primary' },
    body: { tag: 'p', classes: 'text-sm md:text-base text-text-secondary leading-relaxed font-medium' },
    "body-sm": { tag: 'p', classes: 'text-xs md:text-sm text-text-secondary leading-relaxed font-medium' },
    label: { tag: 'span', classes: 'text-xs font-bold tracking-[0.2em] uppercase text-text-muted' },
    metric: { tag: 'span', classes: 'text-4xl md:text-5xl font-mono text-text-primary' }
  };

  const Component = as || variantMap[variant].tag;
  const combinedClasses = `${variantMap[variant].classes} ${className}`;

  return (
    <Component className={combinedClasses} {...props}>
      {children}
    </Component>
  );
}
