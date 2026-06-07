"use client";

import React, { useState, useTransition } from 'react';
import { Typography } from '@/components/ui/Typography';
import { Panel } from '@/components/ui/Panel';
import { Button } from '@/components/ui/Button';
import { Search, Plus, X, Upload, Check } from 'lucide-react';
import { createProject, updateProject, deleteProject } from '@/app/actions/portfolio';
import { useRouter } from 'next/navigation';

export default function PortfolioClient({ initialProjects }: { initialProjects: any[] }) {
  const [selectedProject, setSelectedProject] = useState<any | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [search, setSearch] = useState('');
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const [formData, setFormData] = useState<any>({});
  const [activeTab, setActiveTab] = useState('Core');

  const filteredProjects = initialProjects.filter(p => {
    const searchString = `${p.title} ${p.client_name}`.toLowerCase();
    if (search && !searchString.includes(search.toLowerCase())) return false;
    return true;
  });

  const openEditor = (project?: any) => {
    if (project) {
      setSelectedProject(project);
      setIsCreating(false);
      setFormData(project);
    } else {
      setSelectedProject(null);
      setIsCreating(true);
      setFormData({
        title: '',
        slug: '',
        client_name: '',
        summary: '',
        situation: '',
        objective: '',
        strategy: '',
        outcome_label: '',
        outcome_metric: '',
        status: 'Draft',
        cover_image_url: '',
        evidence_image_url: '',
        is_featured_home: false,
        is_featured_portfolio: false,
        has_full_case_study: false,
        display_order: 0,
        move_code: 0,
      });
    }
    setActiveTab('Core');
  };

  const closeEditor = () => {
    setSelectedProject(null);
    setIsCreating(false);
    setFormData({});
  };

  React.useEffect(() => {
    if (selectedProject && !isCreating) {
      const latestProject = initialProjects.find(p => p.id === selectedProject.id) || selectedProject;
      setFormData(latestProject);
    }
  }, [selectedProject, initialProjects, isCreating]);

  const handleSave = () => {
    startTransition(async () => {
      let result;
      if (isCreating) {
        result = await createProject(formData);
      } else {
        result = await updateProject(selectedProject.id, formData);
      }

      if (result?.success) {
        closeEditor();
        router.refresh();
      } else {
        alert(result?.error || 'An error occurred while saving.');
      }
    });
  };

  const handleDelete = () => {
    if (!selectedProject || !confirm('Are you sure you want to delete this project?')) return;
    startTransition(async () => {
      const result = await deleteProject(selectedProject.id);
      if (result?.success) {
        closeEditor();
        router.refresh();
      } else {
        alert(result?.error || 'An error occurred while deleting.');
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <Typography variant="h2" className="mb-2">Portfolio</Typography>
          <Typography variant="body-sm" className="text-text-secondary">
            Manage your strategic moves and case studies.
          </Typography>
        </div>
        <Button onClick={() => openEditor()} className="flex items-center gap-2">
          <Plus className="w-4 h-4" /> New Project
        </Button>
      </div>

      <Panel theme="light" className="bg-surface-panel border-surface-elevated">
        <div className="p-4 border-b border-surface-elevated flex items-center bg-surface-elevated/20">
          <div className="relative w-full max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input 
              type="text" 
              placeholder="Search by title or client..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-surface-card border border-surface-elevated rounded-md pl-9 pr-4 py-2 text-sm focus:border-accent-blue outline-none transition-colors"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-surface-elevated bg-surface-elevated/50">
                <th className="px-6 py-4 text-xs font-semibold text-text-secondary uppercase tracking-widest">Project</th>
                <th className="px-6 py-4 text-xs font-semibold text-text-secondary uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-text-secondary uppercase tracking-widest">Featured</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-elevated">
              {filteredProjects.map((project) => (
                <tr 
                  key={project.id} 
                  onClick={() => openEditor(project)}
                  className="hover:bg-surface-elevated/30 transition-colors cursor-pointer group"
                >
                  <td className="px-6 py-4">
                    <div className="font-semibold text-text-primary mb-1">{project.title}</div>
                    <div className="text-sm text-text-muted">{project.client_name || 'No Client'}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      project.status === 'Published' ? 'bg-green-500/10 text-green-500 border border-green-500/20' :
                      project.status === 'Review' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' :
                      'bg-surface-elevated text-text-secondary border border-surface-elevated'
                    }`}>
                      {project.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-text-muted">
                    <div className="flex gap-2">
                      {project.is_featured_home && <span className="px-2 py-1 bg-accent-blue/10 text-accent-blue rounded text-xs">Home</span>}
                      {project.is_featured_portfolio && <span className="px-2 py-1 bg-accent-blue/10 text-accent-blue rounded text-xs">Portfolio</span>}
                    </div>
                  </td>
                </tr>
              ))}
              {filteredProjects.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-6 py-8 text-center text-text-muted">No projects found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Panel>

      {/* Editor Modal / Slide-over */}
      {(selectedProject || isCreating) && (
        <>
          <div className="fixed inset-0 bg-obsidian/80 backdrop-blur-sm z-40 transition-opacity" onClick={closeEditor} />
          <div className="fixed inset-y-0 right-0 w-full max-w-4xl bg-surface-base border-l border-surface-elevated shadow-2xl z-50 overflow-y-auto transform transition-transform duration-300">
            <div className="sticky top-0 bg-surface-base/90 backdrop-blur-md border-b border-surface-elevated px-6 py-4 flex items-center justify-between z-10">
              <Typography variant="h3">{isCreating ? 'New Project' : 'Edit Project'}</Typography>
              <div className="flex items-center gap-3">
                <Button variant="outline" onClick={closeEditor} disabled={isPending}>Cancel</Button>
                <Button onClick={handleSave} disabled={isPending} className="flex items-center gap-2">
                  <Check className="w-4 h-4" /> Save
                </Button>
              </div>
            </div>

            <div className="px-6 py-4 border-b border-surface-elevated bg-surface-panel/30 flex gap-4 overflow-x-auto">
              {['Core', 'Narrative', 'Outcomes', 'Media'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === tab 
                      ? 'border-accent-blue text-accent-blue' 
                      : 'border-transparent text-text-secondary hover:text-text-primary'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
            
            <div className="p-6">
              {activeTab === 'Core' && (
                <div className="space-y-6">
                  <div>
                    <Typography variant="label" className="text-text-secondary uppercase tracking-widest text-xs mb-2 block">Title</Typography>
                    <input 
                      type="text" 
                      value={formData.title}
                      onChange={e => setFormData({...formData, title: e.target.value})}
                      className="w-full bg-surface-card border border-surface-elevated rounded-md px-4 py-3 focus:border-accent-blue outline-none transition-colors" 
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <Typography variant="label" className="text-text-secondary uppercase tracking-widest text-xs mb-2 block">Slug</Typography>
                      <input 
                        type="text" 
                        value={formData.slug}
                        onChange={e => setFormData({...formData, slug: e.target.value})}
                        className="w-full bg-surface-card border border-surface-elevated rounded-md px-4 py-3 focus:border-accent-blue outline-none transition-colors font-mono text-sm" 
                      />
                    </div>
                    <div>
                      <Typography variant="label" className="text-text-secondary uppercase tracking-widest text-xs mb-2 block">Client Name</Typography>
                      <input 
                        type="text" 
                        value={formData.client_name || ''}
                        onChange={e => setFormData({...formData, client_name: e.target.value})}
                        className="w-full bg-surface-card border border-surface-elevated rounded-md px-4 py-3 focus:border-accent-blue outline-none transition-colors" 
                      />
                    </div>
                  </div>
                  <div>
                    <Typography variant="label" className="text-text-secondary uppercase tracking-widest text-xs mb-2 block">Status</Typography>
                    <select 
                      value={formData.status}
                      onChange={e => setFormData({...formData, status: e.target.value})}
                      className="w-full sm:w-64 bg-surface-card border border-surface-elevated rounded-md px-4 py-3 focus:border-accent-blue outline-none transition-colors"
                    >
                      <option value="Draft">Draft</option>
                      <option value="Review">Review</option>
                      <option value="Published">Published</option>
                    </select>
                  </div>
                  <div className="flex gap-6 pt-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={formData.is_featured_home}
                        onChange={e => setFormData({...formData, is_featured_home: e.target.checked})}
                        className="w-4 h-4 rounded bg-surface-card border-surface-elevated text-accent-blue"
                      />
                      <span className="text-sm font-medium">Featured on Home</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={formData.is_featured_portfolio}
                        onChange={e => setFormData({...formData, is_featured_portfolio: e.target.checked})}
                        className="w-4 h-4 rounded bg-surface-card border-surface-elevated text-accent-blue"
                      />
                      <span className="text-sm font-medium">Featured on Portfolio</span>
                    </label>
                  </div>
                </div>
              )}

              {activeTab === 'Narrative' && (
                <div className="space-y-6">
                  <div>
                    <Typography variant="label" className="text-text-secondary uppercase tracking-widest text-xs mb-2 block">Summary</Typography>
                    <textarea 
                      rows={3}
                      value={formData.summary || ''}
                      onChange={e => setFormData({...formData, summary: e.target.value})}
                      className="w-full bg-surface-card border border-surface-elevated rounded-md px-4 py-3 focus:border-accent-blue outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <Typography variant="label" className="text-text-secondary uppercase tracking-widest text-xs mb-2 block">Situation</Typography>
                    <textarea 
                      rows={4}
                      value={formData.situation || ''}
                      onChange={e => setFormData({...formData, situation: e.target.value})}
                      className="w-full bg-surface-card border border-surface-elevated rounded-md px-4 py-3 focus:border-accent-blue outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <Typography variant="label" className="text-text-secondary uppercase tracking-widest text-xs mb-2 block">Objective</Typography>
                    <textarea 
                      rows={4}
                      value={formData.objective || ''}
                      onChange={e => setFormData({...formData, objective: e.target.value})}
                      className="w-full bg-surface-card border border-surface-elevated rounded-md px-4 py-3 focus:border-accent-blue outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <Typography variant="label" className="text-text-secondary uppercase tracking-widest text-xs mb-2 block">Strategy</Typography>
                    <textarea 
                      rows={4}
                      value={formData.strategy || ''}
                      onChange={e => setFormData({...formData, strategy: e.target.value})}
                      className="w-full bg-surface-card border border-surface-elevated rounded-md px-4 py-3 focus:border-accent-blue outline-none transition-colors"
                    />
                  </div>
                </div>
              )}

              {activeTab === 'Outcomes' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <Typography variant="label" className="text-text-secondary uppercase tracking-widest text-xs mb-2 block">Outcome Metric</Typography>
                      <input 
                        type="text" 
                        placeholder="e.g. 240%"
                        value={formData.outcome_metric || ''}
                        onChange={e => setFormData({...formData, outcome_metric: e.target.value})}
                        className="w-full bg-surface-card border border-surface-elevated rounded-md px-4 py-3 text-2xl font-bold focus:border-accent-blue outline-none transition-colors" 
                      />
                    </div>
                    <div>
                      <Typography variant="label" className="text-text-secondary uppercase tracking-widest text-xs mb-2 block">Outcome Label</Typography>
                      <input 
                        type="text" 
                        placeholder="e.g. increase in conversion"
                        value={formData.outcome_label || ''}
                        onChange={e => setFormData({...formData, outcome_label: e.target.value})}
                        className="w-full bg-surface-card border border-surface-elevated rounded-md px-4 py-3 focus:border-accent-blue outline-none transition-colors" 
                      />
                    </div>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer pt-4">
                    <input 
                      type="checkbox" 
                      checked={formData.has_full_case_study}
                      onChange={e => setFormData({...formData, has_full_case_study: e.target.checked})}
                      className="w-4 h-4 rounded bg-surface-card border-surface-elevated text-accent-blue"
                    />
                    <span className="text-sm font-medium">Has Full Case Study Available</span>
                  </label>
                </div>
              )}

              {activeTab === 'Media' && (
                <div className="space-y-8">
                  <div>
                    <Typography variant="label" className="text-text-secondary uppercase tracking-widest text-xs mb-2 block">Cover Image URL</Typography>
                    <div className="flex gap-4">
                      <input 
                        type="text" 
                        value={formData.cover_image_url || ''}
                        onChange={e => setFormData({...formData, cover_image_url: e.target.value})}
                        className="flex-1 bg-surface-card border border-surface-elevated rounded-md px-4 py-3 focus:border-accent-blue outline-none transition-colors font-mono text-sm" 
                      />
                    </div>
                    {formData.cover_image_url && (
                      <div className="mt-4 aspect-video bg-surface-elevated rounded-md border border-surface-elevated overflow-hidden max-w-sm">
                        <img src={formData.cover_image_url} alt="Cover Preview" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <Typography variant="label" className="text-text-secondary uppercase tracking-widest text-xs mb-2 block">Evidence Image URL</Typography>
                    <div className="flex gap-4">
                      <input 
                        type="text" 
                        value={formData.evidence_image_url || ''}
                        onChange={e => setFormData({...formData, evidence_image_url: e.target.value})}
                        className="flex-1 bg-surface-card border border-surface-elevated rounded-md px-4 py-3 focus:border-accent-blue outline-none transition-colors font-mono text-sm" 
                      />
                    </div>
                    {formData.evidence_image_url && (
                      <div className="mt-4 aspect-video bg-surface-elevated rounded-md border border-surface-elevated overflow-hidden max-w-sm">
                        <img src={formData.evidence_image_url} alt="Evidence Preview" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {!isCreating && (
                <div className="mt-12 pt-6 border-t border-surface-elevated flex justify-end">
                  <Button variant="outline" className="text-red-500 border-red-500/20 hover:bg-red-500/10" onClick={handleDelete} disabled={isPending}>
                    Delete Project
                  </Button>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
