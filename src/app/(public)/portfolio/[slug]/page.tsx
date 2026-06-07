import React from 'react';
import { Section } from '@/components/layout/Section';
import { Grid } from '@/components/layout/Grid';
import { Typography } from '@/components/ui/Typography';
import { EndgameSection } from '@/components/sections/EndgameSection';
import { getProjectBySlug, getProjects } from '@/lib/dal/projects';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

interface PageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const project = await getProjectBySlug(params.slug);
  if (!project) return {};
  
  const title = `${project.title} | Portfolio | GAMBIT`;
  const description = project.summary || "Strategic Move Case Study.";
  const images = project.cover_image_url ? [project.cover_image_url] : [];

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images,
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images,
    }
  };
}

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((p: any) => ({
    slug: p.slug,
  }));
}

export default async function ProjectPage({ params }: PageProps) {
  const project = await getProjectBySlug(params.slug);

  if (!project) {
    notFound();
  }

  // Parse rich content if available
  // The 'content' json field could have { background: "", challenge: "", solution: "", results: [] }
  const details = (project as any).content || {};

  return (
    <main className="flex flex-col min-h-screen">
      {/* 1. Hero / Header */}
      <Section className="bg-surface-panel pt-32 pb-24 border-b border-surface-elevated">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24">
          <Link href="/portfolio" className="text-text-secondary text-sm font-semibold tracking-wide uppercase hover:text-accent-gold transition-colors mb-12 inline-block">
            &larr; Back to Archive
          </Link>
          <Grid columns={12} gap="lg" className="items-end">
            <div className="col-span-12 md:col-span-9">
              <Typography variant="label" className="mb-6 block text-text-secondary uppercase">
                {project.client_name || 'Strategic Deployment'}
              </Typography>
              <Typography variant="hero" className="mb-8">
                {project.title}
              </Typography>
              <Typography variant="body" className="max-w-2xl">
                {project.summary}
              </Typography>
            </div>
          </Grid>
        </div>
      </Section>

      {/* 2. Cover Image */}
      {project.cover_image_url && (
        <div className="w-full max-w-7xl mx-auto px-6 md:px-12 lg:px-24 my-12">
          <div className="w-full aspect-[21/9] md:aspect-[21/9] bg-surface-card rounded-[var(--radius-panel)] overflow-hidden border border-surface-elevated relative">
            <Image 
              src={project.cover_image_url} 
              alt={project.title} 
              fill 
              className="object-cover"
              sizes="(max-width: 1200px) 100vw, 1200px"
              priority
            />
          </div>
        </div>
      )}

      {/* 3. Metrics / Stats Bar */}
      {(project.outcome_metric || project.outcome_label) && (
        <Section className="py-12 border-b border-surface-elevated">
          <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24">
            <Grid columns={3} gap="lg">
              <div className="border-l-4 border-l-accent-gold pl-6 py-2">
                <Typography variant="h3" className="text-text-primary mb-1">{project.outcome_metric}</Typography>
                <Typography variant="label" className="text-text-secondary">{project.outcome_label}</Typography>
              </div>
            </Grid>
          </div>
        </Section>
      )}

      {/* 4. Main Content Area */}
      <Section className="bg-surface-card border-b border-surface-elevated pb-32">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24">
          <Grid columns={12} gap="lg">
            {/* Left Col: The Narrative */}
            <div className="col-span-12 md:col-span-8 space-y-16">
              
              {/* Background / Situation */}
              {details.situation && (
                <div>
                  <Typography variant="h3" className="mb-6">The Situation</Typography>
                  <Typography variant="body" className="whitespace-pre-line text-obsidian/80 leading-relaxed">
                    {details.situation}
                  </Typography>
                </div>
              )}

              {/* Strategy */}
              {details.strategy && (
                <div>
                  <Typography variant="h3" className="mb-6">The Strategy</Typography>
                  <Typography variant="body" className="whitespace-pre-line text-obsidian/80 leading-relaxed">
                    {details.strategy}
                  </Typography>
                </div>
              )}

              {/* Execution */}
              {details.execution && (
                <div>
                  <Typography variant="h3" className="mb-6">The Execution</Typography>
                  <Typography variant="body" className="whitespace-pre-line text-obsidian/80 leading-relaxed">
                    {details.execution}
                  </Typography>
                </div>
              )}
            </div>

            {/* Right Col: Metadata & Capabilities */}
            <div className="col-span-12 md:col-span-4">
              <div className="sticky top-32 space-y-12">
                
                {project.project_capabilities?.length > 0 && (
                  <div>
                    <Typography variant="label" className="block mb-6 text-text-secondary uppercase">Capabilities Deployed</Typography>
                    <ul className="space-y-4">
                      {project.project_capabilities.map((pc: any, i: number) => (
                        <li key={i} className="flex items-center gap-4 border-b border-surface-elevated pb-4 last:border-0 text-sm font-medium">
                          <div className="w-1.5 h-1.5 bg-accent-gold rounded-full flex-shrink-0"></div>
                          {pc.capabilities?.title}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {details.deliverables && details.deliverables.length > 0 && (
                  <div>
                    <Typography variant="label" className="block mb-6 text-text-secondary uppercase">Key Deliverables</Typography>
                    <ul className="space-y-4">
                      {details.deliverables.map((d: string, i: number) => (
                        <li key={i} className="text-sm font-medium text-obsidian/80">
                          &mdash; {d}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </Grid>
        </div>
      </Section>

      {/* 5. Endgame CTA */}
      <EndgameSection />
    </main>
  );
}
