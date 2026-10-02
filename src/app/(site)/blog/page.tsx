import { Metadata } from 'next';
import { pageMeta } from '@site/lib/seo';
import { BlogIndex } from '@site/sections/Blog/Blog';

export const metadata: Metadata = pageMeta({
  title: 'Blog | Ixian',
  description: 'Case studies, updates and notes from the people building Ixian.',
  og: 'blog',
  path: '/blog',
});

export default function BlogPage() {
  return <BlogIndex />;
}
