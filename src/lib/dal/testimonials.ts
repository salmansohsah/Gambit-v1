import { createClient } from '@/lib/supabase/server';
import { unstable_cache } from 'next/cache';

export interface Testimonial {
  id: string;
  quote: string;
  author_name: string;
  author_title?: string;
  author_company?: string;
  company_logo_url?: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export async function getAdminTestimonials(): Promise<Testimonial[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as Testimonial[];
  } catch (error) {
    console.error('Failed to fetch testimonials:', error);
    return [];
  }
}

export const getActiveTestimonials = unstable_cache(
  async (): Promise<Testimonial[]> => {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true })
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Testimonial[];
    } catch (error) {
      console.error('Failed to fetch active testimonials:', error);
      return [];
    }
  },
  ['active_testimonials'],
  { revalidate: 3600, tags: ['testimonials'] }
);

export async function upsertTestimonial(testimonial: Partial<Testimonial>) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('testimonials')
    .upsert({ ...testimonial, updated_at: new Date().toISOString() })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteTestimonial(id: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from('testimonials')
    .delete()
    .eq('id', id);

  if (error) throw error;
  return true;
}
