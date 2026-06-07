import { createClient } from '@/lib/supabase/server'
import { revalidateTag } from 'next/cache'

export type ActionState<T = any> = {
  success: boolean
  message: string
  data?: T
  error?: string
}

export type MutationOptions = {
  tags?: string[]
}

/**
 * Generic Create Action wrapper
 * Verifies auth, performs the insert, and revalidates Next.js cache tags.
 */
export async function createAction<T = any>(
  table: string,
  payload: any,
  options?: MutationOptions
): Promise<ActionState<T>> {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return { success: false, message: 'Unauthorized', error: 'Not authenticated' }
    }

    const { data, error } = await supabase
      .from(table)
      .insert(payload)
      .select()
      .single()

    if (error) throw error

    if (options?.tags) {
      for (const tag of options.tags) {
        // @ts-expect-error Next.js 16 types incorrectly require a second profile argument
        revalidateTag(tag)
      }
    }

    return { success: true, message: 'Record created successfully', data }
  } catch (error: any) {
    console.error(`Create Action Error [${table}]:`, error)
    return { success: false, message: 'Failed to create record', error: error.message }
  }
}

/**
 * Generic Update Action wrapper
 * Verifies auth, performs the update on the given ID, and revalidates Next.js cache tags.
 */
export async function updateAction<T = any>(
  table: string,
  id: string | number,
  payload: any,
  options?: MutationOptions
): Promise<ActionState<T>> {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return { success: false, message: 'Unauthorized', error: 'Not authenticated' }
    }

    const { data, error } = await supabase
      .from(table)
      .update(payload)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    if (options?.tags) {
      for (const tag of options.tags) {
        // @ts-expect-error Next.js 16 types incorrectly require a second profile argument
        revalidateTag(tag)
      }
    }

    return { success: true, message: 'Record updated successfully', data }
  } catch (error: any) {
    console.error(`Update Action Error [${table}]:`, error)
    return { success: false, message: 'Failed to update record', error: error.message }
  }
}

/**
 * Generic Delete Action wrapper
 * Verifies auth, performs the delete on the given ID, and revalidates Next.js cache tags.
 */
export async function deleteAction<T = any>(
  table: string,
  id: string | number,
  options?: MutationOptions
): Promise<ActionState<T>> {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return { success: false, message: 'Unauthorized', error: 'Not authenticated' }
    }

    const { error } = await supabase
      .from(table)
      .delete()
      .eq('id', id)

    if (error) throw error

    if (options?.tags) {
      for (const tag of options.tags) {
        // @ts-expect-error Next.js 16 types incorrectly require a second profile argument
        revalidateTag(tag)
      }
    }

    return { success: true, message: 'Record deleted successfully' }
  } catch (error: any) {
    console.error(`Delete Action Error [${table}]:`, error)
    return { success: false, message: 'Failed to delete record', error: error.message }
  }
}

/**
 * Soft Delete Action wrapper
 */
export async function softDeleteAction<T = any>(
  table: string,
  id: string | number,
  options?: MutationOptions
): Promise<ActionState<T>> {
  return updateAction<T>(table, id, { deleted_at: new Date().toISOString() }, options);
}

/**
 * Restore Action wrapper
 */
export async function restoreAction<T = any>(
  table: string,
  id: string | number,
  options?: MutationOptions
): Promise<ActionState<T>> {
  return updateAction<T>(table, id, { deleted_at: null }, options);
}
