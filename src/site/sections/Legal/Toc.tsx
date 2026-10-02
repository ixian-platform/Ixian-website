'use client';

import { useEffect, useState } from 'react';
import s from './Legal.module.css';

/** Table of contents with the section in view marked (scroll spy). */
export default function Toc({ items }: { items: { id: string; label: string; n: number }[] }) {
  const [cur, setCur] = useState(items[0]?.id);
  useEffect(() => {
    const els = items.map((i) => document.getElementById(i.id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        const vis = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (vis[0]) setCur(vis[0].target.id);
      },
      { rootMargin: '-15% 0px -70% 0px' }
    );
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, [items]);
  return (
    <nav aria-label="Contents" className={s.toc}>
      <p className={s.tocLabel}>Contents</p>
      <ol>
        {items.map((i) => (
          <li key={i.id}>
            <a href={`#${i.id}`} aria-current={cur === i.id ? 'location' : undefined}>
              <span>{i.n}</span>
              {i.label}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
