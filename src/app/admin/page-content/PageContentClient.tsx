"use client";

import React, { useState, useTransition } from 'react';
import { Typography } from '@/components/ui/Typography';
import { Panel } from '@/components/ui/Panel';
import { Button } from '@/components/ui/Button';
import { FileText, Save } from 'lucide-react';
import { updatePageContent } from '@/app/actions/system';
import { useRouter } from 'next/navigation';

export default function PageContentClient({ initialContent }: { initialContent: any[] }) {
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const [formData, setFormData] = useState<any>({});

  // Group by page
  const pages = Array.from(new Set(initialContent.map(i => i.page))).sort();

  const openEditor = (item: any) => {
    setSelectedItem(item);
    setFormData({
      value_text: item.value_text || '',
      value_json: item.value_json ? JSON.stringify(item.value_json, null, 2) : '',
    });
  };

  const handleSave = () => {
    if (!selectedItem) return;
    startTransition(async () => {
      let finalJson = null;
      if (selectedItem.page_content_schema?.type === 'json' && formData.value_json) {
        try {
          finalJson = JSON.parse(formData.value_json);
        } catch (e) {
          alert('Invalid JSON. Please fix errors before saving.');
          return;
        }
      }

      const dataToSave = {
        value_text: selectedItem.page_content_schema?.type === 'text' ? formData.value_text : null,
        value_json: selectedItem.page_content_schema?.type === 'json' ? finalJson : null,
      };

      const result = await updatePageContent(selectedItem.id, dataToSave);

      if (result?.success) {
        router.refresh();
      } else {
        alert(result?.error || 'An error occurred while saving.');
      }
    });
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 h-[calc(100vh-12rem)]">
      {/* Left Column: Grouped List */}
      <div className="w-full lg:w-1/3 flex flex-col gap-4">
        <div>
          <Typography variant="h3">Page Content</Typography>
          <Typography variant="body-sm" className="text-text-secondary mt-1">
            Manage global content snippets and text blocks.
          </Typography>
        </div>

        <div className="flex-1 overflow-y-auto space-y-6 pr-2 custom-scrollbar">
          {pages.map(page => (
            <div key={page} className="space-y-2">
              <Typography variant="label" className="uppercase tracking-wider text-xs text-text-muted px-2">
                {page}
              </Typography>
              {initialContent.filter(i => i.page === page).map(item => (
                <div 
                  key={item.id}
                  onClick={() => openEditor(item)}
                  className={`p-3 rounded-md border cursor-pointer transition-colors ${
                    selectedItem?.id === item.id 
                      ? 'bg-surface-elevated border-accent-blue' 
                      : 'bg-surface-panel border-surface-elevated hover:bg-surface-elevated/50'
                  }`}
                >
                  <Typography variant="body-sm" className="font-semibold">{item.page_content_schema?.key_name || 'Unknown Key'}</Typography>
                  <Typography variant="label" className="text-text-muted text-xs block line-clamp-1 mt-1">
                    {item.page_content_schema?.description || 'No description provided.'}
                  </Typography>
                </div>
              ))}
            </div>
          ))}
          {initialContent.length === 0 && (
            <div className="p-8 text-center text-text-muted border border-dashed border-surface-elevated rounded-md">
              No content definitions found.
            </div>
          )}
        </div>
      </div>

      {/* Right Column: Editor */}
      <div className="w-full lg:w-2/3 flex flex-col h-full">
        {selectedItem ? (
          <Panel theme="light" className="flex-1 flex flex-col bg-surface-panel border-surface-elevated overflow-hidden">
            <div className="px-6 py-4 border-b border-surface-elevated bg-surface-base flex items-center justify-between shrink-0">
              <div>
                <Typography variant="h4">{selectedItem.page_content_schema?.key_name}</Typography>
                <Typography variant="body-sm" className="text-text-muted mt-1">
                  {selectedItem.page_content_schema?.description}
                </Typography>
              </div>
              <Button onClick={handleSave} disabled={isPending} className="flex items-center gap-2">
                <Save className="w-4 h-4" /> Save
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
              {selectedItem.page_content_schema?.type === 'text' ? (
                <div>
                  <Typography variant="label" className="text-text-secondary uppercase tracking-widest text-xs mb-2 block">Content Text</Typography>
                  <textarea 
                    rows={12}
                    value={formData.value_text || ''}
                    onChange={e => setFormData({...formData, value_text: e.target.value})}
                    className="w-full bg-surface-base border border-surface-elevated rounded-md px-4 py-4 focus:border-accent-blue outline-none transition-colors"
                  />
                </div>
              ) : selectedItem.page_content_schema?.type === 'json' ? (
                <div>
                  <Typography variant="label" className="text-text-secondary uppercase tracking-widest text-xs mb-2 block">Content JSON</Typography>
                  <textarea 
                    rows={20}
                    value={formData.value_json || ''}
                    onChange={e => setFormData({...formData, value_json: e.target.value})}
                    className="w-full bg-surface-base border border-surface-elevated rounded-md px-4 py-4 font-mono text-sm focus:border-accent-blue outline-none transition-colors custom-scrollbar"
                  />
                  <Typography variant="body-sm" className="text-amber-500 mt-2">
                    Ensure the JSON is perfectly formatted. It must be valid.
                  </Typography>
                </div>
              ) : (
                <div className="text-text-muted">Unsupported content type: {selectedItem.page_content_schema?.type}</div>
              )}
            </div>
          </Panel>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center border border-dashed border-surface-elevated rounded-xl bg-surface-panel/30 text-center p-8">
            <div className="w-16 h-16 rounded-full bg-surface-elevated flex items-center justify-center mb-4">
              <FileText className="w-8 h-8 text-text-muted" />
            </div>
            <Typography variant="h3" className="mb-2">Select Content Key</Typography>
            <Typography variant="body" className="text-text-secondary max-w-sm">
              Choose a page content block from the list to modify its value across the site.
            </Typography>
          </div>
        )}
      </div>
    </div>
  );
}
