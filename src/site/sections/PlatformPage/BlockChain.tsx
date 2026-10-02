'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useNetworkPulse, fmt } from '@site/lib/useNetworkPulse';
import { prefersReducedMotion } from '@site/lib/motion';
import { dltChain as c, dltStrip } from '@site/content/platform';
import s from './Chain.module.css';

/* Live chain with finality arcs. Each arc reaches back five blocks: a block's header freezes
   the signer set of the block five before it, which makes that block final.
   Heights come from the network's status file; reduced motion skips the step, draw and flash. */

const FINAL = 5;
const Y = 96; // the chain
const ARC = 74; // arc height
const BOX = 12;

export default function BlockChain() {
  const pulse = useNetworkPulse();
  const h = pulse.height;
  const wrap = useRef<HTMLDivElement>(null);
  const moving = useRef<SVGGElement>(null);
  const [w, setW] = useState(0);
  const [sel, setSel] = useState<number | null>(null);
  const [fresh, setFresh] = useState<number | null>(null);
  // when this page saw the latest block arrive: the next block fills against the 30 s target from then
  const [seenAt, setSeenAt] = useState<number | null>(null);
  const [now, setNow] = useState(0);
  useEffect(() => {
    if (seenAt == null) return;
    setNow(Date.now());
    const id = window.setInterval(() => document.visibilityState === 'visible' && setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, [seenAt]);
  const ago = seenAt == null ? null : Math.max(0, Math.round((now - seenAt) / 1000));
  const prev = useRef<number | null>(null);

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setW(Math.round(e.contentRect.width)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const step = w < 560 ? 34 : 50;
  const right = w - 28; // the next block's centre
  const count = w ? Math.max(9, Math.floor((w - 40) / step)) : 0; // blocks drawn, the next one included
  const xOf = (n: number) => (h == null ? 0 : right - (h + 1 - n) * step);

  // one new block: step left, draw its arc, flash the block it makes final
  useLayoutEffect(() => {
    const was = prev.current;
    prev.current = h;
    if (h == null || was == null || h === was) return;
    setSeenAt(Date.now());
    if (h - was !== 1 || prefersReducedMotion()) return;
    moving.current?.animate([{ transform: `translateX(${step}px)` }, { transform: 'none' }], { duration: 700, easing: 'cubic-bezier(0.65, 0, 0.35, 1)' });
    setFresh(h);
    const id = window.setTimeout(() => setFresh(null), 2200);
    return () => window.clearTimeout(id);
  }, [h, step]);

  const blocks = h == null || !count ? [] : Array.from({ length: count }, (_, i) => h + 1 - (count - 1) + i);
  const depth = (n: number) => (h == null ? 0 : h - n);
  const state = (n: number) => (h == null ? 'next' : n > h ? 'next' : depth(n) >= FINAL ? 'final' : 'signing');
  const shown = sel ?? (h != null ? h - FINAL : null);
  const boundary = h == null ? 0 : (xOf(h - FINAL) + xOf(h - FINAL + 1)) / 2;
  const first = blocks[0];

  const sentence =
    shown == null || h == null
      ? c.reading
      : state(shown) === 'final'
        ? c.say.final(fmt(shown), fmt(shown + FINAL))
        : state(shown) === 'signing'
          ? c.say.signing(fmt(shown), depth(shown), fmt(shown + FINAL))
          : c.say.next(fmt(shown));

  const pick = (n: number) => setSel((cur) => (cur === n ? null : n));

  return (
    <figure className={s.chain} aria-label={c.label}>
      <figcaption className={s.head}>
        <span className={s.title}>
          <i data-on={pulse.ok || undefined} aria-hidden />
          {c.label}
          {pulse.dlt != null && (
            <span className={s.nodes}>
              · <b>{pulse.dlt}</b> {c.nodes}
            </span>
          )}
        </span>
        <span className={s.now}>
          <span>{ago != null ? c.seen(ago) : c.now}</span>
          <b>{h != null ? fmt(h) : '…'}</b>
        </span>
      </figcaption>

      <div ref={wrap} className={s.stage}>
        <svg width={w || undefined} height={Y + 64} className={s.svg} role="group" aria-label={h == null ? c.reading : `${c.now} ${fmt(h)}`}>
          <line x1={0} x2={w} y1={Y} y2={Y} className={s.line} />
          {h != null && w > 0 && (
            <>
              <g ref={moving}>
                {/* the arcs: each block reaching back to the block five before it */}
                {blocks.map((n) => {
                  if (n > h || n - FINAL < first - 1) return null;
                  const x1 = xOf(n);
                  const x2 = xOf(n - FINAL);
                  const latest = n === h;
                  return (
                    <path
                      key={`a${n}`}
                      d={`M ${x1} ${Y - BOX / 2 - 2} C ${x1} ${Y - ARC}, ${x2} ${Y - ARC}, ${x2} ${Y - BOX / 2 - 2}`}
                      className={s.arc}
                      data-latest={latest || undefined}
                      data-fresh={(latest && fresh === h) || undefined}
                      // the arc that made the selected block final, or, for one still signing, the block it will freeze
                      data-sel={(shown != null && (n - FINAL === shown || (n === shown && n > h - FINAL))) || undefined}
                      pathLength={1}
                    />
                  );
                })}

                {/* the blocks */}
                {blocks.map((n) => {
                  const st = state(n);
                  const d = Math.max(0, depth(n));
                  const x = xOf(n);
                  const on = n === shown;
                  return (
                    <g
                      key={n}
                      className={s.block}
                      data-state={st}
                      data-latest={n === h || undefined}
                      data-sel={on || undefined}
                      data-fresh={(fresh != null && n === fresh - FINAL) || undefined}
                      role="button"
                      tabIndex={0}
                      aria-pressed={on}
                      aria-label={`${dltStrip.status[st as 'final' | 'signing' | 'next']}: ${fmt(n)}`}
                      onClick={() => pick(n)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          pick(n);
                        }
                      }}
                    >
                      <rect x={x - step / 2} y={Y - 40} width={step} height={80} className={s.hit} />
                      <rect x={x - BOX / 2} y={Y - BOX / 2} width={BOX} height={BOX} className={s.box} />
                      {st === 'next' && ago != null && (
                        <rect x={x - BOX / 2 + 2} y={Y + BOX / 2 - 2 - (BOX - 4) * Math.min(1, ago / 30)} width={BOX - 4} height={(BOX - 4) * Math.min(1, ago / 30)} className={s.wait} />
                      )}
                      {st === 'signing' && <rect x={x - BOX / 2 + 2} y={Y + BOX / 2 - 2 - ((BOX - 4) * d) / FINAL} width={BOX - 4} height={((BOX - 4) * d) / FINAL} className={s.fill} />}
                      <text x={x} y={Y + 30} textAnchor="middle" className={s.no}>
                        {String(n % 1000).padStart(3, '0')}
                      </text>
                    </g>
                  );
                })}
              </g>

              {/* the finality boundary stays put; blocks cross it */}
              <line x1={boundary} x2={boundary} y1={Y - 22} y2={Y + 52} className={s.boundary} />
              <text x={boundary - 10} y={Y + 52} textAnchor="end" className={s.zone}>
                ← {c.zones.final}
              </text>
              <text x={boundary + 10} y={Y + 52} className={s.zone}>
                {c.zones.signing} →
              </text>
            </>
          )}
        </svg>
      </div>

      <div className={s.say} aria-live="polite">
        <p>{sentence}</p>
        {shown != null && h != null && shown <= h && (
          <a href={dltStrip.explorerBlock(shown)} target="_blank" rel="noreferrer">
            {c.explorer} ↗
          </a>
        )}
      </div>
      <p className={s.caption}>{c.arcs}</p>
    </figure>
  );
}
