import React from 'react';
import { Section } from '@/components/layout/Section';
import { Grid } from '@/components/layout/Grid';
import { Typography } from '@/components/ui/Typography';
import { EndgameSection } from '@/components/sections/EndgameSection';
import { getInsightBySlug, getInsights } from '@/lib/dal/insights';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';

interface PageProps {
  params: {
    slug: string;
  };
}

import { mergeSeoMetadata } from '@/lib/seo-helper';

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const insight = await getInsightBySlug(slug);
  if (!insight) return {};
  
  const title = `${insight.title} | Insights | GAMBIT`;
  const description = insight.summary || "Strategic Thinking. Practical Execution.";
  const images = insight.cover_image_url ? [insight.cover_image_url] : [];

  return mergeSeoMetadata(`/insights/${slug}`, {
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
    },
    alternates: {
      canonical: `/insights/${slug}`
    }
  });
}

export async function generateStaticParams() {
  const insights = await getInsights();
  return insights.map((i: any) => ({
    slug: i.slug,
  }));
}

export default async function InsightPage({ params }: PageProps) {
  const insight = await getInsightBySlug(params.slug);

  if (!insight) {
    notFound();
  }

  const categoryName = (insight as any).insight_categories?.label || "Strategy";
  const readTime = insight.read_time_minutes ? `${insight.read_time_minutes} Min Read` : "5 Min Read";
  const dateStr = insight.published_at || insight.created_at || new Date().toISOString();
  const date = new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const authorName = (insight as any).team_members?.full_name || "GAMBIT Strategy Team";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": insight.title,
    "image": insight.cover_image_url ? [insight.cover_image_url] : [],
    "datePublished": insight.published_at || insight.created_at,
    "dateModified": insight.updated_at || insight.published_at || insight.created_at,
    "author": [{
      "@type": "Person",
      "name": authorName,
    }]
  };

  return (
    <main className="flex flex-col min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* 1. Article Header */}
      <Section className="bg-surface-panel pt-32 pb-16 border-b border-surface-elevated">
        <div className="max-w-4xl mx-auto px-6 md:px-12">
          <Link href="/insights" className="text-text-secondary text-sm font-semibold tracking-wide uppercase hover:text-accent-gold transition-colors mb-12 inline-block">
            &larr; Back to Intelligence Hub
          </Link>
          
          <div className="flex items-center gap-4 mb-6">
            <Typography variant="label" className="text-accent-gold uppercase tracking-widest">{categoryName}</Typography>
            <span className="text-surface-elevated text-sm">&bull;</span>
            <Typography variant="label" className="text-text-muted">{readTime}</Typography>
          </div>
          
          <Typography variant="hero" className="mb-8">
            {insight.title}
          </Typography>
          
          <div className="flex items-center gap-4 border-t border-surface-elevated pt-8">
            <div className="flex flex-col">
              <Typography variant="label" className="text-text-primary block mb-1">{authorName}</Typography>
              <Typography variant="label" className="text-text-muted">{date}</Typography>
            </div>
          </div>
        </div>
      </Section>

      {/* 2. Cover Image (If available) */}
      {insight.cover_image_url && (
        <div className="w-full max-w-5xl mx-auto px-6 md:px-12 my-12">
          <div className="w-full aspect-[21/9] bg-surface-card rounded-[var(--radius-panel)] overflow-hidden border border-surface-elevated relative">
            <Image 
              src={insight.cover_image_url} 
              alt={insight.title} 
              fill 
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 1024px"
              priority
            />
          </div>
        </div>
      )}

      {/* 3. Article Body */}
      <Section className="bg-surface-card pb-32">
        <div className="max-w-3xl mx-auto px-6 md:px-12">
          {insight.summary && (
            <Typography variant="h3" className="mb-12 text-obsidian/90">
              {insight.summary}
            </Typography>
          )}

          <div className="prose prose-invert prose-lg max-w-none text-obsidian/80
                          prose-headings:text-text-primary prose-headings:font-bold prose-headings:tracking-tight
                          prose-h2:mt-16 prose-h2:mb-6 prose-h2:text-3xl
                          prose-h3:mt-10 prose-h3:mb-4 prose-h3:text-2xl
                          prose-p:mb-8 prose-p:leading-relaxed
                          prose-a:text-accent-gold prose-a:no-underline hover:prose-a:underline
                          prose-strong:text-text-primary
                          prose-ul:list-disc prose-ul:pl-6 prose-li:mb-2
                          prose-ol:list-decimal prose-ol:pl-6
                          prose-blockquote:border-l-4 prose-blockquote:border-accent-gold prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:text-obsidian/70">
            <ReactMarkdown>
              {insight.body_content || "No content provided."}
            </ReactMarkdown>
          </div>
        </div>
      </Section>

      {/* 4. Endgame CTA */}
      <EndgameSection />
    </main>
  );
}
