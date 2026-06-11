import React from 'react';
import { Section } from '@/components/layout/Section';
import { Grid } from '@/components/layout/Grid';
import { Typography } from '@/components/ui/Typography';
import { Panel } from '@/components/ui/Panel';
import { EndgameSection } from '@/components/sections/EndgameSection';
import { ArchiveList } from '@/components/sections/ArchiveList';
import { getProjects, getFeaturedProjects } from '@/lib/dal/projects';
import { getPageContent } from '@/lib/dal/site';
import { Metadata } from 'next';
import Link from 'next/link';

export async function generateMetadata() {
  const content = await getPageContent('portfolio');
  return {
    title: content?.meta?.title || "Portfolio | GAMBIT",
    description: content?.meta?.description || "Strategic Moves and Measurable Outcomes.",
  };
}

export default async function PortfolioPage() {
  const content = await getPageContent('portfolio');
  const allProjects = await getProjects();
  const featuredProjects = await getFeaturedProjects('portfolio');
  const flagshipMove = featuredProjects.length > 0 ? featuredProjects[0] : null;
  const archiveMoves = allProjects.filter((p: any) => p.id !== flagshipMove?.id);

  const lessons = content?.lessons?.items || [
    { title: "Friction is the Enemy", desc: "Every unnecessary click costs you revenue. In Project Apex, simply moving the CTA above the fold increased conversion by 14%." },
    { title: "Clarity Over Cleverness", desc: "Customers do not buy what they do not understand. Rewriting the Horizon Shift positioning statement was the primary driver of their growth." },
    { title: "Data Beats Intuition", desc: "We thought the bottleneck was the pricing page. The data proved it was the onboarding flow. Always measure before you cut." }
  ];

  return (
    <main className="flex flex-col min-h-screen">
      {/* 1. Hero Section */}
      <Section className="bg-surface-panel pt-32 pb-24 border-b border-surface-elevated">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24">
          <Grid columns={12} gap="lg" className="items-end">
            <div className="col-span-12 md:col-span-9">
              <Typography variant="label" className="mb-6 block text-text-secondary uppercase">
                {content?.hero?.badge || 'Recent Moves'}
              </Typography>
              <Typography variant="hero" className="mb-8 whitespace-pre-line">
                {content?.hero?.headline || 'STRATEGIC MOVES.\nMEASURABLE OUTCOMES.'}
              </Typography>
              <Typography variant="body" className="max-w-2xl">
                {content?.hero?.subheadline || 'We do not build portfolios. We record strategic deployments. Every project below was executed with military precision to solve a specific business problem and engineer an unfair advantage.'}
              </Typography>
            </div>
          </Grid>
        </div>
      </Section>

      {/* 2. Featured Move */}
      {flagshipMove && (
        <Section className="bg-surface-card border-b border-surface-elevated">
          <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24">
            <Typography variant="label" className="mb-6 block text-text-secondary uppercase tracking-widest">MOVE 00 &mdash; FLAGSHIP INITIATIVE</Typography>
            <Typography variant="h2" className="mb-16">{flagshipMove.title}</Typography>
            
            <Grid columns={12} gap="lg">
              {/* Visual/Image Area (Supporting Evidence) */}
              <div 
                className="col-span-12 md:col-span-6 h-[400px] md:h-auto bg-surface-panel rounded-[var(--radius-panel)] border border-surface-elevated relative overflow-hidden flex items-center justify-center bg-cover bg-center"
                style={{ backgroundImage: flagshipMove.cover_image_url ? `url(${flagshipMove.cover_image_url})` : 'none' }}
              >
                {!flagshipMove.cover_image_url && <Typography variant="label" className="text-text-muted">EVIDENCE PLACEHOLDER</Typography>}
              </div>
              
              {/* Strategic Details */}
              <div className="col-span-12 md:col-span-5 md:col-start-8 flex flex-col justify-center">
                <div className="space-y-8">
                  <div>
                    <Typography variant="h4" className="mb-2 text-text-secondary">Situation</Typography>
                    <Typography variant="body">{flagshipMove.summary}</Typography>
                  </div>
                  <div>
                    <Typography variant="h4" className="mb-2 text-text-secondary">Strategy</Typography>
                    <Typography variant="body">{flagshipMove.client_name}</Typography>
                  </div>
                  <div className="pt-6 border-t border-surface-elevated">
                    <Typography variant="h3" className="mb-2">The Outcome</Typography>
                    <Typography variant="h2" className="text-text-primary">{flagshipMove.outcome_metric}</Typography>
                    <Typography variant="body-sm" className="mb-8">{flagshipMove.outcome_label}</Typography>
                    <Link href={`/portfolio/${flagshipMove.slug}`} className="inline-flex items-center text-sm font-bold uppercase tracking-widest text-accent-gold hover:text-accent-gold transition-colors">
                      Explore Full Case Study &rarr;
                    </Link>
                  </div>
                </div>
              </div>
            </Grid>
          </div>
        </Section>
      )}

      {/* 3. Move Archive */}
      <Section className="bg-surface-panel border-b border-surface-elevated">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24">
          <Typography variant="h2" className="mb-12">{content?.archive?.headline || 'Strategic Archive.'}</Typography>
          <ArchiveList moves={archiveMoves} />
        </div>
      </Section>

      {/* 4. Results Layer & 6. Trust Layer Combined */}
      <Section className="bg-surface-card border-b border-surface-elevated">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24">
          <Grid columns={12} gap="lg">
            <div className="col-span-12 md:col-span-4">
              <Typography variant="h2" className="mb-6">{content?.math?.headline || 'The Math.'}</Typography>
              <Typography variant="body">{content?.math?.body || 'We don\'t optimize for awards. We optimize for leverage, efficiency, and revenue.'}</Typography>
            </div>
            <div className="col-span-12 md:col-span-8">
              <Grid columns={2} gap="lg">
                <Panel theme="light" className="bg-surface-panel flex flex-col items-center justify-center text-center py-12">
                  <Typography variant="hero" className="text-text-primary mb-2">1,000+</Typography>
                  <Typography variant="h4">Deployments</Typography>
                </Panel>
                <Panel theme="light" className="bg-surface-panel flex flex-col items-center justify-center text-center py-12">
                  <Typography variant="hero" className="text-text-primary mb-2">10+</Typography>
                  <Typography variant="h4">Years Experience</Typography>
                </Panel>
                <Panel theme="light" className="bg-surface-panel flex flex-col items-center justify-center text-center py-12">
                  <Typography variant="hero" className="text-text-primary mb-2">3.5x</Typography>
                  <Typography variant="h4">Avg. Conversion Lift</Typography>
                </Panel>
                <Panel theme="light" className="bg-surface-panel flex flex-col items-center justify-center text-center py-12">
                  <Typography variant="hero" className="text-text-primary mb-2">99%</Typography>
                  <Typography variant="h4">Operational Certainty</Typography>
                </Panel>
              </Grid>
            </div>
          </Grid>
        </div>
      </Section>

      {/* 5. Strategic Lessons */}
      <Section className="bg-surface-panel border-b border-surface-elevated">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24">
          <Typography variant="h2" className="mb-12">{content?.lessons?.headline || 'Post-Action Intelligence.'}</Typography>
          <Grid columns={3} gap="lg">
            {lessons.map((lesson: any, i: number) => (
              <Panel key={i} theme="light" className="bg-surface-card h-full border-t-4 border-t-accent-gold">
                <Typography variant="h4" className="mb-4">{lesson.title}</Typography>
                <Typography variant="body-sm">{lesson.desc}</Typography>
              </Panel>
            ))}
          </Grid>
        </div>
      </Section>

      {/* 8. Conversion CTA */}
      <EndgameSection content={content?.endgame} />
    </main>
  );
}
