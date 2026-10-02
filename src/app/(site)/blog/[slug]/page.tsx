import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { pageMeta, SITE_URL } from '@site/lib/seo';
import { POSTS, postBySlug } from '@site/content/blog';
import { Article } from '@site/sections/Blog/Blog';

// static export: one page per post, built once
export const dynamicParams = false;
export function generateStaticParams() {
  return POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = postBySlug(slug);
  if (!post) return {};
  const base = pageMeta({ title: `${post.title} | Ixian`, description: post.summary ?? post.subtitle, path: `/blog/${post.slug}`, og: `blog/${post.slug}` });
  return {
    ...base,
    // a republished post points search engines at the original
    alternates: { canonical: post.canonical ?? `${SITE_URL}/blog/${post.slug}` },
    openGraph: { ...base.openGraph, type: 'article', publishedTime: post.date, modifiedTime: post.updated ?? post.date, tags: post.tags },
  };
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = postBySlug(slug);
  if (!post) notFound();
  const ld = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.summary ?? post.subtitle,
    datePublished: post.date,
    dateModified: post.updated ?? post.date,
    author: { '@type': 'Organization', name: post.author },
    publisher: { '@type': 'Organization', name: 'Ixian', url: SITE_URL },
    mainEntityOfPage: `${SITE_URL}/blog/${post.slug}`,
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <Article post={post} />
    </>
  );
}
