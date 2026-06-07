import React from 'react';
import { Section } from '../layout/Section';
import { Grid } from '../layout/Grid';
import { Typography } from '../ui/Typography';

export interface ProcessStep {
  num: string;
  title: string;
  desc: string;
}

interface ProcessSectionProps {
  headline: string;
  subheadline: string;
  steps: ProcessStep[];
  className?: string;
}

export function ProcessSection({ headline, subheadline, steps, className = '' }: ProcessSectionProps) {
  return (
    <Section className={`bg-surface-panel border-b border-surface-elevated ${className}`}>
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24">
        <Grid columns={12} gap="lg">
          <div className="col-span-12 md:col-span-4">
            <Typography variant="h2" className="mb-6">{headline}</Typography>
            <Typography variant="body" className="mb-12">{subheadline}</Typography>
          </div>
          <div className="col-span-12 md:col-span-8">
            <div className="space-y-12">
              {steps.map((step, i) => (
                <div key={i} className="flex flex-col md:flex-row gap-6 md:gap-12 pb-12 border-b border-surface-elevated last:border-0 last:pb-0">
                  <Typography variant="h3" className="text-accent-gold shrink-0">{step.num}</Typography>
                  <div>
                    <Typography variant="h3" className="mb-3">{step.title}</Typography>
                    <Typography variant="body">{step.desc}</Typography>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Grid>
      </div>
    </Section>
  );
}
