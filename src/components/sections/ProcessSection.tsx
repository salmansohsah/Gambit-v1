import React from 'react';
import { Typography } from '../ui/Typography';
import { Section } from '../layout/Section';

interface ProcessSectionProps {
  content?: any;
}

export function ProcessSection({ content }: ProcessSectionProps) {
  const fallbackSteps = [
    { phase: "Opening", title: "Analyze & Architect", desc: "Understand the position. Research the landscape. Define the exact strategic architecture required." },
    { phase: "Mid-Game", title: "Build & Deploy", desc: "Design the experience. Build the technical systems. Execute the strategy with absolute precision." },
    { phase: "Endgame", title: "Scale & Defend", desc: "Optimize performance. Scale the advantage intelligently. Maintain momentum across all channels." }
  ];

  const steps = content?.steps ? content.steps : fallbackSteps;

  return (
    <Section className="bg-surface-deep border-y border-surface-elevated">
      <div className="max-w-3xl mx-auto">
        <Typography variant="label" className="mb-12 block text-center">{content?.badge || 'The Methodology'}</Typography>
        
        <div className="relative pl-8 md:pl-16 py-8">
          {/* Timeline Line */}
          <div className="absolute top-0 left-0 bottom-0 w-0.5 bg-surface-elevated">
            <div className="w-full h-1/3 bg-accent-gold"></div>
          </div>

          <div className="space-y-16">
            {steps.map((step: any, i: number) => (
              <div key={i} className="relative group">
                <div className="absolute -left-10 md:-left-[4.5rem] top-1.5 w-4 h-4 bg-surface-card border-2 border-surface-elevated rounded-full group-hover:border-accent-gold transition-colors duration-300"></div>
                
                <Typography variant="label" className="mb-2 block text-accent-gold">{step.phase}</Typography>
                <Typography variant="h3" className="mb-4">{step.title}</Typography>
                <Typography variant="body">{step.desc || step.description}</Typography>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}
