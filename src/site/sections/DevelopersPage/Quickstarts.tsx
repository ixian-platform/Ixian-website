'use client';

import { useRef, useState } from 'react';
import CodeBlock from '@site/components/page/CodeBlock';
import Icon from '@site/components/Icon';
import type { Quickstart } from '@site/content/developers';
import s from './DevelopersPage.module.css';

// Vertical tablist with arrow-key navigation; becomes a row of tabs on phones.

export default function Quickstarts({
  items,
  labels,
}: {
  items: Quickstart[];
  labels: { timeLabel: string; needsLabel: string; noTime: string; open: string };
}) {
  const [cur, setCur] = useState(0);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const go = (i: number) => {
    const n = (i + items.length) % items.length;
    setCur(n);
    refs.current[n]?.focus();
  };
  return (
    <div className={s.qs}>
      <div className={s.qsList} role="tablist" aria-label="Quickstarts" aria-orientation="vertical">
        {items.map((q, i) => (
          <button
            key={q.id}
            ref={(el) => {
              refs.current[i] = el;
            }}
            type="button"
            role="tab"
            id={`qs-t-${q.id}`}
            aria-controls={`qs-p-${q.id}`}
            aria-selected={i === cur}
            tabIndex={i === cur ? 0 : -1}
            className={s.qsTab}
            onClick={() => setCur(i)}
            onKeyDown={(e) => {
              if (e.key === 'ArrowDown' || e.key === 'ArrowRight') go(i + 1);
              else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') go(i - 1);
              else if (e.key === 'Home') go(0);
              else if (e.key === 'End') go(items.length - 1);
              else return;
              e.preventDefault();
            }}
          >
            <span className={s.qsNo}>{String(i + 1).padStart(2, '0')}</span>
            <span className={s.qsName}>{q.name}</span>
          </button>
        ))}
      </div>
      <div className={s.qsPanes}>
        {items.map((q, i) => (
          <div
            key={q.id}
            role="tabpanel"
            id={`qs-p-${q.id}`}
            aria-labelledby={`qs-t-${q.id}`}
            className={s.qsPane}
            data-on={i === cur || undefined}
            inert={i !== cur}
          >
            <h3 className={s.qsTitle}>{q.name}</h3>
            <p className={s.qsBody}>{q.body}</p>
            <dl className={s.qsMeta}>
              <div>
                <dt>{labels.timeLabel}</dt>
                <dd data-muted={!q.time || undefined}>{q.time ?? labels.noTime}</dd>
              </div>
              <div>
                <dt>{labels.needsLabel}</dt>
                <dd>{q.needs.join(' · ')}</dd>
              </div>
            </dl>
            <CodeBlock lines={q.code} lang="Shell" />
            <a className={s.qsOpen} href={q.href} target="_blank" rel="noreferrer">
              {labels.open}
              <Icon name="external" size={14} />
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
