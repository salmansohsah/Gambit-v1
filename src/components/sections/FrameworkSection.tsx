import React from 'react';
import { Typography } from '../ui/Typography';
import { Card } from '../ui/Card';
import { Grid } from '../layout/Grid';
import { Section } from '../layout/Section';

interface FrameworkSectionProps {
  content?: any;
  capabilities?: any[];
}

export function FrameworkSection({ content, capabilities = [] }: FrameworkSectionProps) {
  const fallbackCapabilities = [
    { title: 'Strategy', short_description: 'Define your position, analyze the landscape, and plot the course to definitive advantage.' },
    { title: 'Brand', short_description: 'Build an identity that communicates authority and demands premium positioning.' },
    { title: 'Digital Experience', short_description: 'Architect websites and applications that convert attention into commitment.' },
    { title: 'Technology', short_description: 'Develop scalable foundations that reduce friction and increase operational efficiency.' },
    { title: 'Automation', short_description: 'Eliminate manual bottlenecks. Let systems handle the repetitive while you focus on the strategic.' },
    { title: 'Growth', short_description: 'Deploy targeted campaigns that capture demand and expand your market footprint.' }
  ];

  const displayCapabilities = capabilities && capabilities.length > 0 ? capabilities : fallbackCapabilities;

  return (
    <Section>
      <div className="mb-20">
        <Typography variant="label" className="mb-4 block">{content?.badge || 'The Framework'}</Typography>
        <Typography variant="h2" className="whitespace-pre-line">{content?.headline || 'Every Position Matters.'}</Typography>
      </div>

      <Grid columns={12} gap="md">
        {displayCapabilities.map((cap, i) => (
          <div key={cap.title} className="col-span-1 md:col-span-6 lg:col-span-4">
            <Card interactive className="h-full group relative overflow-hidden">
              <div className="absolute bottom-0 left-0 w-full h-1 bg-surface-elevated transform translate-y-full group-hover:translate-y-0 group-hover:bg-accent-blue transition-all duration-300"></div>
              
              <div className="flex justify-between items-start mb-8">
                <div className="w-10 h-10 border border-surface-elevated rounded flex items-center justify-center group-hover:border-accent-blue transition-colors">
                  <div className="w-3 h-3 bg-surface-elevated group-hover:bg-accent-blue transition-colors"></div>
                </div>
                <Typography variant="label" className="text-text-muted font-mono">{`0${i+1}`}</Typography>
              </div>
              
              <Typography variant="h4" className="mb-4">{cap.title}</Typography>
              <Typography variant="body" className="text-sm">{cap.short_description}</Typography>
            </Card>
          </div>
        ))}
      </Grid>
    </Section>
  );
}
