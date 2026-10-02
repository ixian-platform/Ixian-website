'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { start } from '@site/content/homeV3';
import { ScrollTrigger, prefersReducedMotion } from '@site/lib/motion';
import SectionBoundary from '@site/components/SectionBoundary';
import Icon from '@site/components/Icon';
import Link from 'next/link';
import Field from './Field';
import TryAddress from './TryAddress';
import s from './Start.module.css';

/* The step nearest the reading line is active. Reduced motion or no JS: every step equal, no fill. */

export default function Start() {
  const list = useRef<HTMLOListElement>(null);
  const fill = useRef<HTMLSpanElement>(null);
  const [active, setActive] = useState(-1); // -1 = still (no highlight)

  // which step is active: the list's progress past the reading line
  useEffect(() => {
    const el = list.current;
    if (!el || prefersReducedMotion()) return;
    const n = start.steps.length;
    const t = ScrollTrigger.create({
      trigger: el,
      start: 'top 78%',
      end: 'bottom 42%',
      onUpdate: (self) => setActive(Math.min(n - 1, Math.floor(self.progress * n))),
      onLeaveBack: () => setActive(0),
    });
    setActive(Math.min(n - 1, Math.max(0, Math.floor(t.progress * n))));
    return () => t.kill();
  }, []);

  // the fill runs from the first node to the active one (across or down)
  useLayoutEffect(() => {
    const el = list.current;
    const f = fill.current;
    if (!el || !f || active < 0) return;
    const place = () => {
      const node = el.querySelectorAll<HTMLElement>('[data-node]')[active];
      if (!node) return;
      const li = node.parentElement as HTMLElement; // positioned inside the <ol>
      const vertical = getComputedStyle(el).gridTemplateColumns.split(' ').length === 1;
      f.style.setProperty('--x', `${vertical ? 0 : li.offsetLeft + 4}px`);
      f.style.setProperty('--y', `${vertical ? li.offsetTop + node.offsetTop : 0}px`);
    };
    place();
    window.addEventListener('resize', place);
    return () => window.removeEventListener('resize', place);
  }, [active]);

  return (
    <section id="start" className={s.start} aria-labelledby="start-title">
      <Field />
      <SectionBoundary />
      <div className={s.wrap}>
        <header className={s.intro}>
          <h2 id="start-title" className={s.title} data-reveal data-reveal-delay="0.24">
            {start.title}
          </h2>
          <p className={s.lead} data-reveal>
            {start.lead}
          </p>
        </header>

        <ol ref={list} className={s.steps} data-live={active >= 0 || undefined} data-reveal data-reveal-delay="0.32">
          <span ref={fill} className={s.fill} aria-hidden />
          {start.steps.map((step, i) => (
            <li key={step.title} className={s.step} data-on={active < 0 || i === active || undefined} data-done={active >= 0 && i <= active ? '' : undefined}>
              <span className={s.node} data-node aria-hidden />
              <p className={s.time}>{step.time}</p>
              <h3 className={s.stepTitle}>{step.title}</h3>
              <p className={s.body}>{step.body}</p>
              {step.code === 'try' ? <TryAddress /> : <Command code={step.code} />}
              {/^https?:/.test(step.link.href) ? (
                <a className={s.link} href={step.link.href} target="_blank" rel="noreferrer">
                  {step.link.label}
                  <Icon name="external" size={14} />
                </a>
              ) : (
                <Link className={s.link} href={step.link.href}>
                  {step.link.label}
                  <Icon name="arrow" size={14} />
                </Link>
              )}
            </li>
          ))}
        </ol>

        <div className={s.cta} data-reveal>
          <Link className={s.ctaBtn} href={start.cta.href}>
            {start.cta.label}
            <Icon name="arrow" size={16} />
          </Link>
          <span>{start.cta.note}</span>
        </div>

        <p className={s.tools} data-reveal>
          {start.toolLinks.map((t, i) => (
            <span key={t.href}>
              {i > 0 && ' · '}
              <a href={t.href} target="_blank" rel="noreferrer" className={s.toolLink}>
                {t.label}
              </a>
              {t.note && ` (${t.note})`}
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}

function Command({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef(0);
  useEffect(() => () => window.clearTimeout(timer.current), []);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard unavailable: the text stays selectable */
    }
  };
  return (
    <button type="button" className={s.cmd} onClick={copy} aria-label={`Copy: ${code}`}>
      <code>{code}</code>
      <span className={s.copy} aria-live="polite">
        {copied ? 'Copied' : 'Copy'}
      </span>
    </button>
  );
}
