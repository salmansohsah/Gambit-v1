"use client";

import React, { useState } from 'react';
import { Grid } from '@/components/layout/Grid';
import { Panel } from '@/components/ui/Panel';
import { Typography } from '@/components/ui/Typography';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export function ArchiveList({ moves }: { moves: any[] }) {
  const [visibleCount, setVisibleCount] = useState(6);

  return (
    <>
      <Grid columns={2} gap="lg">
        {moves.slice(0, visibleCount).map((move, i) => (
          <Panel key={i} theme="light" className="bg-surface-card h-full flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-6">
                <div>
                  <Typography variant="label" className="block text-text-secondary mb-2 tracking-widest">
                    MOVE {(i + 1).toString().padStart(2, '0')}
                  </Typography>
                  <Typography variant="h3">{move.title}</Typography>
                </div>
              </div>
              <Typography variant="body" className="mb-8">{move.summary}</Typography>
              
              <div className="flex flex-wrap gap-2 mb-8">
                {move.project_capabilities?.map((pc: any, j: number) => (
                  <span key={j} className="text-xs font-medium text-text-secondary bg-surface-panel border border-surface-elevated px-2 py-1 rounded">
                    {pc.capabilities?.title}
                  </span>
                ))}
              </div>
            </div>
            <div className="border-t border-surface-elevated pt-6">
              <Typography variant="label" className="text-text-secondary block mb-1">Outcome</Typography>
              <Typography variant="h4" className="text-obsidian mb-6">{move.outcome_label}</Typography>
              <Link href={`/portfolio/${move.slug}`} className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-accent-blue hover:text-accent-gold transition-colors">
                Explore Full Case Study &rarr;
              </Link>
            </div>
          </Panel>
        ))}
      </Grid>

      {/* Progressive Reveal Mechanism */}
      {visibleCount < moves.length && (
        <div className="mt-16 flex justify-center">
          <Button variant="outline" onClick={() => setVisibleCount(prev => prev + 6)}>
            View More Moves
          </Button>
        </div>
      )}
    </>
  );
}
