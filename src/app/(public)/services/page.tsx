import React from 'react';
import { Section } from '@/components/layout/Section';
import { Grid } from '@/components/layout/Grid';
import { Typography } from '@/components/ui/Typography';
import { Panel } from '@/components/ui/Panel';
import { RecentMovesSection } from '@/components/sections/RecentMovesSection';
import { ProcessSection } from '@/components/sections/SharedProcessSection';
import { EndgameSection } from '@/components/sections/EndgameSection';
import { getPageContent } from '@/lib/dal/site';
import { getCapabilities } from '@/lib/dal/taxonomy';
import { getFeaturedProjects } from '@/lib/dal/projects';

export async function generateMetadata() {
  const content = await getPageContent('services');
  return {
    title: content?.meta?.title || "Services | GAMBIT",
    description: content?.meta?.description || "The Strategic Capabilities Layer.",
  };
}

export default async function ServicesPage() {
  const content = await getPageContent('services');
  const dbCapabilities = await getCapabilities();
  const featuredProjects = await getFeaturedProjects('portfolio');

  // We can merge bullet points if we have them in content, else fallback to standard empty array
  // We'll use the DB capabilities for the matrix.
  const displayCapabilities = dbCapabilities && dbCapabilities.length > 0 ? dbCapabilities : [
    {
      title: "Strategic Positioning",
      full_description: "Define the terrain before the battle begins. We identify market voids, establish unassailable competitive advantages, and architect business models designed for leverage.",
      points: ["Market Analysis & Void Identification", "Business Model Architecture", "Competitive Moat Strategy"]
    },
    {
      title: "Brand Architecture",
      full_description: "Transform commodities into monopolies. We build elite, high-perception brand systems that command premium pricing and absolute market authority.",
      points: ["Brand Identity Systems", "Premium Positioning", "Narrative Architecture"]
    },
    {
      title: "Digital Infrastructure",
      full_description: "Deploy platforms that scale without friction. From high-performance web applications to bespoke internal tools that automate advantage.",
      points: ["Full-Stack Engineering", "Performance Optimization", "Scalable System Architecture"]
    },
    {
      title: "Growth Mechanics",
      full_description: "Engineer predictable revenue engines. We don't guess; we deploy mathematical growth models, technical SEO, and conversion optimization.",
      points: ["Technical SEO & GEO", "Conversion Rate Optimization", "Growth Engine Deployment"]
    }
  ];

  const processSteps = content?.process?.steps || [
    { num: "01", title: "Audit & Reconnaissance", desc: "Deep analysis of your current market position, technical debt, and brand perception." },
    { num: "02", title: "Strategic Formulation", desc: "Developing the exact blueprint and required capabilities to dominate your specific vertical." },
    { num: "03", title: "Tactical Execution", desc: "Deploying the brand, technology, and growth systems with military precision." },
    { num: "04", title: "Optimization & Scale", desc: "Continuous refinement of the engine to maximize leverage and outpace competition." }
  ];

  return (
    <main className="flex flex-col min-h-screen">
      {/* 1. Services Hero */}
      <Section className="bg-surface-panel pt-32 pb-24 border-b border-surface-elevated">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24">
          <Grid columns={12} gap="lg" className="items-end">
            <div className="col-span-12 md:col-span-8">
              <Typography variant="label" className="mb-6 block text-text-secondary uppercase">
                {content?.hero?.badge || 'Capabilities'}
              </Typography>
              <Typography variant="hero" className="mb-8 whitespace-pre-line">
                {content?.hero?.headline || 'THE STRATEGIC\nCAPABILITIES LAYER.'}
              </Typography>
              <Typography variant="body" className="max-w-2xl">
                {content?.hero?.subheadline || 'We do not sell isolated services. We deploy integrated systems of strategy, design, and engineering designed to create positions, defend advantages, and scale intelligently.'}
              </Typography>
            </div>
          </Grid>
        </div>
      </Section>

      {/* 2. Capability Breakdown */}
      <Section className="bg-surface-card border-b border-surface-elevated">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24">
          <Typography variant="h2" className="mb-16 max-w-3xl whitespace-pre-line">
            {content?.matrix?.headline || 'We engineer unfair advantages across four primary vectors.'}
          </Typography>
          <Grid columns={2} gap="lg">
            {displayCapabilities.map((cap: any, i: number) => {
              // Attempt to match custom points from content if we have a match by slug or title
              // Or just use generic points if dbCapabilities lacks them.
              const points = cap.points || content?.matrix?.points?.[cap.slug] || [];
              
              return (
                <Panel key={i} theme="light" className="h-full flex flex-col justify-between">
                  <div>
                    <Typography variant="h3" className="mb-4">{cap.title}</Typography>
                    <Typography variant="body" className="mb-8">{cap.full_description || cap.short_description}</Typography>
                  </div>
                  {points.length > 0 && (
                    <ul className="space-y-3 border-t border-surface-elevated pt-6">
                      {points.map((pt: string, j: number) => (
                        <li key={j} className="flex items-center">
                          <span className="w-1.5 h-1.5 bg-accent-gold mr-3 rounded-full shrink-0"></span>
                          <Typography variant="body-sm">{pt}</Typography>
                        </li>
                      ))}
                    </ul>
                  )}
                </Panel>
              )
            })}
          </Grid>
        </div>
      </Section>

      {/* 3. Process Section */}
      <ProcessSection 
        headline={content?.process?.headline || "Deployment Protocol."}
        subheadline={content?.process?.subheadline || "How we integrate our capabilities into your organization to ensure maximum leverage."}
        steps={processSteps} 
      />

      {/* 4. Proof Integration */}
      <RecentMovesSection projects={featuredProjects} content={content?.recent_moves} />

      {/* 5. Conversion CTA */}
      <EndgameSection content={content?.endgame} />
    </main>
  );
}
