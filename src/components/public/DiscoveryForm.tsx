"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Typography } from '@/components/ui/Typography';
import { Panel } from '@/components/ui/Panel';
import { Button } from '@/components/ui/Button';
import { submitContactForm } from '@/app/actions/contact';

const discoveryFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  company: z.string().min(1, 'Company/Organization is required'),
  email: z.string().email('Valid email is required'),
  website: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  industry: z.string().optional(),
  goal: z.string().min(1, 'Primary goal is required'),
  challenge: z.string().min(1, 'Current challenge is required'),
  budget: z.string().optional(),
  timeline: z.string().min(1, 'Timeline is required'),
});

type DiscoveryFormData = z.infer<typeof discoveryFormSchema>;

export function DiscoveryForm() {
  const [formState, setFormState] = useState<'idle' | 'loading' | 'success'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DiscoveryFormData>({
    resolver: zodResolver(discoveryFormSchema),
  });

  const onSubmit = async (data: DiscoveryFormData) => {
    setFormState('loading');
    setErrorMessage('');

    // Convert to FormData to match existing submitContactForm signature,
    // or we can just update submitContactForm to take JSON.
    // The current signature of submitContactForm in `actions/contact.ts` takes FormData.
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value) formData.append(key, value);
    });

    const result = await submitContactForm(formData);

    if (result.success) {
      setFormState('success');
    } else {
      setErrorMessage(result.message || 'Failed to submit form.');
      setFormState('idle');
    }
  };

  const inputClassName = "w-full bg-surface-panel border border-surface-elevated rounded-lg px-4 py-3 text-sm text-obsidian placeholder:text-text-muted outline-none focus:border-accent-gold transition-colors";
  const errorClassName = "text-red-500 text-xs mt-1 block";

  if (formState === 'success') {
    return (
      <Panel theme="light" className="bg-surface-panel border-l-4 border-l-[#4ADE80] border-t-0 p-6 text-center shadow-none !rounded-lg w-full">
         <Typography variant="h4" className="!text-[#4ADE80] mb-2">Request Received</Typography>
         <Typography variant="body-sm">We will be in touch shortly to schedule your Discovery Call.</Typography>
      </Panel>
    );
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
      <div className="grid grid-cols-2 gap-6">
        <div className="col-span-2 sm:col-span-1">
          <label className="block text-xs font-semibold uppercase tracking-wide text-text-secondary mb-2">Name</label>
          <input {...register('name')} type="text" className={inputClassName} placeholder="Executive Name" />
          {errors.name && <span className={errorClassName}>{errors.name.message}</span>}
        </div>

        <div className="col-span-2 sm:col-span-1">
          <label className="block text-xs font-semibold uppercase tracking-wide text-text-secondary mb-2">Email</label>
          <input {...register('email')} type="email" className={inputClassName} placeholder="work@company.com" />
          {errors.email && <span className={errorClassName}>{errors.email.message}</span>}
        </div>

        <div className="col-span-2 sm:col-span-1">
          <label className="block text-xs font-semibold uppercase tracking-wide text-text-secondary mb-2">Company / Organization</label>
          <input {...register('company')} type="text" className={inputClassName} placeholder="Organization Name" />
          {errors.company && <span className={errorClassName}>{errors.company.message}</span>}
        </div>

        <div className="col-span-2 sm:col-span-1">
          <label className="block text-xs font-semibold uppercase tracking-wide text-text-secondary mb-2">Website (Optional)</label>
          <input {...register('website')} type="url" className={inputClassName} placeholder="https://" />
          {errors.website && <span className={errorClassName}>{errors.website.message}</span>}
        </div>

        <div className="col-span-2 sm:col-span-1">
          <label className="block text-xs font-semibold uppercase tracking-wide text-text-secondary mb-2">Industry</label>
          <input {...register('industry')} type="text" className={inputClassName} placeholder="e.g. Fintech, SaaS" />
          {errors.industry && <span className={errorClassName}>{errors.industry.message}</span>}
        </div>

        <div className="col-span-2 sm:col-span-1">
          <label className="block text-xs font-semibold uppercase tracking-wide text-text-secondary mb-2">Budget Range (Optional)</label>
          <select {...register('budget')} className={inputClassName}>
            <option value="">Select Range</option>
            <option value="10k-25k">$10k - $25k</option>
            <option value="25k-50k">$25k - $50k</option>
            <option value="50k+">$50k+</option>
          </select>
          {errors.budget && <span className={errorClassName}>{errors.budget.message}</span>}
        </div>

        <div className="col-span-2 sm:col-span-1">
          <label className="block text-xs font-semibold uppercase tracking-wide text-text-secondary mb-2">Timeline</label>
          <select {...register('timeline')} className={inputClassName}>
            <option value="">Select Timeline</option>
            <option value="immediate">Immediate (1-2 Weeks)</option>
            <option value="soon">Soon (1 Month)</option>
            <option value="future">Future Planning (3+ Months)</option>
          </select>
          {errors.timeline && <span className={errorClassName}>{errors.timeline.message}</span>}
        </div>

        <div className="col-span-2">
          <label className="block text-xs font-semibold uppercase tracking-wide text-text-secondary mb-2">Primary Goal</label>
          <input {...register('goal')} type="text" className={inputClassName} placeholder="What is the main objective?" />
          {errors.goal && <span className={errorClassName}>{errors.goal.message}</span>}
        </div>

        <div className="col-span-2">
          <label className="block text-xs font-semibold uppercase tracking-wide text-text-secondary mb-2">Current Challenge</label>
          <textarea {...register('challenge')} className={inputClassName} rows={4} placeholder="Describe the friction or obstacle holding you back." />
          {errors.challenge && <span className={errorClassName}>{errors.challenge.message}</span>}
        </div>
      </div>

      {errorMessage && (
        <Typography variant="body-sm" className="text-red-500 font-medium">
          {errorMessage}
        </Typography>
      )}

      <div className="pt-6">
        <Button variant="primary" type="submit" disabled={formState === 'loading'} className={formState === 'loading' ? 'opacity-70 cursor-wait w-full sm:w-auto' : 'w-full sm:w-auto'}>
          {formState === 'loading' ? 'Processing...' : 'Start The Conversation'}
        </Button>
      </div>
    </form>
  );
}
