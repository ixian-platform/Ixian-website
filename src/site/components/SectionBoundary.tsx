'use client';

import { useEffect, useRef } from 'react';
import { ScrollTrigger, prefersReducedMotion } from '@site/lib/motion';
import s from './SectionBoundary.module.css';

/** Full-width hairline with crosshair marks at the content grid's edges; drawn in on
    enter, static with reduced motion or without JS. */
export default function SectionBoundary({ edge = 'top' }: { edge?: 'top' | 'bottom' } = {}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    el.dataset.armed = '';
    const t = ScrollTrigger.create({
      trigger: el,
      start: 'top 88%',
      once: true,
      onEnter: () => {
        el.dataset.in = '';
      },
    });
    return () => t.kill();
  }, []);
  return (
    <div ref={ref} className={s.boundary} data-edge={edge} aria-hidden>
      <span className={s.draw} />
      <span className={s.marks}>
        <i />
        <i />
      </span>
    </div>
  );
}
