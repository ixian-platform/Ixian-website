'use client';

import { useId, useState } from 'react';
import s from './faq.module.css';

/** FAQ: one question open at a time; answers open in place (320 ms,
    instant with reduced motion). Closed answers are inert. */
export default function Faq({ items }: { items: { q: string; a: React.ReactNode }[] }) {
  const [open, setOpen] = useState<number | null>(0);
  const id = useId();
  return (
    <ul className={s.list}>
      {items.map((it, i) => {
        const on = open === i;
        return (
          <li key={it.q} className={s.item}>
            <h3 className={s.q}>
              <button
                type="button"
                aria-expanded={on}
                aria-controls={`${id}-${i}`}
                onClick={() => setOpen(on ? null : i)}
              >
                {it.q}
                <span className={s.plus} aria-hidden />
              </button>
            </h3>
            <div id={`${id}-${i}`} className={s.a} data-open={on} inert={!on} role="region" aria-label={it.q}>
              <div>
                <p>{it.a}</p>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
