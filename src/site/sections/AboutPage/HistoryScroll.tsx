'use client';

import { useEffect, useRef, useState } from 'react';
import SectionBoundary from '@site/components/SectionBoundary';
import { ScrollTrigger, prefersReducedMotion } from '@site/lib/motion';
import type { Year } from '@site/content/about';
import Timeline from './Timeline';
import HistoryField from './HistoryField';
import s from './HistoryScroll.module.css';
import t from './AboutPage.module.css';
import { TextLink } from '@site/components/page/kit';

/* Pinned sideways scroll on desktop (~45% of a screen per year). Phones, short windows
   and reduced motion get the Timeline instead, which is also what the server renders. */

type Copy = { title: string; lead: string; years: Year[]; source: string; next: { label: string; href: string } };

export default function HistoryScroll({ copy }: { copy: Copy }) {
  const foot = (
    <div className={t.tlFoot}>
      <span>{copy.source}</span>
      <TextLink {...copy.next} small />
    </div>
  );
  const [pin, setPin] = useState(false);
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLOListElement>(null);
  const fill = useRef<HTMLSpanElement>(null);
  const [cur, setCur] = useState(0);

  useEffect(() => {
    const ok = !prefersReducedMotion() && window.innerWidth >= 1024 && window.innerHeight >= 680;
    setPin(ok);
  }, []);

  useEffect(() => {
    if (!pin) return;
    const el = root.current;
    const tr = track.current;
    if (!el || !tr) return;
    const n = copy.years.length;
    const st = ScrollTrigger.create({
      trigger: el,
      start: 'top top',
      end: 'bottom bottom',
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        const max = tr.scrollWidth - tr.clientWidth;
        tr.style.transform = `translate3d(${-self.progress * max}px, 0, 0)`;
        if (fill.current) fill.current.style.transform = `scaleX(${self.progress})`;
        // a year lights up once its panel is mostly in view, not halfway there
        setCur(Math.min(n - 1, Math.floor(self.progress * (n - 1) + 0.25)));
      },
    });
    requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => st.kill();
  }, [pin, copy.years.length]);

  if (!pin) {
    return (
      <section id="history" className={s.plain} aria-labelledby="history-title">
        <HistoryField />
        <SectionBoundary />
        <div className={s.wrap}>
          <div className={s.intro}>
            <h2 id="history-title" className={s.title}>
              {copy.title}
            </h2>
            <p className={s.lead}>{copy.lead}</p>
          </div>
          <Timeline years={copy.years} />
          {foot}
        </div>
      </section>
    );
  }

  return (
    <section ref={root} id="history" className={s.pinned} style={{ height: `${100 + copy.years.length * 45}vh` }} aria-labelledby="history-title">
      <SectionBoundary />
      <div className={s.sticky}>
        <HistoryField />
        <div className={s.wrap}>
          <div className={s.intro}>
            <h2 id="history-title" className={s.title}>
              {copy.title}
            </h2>
            <p className={s.lead}>{copy.lead}</p>
          </div>
          <div className={s.ruler} aria-hidden>
            <span className={s.track}>
              <span ref={fill} className={s.fill} />
            </span>
            {copy.years.map((y, i) => (
              <span key={y.year} className={s.tick} data-on={i === cur || undefined} data-past={i < cur || undefined} style={{ left: `${(i / (copy.years.length - 1)) * 100}%` }}>
                <i />
                {y.year}
              </span>
            ))}
          </div>
        </div>
        <ol ref={track} className={s.panels}>
          {copy.years.map((y, i) => (
            <li key={y.year} className={s.panel} data-on={i === cur || undefined}>
              <p className={s.year}>{y.year}</p>
              <ol className={s.items}>
                {y.items.map((m) => (
                  <li key={m.title}>
                    <h3>{m.title}</h3>
                    <p>{m.body}</p>
                  </li>
                ))}
              </ol>
            </li>
          ))}
        </ol>
        <div className={s.wrap}>{foot}</div>
      </div>
    </section>
  );
}
