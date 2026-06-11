'use server'

import { upsertSeoOverride, deleteSeoOverride, SeoOverride } from '@/lib/dal/seo'
import { revalidateTag } from 'next/cache'
import { logAuditEvent } from '@/lib/utils/auditLogger'

export async function saveSeoOverride(data: Partial<SeoOverride>) {
  try {
    const result = await upsertSeoOverride(data)
    revalidateTag('seo')
    
    logAuditEvent({
      entityType: 'seo_overrides',
      entityId: data.id || 'new',
      action: data.id ? 'update' : 'create',
      changes: data
    });

    return { success: true, data: result }
  } catch (error: any) {
    console.error('Failed to save SEO override:', error)
    return { success: false, error: error.message }
  }
}

export async function removeSeoOverride(id: string) {
  try {
    await deleteSeoOverride(id)
    revalidateTag('seo')
    
    logAuditEvent({
      entityType: 'seo_overrides',
      entityId: id,
      action: 'delete'
    });

    return { success: true }
  } catch (error: any) {
    console.error('Failed to delete SEO override:', error)
    return { success: false, error: error.message }
  }
}
