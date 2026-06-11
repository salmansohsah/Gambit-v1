import React from 'react';
import { Section } from '@/components/layout/Section';
import { Grid } from '@/components/layout/Grid';
import { Typography } from '@/components/ui/Typography';
import { Panel } from '@/components/ui/Panel';
import { EndgameSection } from '@/components/sections/EndgameSection';
import { ProcessSection } from '@/components/sections/SharedProcessSection';
import { getPageContent, getSiteSettings } from '@/lib/dal/site';
import { Metadata } from 'next';
import Link from 'next/link';

export async function generateMetadata() {
  const content = await getPageContent('about');
  return {
    title: content?.meta?.title || "About | GAMBIT",
    description: content?.meta?.description || "Operating philosophy and strategic positioning.",
  };
}

export default async function AboutPage() {
  const content = await getPageContent('about');
  const settings = await getSiteSettings();

  const principles = content?.principles?.items || [
    { title: "Strategy Dictates Tactics", desc: "Execution without strategy is a fast path to failure. We build the architecture before we pour the concrete." },
    { title: "Positioning is Leverage", desc: "Commodities compete on price. Brands compete on positioning. We engineer unfair advantages." },
    { title: "Systems Over Silos", desc: "Growth, design, and technology are not separate disciplines. They are interconnected systems." }
  ];

  const processSteps = content?.process?.steps || [
    { num: "01", title: "Discovery", desc: "Deep reconnaissance of your market position and operational architecture." },
    { num: "02", title: "Strategy", desc: "Engineering the strategic blueprint and defining your unfair advantage." },
    { num: "03", title: "Execution", desc: "Deploying high-leverage assets across technology, brand, and growth." },
    { num: "04", title: "Optimization", desc: "Continuous compounding of results through data and refinement." }
  ];

  return (
    <main className="flex flex-col min-h-screen">
      {/* 1. Hero Section */}
      <Section className="bg-surface-panel pt-32 pb-24 border-b border-surface-elevated">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24">
          <Grid columns={12} gap="lg" className="items-end">
            <div className="col-span-12 md:col-span-9">
              <Typography variant="label" className="mb-6 block text-text-secondary uppercase">
                {content?.hero?.badge || 'Operating Philosophy'}
              </Typography>
              <Typography variant="hero" className="mb-8 whitespace-pre-line">
                {content?.hero?.headline || 'CLARITY IS THE\nULTIMATE WEAPON.'}
              </Typography>
              <Typography variant="body" className="max-w-2xl">
                {content?.hero?.subheadline || 'We are a strategic growth partner. We combine strategy, brand, digital experience, and automation to create unassailable market positions for ambitious organizations.'}
              </Typography>
            </div>
          </Grid>
        </div>
      </Section>

      {/* 2. Why GAMBIT Exists */}
      <Section className="bg-surface-card border-b border-surface-elevated">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24">
          <Grid columns={12} gap="lg">
            <div className="col-span-12 md:col-span-5">
              <Typography variant="h2" className="mb-6">{content?.trap?.headline || 'The Execution Trap.'}</Typography>
              <Typography variant="body" className="whitespace-pre-line">
                {content?.trap?.body || 'Most businesses fail because they rush into tactical execution without a cohesive strategy. They build products no one wants, scale broken models, and compete in crowded markets. GAMBIT exists to build the strategic foundation first, ensuring every tactical move creates maximum leverage.'}
              </Typography>
            </div>
            <div className="col-span-12 md:col-span-6 md:col-start-7">
               <Panel theme="light" className="bg-surface-panel">
                 <Typography variant="h3" className="mb-4 text-text-primary">{content?.trap?.panel_headline || 'Strategy Before Scale'}</Typography>
                 <Typography variant="body" className="whitespace-pre-line">
                   {content?.trap?.panel_body || 'We believe that an inferior product with superior positioning will always defeat a superior product with inferior positioning. We fix the positioning first.'}
                 </Typography>
               </Panel>
            </div>
          </Grid>
        </div>
      </Section>

      {/* 3. Operating Principles */}
      <Section className="bg-surface-panel border-b border-surface-elevated">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24">
          <Typography variant="h2" className="mb-16">{content?.principles?.headline || 'Core Principles.'}</Typography>
          <div className="space-y-12">
            {principles.map((p: any, i: number) => (
              <div key={i} className="pt-8 border-t border-surface-elevated">
                <Grid columns={12} gap="lg">
                  <div className="col-span-12 md:col-span-5">
                    <Typography variant="h3" className="mb-4 md:mb-0 text-text-primary">{p.title as React.ReactNode}</Typography>
                  </div>
                  <div className="col-span-12 md:col-span-7">
                    <Typography variant="body">{p.desc as React.ReactNode}</Typography>
                  </div>
                </Grid>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* 4. How We Work */}
      <ProcessSection 
        headline={content?.process?.headline || "Operational Flow."}
        subheadline={content?.process?.subheadline || "Our methodology is built on extreme precision and analytical rigor."}
        steps={processSteps} 
      />

      {/* 5. Trust & Credibility & 6. Future Vision */}
      <Section className="bg-surface-panel border-b border-surface-elevated">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24">
          <Grid columns={2} gap="lg">
            <Panel theme="light" className="bg-surface-card">
              <Typography variant="h3" className="mb-4">{content?.vision?.indicators_title || 'Experience Indicators'}</Typography>
              <Typography variant="body" className="whitespace-pre-line">
                {content?.vision?.indicators_body || 'We leverage cross-disciplinary expertise built over thousands of successful deployments. We bring operational certainty to complex brand and engineering problems.'}
              </Typography>
            </Panel>
            <Panel theme="light" className="bg-surface-card">
              <Typography variant="h3" className="mb-4">{content?.vision?.future_title || 'Future Vision'}</Typography>
              <Typography variant="body" className="whitespace-pre-line">
                {content?.vision?.future_body || 'GAMBIT is building the definitive strategic growth partner for the modern era. We are fundamentally committed to engineering unassailable positions for our clients.'}
              </Typography>
            </Panel>
          </Grid>
        </div>
      </Section>

      {/* 7. Meet The Founder */}
      <Section className="bg-surface-card border-b border-surface-elevated">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24">
          <Grid columns={12} gap="lg" className="items-center">
            {/* Image Placeholder */}
            <div className="col-span-12 md:col-span-5 order-2 md:order-1">
              <div 
                className="aspect-[3/4] w-full bg-surface-panel rounded-[var(--radius-panel)] flex items-center justify-center overflow-hidden border border-surface-elevated relative bg-cover bg-center"
                style={{ backgroundImage: content?.founder?.image_url ? `url(${content.founder.image_url})` : 'none' }}
              >
                 {!content?.founder?.image_url && <Typography variant="label" className="text-text-muted absolute">PORTRAIT PLACEHOLDER</Typography>}
              </div>
            </div>
            
            {/* Bio */}
            <div className="col-span-12 md:col-span-6 md:col-start-7 order-1 md:order-2">
              <Typography variant="label" className="mb-2 block text-accent-gold uppercase tracking-widest">{content?.founder?.role || 'Founder & Strategic Director'}</Typography>
              <Typography variant="h2" className="mb-8">{content?.founder?.name || 'Salman Al-Sawy'}</Typography>
              
              <div className="space-y-6 mb-12">
                {content?.founder?.paragraphs ? (
                  content.founder.paragraphs.map((p: string, i: number) => (
                    <Typography key={i} variant="body">{p}</Typography>
                  ))
                ) : (
                  <>
                    <Typography variant="body">
                      Salman Al-Sawy is an ambitious entrepreneur and strategic creative professional with more than 10 years of experience across creative disciplines, brand development, and startup growth.
                    </Typography>
                    <Typography variant="body">
                      Over the years, he has partnered with more than 1,000 satisfied clients, startups, and growing businesses, helping transform ideas into structured brands, scalable systems, and sustainable growth initiatives.
                    </Typography>
                    <Typography variant="body">
                      His approach combines strategic thinking, creative execution, and business-focused decision making to help organizations move with clarity and confidence.
                    </Typography>
                  </>
                )}
              </div>

              {/* Contact Information */}
              <div className="flex flex-col space-y-4 border-t border-surface-elevated pt-8">
                 <Typography variant="label" className="text-text-secondary">Executive Contact</Typography>
                 {settings?.linkedin_url && (
                   <Link href={settings.linkedin_url} target="_blank" className="text-sm font-semibold tracking-wide hover:text-accent-gold transition-colors">LinkedIn Profile &rarr;</Link>
                 )}
                 <Link href="#" className="text-sm font-semibold tracking-wide hover:text-accent-gold transition-colors">Discord: @salmanalsawy &rarr;</Link>
                 {settings?.contact_email && (
                   <Link href={`mailto:${settings.contact_email}`} className="text-sm font-semibold tracking-wide hover:text-accent-gold transition-colors">{settings.contact_email} &rarr;</Link>
                 )}
              </div>
            </div>
          </Grid>
        </div>
      </Section>

      {/* 8. Conversion CTA */}
      <EndgameSection content={content?.endgame} />
    </main>
  );
}
