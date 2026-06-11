"use client";

import React, { useState, useTransition, useRef } from 'react';
import { Typography } from '@/components/ui/Typography';
import { Button } from '@/components/ui/Button';
import { Upload, Trash2, Link as LinkIcon, Image as ImageIcon, Copy, CheckCircle2 } from 'lucide-react';
import { uploadMedia, deleteMedia } from '@/app/actions/media';
import { useRouter } from 'next/navigation';

export default function MediaLibraryClient({ initialFiles }: { initialFiles: any[] }) {
  const [isPending, startTransition] = useTransition();
  const [uploading, setUploading] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    const result = await uploadMedia(formData);
    setUploading(false);
    
    if (fileInputRef.current) fileInputRef.current.value = '';

    if (result.success) {
      router.refresh();
    } else {
      alert(result.error || 'Failed to upload file.');
    }
  };

  const handleDelete = (path: string) => {
    if (!confirm('Are you sure you want to delete this file? This might break images currently in use.')) return;
    startTransition(async () => {
      const result = await deleteMedia(path);
      if (result.success) {
        router.refresh();
      } else {
        alert(result.error || 'Failed to delete file.');
      }
    });
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  // Sort by created_at desc
  const sortedFiles = [...initialFiles].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto w-full pb-12">
      <div className="flex items-center justify-between">
        <div>
          <Typography variant="h2">Media Library</Typography>
          <Typography variant="body-sm" className="text-text-secondary mt-1">
            Manage global image assets. Copy the public URL to use in content.
          </Typography>
        </div>
        <div>
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="image/*"
            onChange={handleUpload}
          />
          <Button 
            onClick={() => fileInputRef.current?.click()} 
            disabled={uploading || isPending} 
            className="flex items-center gap-2"
          >
            <Upload className="w-4 h-4" /> 
            {uploading ? 'Uploading...' : 'Upload Media'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {sortedFiles.map((file) => {
          const isImage = file.metadata?.mimetype?.startsWith('image/');
          return (
            <div key={file.id} className="bg-surface-panel border border-surface-elevated rounded-lg overflow-hidden group flex flex-col">
              <div className="aspect-video bg-surface-base border-b border-surface-elevated flex items-center justify-center relative overflow-hidden p-2">
                {isImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img 
                    src={file.publicUrl} 
                    alt={file.name} 
                    className="object-contain w-full h-full rounded-sm"
                    loading="lazy"
                  />
                ) : (
                  <ImageIcon className="w-12 h-12 text-text-muted" />
                )}
                
                <div className="absolute inset-0 bg-obsidian/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                  <button 
                    onClick={() => copyToClipboard(file.publicUrl)}
                    className="p-2 bg-surface-base rounded-md text-text-primary hover:text-accent-gold transition-colors"
                    title="Copy Public URL"
                  >
                    {copiedUrl === file.publicUrl ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                  </button>
                  <a 
                    href={file.publicUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-surface-base rounded-md text-text-primary hover:text-accent-gold transition-colors"
                    title="Open in new tab"
                  >
                    <LinkIcon className="w-4 h-4" />
                  </a>
                  <button 
                    onClick={() => handleDelete(file.name)}
                    disabled={isPending}
                    className="p-2 bg-surface-base rounded-md text-text-primary hover:text-red-500 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="p-3">
                <Typography variant="label" className="text-xs truncate block font-medium" title={file.name}>
                  {file.name}
                </Typography>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-[10px] text-text-muted">
                    {(file.metadata?.size / 1024).toFixed(1)} KB
                  </span>
                  <span className="text-[10px] text-text-muted">
                    {new Date(file.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
        {sortedFiles.length === 0 && !uploading && (
          <div className="col-span-full p-12 text-center text-text-muted border border-dashed border-surface-elevated rounded-xl bg-surface-panel/30">
            <ImageIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <Typography variant="h4" className="mb-2">No Media Uploaded</Typography>
            <Typography variant="body-sm" className="max-w-md mx-auto">
              Upload images here to use them in insights, portfolio projects, and page content.
            </Typography>
          </div>
        )}
      </div>
    </div>
  );
}
