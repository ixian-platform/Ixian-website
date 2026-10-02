import type { MetadataRoute } from 'next';
import { SITE_URL } from '@site/lib/seo';
import { POSTS } from '@site/content/blog';

// static export: generated once at build time
export const dynamic = 'force-static';

const ROUTES: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'] }[] = [
  { path: '/', priority: 1, changeFrequency: 'weekly' },
  { path: '/technology', priority: 0.9, changeFrequency: 'monthly' },
  { path: '/build', priority: 0.9, changeFrequency: 'monthly' },
  { path: '/quickstart', priority: 0.9, changeFrequency: 'monthly' },
  { path: '/get-involved', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/about-us', priority: 0.6, changeFrequency: 'yearly' },
  { path: '/blog', priority: 0.6, changeFrequency: 'weekly' },
  // republished posts carry a canonical to the original, so only posts first published here are listed
  ...POSTS.filter((p) => !p.canonical).map((p) => ({ path: `/blog/${p.slug}`, priority: 0.5, changeFrequency: 'yearly' as const })),
  { path: '/privacy-policy', priority: 0.2, changeFrequency: 'yearly' },
  { path: '/terms-of-use', priority: 0.2, changeFrequency: 'yearly' },
  { path: '/cookie-policy', priority: 0.2, changeFrequency: 'yearly' },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date('2026-09-24');
  return ROUTES.map((r) => ({ url: `${SITE_URL}${r.path === '/' ? '' : r.path}`, lastModified, changeFrequency: r.changeFrequency, priority: r.priority }));
}
