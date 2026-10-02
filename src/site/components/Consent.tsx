'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { links } from '@site/content/links';
import { readConsent, writeConsent } from '@site/lib/consent';
import s from './Consent.module.css';

// Non-blocking consent card; the footer's "Privacy settings" reopens it. Nothing external loads before a yes.

type Mode = 'hidden' | 'notice' | 'settings';

export default function Consent() {
  const [mode, setMode] = useState<Mode>('hidden');
  const [external, setExternal] = useState(false);
  const card = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const c = readConsent();
    if (c) setExternal(c.external);
    // first visit: a moment after the page settles, so it never competes with the first paint
    const t = c ? 0 : window.setTimeout(() => setMode('notice'), 1400);
    const open = () => {
      setExternal(readConsent()?.external ?? false);
      setMode('settings');
    };
    window.addEventListener('ix-privacy-open', open);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener('ix-privacy-open', open);
    };
  }, []);

  useEffect(() => {
    if (mode === 'settings') card.current?.focus();
    if (mode === 'hidden') return;
    const esc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mode === 'settings') setMode('hidden');
    };
    window.addEventListener('keydown', esc);
    return () => window.removeEventListener('keydown', esc);
  }, [mode]);

  if (mode === 'hidden') return null;

  const choose = (v: boolean) => {
    writeConsent({ external: v });
    setExternal(v);
    setMode('hidden');
  };

  return (
    <div ref={card} className={s.card} role="region" aria-label="Privacy choices" tabIndex={-1} data-mode={mode}>
      <p className={s.eyebrow}>Privacy</p>
      {mode === 'notice' ? (
        <>
          <p className={s.text}>No cookies and no tracking here. One question: may older blog posts load their images from Medium?</p>
          <div className={s.actions}>
            <button type="button" className={s.btn} onClick={() => choose(true)}>
              Allow images
            </button>
            <button type="button" className={s.btn} onClick={() => choose(false)}>
              Keep them off
            </button>
          </div>
          <Link href={links.cookies} className={s.more}>
            What this means
          </Link>
        </>
      ) : (
        <>
          <ul className={s.rows}>
            <li>
              <span className={s.rowText}>
                <b>Essential</b>
                <span>Your privacy choice and your Quickstart progress, kept in this browser only.</span>
              </span>
              <span className={s.always}>Always on</span>
            </li>
            <li>
              <span className={s.rowText}>
                <b id="ix-ext-label">External content</b>
                <span>Images in older blog posts, loaded from Medium’s servers.</span>
              </span>
              <button type="button" role="switch" aria-checked={external} aria-labelledby="ix-ext-label" className={s.switch} onClick={() => setExternal((v) => !v)}>
                <i aria-hidden />
              </button>
            </li>
          </ul>
          <div className={s.actions}>
            <button type="button" className={s.btn} data-main onClick={() => choose(external)}>
              Save
            </button>
            <button type="button" className={s.btn} onClick={() => setMode('hidden')}>
              Cancel
            </button>
          </div>
          <Link href={links.cookies} className={s.more}>
            Cookie policy
          </Link>
        </>
      )}
    </div>
  );
}
