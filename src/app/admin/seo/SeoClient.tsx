'use client';

import React, { useState } from 'react';
import { SeoOverride } from '@/lib/dal/seo';
import { Typography } from '@/components/ui/Typography';
import { Button } from '@/components/ui/Button';
import { Panel } from '@/components/ui/Panel';
import { saveSeoOverride, removeSeoOverride } from './actions';
import { Plus, Edit2, Trash2, Globe, FileText, Check, X } from 'lucide-react';

export default function SeoClient({ initialOverrides }: { initialOverrides: SeoOverride[] }) {
  const [overrides, setOverrides] = useState<SeoOverride[]>(initialOverrides);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<SeoOverride>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  const handleAddNew = () => {
    setEditingId('new');
    setFormData({
      page_path: '/',
      is_active: true,
      noindex: false,
      nofollow: false,
    });
    setError('');
  };

  const handleEdit = (override: SeoOverride) => {
    setEditingId(override.id);
    setFormData(override);
    setError('');
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this SEO override?')) return;
    const res = await removeSeoOverride(id);
    if (res.success) {
      setOverrides(overrides.filter((o) => o.id !== id));
    } else {
      alert('Failed to delete: ' + res.error);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError('');
    
    // basic validation
    if (!formData.page_path) {
      setError('Page Path is required.');
      setIsSaving(false);
      return;
    }

    // sanitize structured data json
    if (formData.structured_data_json && typeof formData.structured_data_json === 'string') {
      try {
        JSON.parse(formData.structured_data_json);
      } catch (err) {
        setError('Structured Data must be valid JSON.');
        setIsSaving(false);
        return;
      }
    }

    const res = await saveSeoOverride(formData);
    
    if (res.success && res.data) {
      if (editingId === 'new') {
        setOverrides([...overrides, res.data]);
      } else {
        setOverrides(overrides.map((o) => (o.id === editingId ? res.data! : o)));
      }
      setEditingId(null);
    } else {
      setError(res.error || 'Unknown error occurred.');
    }
    
    setIsSaving(false);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <Typography variant="h2" className="text-obsidian tracking-tight">SEO Manager</Typography>
          <Typography variant="body" className="text-text-secondary mt-1">
            Manage metadata, OpenGraph, and structured data for specific routes.
          </Typography>
        </div>
        {!editingId && (
          <Button onClick={handleAddNew} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Override
          </Button>
        )}
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-600 px-4 py-3 rounded-md text-sm font-medium">
          {error}
        </div>
      )}

      {editingId ? (
        <Panel theme="light" className="bg-surface-card border border-surface-elevated animate-in fade-in slide-in-from-bottom-4 duration-300">
          <form onSubmit={handleSave} className="space-y-6">
            <div className="flex items-center justify-between border-b border-surface-elevated pb-4 mb-6">
              <Typography variant="h3">
                {editingId === 'new' ? 'New SEO Override' : 'Edit SEO Override'}
              </Typography>
              <div className="flex items-center gap-2">
                <Button type="button" variant="outline" onClick={() => setEditingId(null)} disabled={isSaving}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSaving} className="flex items-center gap-2">
                  {isSaving ? 'Saving...' : <><Check className="w-4 h-4" /> Save</>}
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column - Core SEO */}
              <div className="space-y-6">
                <Typography variant="h4" className="text-accent-gold border-b border-surface-elevated pb-2">Core Configuration</Typography>
                
                <div>
                  <label className="block text-sm font-semibold text-text-primary mb-1">Target Page Path *</label>
                  <Typography variant="body-sm" className="text-text-muted mb-2">e.g. "/", "/about", "/portfolio/apex-project"</Typography>
                  <input
                    type="text"
                    required
                    value={formData.page_path || ''}
                    onChange={e => setFormData({ ...formData, page_path: e.target.value })}
                    className="w-full px-3 py-2 bg-surface-panel border border-surface-elevated rounded-md text-sm text-obsidian focus:outline-none focus:border-accent-gold transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-text-primary mb-1">Title</label>
                  <input
                    type="text"
                    value={formData.title || ''}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 bg-surface-panel border border-surface-elevated rounded-md text-sm text-obsidian focus:outline-none focus:border-accent-gold transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-text-primary mb-1">Description</label>
                  <textarea
                    rows={3}
                    value={formData.description || ''}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 bg-surface-panel border border-surface-elevated rounded-md text-sm text-obsidian focus:outline-none focus:border-accent-gold transition-colors resize-none"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-text-primary mb-1">Keywords</label>
                  <input
                    type="text"
                    value={formData.keywords || ''}
                    onChange={e => setFormData({ ...formData, keywords: e.target.value })}
                    className="w-full px-3 py-2 bg-surface-panel border border-surface-elevated rounded-md text-sm text-obsidian focus:outline-none focus:border-accent-gold transition-colors"
                    placeholder="Comma separated"
                  />
                </div>

                <div className="flex items-center gap-6 pt-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.noindex || false}
                      onChange={e => setFormData({ ...formData, noindex: e.target.checked })}
                      className="rounded border-surface-elevated text-accent-gold focus:ring-accent-gold cursor-pointer"
                    />
                    <span className="text-sm font-medium text-text-primary">No Index</span>
                  </label>
                  
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.nofollow || false}
                      onChange={e => setFormData({ ...formData, nofollow: e.target.checked })}
                      className="rounded border-surface-elevated text-accent-gold focus:ring-accent-gold cursor-pointer"
                    />
                    <span className="text-sm font-medium text-text-primary">No Follow</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer ml-auto">
                    <input
                      type="checkbox"
                      checked={formData.is_active || false}
                      onChange={e => setFormData({ ...formData, is_active: e.target.checked })}
                      className="rounded border-surface-elevated text-accent-gold focus:ring-accent-gold cursor-pointer"
                    />
                    <span className="text-sm font-medium text-text-primary">Active</span>
                  </label>
                </div>
              </div>

              {/* Right Column - OpenGraph & Twitter */}
              <div className="space-y-6">
                <Typography variant="h4" className="text-accent-gold border-b border-surface-elevated pb-2">Social & OpenGraph</Typography>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-semibold text-text-primary mb-1">OG Title</label>
                    <input
                      type="text"
                      value={formData.og_title || ''}
                      onChange={e => setFormData({ ...formData, og_title: e.target.value })}
                      className="w-full px-3 py-2 bg-surface-panel border border-surface-elevated rounded-md text-sm text-obsidian focus:outline-none focus:border-accent-gold transition-colors"
                    />
                  </div>
                  
                  <div className="col-span-2">
                    <label className="block text-sm font-semibold text-text-primary mb-1">OG Description</label>
                    <textarea
                      rows={2}
                      value={formData.og_description || ''}
                      onChange={e => setFormData({ ...formData, og_description: e.target.value })}
                      className="w-full px-3 py-2 bg-surface-panel border border-surface-elevated rounded-md text-sm text-obsidian focus:outline-none focus:border-accent-gold transition-colors resize-none"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-semibold text-text-primary mb-1">OG Image URL</label>
                    <input
                      type="text"
                      value={formData.og_image || ''}
                      onChange={e => setFormData({ ...formData, og_image: e.target.value })}
                      className="w-full px-3 py-2 bg-surface-panel border border-surface-elevated rounded-md text-sm text-obsidian focus:outline-none focus:border-accent-gold transition-colors"
                    />
                  </div>

                  <div className="col-span-2 pt-4 border-t border-surface-elevated">
                    <label className="block text-sm font-semibold text-text-primary mb-1">Twitter Card Type</label>
                    <select
                      value={formData.twitter_card || ''}
                      onChange={e => setFormData({ ...formData, twitter_card: e.target.value })}
                      className="w-full px-3 py-2 bg-surface-panel border border-surface-elevated rounded-md text-sm text-obsidian focus:outline-none focus:border-accent-gold transition-colors"
                    >
                      <option value="">Default (summary_large_image)</option>
                      <option value="summary">Summary</option>
                      <option value="summary_large_image">Summary Large Image</option>
                      <option value="app">App</option>
                      <option value="player">Player</option>
                    </select>
                  </div>
                  
                  <div className="col-span-2">
                    <label className="block text-sm font-semibold text-text-primary mb-1">Canonical URL Override</label>
                    <input
                      type="text"
                      value={formData.canonical_url || ''}
                      onChange={e => setFormData({ ...formData, canonical_url: e.target.value })}
                      className="w-full px-3 py-2 bg-surface-panel border border-surface-elevated rounded-md text-sm text-obsidian focus:outline-none focus:border-accent-gold transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Full Width - Structured Data */}
              <div className="col-span-1 lg:col-span-2 space-y-6 pt-6 border-t border-surface-elevated">
                 <Typography variant="h4" className="text-accent-gold border-b border-surface-elevated pb-2">Structured Data (JSON-LD)</Typography>
                 <div>
                    <label className="block text-sm font-semibold text-text-primary mb-1">JSON Payload</label>
                    <textarea
                      rows={6}
                      value={typeof formData.structured_data_json === 'string' ? formData.structured_data_json : (formData.structured_data_json ? JSON.stringify(formData.structured_data_json, null, 2) : '')}
                      onChange={e => setFormData({ ...formData, structured_data_json: e.target.value })}
                      className="w-full px-3 py-2 bg-surface-panel border border-surface-elevated rounded-md text-sm text-obsidian font-mono focus:outline-none focus:border-accent-gold transition-colors resize-y"
                      placeholder={'{\n  "@context": "https://schema.org",\n  "@type": "Organization"\n}'}
                    />
                 </div>
              </div>
            </div>
          </form>
        </Panel>
      ) : (
        <div className="bg-surface-card rounded-lg border border-surface-elevated overflow-hidden">
          {overrides.length === 0 ? (
            <div className="p-12 text-center flex flex-col items-center">
              <Globe className="w-12 h-12 text-surface-elevated mb-4" />
              <Typography variant="h4" className="mb-2">No SEO Overrides</Typography>
              <Typography variant="body-sm" className="text-text-muted mb-6">Create your first SEO metadata override for a specific page route.</Typography>
              <Button onClick={handleAddNew} variant="outline">Create Override</Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-panel border-b border-surface-elevated">
                    <th className="py-3 px-4 text-xs font-semibold text-text-secondary uppercase tracking-wider">Path</th>
                    <th className="py-3 px-4 text-xs font-semibold text-text-secondary uppercase tracking-wider">Title</th>
                    <th className="py-3 px-4 text-xs font-semibold text-text-secondary uppercase tracking-wider">Status</th>
                    <th className="py-3 px-4 text-xs font-semibold text-text-secondary uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-elevated">
                  {overrides.map((override) => (
                    <tr key={override.id} className="hover:bg-surface-panel/50 transition-colors group">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <Globe className="w-4 h-4 text-text-muted" />
                          <span className="font-medium text-sm text-obsidian">{override.page_path}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-sm text-text-primary line-clamp-1">{override.title || <span className="text-text-muted italic">No title</span>}</span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2 items-center">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${override.is_active ? 'bg-green-100 text-green-800' : 'bg-surface-elevated text-text-muted'}`}>
                            {override.is_active ? 'Active' : 'Inactive'}
                          </span>
                          {(override.noindex || override.nofollow) && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                              Hidden
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => handleEdit(override)} className="p-1.5 text-text-muted hover:text-accent-gold transition-colors rounded-md hover:bg-surface-elevated">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDelete(override.id)} className="p-1.5 text-text-muted hover:text-red-500 transition-colors rounded-md hover:bg-red-50">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
