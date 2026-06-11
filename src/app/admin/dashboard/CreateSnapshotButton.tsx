"use client";

import React, { useTransition } from 'react';
import { Button } from '@/components/ui/Button';
import { Camera } from 'lucide-react';
import { createSnapshotAction } from '@/app/actions/system';
import { useRouter } from 'next/navigation';

export default function CreateSnapshotButton() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleSnapshot = () => {
    const label = prompt("Enter a label for this snapshot:", `Manual Snapshot - ${new Date().toLocaleString()}`);
    if (!label) return;

    startTransition(async () => {
      const result = await createSnapshotAction(label);
      if (result.success) {
        alert('Snapshot created successfully!');
        router.push('/admin/sync');
      } else {
        alert(result.error || 'Failed to create snapshot.');
      }
    });
  };

  return (
    <Button 
      variant="outline" 
      className="w-full flex items-center justify-center gap-2 h-12"
      onClick={handleSnapshot}
      disabled={isPending}
    >
      <Camera className="w-4 h-4" /> {isPending ? 'Saving...' : 'Snapshot'}
    </Button>
  );
}
