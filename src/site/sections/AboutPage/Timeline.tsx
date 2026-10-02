'use client';

import { useRef, useState } from 'react';
import Icon from '@site/components/Icon';
import type { Year } from '@site/content/about';
import s from './AboutPage.module.css';

export default function Timeline({ years }: { years: Year[] }) {
  const [cur, setCur] = useState(0);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const go = (i: number, focus = true) => {
    const n = Math.max(0, Math.min(years.length - 1, i));
    setCur(n);
    if (focus) refs.current[n]?.focus();
    else {
      // keep the chosen year in view on the ruler without moving the page
      const b = refs.current[n];
      const r = b?.parentElement;
      if (b && r && r.scrollWidth > r.clientWidth) r.scrollTo({ left: b.offsetLeft - r.clientWidth / 2, behavior: 'smooth' });
    }
  };
  // touch: swipe the milestones sideways to change the year
  const touch = useRef<{ x: number; y: number } | null>(null);
  const onTouchStart = (e: React.TouchEvent) => {
    const t0 = e.touches[0];
    touch.current = { x: t0.clientX, y: t0.clientY };
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    const a = touch.current;
    touch.current = null;
    if (!a) return;
    const t1 = e.changedTouches[0];
    const dx = t1.clientX - a.x;
    if (Math.abs(dx) > 44 && Math.abs(dx) > Math.abs(t1.clientY - a.y) * 1.4) go(cur + (dx < 0 ? 1 : -1), false);
  };
  const pct = years.length > 1 ? (cur / (years.length - 1)) * 100 : 0;
  return (
    <div className={s.tl}>
      <div className={s.ruler} role="tablist" aria-label="Years">
        <span className={s.track} aria-hidden>
          <span className={s.fill} style={{ width: `${pct}%` }} />
        </span>
        {years.map((y, i) => (
          <button
            key={y.year}
            ref={(el) => {
              refs.current[i] = el;
            }}
            type="button"
            role="tab"
            id={`tl-t-${y.year}`}
            aria-controls={`tl-p-${y.year}`}
            aria-selected={i === cur}
            tabIndex={i === cur ? 0 : -1}
            className={s.tick}
            data-past={i < cur || undefined}
            style={{ left: `${years.length > 1 ? (i / (years.length - 1)) * 100 : 0}%` }}
            onClick={() => setCur(i)}
            onKeyDown={(e) => {
              if (e.key === 'ArrowRight') go(i + 1);
              else if (e.key === 'ArrowLeft') go(i - 1);
              else if (e.key === 'Home') go(0);
              else if (e.key === 'End') go(years.length - 1);
              else return;
              e.preventDefault();
            }}
          >
            <i aria-hidden />
            <span>{y.year}</span>
          </button>
        ))}
      </div>

      <div className={s.tlBody}>
        <div className={s.tlSide}>
          <div className={s.tlYears} aria-hidden>
            {years.map((y, i) => (
              <span key={y.year} data-on={i === cur || undefined}>
                {y.year}
              </span>
            ))}
          </div>
          <div className={s.tlNav}>
            <button type="button" onClick={() => go(cur - 1, false)} disabled={cur === 0} aria-label="Previous year">
              <Icon name="back" size={16} />
            </button>
            <button type="button" onClick={() => go(cur + 1, false)} disabled={cur === years.length - 1} aria-label="Next year">
              <Icon name="back" size={16} style={{ transform: 'scaleX(-1)' }} />
            </button>
          </div>
        </div>
        <div className={s.tlPanes} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
          {years.map((y, i) => (
            <div
              key={y.year}
              role="tabpanel"
              id={`tl-p-${y.year}`}
              aria-labelledby={`tl-t-${y.year}`}
              className={s.tlPane}
              data-on={i === cur || undefined}
              inert={i !== cur}
            >
              {/* the panel is a div so the list inside keeps its list role */}
              <ol>
                {y.items.map((m) => (
                  <li key={m.title}>
                    <h3>{m.title}</h3>
                    <p>{m.body}</p>
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
