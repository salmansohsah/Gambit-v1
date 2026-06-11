"use server";

import { upsertTestimonial, deleteTestimonial, Testimonial } from '@/lib/dal/testimonials';
import { logAuditEvent } from '@/lib/utils/auditLogger';
import { revalidateTag } from 'next/cache';

export async function upsertTestimonialAction(testimonial: Partial<Testimonial>) {
  try {
    const isNew = !testimonial.id;
    const data = await upsertTestimonial(testimonial);

    await logAuditEvent({
      entity_type: 'testimonials',
      entity_id: data.id,
      action: isNew ? 'CREATE' : 'UPDATE',
      new_data: data,
    });

    revalidateTag('testimonials');
    return { success: true, data };
  } catch (error: any) {
    console.error('Testimonial upsert error:', error);
    return { success: false, error: error.message };
  }
}

export async function deleteTestimonialAction(id: string) {
  try {
    await deleteTestimonial(id);

    await logAuditEvent({
      entity_type: 'testimonials',
      entity_id: id,
      action: 'DELETE',
    });

    revalidateTag('testimonials');
    return { success: true };
  } catch (error: any) {
    console.error('Testimonial delete error:', error);
    return { success: false, error: error.message };
  }
}
