import React from 'react';
import TestimonialsClient from './TestimonialsClient';
import { getAdminTestimonials } from '@/lib/dal/testimonials';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Testimonials | Admin',
};

export default async function TestimonialsPage() {
  const testimonials = await getAdminTestimonials();

  return <TestimonialsClient initialTestimonials={testimonials} />;
}
