"use client";

import React, { useState, useTransition } from 'react';
import { Typography } from '@/components/ui/Typography';
import { Panel } from '@/components/ui/Panel';
import { Button } from '@/components/ui/Button';
import { Search, Filter, Download, X } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { updateLeadStatus, updateLeadNotes } from '@/app/actions/leads';
import { useRouter } from 'next/navigation';

export default function LeadsClient({ initialLeads }: { initialLeads: any[] }) {
  const [selectedLead, setSelectedLead] = useState<any | null>(null);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [isPending, startTransition] = useTransition();
  const [internalNotes, setInternalNotes] = useState('');
  const router = useRouter();

  const filteredLeads = initialLeads.filter(lead => {
    if (filterStatus !== 'All' && lead.status !== filterStatus) return false;
    const searchString = `${lead.full_name} ${lead.organization}`.toLowerCase();
    if (search && !searchString.includes(search.toLowerCase())) return false;
    return true;
  });

  const handleStatusChange = async (newStatus: string) => {
    if (!selectedLead) return;
    
    // Optimistic UI update
    setSelectedLead({ ...selectedLead, status: newStatus });
    
    startTransition(async () => {
      const result = await updateLeadStatus(selectedLead.id, newStatus);
      if (!result.success) {
        alert('Failed to update status: ' + result.error);
        setSelectedLead({ ...selectedLead }); // Revert
      }
      router.refresh();
    });
  };

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInternalNotes(e.target.value);
  };

  const handleNotesBlur = () => {
    if (!selectedLead) return;
    const newNotes = { text: internalNotes, updatedAt: new Date().toISOString() };
    startTransition(async () => {
      await updateLeadNotes(selectedLead.id, newNotes);
      router.refresh();
    });
  };

  const openLead = (lead: any) => {
    setSelectedLead(lead);
    setInternalNotes(lead.notes?.text || '');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <Typography variant="h2" className="mb-2">Leads</Typography>
          <Typography variant="body-sm" className="text-text-secondary">
            Strategic intake pipeline and CRM operations.
          </Typography>
        </div>
        <Button variant="outline" className="flex items-center gap-2">
          <Download className="w-4 h-4" /> Export CSV
        </Button>
      </div>

      <Panel theme="light" className="bg-surface-panel border-surface-elevated">
        <div className="p-4 border-b border-surface-elevated flex flex-col sm:flex-row gap-4 justify-between items-center bg-surface-elevated/20">
          <div className="relative w-full sm:w-96">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input 
              type="text" 
              placeholder="Search by name or org..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-surface-card border border-surface-elevated rounded-md pl-9 pr-4 py-2 text-sm focus:border-accent-gold outline-none transition-colors"
            />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="w-4 h-4 text-text-muted" />
            <select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-surface-card border border-surface-elevated rounded-md px-3 py-2 text-sm focus:border-accent-gold outline-none transition-colors w-full sm:w-auto"
            >
              <option value="All">All Statuses</option>
              <option value="new">New</option>
              <option value="reviewed">Reviewed</option>
              <option value="in_conversation">In Conversation</option>
              <option value="closed_won">Closed Won</option>
              <option value="closed_lost">Closed Lost</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-surface-elevated bg-surface-elevated/50">
                <th className="px-6 py-4 text-xs font-semibold text-text-secondary uppercase tracking-widest">Lead</th>
                <th className="px-6 py-4 text-xs font-semibold text-text-secondary uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-text-secondary uppercase tracking-widest">Received Date</th>
                <th className="px-6 py-4 text-xs font-semibold text-text-secondary uppercase tracking-widest">Source</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-elevated">
              {filteredLeads.map((lead) => (
                <tr 
                  key={lead.id} 
                  onClick={() => openLead(lead)}
                  className="hover:bg-surface-elevated/30 transition-colors cursor-pointer"
                >
                  <td className="px-6 py-4">
                    <div className="font-semibold text-text-primary mb-1">{lead.full_name}</div>
                    <div className="text-sm text-text-muted">{lead.organization || 'No Organization'}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      lead.status === 'new' ? 'bg-green-500/10 text-green-500 border border-green-500/20' :
                      lead.status === 'reviewed' ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20' :
                      lead.status === 'in_conversation' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' :
                      lead.status === 'closed_won' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' :
                      'bg-red-500/10 text-red-500 border border-red-500/20'
                    }`}>
                      {lead.status ? lead.status.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()) : 'Unknown'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-text-muted">
                    {lead.submitted_at ? formatDistanceToNow(new Date(lead.submitted_at), { addSuffix: true }) : 'Unknown'}
                  </td>
                  <td className="px-6 py-4 text-sm text-text-muted">{lead.source || 'Website'}</td>
                </tr>
              ))}
              {filteredLeads.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-text-muted">No leads found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Panel>

      {/* Slide-over Panel for Lead Details */}
      {selectedLead && (
        <>
          <div className="fixed inset-0 bg-obsidian/80 backdrop-blur-sm z-40 transition-opacity" onClick={() => setSelectedLead(null)} />
          <div className="fixed inset-y-0 right-0 w-full max-w-4xl bg-surface-base border-l border-surface-elevated shadow-2xl z-50 overflow-y-auto transform transition-transform duration-300">
            <div className="sticky top-0 bg-surface-base/90 backdrop-blur-md border-b border-surface-elevated px-6 py-4 flex items-center justify-between z-10">
              <Typography variant="h3">{selectedLead.full_name}</Typography>
              <button onClick={() => setSelectedLead(null)} className="p-2 hover:bg-surface-elevated rounded-full transition-colors">
                <X className="w-5 h-5 text-text-secondary" />
              </button>
            </div>
            
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left Column: Intake Data */}
              <div className="space-y-6">
                <Typography variant="h4" className="border-b border-surface-elevated pb-2">Intake Profile</Typography>
                
                <div>
                  <Typography variant="label" className="text-text-secondary uppercase tracking-widest text-xs mb-1 block">Email</Typography>
                  <Typography variant="body" className="font-medium">{selectedLead.email}</Typography>
                </div>
                
                <div>
                  <Typography variant="label" className="text-text-secondary uppercase tracking-widest text-xs mb-1 block">Organization</Typography>
                  <Typography variant="body" className="font-medium">{selectedLead.organization || 'N/A'}</Typography>
                </div>
                
                <div>
                  <Typography variant="label" className="text-text-secondary uppercase tracking-widest text-xs mb-1 block">Primary Goal</Typography>
                  <Typography variant="body" className="font-medium bg-surface-panel p-3 rounded-md border border-surface-elevated">
                    {selectedLead.primary_goal || 'Not specified'}
                  </Typography>
                </div>

                <div>
                  <Typography variant="label" className="text-text-secondary uppercase tracking-widest text-xs mb-1 block">Current Challenge</Typography>
                  <Typography variant="body" className="font-medium bg-surface-panel p-3 rounded-md border border-surface-elevated">
                    {selectedLead.current_challenge || 'Not specified'}
                  </Typography>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Typography variant="label" className="text-text-secondary uppercase tracking-widest text-xs mb-1 block">Budget</Typography>
                    <Typography variant="body" className="font-medium">{selectedLead.budget_range || 'Unknown'}</Typography>
                  </div>
                  <div>
                    <Typography variant="label" className="text-text-secondary uppercase tracking-widest text-xs mb-1 block">Timeline</Typography>
                    <Typography variant="body" className="font-medium">{selectedLead.timeline || 'Unknown'}</Typography>
                  </div>
                </div>
              </div>

              {/* Right Column: Operator Controls */}
              <div className="space-y-6">
                <Typography variant="h4" className="border-b border-surface-elevated pb-2">Operator Controls</Typography>

                <div>
                  <Typography variant="label" className="text-text-secondary uppercase tracking-widest text-xs mb-2 block">Pipeline Status</Typography>
                  <select 
                    className="w-full bg-surface-card border border-surface-elevated rounded-md px-4 py-3 text-sm focus:border-accent-gold outline-none transition-colors font-medium disabled:opacity-50"
                    value={selectedLead.status}
                    onChange={(e) => handleStatusChange(e.target.value)}
                    disabled={isPending}
                  >
                    <option value="new">New</option>
                    <option value="reviewed">Reviewed</option>
                    <option value="in_conversation">In Conversation</option>
                    <option value="closed_won">Closed Won</option>
                    <option value="closed_lost">Closed Lost</option>
                  </select>
                </div>

                <div>
                  <Typography variant="label" className="text-text-secondary uppercase tracking-widest text-xs mb-2 block">Internal Notes</Typography>
                  <textarea 
                    rows={8}
                    className="w-full bg-surface-card border border-surface-elevated rounded-md px-4 py-3 text-sm focus:border-accent-gold outline-none transition-colors"
                    placeholder="Add operational notes here. Auto-saves on blur."
                    value={internalNotes}
                    onChange={handleNotesChange}
                    onBlur={handleNotesBlur}
                  ></textarea>
                  {selectedLead.notes?.updatedAt && (
                    <Typography variant="body-sm" className="text-text-muted mt-2 text-xs text-right">
                      Last edited: {formatDistanceToNow(new Date(selectedLead.notes.updatedAt), { addSuffix: true })}
                    </Typography>
                  )}
                </div>

                <div className="bg-surface-panel p-4 rounded-md border border-surface-elevated">
                  <Typography variant="label" className="text-text-secondary uppercase tracking-widest text-xs mb-2 block">Metadata</Typography>
                  <div className="space-y-1 text-sm text-text-muted">
                    <p>Received: {selectedLead.submitted_at ? new Date(selectedLead.submitted_at).toLocaleString() : 'Unknown'}</p>
                    <p>Source: {selectedLead.source}</p>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
