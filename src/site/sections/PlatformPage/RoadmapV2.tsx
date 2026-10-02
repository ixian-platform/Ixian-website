'use client';

import { useState } from 'react';
import { roadmap, roadmapV2 as c, type RoadmapItem } from '@site/content/platform';
import s from './Round4.module.css';

/* Every item and its readout line is in the markup, so it works without JavaScript. */

const TONE: Record<string, string> = { DLT: 'dlt', S2: 's2', Clients: 'plain', QuIXI: 'build' };

export default function RoadmapV2() {
  const [done, research, backlog] = roadmap.columns;
  const [layer, setLayer] = useState<string | null>(null);
  const [focus, setFocus] = useState<RoadmapItem | null>(null);
  const match = (it: RoadmapItem) => !layer || it.parts.includes(layer);
  const quarters = Array.from(new Set(done.items.map((i) => i.when!)));
  const count = (items: RoadmapItem[]) => items.filter(match).length;

  // a plain function, not a component: a component defined here would remount on every
  // state change, and the focused chip would lose focus (a keyboard trap)
  const chip = (it: RoadmapItem, size: 'lg' | 'sm') => (
    <li key={it.title}>
      <button
        type="button"
        className={s.rmChip}
        data-size={size}
        data-dim={!match(it) || undefined}
        data-on={focus?.title === it.title || undefined}
        onMouseEnter={() => setFocus(it)}
        onFocus={() => setFocus(it)}
        onClick={() => setFocus(it)}
        title={it.body}
      >
        <span className={s.rmDots} aria-hidden>
          {it.parts.map((p) => (
            <i key={p} data-tone={TONE[p]} />
          ))}
        </span>
        {it.title}
        <span className="ix-sr">: {it.body}</span>
      </button>
    </li>
  );

  return (
    <div className={s.rm}>
      <div className={s.rmFilter} role="group" aria-label={c.hint}>
        <button type="button" onClick={() => setLayer(null)} aria-pressed={layer == null}>
          {c.all}
        </button>
        {c.layers.map((l) => (
          <button key={l.id} type="button" onClick={() => setLayer((v) => (v === l.id ? null : l.id))} aria-pressed={layer === l.id} data-tone={l.tone}>
            <i aria-hidden />
            {l.label}
          </button>
        ))}
      </div>

      <div className={s.rmTime}>
        <section className={s.rmPast} aria-label={c.shipped}>
          <p className={s.rmHead}>
            {c.shipped} <span>{count(done.items)}</span>
          </p>
          <div className={s.rmQuarters}>
            {quarters.map((q) => (
              <div key={q} className={s.rmQuarter}>
                <span className={s.rmTick}>{q}</span>
                <ul>
                  {done.items
                    .filter((i) => i.when === q)
                    .map((it) => chip(it, 'lg'))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <div className={s.rmNow} aria-hidden>
          <span>{c.now}</span>
          <i />
        </div>

        <div className={s.rmFuture}>
          <section aria-label={c.research}>
            <p className={s.rmHead}>
              {c.research} <span>{count(research.items)}</span>
            </p>
            <ul className={s.rmField}>
              {research.items.map((it) => chip(it, 'lg'))}
            </ul>
          </section>
          <section aria-label={c.backlog}>
            <p className={s.rmHead} data-quiet>
              {c.backlog} <span>{count(backlog.items)}</span>
            </p>
            <ul className={s.rmField} data-quiet>
              {backlog.items.map((it) => chip(it, 'sm'))}
            </ul>
          </section>
        </div>
      </div>

      <p className={s.rmRead} aria-live="polite">
        {focus ? (
          <>
            <b>{focus.title}</b> {focus.body} <span>{focus.parts.join(' · ')}</span>
          </>
        ) : (
          <span>{c.read}</span>
        )}
      </p>
    </div>
  );
}
