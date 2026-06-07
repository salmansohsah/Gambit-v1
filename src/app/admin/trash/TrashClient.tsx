"use client";

import React, { useTransition } from 'react';
import { Typography } from '@/components/ui/Typography';
import { Panel } from '@/components/ui/Panel';
import { Button } from '@/components/ui/Button';
import { Trash2, RotateCcw, AlertTriangle } from 'lucide-react';
import { restoreEntity } from '@/app/actions/trash';
import { useRouter } from 'next/navigation';

export default function TrashClient({ initialItems }: { initialItems: any[] }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleRestore = (table: string, id: string) => {
    startTransition(async () => {
      const result = await restoreEntity(table, id);
      if (result.success) {
        router.refresh();
      } else {
        alert(result.error || 'Failed to restore item.');
      }
    });
  };

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto w-full pb-12">
      <div>
        <Typography variant="h2">Trash / Restore</Typography>
        <Typography variant="body-sm" className="text-text-secondary mt-1">
          Recover soft-deleted items across the system. Items are kept indefinitely unless hard deleted directly in the database.
        </Typography>
      </div>

      <Panel theme="light" className="bg-surface-panel border-surface-elevated overflow-hidden">
        {initialItems.length > 0 ? (
          <div className="divide-y divide-surface-elevated">
            {initialItems.map((item) => (
              <div key={`${item.table}-${item.id}`} className="p-4 flex items-center justify-between hover:bg-surface-elevated/30 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-red-500/10 text-red-500 rounded-md shrink-0">
                    <Trash2 className="w-5 h-5" />
                  </div>
                  <div>
                    <Typography variant="body-sm" className="font-semibold">{item.title || 'Untitled'}</Typography>
                    <Typography variant="label" className="text-text-muted text-xs block uppercase tracking-wider mt-1">
                      {item.table} • Deleted on {new Date(item.deleted_at).toLocaleDateString()}
                    </Typography>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  onClick={() => handleRestore(item.table, item.id)}
                  disabled={isPending}
                  className="flex items-center gap-2 px-3 py-1.5 h-auto text-sm"
                >
                  <RotateCcw className="w-4 h-4" /> Restore
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center flex flex-col items-center text-text-muted">
            <AlertTriangle className="w-12 h-12 mb-4 opacity-50" />
            <Typography variant="h4" className="mb-2">Trash is Empty</Typography>
            <Typography variant="body-sm" className="max-w-md mx-auto">
              There are no soft-deleted items to recover at this time.
            </Typography>
          </div>
        )}
      </Panel>
    </div>
  );
}
