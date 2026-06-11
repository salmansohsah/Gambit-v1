import React from 'react';
import { Typography } from '@/components/ui/Typography';
import { Panel } from '@/components/ui/Panel';
import { Grid } from '@/components/layout/Grid';
import { Button } from '@/components/ui/Button';
import { TrendingUp, Clock, Archive, ArrowRight, PlusCircle, Database, Activity, CheckCircle, AlertTriangle, Compass, Search } from 'lucide-react';
import Link from 'next/link';
import CreateSnapshotButton from './CreateSnapshotButton';
import { getDashboardMetrics, getActivePipeline, getPendingDrafts, getSystemHealth, getSeoHealth } from '@/lib/dal/admin';
import { formatDistanceToNow } from 'date-fns';

export default async function DashboardPage() {
  const metrics = await getDashboardMetrics();
  const pipeline = await getActivePipeline();
  const drafts = await getPendingDrafts();
  const health = await getSystemHealth();
  const seoHealth = await getSeoHealth();

  const KPIS = [
    { label: 'New Leads (7d)', value: metrics.newLeads.toString(), icon: TrendingUp, trend: 'Recent', trendColor: 'text-green-500' },
    { label: 'Pending Reviews', value: metrics.pendingReviews.toString(), icon: Clock, trend: 'Total Drafts/Reviews', trendColor: 'text-amber-500' },
    { label: 'Pending Insights', value: drafts.filter(d => d.type === 'Insight').length.toString(), icon: Activity, trend: 'Action needed', trendColor: 'text-amber-500' },
    { label: 'Published Moves', value: metrics.publishedMoves.toString(), icon: Archive, trend: 'All-time', trendColor: 'text-text-muted' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <Typography variant="h2" className="mb-2">Command Center</Typography>
          <Typography variant="body-sm" className="text-text-secondary">
            Overview of platform operations, lead pipeline, and content strategy.
          </Typography>
        </div>
        
        {/* S1-F1: Status Strip */}
        <div className="flex items-center gap-4 bg-surface-panel border border-surface-elevated px-4 py-2 rounded-md">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-text-muted" />
            <span className="text-xs font-medium text-text-secondary">Supabase:</span>
            {health.supabaseHealthy ? (
              <span className="flex items-center gap-1 text-xs text-green-500 font-semibold"><CheckCircle className="w-3 h-3"/> Healthy</span>
            ) : (
              <span className="flex items-center gap-1 text-xs text-red-500 font-semibold"><AlertTriangle className="w-3 h-3"/> Error</span>
            )}
          </div>
          <div className="w-px h-4 bg-surface-elevated" />
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-text-muted" />
            <span className="text-xs font-medium text-text-secondary">Last Snapshot:</span>
            <span className="text-xs font-semibold text-text-primary">{health.lastSnapshot || 'N/A (Pending S2)'}</span>
          </div>
        </div>
      </div>

      {/* KPI Widgets */}
      <Grid columns={4} gap="lg">
        {KPIS.map((kpi, i) => {
          const Icon = kpi.icon;
          return (
            <Panel key={i} theme="light" className="bg-surface-panel p-6 border-surface-elevated">
              <div className="flex items-start justify-between mb-4">
                <Typography variant="label" className="text-text-secondary uppercase tracking-widest">{kpi.label}</Typography>
                <div className="p-2 bg-surface-elevated rounded-md text-text-muted">
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline gap-4">
                <span className="text-4xl font-bold text-text-primary tracking-tight">{kpi.value}</span>
                <span className={`text-sm font-medium ${kpi.trendColor}`}>{kpi.trend}</span>
              </div>
            </Panel>
          );
        })}
      </Grid>

      {/* S1-F7: Content Health Row */}
      {seoHealth.pagesMissingSeo > 0 && (
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-md p-4 flex items-center justify-between">
          <div className="flex items-center gap-3 text-amber-500">
            <AlertTriangle className="w-5 h-5" />
            <Typography variant="body-sm" className="font-semibold">
              Content Health: {seoHealth.pagesMissingSeo} out of {seoHealth.totalCorePages} core pages are missing custom SEO metadata.
            </Typography>
          </div>
          <Link href="/admin/seo">
            <Button variant="outline" className="text-xs px-3 py-1 border-amber-500/20 hover:bg-amber-500/10 text-amber-500">
              Manage SEO
            </Button>
          </Link>
        </div>
      )}

      <Grid columns={12} gap="lg">
        {/* Left Column: Active Pipeline */}
        <div className="col-span-12 lg:col-span-7 space-y-6">
          <Panel theme="light" className="bg-surface-panel border-surface-elevated">
            <div className="flex items-center justify-between p-6 border-b border-surface-elevated">
              <Typography variant="h4">Active Pipeline</Typography>
              <Link href="/admin/leads" className="text-sm font-semibold text-accent-gold hover:text-accent-gold transition-colors flex items-center gap-2">
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="p-0">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-surface-elevated bg-surface-elevated/50">
                    <th className="px-6 py-4 text-xs font-semibold text-text-secondary uppercase tracking-widest">Lead</th>
                    <th className="px-6 py-4 text-xs font-semibold text-text-secondary uppercase tracking-widest">Status</th>
                    <th className="px-6 py-4 text-xs font-semibold text-text-secondary uppercase tracking-widest">Received</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-elevated">
                  {pipeline.map((lead) => (
                    <tr key={lead.id} className="hover:bg-surface-elevated/30 transition-colors cursor-pointer group">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-text-primary mb-1">{lead.full_name}</div>
                        <div className="text-sm text-text-muted">{lead.organization || 'No Organization'}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          lead.status === 'New' ? 'bg-green-500/10 text-green-500 border border-green-500/20' :
                          lead.status === 'Reviewed' ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20' :
                          'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                        }`}>
                          {lead.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-text-muted">
                        {lead.submitted_at ? formatDistanceToNow(new Date(lead.submitted_at), { addSuffix: true }) : 'Unknown'}
                      </td>
                    </tr>
                  ))}
                  {pipeline.length === 0 && (
                    <tr>
                      <td colSpan={3} className="px-6 py-8 text-center text-text-muted">No active leads in pipeline.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Panel>
        </div>

        {/* Right Column: Action Center */}
        <div className="col-span-12 lg:col-span-5 space-y-6">
          <Panel theme="light" className="bg-surface-panel border-surface-elevated p-6">
            <Typography variant="h4" className="mb-6">Quick Actions</Typography>
            <div className="grid grid-cols-2 gap-4">
              <Link href="/admin/insights">
                <Button variant="outline" className="w-full flex items-center justify-center gap-2 h-12">
                  <PlusCircle className="w-4 h-4" /> New Insight
                </Button>
              </Link>
              <Link href="/admin/portfolio">
                <Button variant="outline" className="w-full flex items-center justify-center gap-2 h-12">
                  <PlusCircle className="w-4 h-4" /> New Move
                </Button>
              </Link>
              <Link href="/admin/navigation">
                <Button variant="outline" className="w-full flex items-center justify-center gap-2 h-12">
                  <Compass className="w-4 h-4" /> Navigation
                </Button>
              </Link>
              <Link href="/admin/seo">
                <Button variant="outline" className="w-full flex items-center justify-center gap-2 h-12">
                  <Search className="w-4 h-4" /> Manage SEO
                </Button>
              </Link>
              <div className="col-span-2">
                <CreateSnapshotButton />
              </div>
            </div>
          </Panel>

          <Panel theme="light" className="bg-surface-panel border-surface-elevated">
            <div className="p-6 border-b border-surface-elevated">
              <Typography variant="h4">Drafts Awaiting Review</Typography>
            </div>
            <div className="divide-y divide-surface-elevated">
              {drafts.map((draft) => (
                <div key={draft.id} className="p-6 flex items-start justify-between hover:bg-surface-elevated/30 transition-colors">
                  <div>
                    <Typography variant="label" className="text-text-secondary uppercase tracking-widest text-xs mb-1 block">
                      {draft.type}
                    </Typography>
                    <Typography variant="body-sm" className="font-semibold text-text-primary mb-1">
                      {draft.title}
                    </Typography>
                    <Typography variant="label" className="text-text-muted">
                      By {draft.author}
                    </Typography>
                  </div>
                  <Button variant="outline" className="text-sm px-3 py-1">Review</Button>
                </div>
              ))}
              {drafts.length === 0 && (
                <div className="p-6 text-center text-text-muted">
                  No drafts awaiting review.
                </div>
              )}
            </div>
          </Panel>
        </div>
      </Grid>
    </div>
  );
}
