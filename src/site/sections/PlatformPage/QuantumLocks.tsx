'use client';

import { useState } from 'react';
import { locks as c } from '@site/content/platform';
import s from './Round4.module.css';

/* Hybrid key exchange as three padlocks. Under a quantum computer RSA-4096 and ECDH open
   (Shor's algorithm) but ML-KEM-1024 holds, so the shared secret holds too.
   Without JavaScript the "today" state renders with every line readable. */

function Padlock({ open }: { open: boolean }) {
  return (
    <svg viewBox="0 0 40 48" className={s.padlock} data-open={open || undefined} aria-hidden>
      <path d="M11 22 V14 a9 9 0 0 1 18 0 V22" className={s.shackle} />
      <rect x="5" y="22" width="30" height="22" rx="3" className={s.body} />
      <path d="M20 30 v6" className={s.keyhole} />
    </svg>
  );
}

export default function QuantumLocks() {
  const [q, setQ] = useState(false);
  return (
    <div className={s.locks} data-quantum={q || undefined}>

      <div className={s.lockPanel}>
        <div className={s.lockHead}>
          <p className={s.strap}>
            <b>{c.threatTitle}</b> {c.threat}
          </p>
          <button type="button" role="switch" aria-checked={q} className={s.switch} onClick={() => setQ((v) => !v)}>
            <span data-on={!q || undefined}>{c.toggle.off}</span>
            <i aria-hidden />
            <span data-on={q || undefined}>{c.toggle.on}</span>
          </button>
        </div>

        <ul className={s.lockRow}>
          {c.items.map((it) => {
            const broken = q && it.id !== 'kem';
            const hero = q && it.id === 'kem';
            return (
              <li key={it.id} className={s.lock} data-broken={broken || undefined} data-hero={hero || undefined}>
                <Padlock open={broken} />
                <b>{it.name}</b>
                <span className={s.lockMath}>{it.math}</span>
                <span className={s.lockState}>{broken ? `${c.broken} · ${it.breaks}` : q ? `${c.holds} · ${it.breaks}` : c.holds}</span>
              </li>
            );
          })}
        </ul>

        <div className={s.verdict} aria-live="polite">
          <p data-ok>
            <b className={s.tick} aria-hidden />
            {c.verdict.safe}
          </p>
          <p data-show={q || undefined}>{c.verdict.classical}</p>
        </div>
        <p className={s.caption}>
          {c.label}. {c.note}
        </p>
      </div>
    </div>
  );
}
