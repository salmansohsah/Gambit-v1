import React from 'react';
import { Typography } from '../ui/Typography';
import { Button } from '../ui/Button';
import { Grid } from '../layout/Grid';
import { Section } from '../layout/Section';
import Link from 'next/link';

interface HeroSectionProps {
  content?: any;
}

export function HeroSection({ content }: HeroSectionProps) {
  return (
    <Section className="min-h-[90vh] flex items-center relative overflow-hidden">
      {/* Abstract Grid Background Element */}
      <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none" 
           style={{
             backgroundImage: 'linear-gradient(to right, #000 1px, transparent 1px), linear-gradient(to bottom, #000 1px, transparent 1px)',
             backgroundSize: '64px 64px',
             maskImage: 'linear-gradient(to left, black, transparent)'
           }}
      />
      
      <Grid columns={12} gap="lg" className="relative z-10 w-full items-center">
        {/* 90/10 Asymmetric Tension Left Side */}
        <div className="col-span-12 md:col-span-10 lg:col-span-9">
          <Typography variant="label" className="mb-8 block text-text-secondary">
            {content?.badge || 'Strategic Digital Agency'}
          </Typography>
          <Typography variant="hero" className="mb-8 whitespace-pre-line">
            {content?.headline || 'YOUR MARKET\nIS A BOARD.'}
          </Typography>
          <Typography variant="body" className="max-w-2xl mb-12">
            {content?.subheadline || 'Most businesses react. The best businesses create positions. We help them do both. We build the architecture for lasting competitive advantage.'}
          </Typography>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <Link href="/contact" passHref legacyBehavior>
              <Button variant="primary">{content?.cta_primary || 'Make Your Next Move'}</Button>
            </Link>
            <Link href="/portfolio" passHref legacyBehavior>
              <Button variant="text">{content?.cta_secondary || 'View Recent Moves \u2192'}</Button>
            </Link>
          </div>
        </div>
        
        {/* Right Side Abstract Element */}
        <div className="hidden lg:flex col-span-3 justify-end">
          <div className="w-full aspect-square border border-surface-elevated rounded-[var(--radius-panel)] bg-surface-card p-6 flex flex-col justify-between shadow-sm relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-transparent to-[#F4F4F5] opacity-50"></div>
            <Typography variant="label" className="text-text-muted relative z-10">Live Signal</Typography>
            <div className="h-1 w-full bg-surface-elevated relative z-10 overflow-hidden rounded-full">
              <div className="h-full bg-accent-blue w-1/3 group-hover:w-full transition-all duration-1000 ease-in-out"></div>
            </div>
          </div>
        </div>
      </Grid>
      
      {/* Executive Trust Strip */}
      <div className="absolute bottom-0 left-0 w-full border-t border-surface-elevated bg-surface-deep/50 py-6 hidden md:block">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 flex items-center justify-between opacity-50 grayscale">
          <span className="font-bold tracking-widest text-sm uppercase">Acme Corp</span>
          <span className="font-bold tracking-widest text-sm uppercase">Global Tech</span>
          <span className="font-bold tracking-widest text-sm uppercase">Stark Ind.</span>
          <span className="font-bold tracking-widest text-sm uppercase">Wayne Ent.</span>
          <span className="font-bold tracking-widest text-sm uppercase">Cyberdyne</span>
        </div>
      </div>
    </Section>
  );
}
