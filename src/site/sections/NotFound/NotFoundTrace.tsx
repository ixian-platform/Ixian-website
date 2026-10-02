'use client';

import { useEffect, useState } from 'react';
import { sha3_512 } from '@noble/hashes/sha3.js';
import { hex } from '@site/lib/sha3';
import { notFound as c } from '@site/content/notFound';
import { closest } from '@site/lib/nearestRoute';
import s from './NotFound.module.css';

const group = (h: string) => h.match(/.{1,4}/g)?.join(' ') ?? h;

export default function NotFoundTrace() {
  const [path, setPath] = useState<string | null>(null);
  useEffect(() => {
    setPath(window.location.pathname);
  }, []);

  const digest = path == null ? '' : hex(sha3_512(new TextEncoder().encode(path)));
  const guess = path == null ? null : closest(path);

  return (
    <div className={s.card} data-ready={path != null || undefined}>
      <ol className={s.trace}>
        <li className={s.row}>
          <span className={s.k}>{c.rows.path}</span>
          <span className={s.node} aria-hidden />
          <div className={s.v}>
            <code className={s.path}>{path ?? '/'}</code>
          </div>
        </li>
        <li className={s.row}>
          <span className={s.k}>{c.rows.hash}</span>
          <span className={s.node} aria-hidden />
          <div className={s.v}>
            <code className={s.hash}>{digest ? `${digest.slice(0, 40)}…` : '…'}</code>
          </div>
        </li>
        <li className={s.row}>
          <span className={s.k}>{c.rows.sector}</span>
          <span className={s.node} aria-hidden />
          <div className={s.v}>
            <code className={s.sector}>{digest ? group(digest.slice(0, 20)) : '…'}</code>
            <small className={s.note}>{c.notes.sector}</small>
          </div>
        </li>
        <li className={s.row} data-last={guess ? undefined : ''}>
          <span className={s.k}>{c.rows.presence}</span>
          <span className={s.node} data-no aria-hidden />
          <div className={s.v}>
            <span className={s.none}>
              <svg viewBox="-8 -8 16 16" width="16" height="16" aria-hidden>
                <circle r="6.5" />
                <path d="M-2.4 -2.4l4.8 4.8M2.4 -2.4l-4.8 4.8" />
              </svg>
              {c.notes.none}
            </span>
            <small className={s.note}>{c.notes.presence}</small>
          </div>
        </li>
        {guess && (
          <li className={s.row} data-last>
            <span className={s.k}>{c.rows.guess}</span>
            <span className={s.node} data-ok aria-hidden />
            <div className={s.v}>
              <a className={s.guess} href={guess.href}>
                {c.didYouMean} <b>{guess.label}</b>?
                <span aria-hidden> →</span>
              </a>
            </div>
          </li>
        )}
      </ol>
    </div>
  );
}
