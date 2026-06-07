import React from 'react';
import { Typography } from '../ui/Typography';
import { Panel } from '../ui/Panel';
import { Section } from '../layout/Section';
import Link from 'next/link';
import Image from 'next/image';

interface RecentMovesSectionProps {
  content?: any;
  projects?: any[];
}

export function RecentMovesSection({ content, projects = [] }: RecentMovesSectionProps) {
  const fallbackMoves = [
    { title: "Enterprise Architecture Overhaul", metric: "300%", label: "Throughput Increase" },
    { title: "B2B SaaS Brand Repositioning", metric: "2.4x", label: "Pipeline Velocity" },
    { title: "Legacy System Automation", metric: "40hrs", label: "Saved Weekly" }
  ];

  const displayMoves = projects && projects.length > 0 ? projects : fallbackMoves;

  return (
    <Section className="overflow-hidden">
      <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <Typography variant="label" className="mb-4 block">{content?.badge || 'Proof of Concept'}</Typography>
          <Typography variant="h2">{content?.headline || 'Recent Moves.'}</Typography>
        </div>
        <Link href="/portfolio" passHref>
          <Typography variant="label" className="text-text-primary cursor-pointer border-b border-transparent hover:text-accent-blue hover:border-accent-blue transition-colors">
            {content?.cta_text || 'View All Case Studies \u2192'}
          </Typography>
        </Link>
      </div>

      {/* Horizontal Scroll Container */}
      <div className="flex gap-6 overflow-x-auto pb-8 no-scrollbar snap-x">
        {displayMoves.map((move: any, i: number) => (
          <div key={i} className="min-w-[85vw] md:min-w-[600px] snap-center">
            <Link href={move.slug ? `/portfolio/${move.slug}` : '/portfolio'} passHref legacyBehavior>
              <a className="block h-full">
                <Panel theme="light" className="p-0 h-full overflow-hidden group cursor-pointer border border-surface-elevated hover:border-text-primary transition-colors duration-500 flex flex-col">
                  
                  {/* Image Placeholder or Real Image */}
                  <div className="w-full h-64 bg-surface-deep relative overflow-hidden flex items-center justify-center border-b border-surface-elevated shrink-0">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-10 pointer-events-none"></div>
                    {move.cover_image_url ? (
                      <Image 
                        src={move.cover_image_url} 
                        alt={move.title} 
                        fill 
                        className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                        sizes="(max-width: 768px) 85vw, 600px"
                      />
                    ) : (
                      <>
                        <div className="w-32 h-32 border border-surface-elevated rotate-45 group-hover:scale-110 transition-transform duration-700 ease-out"></div>
                        <div className="w-16 h-16 bg-surface-card absolute rotate-45 group-hover:-rotate-12 transition-transform duration-700 ease-out"></div>
                      </>
                    )}
                  </div>
                  
                  <div className="p-8 md:p-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-8 relative overflow-hidden flex-grow">
                    <div className="absolute inset-0 bg-accent-gold w-0 group-hover:w-full transition-all duration-700 ease-out opacity-5 z-0 pointer-events-none"></div>
                    <div className="relative z-10">
                      <Typography variant="label" className="mb-2 block text-text-muted">{`Move 0${i+1}`}</Typography>
                      <Typography variant="h3">{move.title}</Typography>
                    </div>
                    <div className="relative z-10 text-right shrink-0 mt-auto md:mt-0">
                      <Typography variant="metric" className="block text-text-primary">{move.outcome_metric || move.metric}</Typography>
                      <Typography variant="label" className="text-text-muted">{move.outcome_label || move.label}</Typography>
                    </div>
                  </div>
                </Panel>
              </a>
            </Link>
          </div>
        ))}
      </div>
    </Section>
  );
}
