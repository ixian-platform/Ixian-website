'use client';

import Link from 'next/link';
import { postsByDate } from '@site/content/blog';
import { links } from '@site/content/links';
import { Card } from '@site/sections/Blog/Blog';
import SectionBoundary from '@site/components/SectionBoundary';
import Icon from '@site/components/Icon';
import s from './BlogTeaser.module.css';

export default function BlogTeaser() {
  const posts = postsByDate().slice(0, 3);
  return (
    <section id="blog" className={s.teaser} aria-labelledby="blog-title">
      <SectionBoundary />
      <div className={s.wrap}>
        <header className={s.head}>
          <h2 id="blog-title" className={s.title} data-reveal data-reveal-delay="0.24">
            From the blog.
          </h2>
          <Link href={links.blog} className={s.all} data-outline="">
            All posts
            <Icon name="arrow" size={15} data-dir="right" />
          </Link>
        </header>
        <div className={s.grid} data-reveal>
          {posts.map((p) => (
            <Card key={p.slug} post={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
