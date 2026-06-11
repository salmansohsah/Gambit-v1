import React from 'react';
import { Typography } from '../ui/Typography';
import { Card } from '../ui/Card';
import { Grid } from '../layout/Grid';
import { Section } from '../layout/Section';

interface Capability {
  title: string;
  short_description: string;
}

interface WhatWeDoSectionProps {
  capabilities?: Capability[];
  content?: any;
}

export function WhatWeDoSection({ capabilities = [], content }: WhatWeDoSectionProps) {
  const fallbackCapabilities: Capability[] = [
    { title: 'Strategy', short_description: 'We build strategies that win market share and outmaneuver competitors.' },
    { title: 'Branding', short_description: 'We design brands that command premium positioning and authority.' },
    { title: 'Design', short_description: 'We craft elite, conversion-focused user experiences with sharp aesthetics.' },
    { title: 'Development', short_description: 'We engineer scalable, high-performance platforms that drive growth.' },
    { title: 'AI Systems', short_description: 'We integrate proprietary AI solutions to automate and dominate markets.' },
    { title: 'Automation', short_description: 'We deploy intelligent workflows that eliminate friction and accelerate speed.' }
  ];

  const displayCapabilities = capabilities && capabilities.length > 0 ? capabilities : fallbackCapabilities;

  return (
    <Section className="bg-surface-deep text-text-primary">
      <div className="mb-16">
        <Typography variant="label" className="mb-4 block text-accent-gold">
          {content?.badge || 'What We Do'}
        </Typography>
        <Typography variant="h2" className="whitespace-pre-line max-w-3xl">
          {content?.headline || 'We architect digital systems that generate lasting competitive advantage.'}
        </Typography>
      </div>

      <Grid columns={12} gap="lg">
        {displayCapabilities.map((cap, i) => (
          <div key={cap.title} className="col-span-12 md:col-span-6 lg:col-span-4">
            <Card 
              interactive 
              className="h-full group relative overflow-hidden bg-surface-card border border-surface-elevated rounded-[2px]"
            >
              {/* Top Accent Line */}
              <div className="absolute top-0 left-0 w-full h-[2px] bg-surface-elevated transform origin-left scale-x-0 group-hover:scale-x-100 group-hover:bg-accent-gold transition-transform duration-500"></div>
              
              <div className="flex flex-col h-full justify-between">
                <div>
                  <Typography variant="h3" className="mb-4 font-bold tracking-tight">
                    {cap.title}
                  </Typography>
                  <Typography variant="body" className="text-text-muted leading-relaxed">
                    {cap.short_description}
                  </Typography>
                </div>
                
                <div className="mt-8 flex items-center text-sm font-semibold tracking-wider uppercase text-text-secondary group-hover:text-accent-gold transition-colors duration-300">
                  <span className="mr-2">&mdash;</span> Discover
                </div>
              </div>
            </Card>
          </div>
        ))}
      </Grid>
    </Section>
  );
}
