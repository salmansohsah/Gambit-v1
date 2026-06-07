"use client";

import React, { useState } from 'react';
import { Typography } from '../ui/Typography';
import { Button } from '../ui/Button';
import { Panel } from '../ui/Panel';
import { Grid } from '../layout/Grid';

interface EndgameSectionProps {
  content?: any;
}

export function EndgameSection({ content }: EndgameSectionProps) {
  const [formState, setFormState] = useState<'idle' | 'loading' | 'success'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormState('loading');
    
    // Simulate network request
    setTimeout(() => {
      setFormState('success');
      
      // Reset form visually after 3 seconds
      setTimeout(() => {
        setFormState('idle');
      }, 3000);
    }, 1500);
  };

  return (
    <div className="bg-surface-panel border-t border-surface-elevated w-full py-24 md:py-32 px-6 md:px-12 lg:px-24">
      <div className="max-w-7xl mx-auto">
        <Panel theme="light" className="border-none p-0 relative shadow-none bg-transparent">
          
          <Grid columns={12} gap="lg" className="items-center">
            <div className="col-span-12 md:col-span-7">
              <Typography variant="label" className="mb-6 block text-accent-gold">{content?.badge || 'Clarity Before Commitment'}</Typography>
              <Typography variant="hero" className="mb-8 whitespace-pre-line">
                {content?.headline || 'THE NEXT\nMOVE IS YOURS.'}
              </Typography>
              <Typography variant="body" className="max-w-xl mb-12">
                {content?.paragraph || 'Let\'s discuss where you are, where you want to go, and how to build the position that gets you there. No sales pressure. Just strategy.'}
              </Typography>
              
              <Button variant="accent" onClick={() => window.location.href = '/contact'}>
                {content?.cta_primary || 'Book A Discovery Call'}
              </Button>
            </div>
            
            <div className="col-span-12 md:col-span-5 bg-surface-card p-8 md:p-12 rounded-[var(--radius-panel)] border border-surface-elevated">
              <Typography variant="h4" className="mb-6">{content?.form_title || 'Start The Conversation'}</Typography>
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                  <input required type="text" placeholder="Full Name" className="w-full bg-transparent border-b border-surface-elevated py-4 text-obsidian placeholder:text-text-muted focus:outline-none focus:border-accent-blue transition-colors rounded-none" />
                </div>
                <div>
                  <input required type="text" placeholder="Organization" className="w-full bg-transparent border-b border-surface-elevated py-4 text-obsidian placeholder:text-text-muted focus:outline-none focus:border-accent-blue transition-colors rounded-none" />
                </div>
                <div className="pt-4">
                  {formState === 'success' ? (
                    <Button variant="outline" className="w-full !border-[#4ADE80] !text-[#4ADE80] pointer-events-none">Message Received</Button>
                  ) : formState === 'loading' ? (
                    <Button variant="primary" className="w-full opacity-70 pointer-events-none">Processing...</Button>
                  ) : (
                    <Button variant="primary" type="submit" className="w-full">Continue &rarr;</Button>
                  )}
                </div>
              </form>
            </div>
          </Grid>
          
        </Panel>
      </div>
    </div>
  );
}
