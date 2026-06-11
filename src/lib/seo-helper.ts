import { Metadata } from 'next'
import { getSeoOverride, SeoOverride } from '@/lib/dal/seo'

export async function mergeSeoMetadata(
  pagePath: string,
  defaultMetadata: Metadata
): Promise<Metadata> {
  const override = await getSeoOverride(pagePath)
  if (!override) return defaultMetadata

  // Start with default
  const merged: Metadata = { ...defaultMetadata }

  // Basic SEO
  if (override.title) {
    merged.title = override.title
  }
  if (override.description) {
    merged.description = override.description
  }
  if (override.keywords) {
    merged.keywords = override.keywords
  }

  // Advanced SEO (Robots)
  if (override.noindex || override.nofollow) {
    merged.robots = {
      index: !override.noindex,
      follow: !override.nofollow,
    }
  }

  // Canonical
  if (override.canonical_url) {
    merged.alternates = {
      ...merged.alternates,
      canonical: override.canonical_url,
    }
  }

  // Open Graph
  const hasOgFields = override.og_title || override.og_description || override.og_image;
  if (hasOgFields) {
    merged.openGraph = {
      ...merged.openGraph,
      ...(override.og_title && { title: override.og_title }),
      ...(override.og_description && { description: override.og_description }),
      ...(override.og_image && {
        images: [{ url: override.og_image }],
      }),
    }
  }

  // Twitter
  const hasTwitterFields = override.twitter_title || override.twitter_description || override.twitter_image || override.twitter_card;
  if (hasTwitterFields) {
    merged.twitter = {
      ...merged.twitter,
      ...(override.twitter_card && { card: override.twitter_card as any }),
      ...(override.twitter_title && { title: override.twitter_title }),
      ...(override.twitter_description && { description: override.twitter_description }),
      ...(override.twitter_image && { images: [override.twitter_image] }),
    }
  }

  return merged
}
