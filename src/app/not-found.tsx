"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { Section } from '@/components/layout/Section';
import { Typography } from '@/components/ui/Typography';
import { Button } from '@/components/ui/Button';

export default function NotFound() {
  const router = useRouter();

  return (
    <main className="flex flex-col flex-1">
      <Section className="bg-surface-panel flex-1 flex items-center justify-center min-h-[70vh]">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <Typography variant="label" className="mb-6 block text-text-secondary uppercase tracking-widest">Error 404</Typography>
          <Typography variant="hero" className="mb-6">
            POSITION<br/>NOT FOUND.
          </Typography>
          <Typography variant="body" className="mb-12">
            The coordinates you requested do not exist in our current strategic architecture. The page may have been moved, deleted, or you followed an invalid path.
          </Typography>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Button variant="primary" onClick={() => router.push('/')}>Return to Base</Button>
            <Button variant="outline" onClick={() => router.push('/contact')}>Contact Command</Button>
          </div>
        </div>
      </Section>
    </main>
  );
}
