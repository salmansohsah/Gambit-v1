import React from 'react';
import { Section } from '@/components/layout/Section';
import { Grid } from '@/components/layout/Grid';
import { Typography } from '@/components/ui/Typography';
import { Panel } from '@/components/ui/Panel';
import { Button } from '@/components/ui/Button';
import { EndgameSection } from '@/components/sections/EndgameSection';
import { getInsights, getFeaturedInsight, getCategories } from '@/lib/dal/insights';
import { getPageContent } from '@/lib/dal/site';
import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';

import { mergeSeoMetadata } from '@/lib/seo-helper';

export async function generateMetadata() {
  const content = await getPageContent('insights');
  return mergeSeoMetadata('/insights', {
    title: content?.meta?.title || "Insights | GAMBIT",
    description: content?.meta?.description || "Strategic Thinking. Practical Execution.",
    alternates: {
      canonical: '/insights'
    }
  });
}

export default async function InsightsPage() {
  const content = await getPageContent('insights');
  const allInsights = await getInsights();
  const featuredInsight = await getFeaturedInsight();
  const categories = await getCategories();

  // Exclude featured insight from the list
  const libraryInsights = allInsights.filter((i: any) => i.id !== featuredInsight?.id);

  const principles = content?.principles?.items || [
    {
      title: "Measure Twice, Cut Once.",
      desc: "Diagnosis precedes prescription. We refuse to execute tactics without a clear, validated strategy."
    },
    {
      title: "Leverage Over Labor.",
      desc: "Do not solve with manpower what can be solved with code, automation, or intelligent systems."
    },
    {
      title: "Outcomes, Not Deliverables.",
      desc: "We are measured by the business impact we generate for our clients, not the files we deliver."
    }
  ];

  return (
    <main className="flex flex-col min-h-screen">
      {/* 1. Hero Section */}
      <Section className="bg-surface-panel pt-32 pb-24 border-b border-surface-elevated">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24">
          <Grid columns={12} gap="lg" className="items-end">
            <div className="col-span-12 md:col-span-9">
              <Typography variant="label" className="mb-6 block text-text-secondary uppercase">
                {content?.hero?.badge || 'Intelligence Hub'}
              </Typography>
              <Typography variant="hero" className="mb-8 whitespace-pre-line">
                {content?.hero?.headline || 'STRATEGIC THINKING.\nPRACTICAL EXECUTION.'}
              </Typography>
              <Typography variant="body" className="max-w-2xl">
                {content?.hero?.subheadline || 'We share our most valuable frameworks, operational observations, and perspectives drawn from real-world business, brand, technology, and growth initiatives.'}
              </Typography>
            </div>
          </Grid>
        </div>
      </Section>

      {/* 4. Categories Layer */}
      {categories.length > 0 && (
        <Section className="bg-surface-card border-b border-surface-elevated py-8">
          <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24">
            <div className="flex flex-wrap items-center gap-4">
              <Typography variant="label" className="text-text-secondary mr-4">Topics:</Typography>
              {categories.map((cat: any, i: number) => (
                <span key={i} className="px-4 py-2 bg-surface-panel border border-surface-elevated rounded-full text-xs font-semibold tracking-wide uppercase text-obsidian hover:border-accent-gold transition-colors cursor-default">
                  {cat.label}
                </span>
              ))}
            </div>
          </div>
        </Section>
      )}

      {/* 2. Featured Insight */}
      {featuredInsight && (
        <Section className="bg-surface-panel border-b border-surface-elevated">
          <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24">
            <Typography variant="label" className="mb-6 block text-text-secondary uppercase tracking-widest">Flagship Insight</Typography>
            
            <Grid columns={12} gap="lg">
              <div className="col-span-12 lg:col-span-7 h-[400px] lg:h-auto bg-surface-card rounded-[var(--radius-panel)] border border-surface-elevated relative overflow-hidden flex items-center justify-center">
                {featuredInsight.cover_image_url ? (
                  <Image 
                    src={featuredInsight.cover_image_url} 
                    alt={featuredInsight.title} 
                    fill 
                    className="object-cover" 
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                ) : (
                  <Typography variant="label" className="text-text-muted">EDITORIAL IMAGE PLACEHOLDER</Typography>
                )}
              </div>
              
              <div className="col-span-12 lg:col-span-5 flex flex-col justify-center">
                <Panel theme="light" className="bg-surface-card h-full flex flex-col justify-center border-none shadow-none">
                  {(featuredInsight as any).insight_categories?.label && (
                    <Typography variant="label" className="text-text-secondary mb-4 block uppercase tracking-widest">
                      {(featuredInsight as any).insight_categories.label}
                    </Typography>
                  )}
                  <Typography variant="h2" className="mb-6">{featuredInsight.title}</Typography>
                  <Typography variant="body" className="mb-8">
                    {featuredInsight.summary}
                  </Typography>
                  <div className="pt-6 border-t border-surface-elevated">
                    <Link href={`/insights/${featuredInsight.slug}`} className="inline-flex items-center text-sm font-bold uppercase tracking-widest text-obsidian hover:text-accent-gold transition-colors">
                      Read Insight &rarr;
                    </Link>
                  </div>
                </Panel>
              </div>
            </Grid>
          </div>
        </Section>
      )}

      {/* 3. Insights Library */}
      <Section className="bg-surface-card border-b border-surface-elevated">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24">
          <Typography variant="h2" className="mb-12">{content?.archive?.headline || 'Intelligence Archives.'}</Typography>
          <Grid columns={2} gap="lg">
            {libraryInsights.map((insight: any, i: number) => {
              const categoryName = (insight as any).insight_categories?.label || "Uncategorized";
              const readTime = insight.read_time_minutes ? `${insight.read_time_minutes} Min Read` : "5 Min Read";
              const dateStr = insight.published_at || insight.created_at || new Date().toISOString();
              const date = new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
              
              return (
                <Panel key={i} theme="light" className="bg-surface-panel h-full flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <Typography variant="label" className="text-text-secondary uppercase tracking-widest">{categoryName}</Typography>
                      <Typography variant="label" className="text-text-muted text-xs">{readTime} &bull; {date}</Typography>
                    </div>
                    <Typography variant="h3" className="mb-4">{insight.title}</Typography>
                    <Typography variant="body" className="mb-8">{insight.summary}</Typography>
                  </div>
                  <div className="border-t border-surface-elevated pt-6">
                    <Link href={`/insights/${insight.slug}`} className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-accent-gold hover:text-accent-gold transition-colors">
                      Read Insight &rarr;
                    </Link>
                  </div>
                </Panel>
              )
            })}
          </Grid>
        </div>
      </Section>

      {/* 5. Strategic Principles Section */}
      <Section className="bg-surface-panel border-b border-surface-elevated">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24">
          <Typography variant="h2" className="mb-12">{content?.principles?.headline || 'Operating Principles.'}</Typography>
          <Grid columns={3} gap="lg">
            {principles.map((principle: any, i: number) => (
              <Panel key={i} theme="light" className="bg-surface-card h-full border-t-4 border-t-accent-gold">
                <Typography variant="h4" className="mb-4">{principle.title as React.ReactNode}</Typography>
                <Typography variant="body-sm">{principle.desc as React.ReactNode}</Typography>
              </Panel>
            ))}
          </Grid>
        </div>
      </Section>

      {/* 6. Subscribe / Stay Updated Section */}
      <Section className="bg-surface-card border-b border-surface-elevated">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24">
          <Grid columns={12} gap="lg" className="items-center">
            <div className="col-span-12 md:col-span-5">
              <Typography variant="label" className="mb-2 block text-accent-gold uppercase tracking-widest">
                {content?.newsletter?.badge || 'Intelligence Feed'}
              </Typography>
              <Typography variant="h2" className="mb-6">{content?.newsletter?.headline || 'Stay Ahead.'}</Typography>
              <Typography variant="body" className="max-w-md">
                {content?.newsletter?.body || 'Join an exclusive list of founders and executives receiving our latest strategic frameworks and operational insights.'}
              </Typography>
            </div>
            
            <div className="col-span-12 md:col-span-6 md:col-start-7">
              <form className="flex flex-col sm:flex-row gap-4 items-center border border-surface-elevated rounded-lg p-2 bg-surface-panel">
                <input 
                  type="email" 
                  name="email"
                  placeholder="Enter your executive email address" 
                  className="flex-1 w-full bg-transparent border-none outline-none px-4 py-2 text-sm text-obsidian placeholder:text-text-muted" 
                  required 
                />
                <Button variant="outline" type="submit" className="w-full sm:w-auto whitespace-nowrap">
                  Subscribe
                </Button>
              </form>
            </div>
          </Grid>
        </div>
      </Section>

      {/* 7. Final Conversion Section */}
      <EndgameSection content={content?.endgame} />
    </main>
  );
}
