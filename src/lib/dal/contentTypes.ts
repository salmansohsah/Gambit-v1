import { createClient } from '@/lib/supabase/server';

export interface ContentType {
  id: string;
  type_id: string;
  name: string;
  description: string;
  schema_json: any;
  is_active: boolean;
}

export async function getContentTypes(): Promise<ContentType[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('content_type_registry')
      .select('*')
      .eq('is_active', true)
      .order('name');

    if (error) throw error;
    return data as ContentType[];
  } catch (error) {
    console.error('Failed to fetch content types:', error);
    return [];
  }
}
