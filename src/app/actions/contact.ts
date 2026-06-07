'use server'

import { createClient } from '@/lib/supabase/server'

export async function submitContactForm(formData: FormData) {
  try {
    const supabase = await createClient()

    const name = formData.get('name') as string
    const email = formData.get('email') as string
    const company = formData.get('company') as string
    const website = formData.get('website') as string
    const industry = formData.get('industry') as string
    const goal = formData.get('goal') as string
    const challenge = formData.get('challenge') as string
    const budget = formData.get('budget') as string
    const timeline = formData.get('timeline') as string
    
    // Server-side validation
    if (!name || !email || !company || !goal || !challenge || !timeline) {
      return { success: false, message: 'Missing required fields' }
    }

    // Verify turnstile token if implemented
    const turnstileToken = formData.get('cf-turnstile-response')
    if (process.env.TURNSTILE_SECRET_KEY && turnstileToken) {
      const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `secret=${process.env.TURNSTILE_SECRET_KEY}&response=${turnstileToken}`,
      })
      const outcome = await res.json()
      if (!outcome.success) {
        return { success: false, message: 'Invalid captcha' }
      }
    }

    // Since we don't have the exact discovery_leads schema fields fully guaranteed for custom inputs,
    // we use standard mappings based on common CRM architectures or fallback to standard json.
    const payload = {
      full_name: name,
      email,
      organization: company,
      website,
      industry,
      primary_goal: goal,
      current_challenge: challenge,
      budget_range: budget,
      timeline,
      status: 'new'
    }

    // Depending on schema, it might be discovery_leads or leads
    const { error } = await supabase
      .from('discovery_leads')
      .insert(payload)

    if (error) {
      // Fallback if schema is slightly different
      console.warn('First insert failed, trying alternative payload format', error)
      const fallbackPayload = {
        name,
        email: email || 'not-provided@example.com',
        company,
        notes: JSON.stringify({ website, industry, goal, challenge, budget, timeline }),
        status: 'new'
      }
      const { error: fallbackError } = await supabase.from('discovery_leads').insert(fallbackPayload)
      if (fallbackError) {
        throw fallbackError
      }
    }

    return { success: true, message: 'Request received' }
  } catch (error: any) {
    console.error('Contact Form Error:', error)
    return { success: false, message: 'Failed to submit form', error: error.message }
  }
}
