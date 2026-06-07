import { revalidateTag } from 'next/cache'
import { NextResponse } from 'next/server'

/**
 * Handles Supabase Database Webhooks to trigger Next.js Incremental Static Regeneration (ISR).
 * Expected Payload from Supabase: { type: 'INSERT'|'UPDATE'|'DELETE', table: 'table_name', record: {...}, old_record: {...} }
 */
export async function POST(request: Request) {
  try {
    // 1. Verify the webhook secret to prevent unauthorized cache purging
    const authHeader = request.headers.get('Authorization')
    const secret = process.env.REVALIDATION_SECRET

    if (!secret || authHeader !== `Bearer ${secret}`) {
      return NextResponse.json({ error: 'Unauthorized: Invalid or missing token' }, { status: 401 })
    }

    // 2. Parse the Supabase JSON payload
    const payload = await request.json()
    const table = payload.table

    if (!table) {
      return NextResponse.json({ error: 'Bad Request: Missing table name in payload' }, { status: 400 })
    }

    // 3. Revalidate the specific Next.js Cache tag mapping to this table
    // @ts-expect-error Next.js 16 types incorrectly require a second profile argument
    revalidateTag(table)

    console.log(`[Webhook ISR] Successfully purged cache tag: [${table}]`)

    return NextResponse.json({ 
      success: true, 
      revalidated: true, 
      tag: table, 
      timestamp: new Date().toISOString() 
    })

  } catch (error: any) {
    console.error('[Webhook ISR] Failed to process revalidation:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
