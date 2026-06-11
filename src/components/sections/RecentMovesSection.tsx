import React from 'react';
import { Typography } from '../ui/Typography';
import { Panel } from '../ui/Panel';
import { Section } from '../layout/Section';
import { Button } from '../ui/Button';
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

  const allMoves = projects && projects.length > 0 ? projects : fallbackMoves;
  const displayMoves = allMoves.slice(0, 3); // Always show exactly 3 on the homepage

  return (
    <Section className="overflow-hidden" container={false}>
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 w-full mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <Typography variant="label" className="mb-4 block">{content?.badge || 'Proof of Concept'}</Typography>
          <Typography variant="h2">{content?.headline || 'Recent Moves.'}</Typography>
        </div>
      </div>

      {/* Grid Container */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-12">
          {displayMoves.map((move: any, i: number) => (
            <div key={i} className="w-full">
              <Link href={move.slug ? `/portfolio/${move.slug}` : '/portfolio'} className="block h-full">
                <Panel theme="light" className="p-0 h-full overflow-hidden group cursor-pointer border border-surface-elevated hover:border-text-primary transition-colors duration-500 flex flex-col shadow-sm hover:shadow-md">
                  
                  {/* Image Placeholder or Real Image */}
                  <div className="w-full h-52 bg-surface-deep relative overflow-hidden flex items-center justify-center border-b border-surface-elevated shrink-0">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-10 pointer-events-none"></div>
                    {move.cover_image_url ? (
                      <Image 
                        src={move.cover_image_url} 
                        alt={move.title} 
                        fill 
                        className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    ) : (
                      <>
                        <div aria-hidden="true" className="w-24 h-24 border border-surface-elevated rotate-45 group-hover:scale-110 transition-transform duration-700 ease-out"></div>
                        <div aria-hidden="true" className="w-12 h-12 bg-surface-card absolute rotate-45 group-hover:-rotate-12 transition-transform duration-700 ease-out"></div>
                      </>
                    )}
                  </div>
                  
                  <div className="p-6 md:p-8 flex flex-col justify-between items-start gap-6 relative overflow-hidden flex-grow">
                    <div className="absolute inset-0 bg-accent-gold w-0 group-hover:w-full transition-all duration-700 ease-out opacity-5 z-0 pointer-events-none"></div>
                    <div className="relative z-10 w-full">
                      <Typography variant="label" className="mb-3 block text-text-muted">{`Move 0${i+1}`}</Typography>
                      <Typography variant="h3" className="break-words line-clamp-2">{move.title}</Typography>
                    </div>
                    <div className="relative z-10 text-left w-full pt-4 border-t border-surface-elevated mt-auto">
                      <Typography variant="metric" className="block text-text-primary break-words text-3xl">{move.outcome_metric || move.metric}</Typography>
                      <Typography variant="label" className="text-text-muted break-words">{move.outcome_label || move.label}</Typography>
                    </div>
                  </div>
                </Panel>
              </Link>
            </div>
          ))}
        </div>
        
        {/* Link to Full Portfolio */}
        <div className="flex flex-col items-center mt-4">
          <Link href="/portfolio">
            <Button variant="primary">
              Show full portfolio
            </Button>
          </Link>
        </div>
      </div>
    </Section>
  );
}
