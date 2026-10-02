'use client';

import { openPrivacySettings } from '@site/lib/consent';

import Link from 'next/link';
import { useEffect, useRef } from 'react';
import Logo, { MARK_D } from './Logo';
import Icon from './Icon';
import { footer } from '@site/content/site';
import { useNetworkPulse, fmt } from '@site/lib/useNetworkPulse';
import { ScrollTrigger, prefersReducedMotion } from '@site/lib/motion';
import s from './Footer.module.css';

// The network line shows real counts only; until the first reading it shows a placeholder, never a fallback number.
// The mark only animates when JS runs and motion is allowed.

const isExternal = (href: string) => href.startsWith('http');

export default function Footer() {
  const pulse = useNetworkPulse();
  const mark = useRef<SVGSVGElement>(null);
  const year = new Date().getFullYear();

  useEffect(() => {
    const el = mark.current;
    if (!el || prefersReducedMotion()) return;
    el.dataset.armed = '';
    const t = ScrollTrigger.create({
      trigger: el,
      start: 'top 92%',
      once: true,
      onEnter: () => {
        el.dataset.in = '';
      },
    });
    return () => t.kill();
  }, []);

  return (
    <footer className={s.footer}>
      <div className={s.wrap}>
        <div className={s.top}>
          <div className={s.brand}>
            <svg ref={mark} className={s.mark} viewBox="3 1 26 30" aria-hidden>
              <path className={s.markFill} d={MARK_D} />
              <path className={s.markLine} d={MARK_D} pathLength={1} />
            </svg>
            <p className={s.tagline}>{footer.tagline}</p>
            <p className={s.maintained}>{footer.maintained}</p>
            <p className={s.status} aria-live="polite">
              <i className={s.dot} data-on={pulse.ok || undefined} aria-hidden />
              {pulse.ok ? (
                <>
                  <span>{footer.status.live}</span>
                  <span className={s.readings}>
                    <span>
                      {footer.status.s2} <b>{fmt(pulse.s2)}</b>
                    </span>
                    <span>
                      {footer.status.dlt} <b>{fmt(pulse.dlt)}</b>
                    </span>
                    <span>
                      {footer.status.block} <b>{fmt(pulse.height)}</b>
                    </span>
                  </span>
                </>
              ) : (
                <span>{footer.status.reading}</span>
              )}
            </p>
          </div>

          <nav className={s.cols} aria-label="Footer">
            {footer.columns.map((col) => (
              <div key={col.title} className={s.col}>
                <p className={s.colTitle}>{col.title}</p>
                <ul>
                  {col.links.map((l) => (
                    <li key={l.label}>
                      {isExternal(l.href) ? (
                        <a href={l.href} target="_blank" rel="noreferrer">
                          {l.label}
                          <Icon name="external" size={12} className={s.ext} />
                        </a>
                      ) : (
                        <Link href={l.href}>{l.label}</Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className={s.bottom}>
          <Link href="/" className={s.logo} aria-label="Ixian home">
            <Logo />
          </Link>
          <p className={s.copy}>© 2017–{year} Ixian</p>
          <ul className={s.legal}>
            {footer.legal.map((l) => (
              <li key={l.label}>
                <Link href={l.href}>{l.label}</Link>
              </li>
            ))}
            <li>
              <button type="button" className={s.settings} onClick={openPrivacySettings}>
                Privacy settings
              </button>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
