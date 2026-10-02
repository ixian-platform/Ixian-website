'use client';

import { useNetworkPulse, fmt } from '@site/lib/useNetworkPulse';
import { eco } from '@site/content/ecosystem';
import s from './Eco.module.css';
// Turbopack (dev) links a CSS module only when a client component imports it (see PlatformPage/Numbers.tsx)
import '@site/components/page/page.module.css';
import '@site/components/SectionBoundary.module.css';

// Three columns, one per verb in the title; hovering a column lights its verb in its colour.

const COLS = [
  { id: 'use', word: 'Use it.', items: ['spixi', 'ixiscope', 'names'] },
  { id: 'build', word: 'Build on it.', items: ['miniapps', 'quixi', 'bot'] },
  { id: 'run', word: 'Run it.', items: ['dlt', 's2'] },
] as const;

export default function EcoHero() {
  const p = useNetworkPulse();
  const by = Object.fromEntries(eco.map.items.map((i) => [i.id, i]));
  const live: Record<string, number | null> = { dlt: p.dlt, s2: p.s2 };
  return (
    <div className={s.doors}>
      <div className={s.doorsHead}>
        <h1 className={s.h1}>{eco.hero.title[0]}</h1>
        <p className={s.lead}>{eco.hero.lead}</p>
      </div>
      <ol className={s.doorCols}>
        {COLS.map((col) => (
          <li key={col.id} className={s.door} data-col={col.id}>
            <span className={s.doorWord}>{col.word}</span>
            <ul>
              {col.items.map((id) => {
                const it = by[id];
                const n = live[id];
                return (
                  <li key={id}>
                    <a href={it.href} data-id={id}>
                      <b>
                        {it.name}
                        {id in live && (
                          <span className={s.doorLive} data-tone={id}>
                            <i data-on={n != null || undefined} aria-hidden />
                            {n != null ? `${fmt(n)} online` : '…'}
                          </span>
                        )}
                      </b>
                      <span>{it.line}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </li>
        ))}
      </ol>
    </div>
  );
}
