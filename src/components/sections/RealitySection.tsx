import React from 'react';
import { Typography } from '../ui/Typography';
import { Grid } from '../layout/Grid';
import { Section } from '../layout/Section';

interface RealitySectionProps {
  content?: any;
}

export function RealitySection({ content }: RealitySectionProps) {
  return (
    <Section className="bg-surface-card border-y border-surface-elevated">
      <Grid columns={12} gap="lg" className="items-center">
        <div className="col-span-12 md:col-span-5">
          <Typography variant="label" className="mb-6 block">{content?.badge || 'Why GAMBIT'}</Typography>
          <Typography variant="h2" className="mb-6">
            {content?.headline || 'Engineered for market dominance.'}
          </Typography>
        </div>
        
        <div className="col-span-12 md:col-span-6 md:col-start-7">
          <div className="pl-0 md:pl-8 border-l-0 md:border-l border-surface-elevated">
            <Typography variant="body" className="mb-6 text-lg">
              {content?.paragraph_1 || 'We don\'t do "best practices" because best practices are just average. We architect proprietary systems—spanning brand, software, and AI—that secure lasting competitive advantages.'}
            </Typography>
            <Typography variant="body" className="text-text-muted">
              {content?.paragraph_2 || 'Our approach integrates deep business strategy with elite technical execution. We deliver cohesive platforms and automated workflows that directly impact your bottom line and scale with your ambition.'}
            </Typography>
          </div>
        </div>
      </Grid>
    </Section>
  );
}
