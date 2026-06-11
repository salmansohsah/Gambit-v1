"use client";

import React, { useTransition } from 'react';
import { Typography } from '@/components/ui/Typography';
import { Panel } from '@/components/ui/Panel';
import { Button } from '@/components/ui/Button';
import { GitBranch, Cloud, RotateCcw, Download, Camera, AlertTriangle, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';
import { createSnapshotAction, restoreSnapshotAction } from '@/app/actions/system';

export default function SyncClient({ 
  snapshots, 
  github, 
  vercel 
}: { 
  snapshots: any[], 
  github: any, 
  vercel: any 
}) {
  const [isPending, startTransition] = useTransition();

  const handleCreateSnapshot = () => {
    const label = prompt("Enter a label for this snapshot:", `Manual Snapshot - ${new Date().toLocaleString()}`);
    if (!label) return;

    startTransition(async () => {
      const result = await createSnapshotAction(label);
      if (result.success) {
        alert('Snapshot created successfully!');
      } else {
        alert(result.error || 'Failed to create snapshot.');
      }
    });
  };

  const handleRestore = (id: string, label: string) => {
    if (!confirm(`Are you sure you want to restore the snapshot "${label}"? This will overwrite all dynamic content. An auto-backup will be taken first.`)) return;
    
    startTransition(async () => {
      const result = await restoreSnapshotAction(id);
      if (result.success) {
        alert('Snapshot restored successfully!');
      } else {
        alert(result.error || 'Failed to restore snapshot.');
      }
    });
  };

  const handleExport = (snapshot: any) => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(snapshot.snapshot_data, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `snapshot_${snapshot.id}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <Typography variant="h2" className="mb-2">Sync Center</Typography>
          <Typography variant="body-sm" className="text-text-secondary">
            Manage global content snapshots and deployment synchronization.
          </Typography>
        </div>
        <Button onClick={handleCreateSnapshot} disabled={isPending}>
          <Camera className="w-4 h-4 mr-2" /> Create Snapshot
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* GitHub Card */}
        <Panel theme="light" className="bg-surface-panel p-6 border-surface-elevated">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <GitBranch className="w-5 h-5 text-text-primary" />
              <Typography variant="h4">Source Code (GitHub)</Typography>
            </div>
          </div>
          {github ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-text-secondary">Last Commit:</span>
                <a href={github.url} target="_blank" rel="noreferrer" className="text-sm text-accent-gold font-mono hover:underline">
                  {github.hash}
                </a>
              </div>
              <div className="text-sm text-text-primary">"{github.message}"</div>
              <div className="text-xs text-text-muted">By {github.author} on {format(new Date(github.date), 'MMM d, yyyy HH:mm')}</div>
            </div>
          ) : (
            <div className="flex items-start gap-3 bg-amber-500/10 text-amber-500 p-4 rounded border border-amber-500/20">
              <AlertTriangle className="w-5 h-5 mt-0.5" />
              <div>
                <div className="text-sm font-semibold mb-1">GitHub API not configured</div>
                <div className="text-xs">Add GITHUB_TOKEN and GITHUB_REPO to environment variables to enable sync tracking.</div>
              </div>
            </div>
          )}
        </Panel>

        {/* Vercel Card */}
        <Panel theme="light" className="bg-surface-panel p-6 border-surface-elevated">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Cloud className="w-5 h-5 text-text-primary" />
              <Typography variant="h4">Deployment (Vercel)</Typography>
            </div>
          </div>
          {vercel ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-text-secondary">Status:</span>
                {vercel.state === 'READY' ? (
                  <span className="flex items-center gap-1 text-sm text-green-500 font-semibold"><CheckCircle className="w-4 h-4"/> Production</span>
                ) : (
                  <span className="text-sm text-amber-500 font-semibold">{vercel.state}</span>
                )}
              </div>
              <div className="text-sm text-text-primary">
                URL: <a href={vercel.url} target="_blank" rel="noreferrer" className="text-accent-gold hover:underline">{vercel.url}</a>
              </div>
              <div className="text-xs text-text-muted">Deployed at {format(new Date(vercel.created), 'MMM d, yyyy HH:mm')}</div>
            </div>
          ) : (
            <div className="flex items-start gap-3 bg-amber-500/10 text-amber-500 p-4 rounded border border-amber-500/20">
              <AlertTriangle className="w-5 h-5 mt-0.5" />
              <div>
                <div className="text-sm font-semibold mb-1">Vercel API not configured</div>
                <div className="text-xs">Add VERCEL_TOKEN and VERCEL_PROJECT_ID to environment variables to enable deployment tracking.</div>
              </div>
            </div>
          )}
        </Panel>
      </div>

      {/* Snapshot List */}
      <Panel theme="light" className="bg-surface-panel border-surface-elevated">
        <div className="p-6 border-b border-surface-elevated flex items-center justify-between">
          <Typography variant="h4">Content Snapshots</Typography>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-surface-elevated bg-surface-elevated/50">
                <th className="px-6 py-4 text-xs font-semibold text-text-secondary uppercase tracking-widest">Snapshot</th>
                <th className="px-6 py-4 text-xs font-semibold text-text-secondary uppercase tracking-widest">Type</th>
                <th className="px-6 py-4 text-xs font-semibold text-text-secondary uppercase tracking-widest">Created At</th>
                <th className="px-6 py-4 text-xs font-semibold text-text-secondary uppercase tracking-widest">Author</th>
                <th className="px-6 py-4 text-xs font-semibold text-text-secondary uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-elevated">
              {snapshots.map((snap) => (
                <tr key={snap.id} className="hover:bg-surface-elevated/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-text-primary">{snap.label}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                      snap.snapshot_type === 'manual' ? 'bg-blue-500/10 text-blue-500' :
                      snap.snapshot_type === 'auto_pre_restore' ? 'bg-amber-500/10 text-amber-500' :
                      'bg-purple-500/10 text-purple-500'
                    }`}>
                      {snap.snapshot_type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-text-secondary font-mono">
                    {format(new Date(snap.created_at), 'MMM d, yyyy HH:mm')}
                  </td>
                  <td className="px-6 py-4 text-sm text-text-secondary">
                    {snap.author_email}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end items-center gap-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleExport(snap)}
                        title="Export JSON"
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="border-red-500/50 hover:bg-red-500/10 text-red-500"
                        onClick={() => handleRestore(snap.id, snap.label)}
                        disabled={isPending}
                        title="Restore Snapshot"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {snapshots.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-text-muted">
                    No snapshots found.
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
