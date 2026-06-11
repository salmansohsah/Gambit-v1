"use client";

import React, { useState, useTransition } from 'react';
import { Typography } from '@/components/ui/Typography';
import { Panel } from '@/components/ui/Panel';
import { Button } from '@/components/ui/Button';
import { Search, Plus, Save, Trash2, Globe, FileText, CheckCircle2, History } from 'lucide-react';
import { createInsight, updateInsight, deleteInsight } from '@/app/actions/insights';
import { useRouter } from 'next/navigation';

export default function InsightsClient({ initialInsights, teamMembers, categories }: { initialInsights: any[], teamMembers: any[], categories: any[] }) {
  const [selectedInsight, setSelectedInsight] = useState<any | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [search, setSearch] = useState('');
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const [formData, setFormData] = useState<any>({});

  const filteredInsights = initialInsights.filter(i => {
    const searchString = `${i.title} ${i.author?.full_name || ''}`.toLowerCase();
    if (search && !searchString.includes(search.toLowerCase())) return false;
    return true;
  });

  const openEditor = (insight?: any) => {
    if (insight) {
      setSelectedInsight(insight);
      setIsCreating(false);
      setFormData({
        title: insight.title,
        slug: insight.slug,
        summary: insight.summary,
        body_content: insight.body_content,
        cover_image_url: insight.cover_image_url,
        author_id: insight.author_id,
        category_id: insight.category_id,
        status: insight.status,
        is_featured: insight.is_featured,
        read_time_minutes: insight.read_time_minutes,
        seo_title: insight.seo_title,
        seo_description: insight.seo_description,
        locale: insight.locale || 'en',
      });
    } else {
      setSelectedInsight(null);
      setIsCreating(true);
      setFormData({
        title: '',
        slug: '',
        summary: '',
        body_content: '',
        cover_image_url: '',
        author_id: null,
        category_id: null,
        status: 'draft',
        is_featured: false,
        read_time_minutes: 5,
        seo_title: '',
        seo_description: '',
        locale: 'en',
      });
    }
  };

  const handleSave = () => {
    startTransition(async () => {
      let result;
      if (isCreating) {
        result = await createInsight(formData);
      } else {
        result = await updateInsight(selectedInsight.id, formData);
      }

      if (result?.success) {
        setIsCreating(false);
        if (isCreating && 'data' in result) {
          setSelectedInsight(result.data); // Switch to editing the newly created one
        }
        router.refresh();
      } else {
        alert(result?.error || 'An error occurred while saving.');
      }
    });
  };

  const handleDelete = () => {
    if (!selectedInsight || !confirm('Are you sure you want to delete this insight?')) return;
    startTransition(async () => {
      const result = await deleteInsight(selectedInsight.id);
      if (result?.success) {
        setSelectedInsight(null);
        router.refresh();
      } else {
        alert(result?.error || 'An error occurred while deleting.');
      }
    });
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 h-[calc(100vh-12rem)]">
      {/* Left Column: List view */}
      <div className="w-full lg:w-1/3 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <Typography variant="h3">Insights</Typography>
          <Button onClick={() => openEditor()} variant="outline" className="flex items-center gap-2 px-3 py-1.5 h-auto text-sm">
            <Plus className="w-4 h-4" /> New
          </Button>
        </div>

        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input 
            type="text" 
            placeholder="Search insights..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-surface-card border border-surface-elevated rounded-md pl-9 pr-4 py-2 text-sm focus:border-accent-gold outline-none transition-colors"
          />
        </div>

        <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
          {filteredInsights.map((insight) => (
            <div 
              key={insight.id}
              onClick={() => openEditor(insight)}
              className={`p-4 rounded-md border cursor-pointer transition-colors ${
                selectedInsight?.id === insight.id 
                  ? 'bg-surface-elevated border-accent-gold' 
                  : 'bg-surface-panel border-surface-elevated hover:bg-surface-elevated/50'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <Typography variant="body-sm" className="font-semibold line-clamp-2 pr-4">{insight.title}</Typography>
                {insight.status === 'published' ? (
                  <Globe className="w-4 h-4 text-green-500 shrink-0" />
                ) : insight.status === 'review' ? (
                  <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0" />
                ) : (
                  <FileText className="w-4 h-4 text-text-muted shrink-0" />
                )}
              </div>
              <Typography variant="label" className="text-text-muted block text-xs">
                {insight.category?.label || 'Uncategorized'} • {insight.author?.full_name || 'System'}
              </Typography>
            </div>
          ))}
          {filteredInsights.length === 0 && (
            <div className="p-8 text-center text-text-muted border border-dashed border-surface-elevated rounded-md">
              No insights found.
            </div>
          )}
        </div>
      </div>

      {/* Right Column: Editor */}
      <div className="w-full lg:w-2/3 flex flex-col h-full">
        {(selectedInsight || isCreating) ? (
          <Panel theme="light" className="flex-1 flex flex-col bg-surface-panel border-surface-elevated overflow-hidden">
            {/* Editor Toolbar */}
            <div className="px-6 py-4 border-b border-surface-elevated bg-surface-base flex items-center justify-between shrink-0">
              <Typography variant="h4">{isCreating ? 'Create New Insight' : 'Edit Insight'}</Typography>
              <div className="flex items-center gap-3">
                {!isCreating && (
                  <>
                    <Button variant="outline" className="text-text-secondary border-surface-elevated hover:bg-surface-elevated" onClick={() => router.push(`/admin/insights/${selectedInsight.id}/history`)}>
                      <History className="w-4 h-4 mr-2" /> History
                    </Button>
                    <Button variant="outline" className="text-red-500 border-red-500/20 hover:bg-red-500/10" onClick={handleDelete} disabled={isPending}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </>
                )}
                
                {isCreating ? (
                  <Button onClick={handleSave} disabled={isPending} className="flex items-center gap-2">
                    <Save className="w-4 h-4" /> {isPending ? 'Saving...' : 'Create Draft'}
                  </Button>
                ) : (
                  <div className="flex items-center gap-2 bg-surface-elevated/30 p-1 rounded-md">
                    <Button 
                      size="sm"
                      variant={formData.status === 'draft' ? 'default' : 'ghost'} 
                      onClick={() => { setFormData({...formData, status: 'draft'}); setTimeout(handleSave, 0); }}
                      disabled={isPending}
                    >Draft</Button>
                    <Button 
                      size="sm"
                      variant={formData.status === 'review' ? 'default' : 'ghost'} 
                      onClick={() => { setFormData({...formData, status: 'review'}); setTimeout(handleSave, 0); }}
                      disabled={isPending}
                    >Review</Button>
                    <Button 
                      size="sm"
                      variant={formData.status === 'published' ? 'default' : 'ghost'} 
                      className={formData.status === 'published' ? 'bg-green-600 hover:bg-green-700 text-white' : ''}
                      onClick={() => { setFormData({...formData, status: 'published'}); setTimeout(handleSave, 0); }}
                      disabled={isPending}
                    >Publish</Button>
                    <Button 
                      size="sm"
                      variant={formData.status === 'archived' ? 'default' : 'ghost'} 
                      className={formData.status === 'archived' ? 'bg-amber-600 hover:bg-amber-700 text-white' : ''}
                      onClick={() => { setFormData({...formData, status: 'archived'}); setTimeout(handleSave, 0); }}
                      disabled={isPending}
                    >Archive</Button>
                    <div className="w-px h-6 bg-surface-elevated mx-1" />
                    <Button size="sm" onClick={handleSave} disabled={isPending} className="flex items-center gap-2">
                      <Save className="w-4 h-4" /> Save
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Editor Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
              <div className="space-y-6">
                <div>
                  <Typography variant="label" className="text-text-secondary uppercase tracking-widest text-xs mb-2 block">Title</Typography>
                  <input 
                    type="text" 
                    value={formData.title}
                    onChange={e => setFormData({...formData, title: e.target.value})}
                    placeholder="E.g. The Future of Serverless Architectures"
                    className="w-full bg-surface-base border border-surface-elevated rounded-md px-4 py-3 text-lg font-bold focus:border-accent-gold outline-none transition-colors"
                  />
                </div>
                
                <div>
                  <Typography variant="label" className="text-text-secondary uppercase tracking-widest text-xs mb-2 block">Slug</Typography>
                  <input 
                    type="text" 
                    value={formData.slug}
                    onChange={e => setFormData({...formData, slug: e.target.value})}
                    className="w-full bg-surface-base border border-surface-elevated rounded-md px-4 py-3 font-mono text-sm focus:border-accent-gold outline-none transition-colors"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Typography variant="label" className="text-text-secondary uppercase tracking-widest text-xs mb-2 block">Author</Typography>
                    <select 
                      value={formData.author_id || ''}
                      onChange={e => setFormData({...formData, author_id: e.target.value})}
                      className="w-full bg-surface-base border border-surface-elevated rounded-md px-4 py-3 focus:border-accent-gold outline-none transition-colors"
                    >
                      <option value="">Select Author...</option>
                      {teamMembers.map(member => (
                        <option key={member.id} value={member.id}>{member.full_name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Typography variant="label" className="text-text-secondary uppercase tracking-widest text-xs mb-2 block">Category</Typography>
                    <select 
                      value={formData.category_id || ''}
                      onChange={e => setFormData({...formData, category_id: e.target.value})}
                      className="w-full bg-surface-base border border-surface-elevated rounded-md px-4 py-3 focus:border-accent-gold outline-none transition-colors"
                    >
                      <option value="">Select Category...</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Typography variant="label" className="text-text-secondary uppercase tracking-widest text-xs mb-2 block">Status</Typography>
                    <select 
                      value={formData.status}
                      onChange={e => setFormData({...formData, status: e.target.value})}
                      className="w-full bg-surface-base border border-surface-elevated rounded-md px-4 py-3 font-semibold focus:border-accent-gold outline-none transition-colors"
                    >
                      <option value="draft">Draft</option>
                      <option value="review">Review</option>
                      <option value="published">Published</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>
                  <div>
                    <Typography variant="label" className="text-text-secondary uppercase tracking-widest text-xs mb-2 block">Read Time (Min)</Typography>
                    <input 
                      type="number" 
                      value={formData.read_time_minutes || ''}
                      onChange={e => setFormData({...formData, read_time_minutes: parseInt(e.target.value) || 0})}
                      className="w-full bg-surface-base border border-surface-elevated rounded-md px-4 py-3 focus:border-accent-gold outline-none transition-colors"
                    />
                  </div>
                </div>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={formData.is_featured}
                    onChange={e => setFormData({...formData, is_featured: e.target.checked})}
                    className="w-4 h-4 rounded bg-surface-base border-surface-elevated text-accent-gold"
                  />
                  <span className="text-sm font-medium text-text-primary">Feature this insight prominently</span>
                </label>
              </div>

              <div className="border-t border-surface-elevated pt-8 space-y-6">
                <div>
                  <Typography variant="label" className="text-text-secondary uppercase tracking-widest text-xs mb-2 block">Summary</Typography>
                  <textarea 
                    rows={3}
                    value={formData.summary || ''}
                    onChange={e => setFormData({...formData, summary: e.target.value})}
                    className="w-full bg-surface-base border border-surface-elevated rounded-md px-4 py-3 focus:border-accent-gold outline-none transition-colors"
                  />
                </div>
                <div>
                  <Typography variant="label" className="text-text-secondary uppercase tracking-widest text-xs mb-2 block flex justify-between">
                    <span>Body Content (Markdown)</span>
                  </Typography>
                  <textarea 
                    rows={16}
                    value={formData.body_content || ''}
                    onChange={e => setFormData({...formData, body_content: e.target.value})}
                    className="w-full bg-surface-base border border-surface-elevated rounded-md px-4 py-4 font-mono text-sm leading-relaxed focus:border-accent-gold outline-none transition-colors custom-scrollbar"
                    placeholder="## Introduction..."
                  />
                </div>
              </div>

              <div className="border-t border-surface-elevated pt-8 space-y-6">
                <Typography variant="h4">Metadata & SEO</Typography>
                
                <div>
                  <Typography variant="label" className="text-text-secondary uppercase tracking-widest text-xs mb-2 block">Cover Image URL</Typography>
                  <input 
                    type="text" 
                    value={formData.cover_image_url || ''}
                    onChange={e => setFormData({...formData, cover_image_url: e.target.value})}
                    className="w-full bg-surface-base border border-surface-elevated rounded-md px-4 py-3 font-mono text-sm focus:border-accent-gold outline-none transition-colors"
                  />
                </div>

                <div>
                  <Typography variant="label" className="text-text-secondary uppercase tracking-widest text-xs mb-2 block">SEO Title</Typography>
                  <input 
                    type="text" 
                    value={formData.seo_title || ''}
                    onChange={e => setFormData({...formData, seo_title: e.target.value})}
                    className="w-full bg-surface-base border border-surface-elevated rounded-md px-4 py-3 focus:border-accent-gold outline-none transition-colors"
                  />
                </div>

                <div>
                  <Typography variant="label" className="text-text-secondary uppercase tracking-widest text-xs mb-2 block">SEO Description</Typography>
                  <textarea 
                    rows={3}
                    value={formData.seo_description || ''}
                    onChange={e => setFormData({...formData, seo_description: e.target.value})}
                    className="w-full bg-surface-base border border-surface-elevated rounded-md px-4 py-3 focus:border-accent-gold outline-none transition-colors"
                  />
                </div>
              </div>

            </div>
          </Panel>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center border border-dashed border-surface-elevated rounded-xl bg-surface-panel/30 text-center p-8">
            <div className="w-16 h-16 rounded-full bg-surface-elevated flex items-center justify-center mb-4">
              <FileText className="w-8 h-8 text-text-muted" />
            </div>
            <Typography variant="h3" className="mb-2">No Insight Selected</Typography>
            <Typography variant="body" className="text-text-secondary max-w-sm">
              Select an insight from the list to edit its contents, or create a new one to share your expertise.
            </Typography>
            <Button onClick={() => openEditor()} className="mt-6 flex items-center gap-2">
              <Plus className="w-4 h-4" /> Create Insight
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
