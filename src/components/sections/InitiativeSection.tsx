import React from 'react';
import { Typography } from '../ui/Typography';
import { Grid } from '../layout/Grid';
import { Section } from '../layout/Section';

interface InitiativeSectionProps {
  content?: any;
}

export function InitiativeSection({ content }: InitiativeSectionProps) {
  const fallbackList = ['Unify fragmented systems', 'Elevate brand positioning', 'Automate operational friction'];
  const listItems = content?.list_items ? content.list_items : fallbackList;

  return (
    <Section className="bg-surface-card border-y border-surface-elevated">
      <Grid columns={12} gap="lg" className="items-center">
        
        <div className="col-span-12 md:col-span-5 lg:col-span-4">
          <Typography variant="label" className="mb-4 block text-accent-gold">{content?.badge || 'The Initiative'}</Typography>
          <Typography variant="h2" className="mb-6">{content?.headline || 'Advantage Compounds.'}</Typography>
          <Typography variant="body" className="mb-8">
            {content?.paragraph || 'The strongest businesses don\'t rely on one great decision. They build systems that consistently create better decisions. By unifying strategy, design, and engineering, we build the architecture that scales your advantage.'}
          </Typography>
          
          <ul className="space-y-4">
            {listItems.map((item: string, idx: number) => (
              <li key={idx} className="flex items-center gap-4 border-b border-surface-elevated pb-4 last:border-0">
                <div className="w-2 h-2 bg-accent-gold flex-shrink-0"></div>
                <span className="text-text-primary font-medium">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Abstract System Diagram */}
        <div className="col-span-12 md:col-span-7 lg:col-span-8 flex justify-center md:justify-end">
          <div className="w-full max-w-lg aspect-[4/3] bg-surface-deep rounded-[var(--radius-panel)] border border-surface-elevated p-8 relative flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0" 
                 style={{
                   backgroundImage: 'linear-gradient(rgba(0,0,0,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.05) 1px, transparent 1px)',
                   backgroundSize: '20px 20px'
                 }}>
            </div>
            
            {/* Diagram Nodes */}
            <div className="relative w-full h-full">
              <div className="absolute top-1/4 left-1/4 w-12 h-12 bg-white border-2 border-text-primary rounded-full z-10 flex items-center justify-center shadow-sm">
                <div className="w-2 h-2 bg-text-primary rounded-full"></div>
              </div>
              <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-white border-2 border-accent-gold rounded-full z-10 flex items-center justify-center shadow-sm">
                 <div className="w-4 h-4 bg-accent-gold rounded-full"></div>
              </div>
              <div className="absolute bottom-1/4 left-1/3 w-10 h-10 bg-white border-2 border-text-primary rounded-full z-10 flex items-center justify-center shadow-sm">
                <div className="w-2 h-2 bg-text-primary rounded-full"></div>
              </div>

              {/* SVG Connecting Lines */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
                <path d="M 25% 25% L 75% 50%" stroke="#E5E5E5" strokeWidth="2" fill="none" strokeDasharray="4 4" />
                <path d="M 33% 75% L 75% 50%" stroke="#E5E5E5" strokeWidth="2" fill="none" strokeDasharray="4 4" />
                <path d="M 25% 25% L 33% 75%" stroke="#E5E5E5" strokeWidth="2" fill="none" />
              </svg>
            </div>
          </div>
        </div>

      </Grid>
    </Section>
  );
}
