'use client';

import { useEffect, useRef, useState } from 'react';
import { ScrollTrigger } from '@site/lib/motion';
import s from './Chapters.module.css';

export type Chapter = { id: string; label: string };

/** Thin chapter line pinned to the bottom of the viewport (decorative; the nav is the real navigation). */
export default function Chapters({ chapters }: { chapters: Chapter[] }) {
  const bar = useRef<HTMLDivElement>(null);
  const [cur, setCur] = useState(0);
  useEffect(() => {
    const all = ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: (self) => {
        bar.current?.style.setProperty('--p', String(self.progress));
        // step aside over the hero too, where it would sit on the page's first buttons
        bar.current?.toggleAttribute('data-top', self.scroll() < window.innerHeight * 0.6);
      },
    });
    const each = chapters
      .filter((c) => document.getElementById(c.id))
      .map((c) =>
        ScrollTrigger.create({
          trigger: `#${c.id}`,
          start: 'top 60%',
          end: 'bottom 40%',
          onToggle: (self) => self.isActive && setCur(chapters.indexOf(c)),
        })
      );
    // step aside when the footer comes in (it would sit over the links)
    const foot = document.querySelector('footer')
      ? ScrollTrigger.create({
          trigger: 'footer',
          start: 'top bottom',
          onToggle: (self) => bar.current?.toggleAttribute('data-off', self.isActive),
        })
      : null;
    return () => {
      foot?.kill();
      all.kill();
      each.forEach((t) => t.kill());
    };
  }, [chapters]);
  return (
    <div ref={bar} className={s.bar} data-top aria-hidden>
      {chapters.map((c, i) => (
        <span key={c.id} className={i === cur ? s.on : undefined}>
          {c.label}
        </span>
      ))}
      <span className={s.track}>
        <span className={s.fill} />
      </span>
    </div>
  );
}
