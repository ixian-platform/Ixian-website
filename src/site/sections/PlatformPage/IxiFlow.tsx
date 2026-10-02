'use client';

import { useEffect, useRef, useState } from 'react';
import { useInView } from '@site/lib/motion';
import { ixi, ixiLive } from '@site/content/platform';
import { useNetworkPulse, fmt } from '@site/lib/useNetworkPulse';
import s from './Instruments.module.css';

// One trace per route the docs describe; IXI Names fees go through a reward pool, so that trace is dashed.
// Traces have equal widths because the docs give no split.

const [mPrice, mMaturity, mStake] = ixi.metrics;
// each route arrives on its own lane (dy), so three traces reach the signers side by side
const ROUTES: { from: 'block' | 'tx' | 'names'; to: 'dlt' | 's2'; x: number; dy: number; dashed?: boolean }[] = [
  { from: 'block', to: 'dlt', x: 96, dy: -12 },
  { from: 'tx', to: 'dlt', x: 144, dy: 0 },
  { from: 'tx', to: 's2', x: 224, dy: 0 },
  { from: 'names', to: 'dlt', x: 184, dy: 12, dashed: true },
];
const TO = { dlt: 'DLT signers', s2: 'S2 relays' };
type Ys = Record<'block' | 'tx' | 'names' | 'dlt' | 's2', number>;

export default function IxiFlow() {
  const root = useRef<HTMLDivElement>(null);
  const seen = useInView(root, { once: true, margin: '0px 0px -20% 0px' });
  const f = ixi.flow;
  // cards size to their content, so trace endpoints are measured from the rendered cards
  const traces = useRef<HTMLDivElement>(null);
  const nodes = useRef<Record<string, HTMLLIElement | null>>({});
  const [box, setBox] = useState<{ w: number; h: number; y: Ys } | null>(null);
  useEffect(() => {
    const el = traces.current;
    if (!el) return;
    const measure = () => {
      if (!traces.current) return;
      const r = el.getBoundingClientRect();
      if (r.width === 0) return setBox(null); // phones: no traces
      const y = {} as Ys;
      (Object.keys(nodes.current) as (keyof Ys)[]).forEach((k) => {
        const n = nodes.current[k];
        if (n) {
          const nr = n.getBoundingClientRect();
          y[k] = Math.round(nr.top + nr.height / 2 - r.top);
        }
      });
      setBox({ w: Math.round(r.width), h: Math.round(r.height), y });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el.parentElement ?? el);
    return () => ro.disconnect();
  }, []);
  // live: each real new block runs one green pulse down the block → signers trace
  const net = useNetworkPulse();
  const h = net.height;
  const extra: Record<string, { v: string; k: string; href: string }[]> = {
    tx: [{ v: mPrice.value, k: mPrice.unit.split(',')[0], href: mPrice.href }],
    dlt: [
      { v: mMaturity.value, k: `until spendable, ${mMaturity.unit.split(',')[0]}`, href: mMaturity.href },
      { v: mStake.value, k: 'stake to run a node', href: mStake.href },
    ],
  };

  return (
    <figure ref={root} className={s.ixi} data-seen={seen || undefined}>
      <figcaption className={s.frameHead}>
        <span>Where IXI goes</span>
        <span className={s.num}>{f.note}</span>
      </figcaption>
      <div className={s.ixiGrid}>
        <ol className={s.ixiCol}>
          {f.sources.map((n, i) => (
            <li key={n.id} className={s.ixiNode} ref={(el) => void (nodes.current[n.id] = el)}>
              <span className={s.ixiTag}>
                {String(i + 1).padStart(2, '0')} · {n.id === 'block' ? 'MINTED' : n.id === 'tx' ? 'FEES' : 'NAMES'}
              </span>
              <b>{n.name}</b>
              <span className={s.ixiNote}>{n.note}</span>
              {extra[n.id]?.map((m) => (
                <a key={m.k} className={s.ixiParam} href={m.href} target="_blank" rel="noreferrer">
                  <span className={s.num}>{m.v}</span> {m.k}
                </a>
              ))}
              <span className={s.ixiTo}>→ {ROUTES.filter((r) => r.from === n.id).map((r) => TO[r.to]).join(' and ')}</span>
            </li>
          ))}
        </ol>

        <div ref={traces} className={s.ixiTraceBox} aria-hidden>
          {box && (
            <svg className={s.ixiTraces} viewBox={`0 0 ${box.w} ${box.h}`} width={box.w} height={box.h}>
              {ROUTES.map((r, i) => {
                const y0 = box.y[r.from];
                const y1 = box.y[r.to] + r.dy;
                const x = Math.round((r.x / 320) * box.w);
                const k = Math.min(10, Math.abs(y1 - y0) / 2);
                const sy = Math.sign(y1 - y0) || 1;
                const d = `M -18 ${y0} H ${x - k} Q ${x} ${y0} ${x} ${y0 + sy * k} V ${y1 - sy * k} Q ${x} ${y1} ${x + k} ${y1} H ${box.w + 18}`;
                return (
                  <g key={r.from + r.to}>
                    <path d={d} className={s.wire2} />
                    <path d={d} className={s.trace2} data-dashed={r.dashed || undefined} />
                    <path d={d} className={s.pulse} style={{ animationDelay: `${i * 260}ms` }} pathLength={1} />
                    {r.from === 'block' && net.newBlocks > 0 && <path key={`live${h}`} d={d} className={s.pulseLive} pathLength={1} />}
                  </g>
                );
              })}
            </svg>
          )}
        </div>

        {/* phones: the sources flow down into the two kinds of operator */}
        <p className={s.ixiFunnel} aria-hidden>
          <i />
          <span>paid to</span>
          <i />
        </p>

        <ol className={`${s.ixiCol} ${s.ixiSinks}`}>
          {f.sinks.map((n) => (
            <li key={n.id} className={s.ixiNode} data-sink ref={(el) => void (nodes.current[n.id] = el)}>
              <span className={s.ixiTag}>
                <i aria-hidden data-k={n.id} /> {n.id === 'dlt' ? 'IXIAN DLT' : 'IXIAN S2'}
              </span>
              <b>{n.name}</b>
              <span className={s.ixiNote}>{n.note}</span>
              {extra[n.id]?.map((m) => (
                <a key={m.k} className={s.ixiParam} href={m.href} target="_blank" rel="noreferrer">
                  <span className={s.num}>{m.v}</span> {m.k}
                </a>
              ))}
            </li>
          ))}
        </ol>
      </div>
      <div className={s.ixiLive} aria-live="polite">
        <span className={s.ixiLiveHead}>
          <i data-on={net.ok || undefined} aria-hidden />
          {ixiLive.pulse}
          <b className={s.num}>{h != null ? fmt(h) : '…'}</b>
        </span>
        <span>{h == null ? ixiLive.reading : ixiLive.since(net.newBlocks)}</span>
        <span className={s.ixiMaturity}>{h != null ? ixiLive.maturity(fmt(h), fmt(h + 960)) : ''}</span>
      </div>
    </figure>
  );
}
