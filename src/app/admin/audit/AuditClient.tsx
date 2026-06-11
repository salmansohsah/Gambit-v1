"use client";

import React, { useState } from 'react';
import { Panel } from '@/components/ui/Panel';
import { Search, Filter, ChevronRight, ChevronDown } from 'lucide-react';
import { format } from 'date-fns';

export default function AuditClient({ initialLogs }: { initialLogs: any[] }) {
  const [search, setSearch] = useState('');
  const [entityFilter, setEntityFilter] = useState('All');
  const [actionFilter, setActionFilter] = useState('All');
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);

  const filteredLogs = initialLogs.filter(log => {
    if (entityFilter !== 'All' && log.entity_type !== entityFilter) return false;
    if (actionFilter !== 'All' && log.action !== actionFilter) return false;
    
    if (search) {
      const s = search.toLowerCase();
      if (!log.actor.toLowerCase().includes(s) && 
          !log.entity_id.toLowerCase().includes(s) && 
          !log.entity_type.toLowerCase().includes(s)) {
        return false;
      }
    }
    return true;
  });

  const uniqueEntities = Array.from(new Set(initialLogs.map(l => l.entity_type)));
  const uniqueActions = Array.from(new Set(initialLogs.map(l => l.action)));

  const toggleExpand = (id: string) => {
    setExpandedLogId(expandedLogId === id ? null : id);
  };

  const getActionColor = (action: string) => {
    switch(action) {
      case 'create': return 'bg-green-500/10 text-green-500 border border-green-500/20';
      case 'update': return 'bg-blue-500/10 text-blue-500 border border-blue-500/20';
      case 'delete': return 'bg-red-500/10 text-red-500 border border-red-500/20';
      case 'publish': return 'bg-purple-500/10 text-purple-500 border border-purple-500/20';
      case 'archive': return 'bg-amber-500/10 text-amber-500 border border-amber-500/20';
      case 'restore': return 'bg-teal-500/10 text-teal-500 border border-teal-500/20';
      default: return 'bg-surface-elevated text-text-secondary border border-surface-elevated';
    }
  };

  return (
    <Panel theme="light" className="bg-surface-panel border-surface-elevated">
      <div className="p-4 border-b border-surface-elevated flex flex-col sm:flex-row gap-4 bg-surface-elevated/20">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input 
            type="text" 
            placeholder="Search by actor or ID..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-surface-card border border-surface-elevated rounded-md pl-9 pr-4 py-2 text-sm focus:border-accent-gold outline-none transition-colors"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-text-muted" />
          <select 
            value={entityFilter} 
            onChange={e => setEntityFilter(e.target.value)}
            className="bg-surface-card border border-surface-elevated rounded-md px-3 py-2 text-sm focus:border-accent-gold outline-none"
          >
            <option value="All">All Entities</option>
            {uniqueEntities.map(e => <option key={e} value={e}>{e}</option>)}
          </select>
          <select 
            value={actionFilter} 
            onChange={e => setActionFilter(e.target.value)}
            className="bg-surface-card border border-surface-elevated rounded-md px-3 py-2 text-sm focus:border-accent-gold outline-none"
          >
            <option value="All">All Actions</option>
            {uniqueActions.map(a => <option key={a} value={a}>{a}</option>)}
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-surface-elevated bg-surface-elevated/50">
              <th className="px-6 py-4 text-xs font-semibold text-text-secondary uppercase tracking-widest w-8"></th>
              <th className="px-6 py-4 text-xs font-semibold text-text-secondary uppercase tracking-widest">Timestamp</th>
              <th className="px-6 py-4 text-xs font-semibold text-text-secondary uppercase tracking-widest">Action</th>
              <th className="px-6 py-4 text-xs font-semibold text-text-secondary uppercase tracking-widest">Entity</th>
              <th className="px-6 py-4 text-xs font-semibold text-text-secondary uppercase tracking-widest">Actor</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-elevated">
            {filteredLogs.map((log) => (
              <React.Fragment key={log.id}>
                <tr 
                  onClick={() => toggleExpand(log.id)}
                  className="hover:bg-surface-elevated/30 transition-colors cursor-pointer"
                >
                  <td className="px-6 py-4 text-text-muted">
                    {expandedLogId === log.id ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                  </td>
                  <td className="px-6 py-4 text-sm font-mono text-text-primary">
                    {format(new Date(log.created_at), 'MMM d, HH:mm:ss')}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium uppercase tracking-wider ${getActionColor(log.action)}`}>
                      {log.action}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-text-primary">{log.entity_type}</div>
                    <div className="text-xs text-text-muted font-mono mt-0.5" title={log.entity_id}>
                      {log.entity_id.length > 20 ? log.entity_id.substring(0, 20) + '...' : log.entity_id}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-text-secondary">
                    {log.actor}
                  </td>
                </tr>
                {expandedLogId === log.id && (
                  <tr className="bg-obsidian/30">
                    <td colSpan={5} className="px-6 py-6 border-b border-surface-elevated">
                      <div className="bg-surface-base rounded-md border border-surface-elevated p-4">
                        <div className="text-xs font-semibold text-text-secondary uppercase tracking-widest mb-3">Payload Changes</div>
                        <pre className="text-xs font-mono text-text-primary overflow-x-auto p-4 bg-surface-elevated/20 rounded border border-surface-elevated">
                          {log.changes ? JSON.stringify(log.changes, null, 2) : 'No changes recorded'}
                        </pre>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
            {filteredLogs.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-text-muted">
                  No audit logs found matching criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}
