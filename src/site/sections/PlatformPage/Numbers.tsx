'use client';

import { numbers } from '@site/content/platform';
import s from './Instruments.module.css';
// Turbopack (dev) only links a CSS module that some client component on the page
// imports; on this page the kit and the section boundaries are server-only, so
// their styles are pulled in here. Without this the page renders unstyled in
// `npm run dev` (webpack and the production build are unaffected).
import '@site/components/page/page.module.css';
import '@site/components/SectionBoundary.module.css';

export default function Numbers() {
  return (
    <section className={s.numbers} aria-label={numbers.label}>
      <dl className={s.bigRow}>
        {numbers.big.map((b) => (
          <div key={b.id} className={s.big} data-reveal>
            <dt className={s.bigLabel}>{b.label}</dt>
            <dd className={s.bigValue}>
              {b.value}
              {b.unit && <small>{b.unit}</small>}
            </dd>
          </div>
        ))}
      </dl>
      {numbers.note && <p className={s.bigAsOf}>{numbers.note}</p>}
    </section>
  );
}
