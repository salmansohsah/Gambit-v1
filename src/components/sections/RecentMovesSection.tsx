'use client';

import React, { useState } from 'react';
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
  const [visibleCount, setVisibleCount] = useState(3);
  const [showSocials, setShowSocials] = useState(false);
  const fallbackMoves = [
    { title: "Enterprise Architecture Overhaul", metric: "300%", label: "Throughput Increase" },
    { title: "B2B SaaS Brand Repositioning", metric: "2.4x", label: "Pipeline Velocity" },
    { title: "Legacy System Automation", metric: "40hrs", label: "Saved Weekly" },
    { title: "Global Expansion Strategy", metric: "$12M", label: "New ARR" },
    { title: "Supply Chain Optimization", metric: "15%", label: "Cost Reduction" },
    { title: "Customer Retention Program", metric: "98%", label: "Retention Rate" },
    { title: "Digital Transformation", metric: "5x", label: "Speed to Market" },
    { title: "Market Penetration", metric: "22%", label: "Market Share" },
    { title: "Product Launch Strategy", metric: "1M+", label: "Active Users" },
    { title: "Operational Efficiency", metric: "60%", label: "Faster Delivery" },
    { title: "Cloud Migration", metric: "99.9%", label: "Uptime" },
    { title: "AI Integration", metric: "30%", label: "Productivity Gain" },
    { title: "Extra Move 13", metric: "N/A", label: "Beyond 12" }
  ];

  const allMoves = projects && projects.length > 0 ? projects : fallbackMoves;
  
  const handleShowMore = () => {
    setVisibleCount(prev => Math.min(prev + 3, 12, allMoves.length));
  };

  const handleShowLess = () => {
    setVisibleCount(prev => Math.max(prev - 3, 3));
    setShowSocials(false); // Reset socials if we collapse
  };
  
  const displayMoves = allMoves.slice(0, visibleCount);
  const maxReached = visibleCount >= 12 || visibleCount >= allMoves.length;

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
        
        {/* Load More Actions */}
        <div className="flex flex-col items-center mt-8 min-h-[60px]">
          <div className="flex items-center gap-4 mb-4">
            {visibleCount > 3 && (
              <Button variant="outline" onClick={handleShowLess}>
                Show less
              </Button>
            )}
            {!maxReached && allMoves.length > 3 && (
              <Button variant="secondary" onClick={handleShowMore}>
                Show more
              </Button>
            )}
          </div>
          
          {maxReached && allMoves.length > 3 && (
            <div className="mt-2">
              {!showSocials ? (
                <Button variant="primary" onClick={() => setShowSocials(true)}>
                  Visit our social platforms to see more
                </Button>
              ) : (
                <div className="flex flex-col items-center gap-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
                  <Typography variant="label" className="text-text-muted mb-2">Connect with us on</Typography>
                  <div className="flex flex-wrap justify-center gap-4">
                    {[
                      { name: 'Instagram', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>, url: '#' },
                      { name: 'TikTok', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path></svg>, url: '#' },
                      { name: 'LinkedIn', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>, url: '#' },
                      { name: 'X', icon: <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.008 3.824H5.059z" /></svg>, url: '#' },
                      { name: 'Facebook', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>, url: '#' }
                    ].map((platform, i) => (
                      <Link key={i} href={platform.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-12 h-12 rounded-full border border-surface-elevated bg-surface-card hover:bg-surface-deep hover:border-text-primary hover:text-accent-gold transition-all duration-300">
                        {platform.icon}
                        <span className="sr-only">{platform.name}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Section>
  );
}
