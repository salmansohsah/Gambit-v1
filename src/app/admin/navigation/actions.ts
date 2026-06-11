'use server'

import { upsertNavItem, deleteNavItem, NavigationItem } from '@/lib/dal/navigation'
import { revalidateTag } from 'next/cache'
import { logAuditEvent } from '@/lib/utils/auditLogger'

export async function saveNavigationItem(data: Partial<NavigationItem>) {
  try {
    await upsertNavItem(data)
    revalidateTag('navigation')
    
    logAuditEvent({
      entityType: 'navigation_items',
      entityId: data.id || 'new',
      action: data.id ? 'update' : 'create',
      changes: data
    });

    return { success: true }
  } catch (error: any) {
    console.error('Failed to save navigation item:', error)
    return { success: false, error: error.message }
  }
}

export async function removeNavigationItem(id: string) {
  try {
    await deleteNavItem(id)
    revalidateTag('navigation')
    
    logAuditEvent({
      entityType: 'navigation_items',
      entityId: id,
      action: 'delete'
    });

    return { success: true }
  } catch (error: any) {
    console.error('Failed to delete navigation item:', error)
    return { success: false, error: error.message }
  }
}
