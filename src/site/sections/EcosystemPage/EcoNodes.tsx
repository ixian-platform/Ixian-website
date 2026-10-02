'use client';

import { useState } from 'react';
import { useNetworkPulse, fmt } from '@site/lib/useNetworkPulse';
import { eco, runNode } from '@site/content/ecosystem';
import releases from '@site/content/generated/releases.json';
import s from './Eco.module.css';

function Commands({ lines }: { lines: string[] }) {
  const [done, setDone] = useState(false);
  return (
    <details className={s.cmds}>
      <summary>{eco.nodes.start}</summary>
      <pre>
        {lines.map((l) => (
          <code key={l}>
            <i>$</i>
            {l.replace(/^\$ /, ' ')}
          </code>
        ))}
      </pre>
      <button
        type="button"
        className={s.copyN}
        onClick={() =>
          navigator.clipboard?.writeText(lines.map((l) => l.replace(/^\$ /, '')).join('\n')).then(
            () => {
              setDone(true);
              window.setTimeout(() => setDone(false), 1600);
            },
            () => {}
          )
        }
      >
        {done ? eco.nodes.copied : eco.nodes.copy}
      </button>
    </details>
  );
}

const short = (v: string) => v.replace(' or more', '+').replace(', 2 TB recommended', '').replace(', 100 recommended', '').replace(' symmetrical', '').replace(' threads at 2 GHz+', ' threads');


const rel = releases as Partial<Record<string, { tag: string; url: string; date: string }>>;
export default function EcoNodes() {
  const p = useNetworkPulse();
  return (
    <div className={s.invite}>
      <p className={s.sum} aria-label={p.dlt != null && p.s2 != null ? `${p.dlt} DLT nodes and ${p.s2} S2 nodes run Ixian now. Yours would be one more.` : 'DLT and S2 nodes run Ixian now. Yours would be one more.'}>
        <span data-tone="dlt">
          <b>{p.dlt != null ? fmt(p.dlt) : '…'}</b>
          <small>DLT</small>
        </span>
        <em>+</em>
        <span data-tone="s2">
          <b>{p.s2 != null ? fmt(p.s2) : '…'}</b>
          <small>S2</small>
        </span>
        <em>+</em>
        <span data-tone="you">
          <b>you</b>
          <small>&nbsp;</small>
        </span>
      </p>
      <p className={s.sumNote}>
        <i data-on={p.ok || undefined} aria-hidden /> Node counts are live.
      </p>

      <ul className={s.kinds}>
        {runNode.kinds.map((k) => (
          <li key={k.id} data-tone={k.id}>
            <h3>{k.name}</h3>
            <p>
              {k.role} <span>{k.earns}</span>
            </p>
            <p className={s.hwLine}>
              {eco.nodes.hardware}: {k.specs.map((r) => short(r.v)).join('  ·  ')}
            </p>
            <div className={s.kindAct}>
              <a href={k.guide.href} target="_blank" rel="noreferrer">
                {k.guide.label} ↗
              </a>
              {rel[k.id] ? (
                /* the latest release, read from GitHub at build time (scripts/fetch-releases.mjs) */
                <a href={rel[k.id]!.url} target="_blank" rel="noreferrer">
                  Latest release <code className={s.relTag}>{rel[k.id]!.tag}</code> ↗
                </a>
              ) : (
                <a href={k.release.href} target="_blank" rel="noreferrer">
                  {k.release.label} ↗
                </a>
              )}
            </div>
            <Commands lines={k.code} />
          </li>
        ))}
      </ul>
    </div>
  );
}
