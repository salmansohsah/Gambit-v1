"use client";

import React, { useState, useTransition } from 'react';
import { Typography } from '@/components/ui/Typography';
import { Panel } from '@/components/ui/Panel';
import { Button } from '@/components/ui/Button';
import { Plus, GripVertical, Trash2, CheckCircle2, AlertCircle, Save } from 'lucide-react';
import { createCapability, updateCapability, deleteCapability } from '@/app/actions/system';
import { useRouter } from 'next/navigation';

export default function CapabilitiesClient({ initialCapabilities }: { initialCapabilities: any[] }) {
  const [selectedCap, setSelectedCap] = useState<any | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const [formData, setFormData] = useState<any>({});

  const openEditor = (cap?: any) => {
    if (cap) {
      setSelectedCap(cap);
      setIsCreating(false);
      setFormData(cap);
    } else {
      setSelectedCap(null);
      setIsCreating(true);
      setFormData({
        label: '',
        slug: '',
        description: '',
        bullet_points: [''],
        display_order: initialCapabilities.length,
        is_active: true,
        is_standalone_page: false,
      });
    }
  };

  const handleSave = () => {
    startTransition(async () => {
      let result;
      const dataToSave = {
        ...formData,
        bullet_points: Array.isArray(formData.bullet_points) ? formData.bullet_points.filter(Boolean) : null
      };

      if (isCreating) {
        result = await createCapability(dataToSave);
      } else {
        result = await updateCapability(selectedCap.id, dataToSave);
      }

      if (result?.success) {
        setIsCreating(false);
        if (isCreating && 'data' in result) {
          setSelectedCap(result.data);
        }
        router.refresh();
      } else {
        alert(result?.error || 'An error occurred while saving.');
      }
    });
  };

  const handleDelete = () => {
    if (!selectedCap || !confirm('Are you sure you want to delete this capability?')) return;
    startTransition(async () => {
      const result = await deleteCapability(selectedCap.id);
      if (result?.success) {
        setSelectedCap(null);
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
        <div className="flex items-center justify-between mb-2">
          <div>
            <Typography variant="h3">Capabilities</Typography>
            <Typography variant="body-sm" className="text-text-secondary mt-1">
              Manage service taxonomy and ordering.
            </Typography>
          </div>
          <Button variant="outline" className="flex items-center gap-2" onClick={() => openEditor()}>
            <Plus className="w-4 h-4" /> New
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
          {initialCapabilities.map((cap) => (
            <div 
              key={cap.id}
              onClick={() => openEditor(cap)}
              className={`p-4 flex items-center justify-between rounded-md border cursor-pointer transition-colors ${
                selectedCap?.id === cap.id
                  ? 'bg-surface-elevated border-accent-blue' 
                  : 'bg-surface-panel border-surface-elevated hover:bg-surface-elevated/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <GripVertical className="w-4 h-4 text-text-muted cursor-move" />
                <div>
                  <Typography variant="body-sm" className="font-semibold">{cap.label}</Typography>
                  <Typography variant="label" className="text-text-muted text-xs block">/{cap.slug}</Typography>
                </div>
              </div>
              <div>
                {cap.is_active ? (
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-text-muted" />
                )}
              </div>
            </div>
          ))}
          {initialCapabilities.length === 0 && (
            <div className="p-8 text-center text-text-muted border border-dashed border-surface-elevated rounded-md">
              No capabilities found.
            </div>
          )}
        </div>
      </div>

      {/* Right Column: Editor */}
      <div className="w-full lg:w-2/3 flex flex-col h-full">
        {(selectedCap || isCreating) ? (
          <Panel theme="light" className="flex-1 flex flex-col bg-surface-panel border-surface-elevated overflow-hidden">
            <div className="px-6 py-4 border-b border-surface-elevated bg-surface-base flex items-center justify-between shrink-0">
              <Typography variant="h4">{isCreating ? 'Create Capability' : 'Edit Capability'}</Typography>
              <div className="flex items-center gap-3">
                {!isCreating && (
                  <Button variant="outline" className="text-red-500 border-red-500/20 hover:bg-red-500/10" onClick={handleDelete} disabled={isPending}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
                <Button onClick={handleSave} disabled={isPending} className="flex items-center gap-2">
                  <Save className="w-4 h-4" /> Save
                </Button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Typography variant="label" className="text-text-secondary uppercase tracking-widest text-xs mb-2 block">Label</Typography>
                  <input 
                    type="text" 
                    value={formData.label}
                    onChange={e => setFormData({...formData, label: e.target.value})}
                    className="w-full bg-surface-base border border-surface-elevated rounded-md px-4 py-3 focus:border-accent-blue outline-none transition-colors"
                  />
                </div>
                <div>
                  <Typography variant="label" className="text-text-secondary uppercase tracking-widest text-xs mb-2 block">Slug</Typography>
                  <input 
                    type="text" 
                    value={formData.slug}
                    onChange={e => setFormData({...formData, slug: e.target.value})}
                    className="w-full bg-surface-base border border-surface-elevated rounded-md px-4 py-3 font-mono text-sm focus:border-accent-blue outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <Typography variant="label" className="text-text-secondary uppercase tracking-widest text-xs mb-2 block">Description</Typography>
                <textarea 
                  rows={4}
                  value={formData.description || ''}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  className="w-full bg-surface-base border border-surface-elevated rounded-md px-4 py-3 focus:border-accent-blue outline-none transition-colors"
                />
              </div>

              <div>
                <Typography variant="label" className="text-text-secondary uppercase tracking-widest text-xs mb-2 block flex justify-between">
                  <span>Bullet Points</span>
                  <button onClick={() => {
                    const current = Array.isArray(formData.bullet_points) ? formData.bullet_points : [];
                    setFormData({...formData, bullet_points: [...current, '']});
                  }} className="text-accent-blue flex items-center gap-1 hover:underline">
                    <Plus className="w-3 h-3" /> Add Point
                  </button>
                </Typography>
                <div className="space-y-3">
                  {(Array.isArray(formData.bullet_points) ? formData.bullet_points : []).map((bp: string, idx: number) => (
                    <div key={idx} className="flex gap-2">
                      <input 
                        type="text" 
                        value={bp}
                        onChange={(e) => {
                          const newBps = [...formData.bullet_points];
                          newBps[idx] = e.target.value;
                          setFormData({...formData, bullet_points: newBps});
                        }}
                        className="flex-1 bg-surface-base border border-surface-elevated rounded-md px-4 py-2 text-sm focus:border-accent-blue outline-none transition-colors"
                      />
                      <button 
                        onClick={() => {
                          const newBps = [...formData.bullet_points];
                          newBps.splice(idx, 1);
                          setFormData({...formData, bullet_points: newBps});
                        }}
                        className="p-2 text-text-muted hover:text-red-500 bg-surface-elevated rounded-md transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  {(!Array.isArray(formData.bullet_points) || formData.bullet_points.length === 0) && (
                     <div className="text-sm text-text-muted">No bullet points added.</div>
                  )}
                </div>
              </div>

              <div className="border-t border-surface-elevated pt-6 space-y-4">
                <Typography variant="h4">Configuration</Typography>
                <div className="flex flex-col gap-3">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={formData.is_active}
                      onChange={e => setFormData({...formData, is_active: e.target.checked})}
                      className="w-4 h-4 rounded bg-surface-base border-surface-elevated text-accent-blue"
                    />
                    <span className="text-sm font-medium">Active (Visible on frontend)</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={formData.is_standalone_page}
                      onChange={e => setFormData({...formData, is_standalone_page: e.target.checked})}
                      className="w-4 h-4 rounded bg-surface-base border-surface-elevated text-accent-blue"
                    />
                    <span className="text-sm font-medium">Has Standalone Dedicated Page</span>
                  </label>
                </div>
              </div>
            </div>
          </Panel>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center border border-dashed border-surface-elevated rounded-xl bg-surface-panel/30 text-center p-8">
            <Typography variant="h3" className="mb-2">Select a Capability</Typography>
            <Typography variant="body" className="text-text-secondary max-w-sm">
              Choose a capability from the list to modify its details, or create a new one.
            </Typography>
          </div>
        )}
      </div>
    </div>
  );
}
