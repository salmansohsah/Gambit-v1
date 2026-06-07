"use client";

import React, { useState, useTransition } from 'react';
import { Typography } from '@/components/ui/Typography';
import { Panel } from '@/components/ui/Panel';
import { Button } from '@/components/ui/Button';
import { Save, Globe, Share2, Mail, Layout } from 'lucide-react';
import { updateSiteSettings } from '@/app/actions/system';
import { useRouter } from 'next/navigation';

export default function SettingsClient({ initialSettings }: { initialSettings: any }) {
  const [formData, setFormData] = useState<any>(initialSettings || {
    site_name: '',
    tagline: '',
    contact_email: '',
    scheduling_url: '',
    nav_cta_label: '',
    nav_cta_url: '',
    seo_default_title: '',
    seo_default_description: '',
    facebook_url: '',
    twitter_url: '',
    linkedin_url: '',
    instagram_url: '',
  });

  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleSave = () => {
    startTransition(async () => {
      // Assuming ID is 1 or whatever the singleton ID is. If not found, default to 1.
      const id = initialSettings?.id || 1; 
      const result = await updateSiteSettings(id, formData);

      if (result?.success) {
        router.refresh();
        alert('Settings saved successfully.');
      } else {
        alert(result?.error || 'An error occurred while saving settings.');
      }
    });
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto w-full pb-12">
      <div className="flex items-center justify-between">
        <div>
          <Typography variant="h2">Site Settings</Typography>
          <Typography variant="body-sm" className="text-text-secondary mt-1">
            Manage global website configuration, SEO, and integrations.
          </Typography>
        </div>
        <Button onClick={handleSave} disabled={isPending} className="flex items-center gap-2">
          <Save className="w-4 h-4" /> Save Settings
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        
        {/* General Info */}
        <Panel theme="light" className="p-6 bg-surface-panel border-surface-elevated space-y-6">
          <div className="flex items-center gap-2 border-b border-surface-elevated pb-4 mb-2">
            <Layout className="w-5 h-5 text-accent-blue" />
            <Typography variant="h4">General Information</Typography>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Typography variant="label" className="text-text-secondary uppercase tracking-widest text-xs mb-2 block">Site Name</Typography>
              <input 
                type="text" 
                value={formData.site_name || ''}
                onChange={e => setFormData({...formData, site_name: e.target.value})}
                className="w-full bg-surface-base border border-surface-elevated rounded-md px-4 py-3 focus:border-accent-blue outline-none transition-colors"
              />
            </div>
            <div>
              <Typography variant="label" className="text-text-secondary uppercase tracking-widest text-xs mb-2 block">Tagline</Typography>
              <input 
                type="text" 
                value={formData.tagline || ''}
                onChange={e => setFormData({...formData, tagline: e.target.value})}
                className="w-full bg-surface-base border border-surface-elevated rounded-md px-4 py-3 focus:border-accent-blue outline-none transition-colors"
              />
            </div>
            <div>
              <Typography variant="label" className="text-text-secondary uppercase tracking-widest text-xs mb-2 block">Navigation CTA Label</Typography>
              <input 
                type="text" 
                value={formData.nav_cta_label || ''}
                onChange={e => setFormData({...formData, nav_cta_label: e.target.value})}
                placeholder="E.g. Let's Talk"
                className="w-full bg-surface-base border border-surface-elevated rounded-md px-4 py-3 focus:border-accent-blue outline-none transition-colors"
              />
            </div>
            <div>
              <Typography variant="label" className="text-text-secondary uppercase tracking-widest text-xs mb-2 block">Navigation CTA URL</Typography>
              <input 
                type="text" 
                value={formData.nav_cta_url || ''}
                onChange={e => setFormData({...formData, nav_cta_url: e.target.value})}
                placeholder="E.g. /contact"
                className="w-full bg-surface-base border border-surface-elevated rounded-md px-4 py-3 focus:border-accent-blue outline-none transition-colors"
              />
            </div>
          </div>
        </Panel>

        {/* Contact & Integrations */}
        <Panel theme="light" className="p-6 bg-surface-panel border-surface-elevated space-y-6">
          <div className="flex items-center gap-2 border-b border-surface-elevated pb-4 mb-2">
            <Mail className="w-5 h-5 text-accent-blue" />
            <Typography variant="h4">Contact & Scheduling</Typography>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Typography variant="label" className="text-text-secondary uppercase tracking-widest text-xs mb-2 block">Contact Email</Typography>
              <input 
                type="email" 
                value={formData.contact_email || ''}
                onChange={e => setFormData({...formData, contact_email: e.target.value})}
                className="w-full bg-surface-base border border-surface-elevated rounded-md px-4 py-3 focus:border-accent-blue outline-none transition-colors"
              />
            </div>
            <div>
              <Typography variant="label" className="text-text-secondary uppercase tracking-widest text-xs mb-2 block">Scheduling URL (Calendly)</Typography>
              <input 
                type="url" 
                value={formData.scheduling_url || ''}
                onChange={e => setFormData({...formData, scheduling_url: e.target.value})}
                className="w-full bg-surface-base border border-surface-elevated rounded-md px-4 py-3 focus:border-accent-blue outline-none transition-colors"
              />
            </div>
          </div>
        </Panel>

        {/* Global SEO */}
        <Panel theme="light" className="p-6 bg-surface-panel border-surface-elevated space-y-6">
          <div className="flex items-center gap-2 border-b border-surface-elevated pb-4 mb-2">
            <Globe className="w-5 h-5 text-accent-blue" />
            <Typography variant="h4">Global SEO Defaults</Typography>
          </div>
          <div className="space-y-6">
            <div>
              <Typography variant="label" className="text-text-secondary uppercase tracking-widest text-xs mb-2 block">Default Meta Title</Typography>
              <input 
                type="text" 
                value={formData.seo_default_title || ''}
                onChange={e => setFormData({...formData, seo_default_title: e.target.value})}
                className="w-full bg-surface-base border border-surface-elevated rounded-md px-4 py-3 focus:border-accent-blue outline-none transition-colors"
              />
            </div>
            <div>
              <Typography variant="label" className="text-text-secondary uppercase tracking-widest text-xs mb-2 block">Default Meta Description</Typography>
              <textarea 
                rows={3}
                value={formData.seo_default_description || ''}
                onChange={e => setFormData({...formData, seo_default_description: e.target.value})}
                className="w-full bg-surface-base border border-surface-elevated rounded-md px-4 py-3 focus:border-accent-blue outline-none transition-colors"
              />
            </div>
          </div>
        </Panel>

        {/* Social Links */}
        <Panel theme="light" className="p-6 bg-surface-panel border-surface-elevated space-y-6">
          <div className="flex items-center gap-2 border-b border-surface-elevated pb-4 mb-2">
            <Share2 className="w-5 h-5 text-accent-blue" />
            <Typography variant="h4">Social Media Links</Typography>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Typography variant="label" className="text-text-secondary uppercase tracking-widest text-xs mb-2 block">LinkedIn URL</Typography>
              <input 
                type="url" 
                value={formData.linkedin_url || ''}
                onChange={e => setFormData({...formData, linkedin_url: e.target.value})}
                className="w-full bg-surface-base border border-surface-elevated rounded-md px-4 py-3 focus:border-accent-blue outline-none transition-colors"
              />
            </div>
            <div>
              <Typography variant="label" className="text-text-secondary uppercase tracking-widest text-xs mb-2 block">Twitter/X URL</Typography>
              <input 
                type="url" 
                value={formData.twitter_url || ''}
                onChange={e => setFormData({...formData, twitter_url: e.target.value})}
                className="w-full bg-surface-base border border-surface-elevated rounded-md px-4 py-3 focus:border-accent-blue outline-none transition-colors"
              />
            </div>
            <div>
              <Typography variant="label" className="text-text-secondary uppercase tracking-widest text-xs mb-2 block">Facebook URL</Typography>
              <input 
                type="url" 
                value={formData.facebook_url || ''}
                onChange={e => setFormData({...formData, facebook_url: e.target.value})}
                className="w-full bg-surface-base border border-surface-elevated rounded-md px-4 py-3 focus:border-accent-blue outline-none transition-colors"
              />
            </div>
            <div>
              <Typography variant="label" className="text-text-secondary uppercase tracking-widest text-xs mb-2 block">Instagram URL</Typography>
              <input 
                type="url" 
                value={formData.instagram_url || ''}
                onChange={e => setFormData({...formData, instagram_url: e.target.value})}
                className="w-full bg-surface-base border border-surface-elevated rounded-md px-4 py-3 focus:border-accent-blue outline-none transition-colors"
              />
            </div>
          </div>
        </Panel>

      </div>
    </div>
  );
}
