"use client";

import React, { useState, useTransition } from 'react';
import { Typography } from '@/components/ui/Typography';
import { Panel } from '@/components/ui/Panel';
import { Button } from '@/components/ui/Button';
import { Quote, Plus, GripVertical, Trash2, Edit2, Check, X } from 'lucide-react';
import { Testimonial } from '@/lib/dal/testimonials';
import { upsertTestimonialAction, deleteTestimonialAction } from './actions';

export default function TestimonialsClient({ initialTestimonials }: { initialTestimonials: Testimonial[] }) {
  const [testimonials, setTestimonials] = useState(initialTestimonials);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Testimonial>>({});
  const [isPending, startTransition] = useTransition();

  const handleAddNew = () => {
    const newId = 'new-' + Date.now();
    const newItem: Testimonial = {
      id: newId,
      quote: '',
      author_name: '',
      author_title: '',
      author_company: '',
      display_order: testimonials.length,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    setTestimonials([...testimonials, newItem]);
    setEditingId(newId);
    setFormData(newItem);
  };

  const handleEdit = (item: Testimonial) => {
    setEditingId(item.id);
    setFormData(item);
  };

  const handleCancel = (id: string) => {
    if (id.startsWith('new-')) {
      setTestimonials(testimonials.filter(t => t.id !== id));
    }
    setEditingId(null);
    setFormData({});
  };

  const handleSave = () => {
    if (!formData.quote || !formData.author_name) {
      alert('Quote and Author Name are required.');
      return;
    }

    startTransition(async () => {
      const payload = { ...formData };
      if (payload.id?.startsWith('new-')) {
        delete payload.id; // Let DB generate UUID
      }

      const result = await upsertTestimonialAction(payload);
      if (result.success && result.data) {
        setTestimonials(prev => {
          const exists = prev.find(t => t.id === formData.id);
          if (exists) {
            return prev.map(t => t.id === formData.id ? result.data as Testimonial : t);
          }
          return [...prev.filter(t => !t.id.startsWith('new-')), result.data as Testimonial];
        });
        setEditingId(null);
        setFormData({});
      } else {
        alert(result.error || 'Failed to save testimonial.');
      }
    });
  };

  const handleDelete = (id: string) => {
    if (id.startsWith('new-')) {
      handleCancel(id);
      return;
    }
    if (!confirm('Are you sure you want to delete this testimonial?')) return;

    startTransition(async () => {
      const result = await deleteTestimonialAction(id);
      if (result.success) {
        setTestimonials(testimonials.filter(t => t.id !== id));
      } else {
        alert(result.error || 'Failed to delete testimonial.');
      }
    });
  };

  const handleToggleActive = (item: Testimonial) => {
    startTransition(async () => {
      const result = await upsertTestimonialAction({ id: item.id, is_active: !item.is_active });
      if (result.success && result.data) {
        setTestimonials(testimonials.map(t => t.id === item.id ? result.data as Testimonial : t));
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <Typography variant="h2" className="mb-2">Testimonials</Typography>
          <Typography variant="body-sm" className="text-text-secondary">
            Manage client quotes and social proof.
          </Typography>
        </div>
        <Button onClick={handleAddNew} disabled={isPending || !!editingId}>
          <Plus className="w-4 h-4 mr-2" /> Add Testimonial
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {testimonials.map((item) => (
          <Panel key={item.id} theme="light" className="bg-surface-panel border-surface-elevated overflow-hidden">
            {editingId === item.id ? (
              <div className="p-6 space-y-4">
                <div>
                  <label className="text-xs font-semibold text-text-secondary uppercase tracking-widest mb-1 block">Quote *</label>
                  <textarea
                    rows={3}
                    value={formData.quote || ''}
                    onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
                    className="w-full bg-surface-base border border-surface-elevated rounded px-3 py-2 text-sm focus:border-accent-gold outline-none"
                    placeholder="The best agency we've worked with..."
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-text-secondary uppercase tracking-widest mb-1 block">Author Name *</label>
                    <input
                      type="text"
                      value={formData.author_name || ''}
                      onChange={(e) => setFormData({ ...formData, author_name: e.target.value })}
                      className="w-full bg-surface-base border border-surface-elevated rounded px-3 py-2 text-sm focus:border-accent-gold outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-text-secondary uppercase tracking-widest mb-1 block">Author Title</label>
                    <input
                      type="text"
                      value={formData.author_title || ''}
                      onChange={(e) => setFormData({ ...formData, author_title: e.target.value })}
                      className="w-full bg-surface-base border border-surface-elevated rounded px-3 py-2 text-sm focus:border-accent-gold outline-none"
                      placeholder="e.g. CEO"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-text-secondary uppercase tracking-widest mb-1 block">Company</label>
                    <input
                      type="text"
                      value={formData.author_company || ''}
                      onChange={(e) => setFormData({ ...formData, author_company: e.target.value })}
                      className="w-full bg-surface-base border border-surface-elevated rounded px-3 py-2 text-sm focus:border-accent-gold outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-text-secondary uppercase tracking-widest mb-1 block">Display Order</label>
                    <input
                      type="number"
                      value={formData.display_order || 0}
                      onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                      className="w-full bg-surface-base border border-surface-elevated rounded px-3 py-2 text-sm focus:border-accent-gold outline-none"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-4 border-t border-surface-elevated">
                  <Button variant="outline" size="sm" onClick={() => handleCancel(item.id)}>Cancel</Button>
                  <Button size="sm" onClick={handleSave} disabled={isPending}>Save</Button>
                </div>
              </div>
            ) : (
              <div className="flex items-start p-4 gap-4">
                <div className="mt-1 cursor-grab text-text-muted hover:text-text-primary">
                  <GripVertical className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-start gap-2 mb-2">
                    <Quote className="w-4 h-4 text-accent-gold shrink-0 mt-1" />
                    <Typography variant="body" className="font-medium">"{item.quote}"</Typography>
                  </div>
                  <Typography variant="body-sm" className="text-text-secondary">
                    <span className="font-semibold text-text-primary">{item.author_name}</span>
                    {item.author_title && <span>, {item.author_title}</span>}
                    {item.author_company && <span> at {item.author_company}</span>}
                  </Typography>
                </div>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleToggleActive(item)}
                    disabled={isPending}
                    className={item.is_active ? 'text-green-500 border-green-500/30' : 'text-text-muted'}
                  >
                    {item.is_active ? <Check className="w-4 h-4 mr-1"/> : <X className="w-4 h-4 mr-1"/>}
                    {item.is_active ? 'Active' : 'Inactive'}
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleEdit(item)} disabled={isPending || !!editingId}>
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" className="text-red-500 hover:bg-red-500/10 border-red-500/30" onClick={() => handleDelete(item.id)} disabled={isPending || !!editingId}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </Panel>
        ))}
        {testimonials.length === 0 && !editingId && (
          <div className="p-8 text-center border border-dashed border-surface-elevated rounded bg-surface-panel/30">
            <Typography variant="body" className="text-text-muted">No testimonials added yet.</Typography>
          </div>
        )}
      </div>
    </div>
  );
}
