'use client';

import { useRef } from 'react';
import { useInView } from '@site/lib/motion';
import { notBuilt as c } from '@site/content/developers';
import s from './Dev2.module.css';
// Turbopack (dev) links a CSS module only when a client component imports it (see PlatformPage/Numbers.tsx)
import '@site/components/page/page.module.css';
import '@site/components/SectionBoundary.module.css';

/* Items strike through once in view; reduced motion shows the end state. */

export default function NotBuilt() {
  const root = useRef<HTMLOListElement>(null);
  const seen = useInView(root, { once: true, margin: '0px 0px -25% 0px' });
  return (
    <ol ref={root} className={s.nb} data-seen={seen || undefined}>
      {c.rows.map((r, i) => (
        <li key={r.cross} style={{ ['--i' as string]: i }}>
          <span className={s.nbNo}>{String(i + 1).padStart(2, '0')}</span>
          <span className={s.nbCross}>
            <span>{r.cross}</span>
          </span>
          <span className={s.nbWith}>{r.with}</span>
          <a className={s.nbWhere} href={r.href}>
            {r.where} →
          </a>
        </li>
      ))}
    </ol>
  );
}
