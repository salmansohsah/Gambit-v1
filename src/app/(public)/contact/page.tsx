import React from 'react';
import { Section } from '@/components/layout/Section';
import { Grid } from '@/components/layout/Grid';
import { Typography } from '@/components/ui/Typography';
import { Panel } from '@/components/ui/Panel';
import { Button } from '@/components/ui/Button';
import { ProcessSection } from '@/components/sections/SharedProcessSection';
import Link from 'next/link';
import { DiscoveryForm } from '@/components/public/DiscoveryForm';
import { mergeSeoMetadata } from '@/lib/seo-helper';
import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  return mergeSeoMetadata('/contact', {
    title: "Contact | GAMBIT",
    description: "Clarity before commitment. Schedule a strategic assessment.",
    alternates: {
      canonical: '/contact'
    }
  });
}

export default function ContactPage() {

  const whoFor = [
    "Founders & Executives driving business growth.",
    "Companies seeking strategic clarity and positioning.",
    "Organizations transitioning to their next growth phase.",
    "Brands tired of tactical execution without a cohesive strategy."
  ];

  const whoNotFor = [
    "Businesses looking for the cheapest available option.",
    "Those seeking immediate execution without strategic alignment.",
    "Organizations not yet ready to invest in serious growth.",
    "Clients looking for endless revisions without a strategic compass."
  ];

  const processSteps = [
    { num: "01", title: "Initial Conversation", desc: "A candid discussion to understand your current position and operational friction." },
    { num: "02", title: "Strategic Assessment", desc: "Evaluating market positioning, capabilities, and the viability of a strategic partnership." },
    { num: "03", title: "Opportunity Identification", desc: "Pinpointing the exact leverage points where intervention will yield maximum ROI." },
    { num: "04", title: "Next-Step Recommendation", desc: "A clear, prescriptive path forward—whether that includes GAMBIT or not." }
  ];

  const inputClassName = "w-full bg-surface-panel border border-surface-elevated rounded-lg px-4 py-3 text-sm text-obsidian placeholder:text-text-muted outline-none focus:border-accent-gold transition-colors";

  return (
    <main className="flex flex-col min-h-screen">
      {/* 1. Hero Section */}
      <Section className="bg-surface-panel pt-32 pb-24 border-b border-surface-elevated">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24">
          <Grid columns={12} gap="lg" className="items-end">
            <div className="col-span-12 md:col-span-9">
              <Typography variant="label" className="mb-6 block text-text-secondary uppercase">Discovery Call</Typography>
              <Typography variant="hero" className="mb-8">
                CLARITY BEFORE<br/>COMMITMENT.
              </Typography>
              <Typography variant="body" className="max-w-2xl">
                Every successful engagement starts with understanding the strategic challenge before proposing tactical solutions. This is a qualification phase to ensure absolute alignment.
              </Typography>
            </div>
          </Grid>
        </div>
      </Section>

      {/* 2 & 3. Qualification Matrix */}
      <Section className="bg-surface-card border-b border-surface-elevated">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24">
          <Grid columns={2} gap="lg">
            <Panel theme="light" className="bg-surface-panel border-t-4 border-t-accent-gold">
              <Typography variant="h3" className="mb-8">Who This Is For</Typography>
              <ul className="space-y-4">
                {whoFor.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="text-accent-gold font-bold mt-[2px]">&rarr;</span>
                    <Typography variant="body-sm">{item}</Typography>
                  </li>
                ))}
              </ul>
            </Panel>

            <Panel theme="light" className="bg-surface-panel border-t-4 border-t-text-muted">
              <Typography variant="h3" className="mb-8">Who This Is NOT For</Typography>
              <ul className="space-y-4">
                {whoNotFor.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="text-text-muted font-bold mt-[2px]">&times;</span>
                    <Typography variant="body-sm">{item}</Typography>
                  </li>
                ))}
              </ul>
            </Panel>
          </Grid>
        </div>
      </Section>

      {/* 4. Discovery Process */}
      <ProcessSection 
        headline="The Intake Process." 
        subheadline="A structured sequence to guarantee strategic alignment." 
        steps={processSteps} 
      />

      {/* 5. Strategic Intake Form & 6. Direct Contact Layer */}
      <Section className="bg-surface-card border-b border-surface-elevated">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24">
          <Grid columns={12} gap="lg">
            
            {/* Form */}
            <div className="col-span-12 lg:col-span-7">
              <Typography variant="h3" className="mb-8">Strategic Intake</Typography>
              <DiscoveryForm />
            </div>

            {/* Direct Contact Layer */}
            <div className="col-span-12 lg:col-span-4 lg:col-start-9 mt-12 lg:mt-0">
              <Panel theme="light" className="bg-surface-panel h-full border-t-4 border-t-accent-gold">
                <Typography variant="label" className="mb-6 block text-text-secondary uppercase tracking-widest">Direct Line</Typography>
                
                <div className="space-y-8">
                  <div>
                    <Typography variant="h4" className="mb-2">Official Email</Typography>
                    <Link href="mailto:salmanalsawyofficial@gmail.com" className="text-sm font-semibold tracking-wide text-text-primary hover:text-accent-gold transition-colors break-words">
                      salmanalsawyofficial@gmail.com &rarr;
                    </Link>
                  </div>
                  
                  <div>
                    <Typography variant="h4" className="mb-2">Scheduling</Typography>
                    <Typography variant="body-sm" className="mb-2">Direct booking calendar.</Typography>
                    <button disabled className="text-sm font-semibold tracking-wide text-obsidian/50 cursor-not-allowed">
                      View Availability (Coming Soon) &rarr;
                    </button>
                  </div>

                  <div>
                    <Typography variant="h4" className="mb-2">Other Channels</Typography>
                    <Typography variant="body-sm" className="mb-2">Professional networking.</Typography>
                    <button disabled className="text-sm font-semibold tracking-wide text-obsidian/50 cursor-not-allowed">
                      Secure Comm Link (Coming Soon) &rarr;
                    </button>
                  </div>
                </div>
              </Panel>
            </div>

          </Grid>
        </div>
      </Section>

      {/* 7. Final Trust Layer */}
      <Section className="bg-surface-panel border-t border-surface-elevated">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 py-8 text-center">
          <Typography variant="h3" className="mb-4">Strategy Before Execution.</Typography>
          <Typography variant="body-sm" className="max-w-2xl mx-auto">
            We partner with operators who understand that sustainable growth requires absolute clarity. We do not pitch short-term tactics; we architect long-term operational partnerships focused entirely on strategic leverage.
          </Typography>
        </div>
      </Section>
    </main>
  );
}
