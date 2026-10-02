'use client';

import { useRef, useState } from 'react';
import { langs as c } from '@site/content/developers';
import s from './Dev2.module.css';

/** Language picker (a tablist: arrow keys move the choice) with a snippet per language. */

export default function Langs() {
  const [i, setI] = useState(1);
  const [copied, setCopied] = useState(false);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const it = c.items[i];
  const go = (n: number) => {
    const k = (n + c.items.length) % c.items.length;
    setI(k);
    tabs.current[k]?.focus();
  };
  return (
    <div className={s.lang}>
      <div className={s.langPick}>
        <p className={s.langLabel}>{c.label}</p>
        <div role="tablist" aria-label={c.label} aria-orientation="vertical" className={s.langList}>
          {c.items.map((x, k) => (
            <button
              key={x.id}
              ref={(el) => {
                tabs.current[k] = el;
              }}
              type="button"
              role="tab"
              id={`lang-${x.id}`}
              aria-selected={k === i}
              aria-controls="lang-panel"
              tabIndex={k === i ? 0 : -1}
              onClick={() => setI(k)}
              onKeyDown={(e) => {
                const step = e.key === 'ArrowDown' || e.key === 'ArrowRight' ? 1 : e.key === 'ArrowUp' || e.key === 'ArrowLeft' ? -1 : 0;
                if (!step) return;
                e.preventDefault();
                go(k + step);
              }}
            >
              {x.name}
            </button>
          ))}
        </div>
      </div>

      <div id="lang-panel" role="tabpanel" aria-labelledby={`lang-${it.id}`} className={s.langPanel}>
        <div className={s.langPath}>
          <span>Goes through</span>
          <b key={it.path}>{it.path}</b>
        </div>
        <div className={s.langCode}>
          <div className={s.langBar}>
            <span>{it.file}</span>
            <button
              type="button"
              onClick={() =>
                navigator.clipboard?.writeText(it.code.filter((l) => !l.startsWith('#')).map((l) => l.replace(/^\$ /, '')).join('\n')).then(
                  () => {
                    setCopied(true);
                    window.setTimeout(() => setCopied(false), 1400);
                  },
                  () => {}
                )
              }
            >
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
          <pre key={it.id} tabIndex={0} aria-label={`${it.name} example`}>
            {it.code.map((l, k) => (
              <code key={k} style={{ ['--k' as string]: k }} data-comment={/^\s*(#|\/\/)/.test(l) || undefined}>
                {l.startsWith('$ ') ? (
                  <>
                    <i>$</i>
                    {l.slice(1)}
                  </>
                ) : (
                  l || ' '
                )}
              </code>
            ))}
          </pre>
        </div>
        <p className={s.langNote}>
          {it.note}{' '}
          <a href={it.link.href} target={/^https?:/.test(it.link.href) ? '_blank' : undefined} rel="noreferrer">
            {it.link.label} {/^https?:/.test(it.link.href) ? '↗' : '→'}
          </a>
        </p>
      </div>
    </div>
  );
}
