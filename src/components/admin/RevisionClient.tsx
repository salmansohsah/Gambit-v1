"use client";

import React, { useState, useTransition } from 'react';
import { Typography } from '@/components/ui/Typography';
import { Panel } from '@/components/ui/Panel';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, History, RotateCcw, ChevronDown, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import { restoreRevisionAction } from '@/app/actions/system';

export default function RevisionClient({ 
  revisions, 
  entityType, 
  entityId, 
  backUrl, 
  title 
}: { 
  revisions: any[], 
  entityType: string, 
  entityId: string, 
  backUrl: string, 
  title: string 
}) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleRestore = (revisionId: string) => {
    if (!confirm('Are you sure you want to restore this revision? Your current state will be saved as a new revision automatically.')) return;
    
    startTransition(async () => {
      const result = await restoreRevisionAction(revisionId, entityType, entityId);
      if (result.success) {
        alert('Revision restored successfully.');
        router.push(backUrl);
      } else {
        alert(result.error || 'Failed to restore revision.');
      }
    });
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={() => router.push(backUrl)} className="px-3">
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <Typography variant="h3">Revision History</Typography>
          <Typography variant="body-sm" className="text-text-secondary">
            {title}
          </Typography>
        </div>
      </div>

      <Panel theme="light" className="bg-surface-panel border-surface-elevated">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-surface-elevated bg-surface-elevated/50">
                <th className="px-6 py-4 text-xs font-semibold text-text-secondary uppercase tracking-widest w-8"></th>
                <th className="px-6 py-4 text-xs font-semibold text-text-secondary uppercase tracking-widest">Saved At</th>
                <th className="px-6 py-4 text-xs font-semibold text-text-secondary uppercase tracking-widest">Author</th>
                <th className="px-6 py-4 text-xs font-semibold text-text-secondary uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-elevated">
              {revisions.map((rev, index) => (
                <React.Fragment key={rev.id}>
                  <tr 
                    onClick={() => toggleExpand(rev.id)}
                    className="hover:bg-surface-elevated/30 transition-colors cursor-pointer"
                  >
                    <td className="px-6 py-4 text-text-muted">
                      {expandedId === rev.id ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-text-primary font-mono">
                        {format(new Date(rev.created_at), 'MMM d, yyyy HH:mm:ss')}
                      </div>
                      {index === 0 && (
                        <span className="inline-block mt-1 text-[10px] font-bold uppercase tracking-wider bg-accent-gold/20 text-accent-gold px-2 py-0.5 rounded-full">
                          Most Recent Revision
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-text-secondary">
                      {rev.author_email}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="border-accent-gold/50 hover:bg-accent-gold/10 text-accent-gold"
                        onClick={(e) => { e.stopPropagation(); handleRestore(rev.id); }}
                        disabled={isPending}
                      >
                        <RotateCcw className="w-4 h-4 mr-2" /> Restore
                      </Button>
                    </td>
                  </tr>
                  {expandedId === rev.id && (
                    <tr className="bg-obsidian/30">
                      <td colSpan={4} className="px-6 py-6 border-b border-surface-elevated">
                        <div className="bg-surface-base rounded-md border border-surface-elevated p-4">
                          <div className="text-xs font-semibold text-text-secondary uppercase tracking-widest mb-3">Snapshot Data</div>
                          <pre className="text-xs font-mono text-text-primary overflow-x-auto p-4 bg-surface-elevated/20 rounded border border-surface-elevated max-h-96">
                            {JSON.stringify(rev.revision_data, null, 2)}
                          </pre>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
              {revisions.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-text-muted">
                    <History className="w-8 h-8 mx-auto mb-3 opacity-20" />
                    No revisions found for this item.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}
