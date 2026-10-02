'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { prefersReducedMotion, useInView } from '@site/lib/motion';
import type { SealKeys, SealResult } from '@site/lib/seal';
import { seal as c } from '@site/content/platform';
import { useMedia } from '@site/components/PinSteps';
import s from './Instruments.module.css';
import r4 from './Round4.module.css';

/* Seals the typed message for real in this tab (see lib/seal.ts) and times each step.
   Keys are made once, on first view, and timed separately. Reduced motion reveals all steps at once. */

const fmtMs = (n: number) => (n < 0.1 ? '<0.1 ms' : n < 100 ? `${n.toFixed(1)} ms` : `${Math.round(n).toLocaleString('en-US')} ms`);
const PHASE_MS = 240;
const PHASES = 6; // legs 0..2, hkdf 3, inner 4, outer 5, then wire + opened at 6

export default function Seal() {
  const root = useRef<HTMLDivElement>(null);
  const seen = useInView(root, { once: true, margin: '0px 0px -15% 0px' });
  const [text, setText] = useState(c.initial);
  /* phones: the plates sit further apart so their labels never overlap */
  const tall = useMedia('(max-width: 720px)');
  const Ys = tall ? [300, 196, 92] : [200, 136, 72];
  const [keys, setKeys] = useState<SealKeys | null>(null);
  const [r, setR] = useState<SealResult | null>(null);
  const [sealedText, setSealedText] = useState('');
  const [phase, setPhase] = useState(PHASES);
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);
  const lib = useRef<typeof import('@site/lib/seal') | null>(null);
  const timers = useRef<number[]>([]);

  const run = useCallback(
    async (k: SealKeys, msg: string) => {
      if (!lib.current) return;
      setBusy(true);
      try {
        const out = await lib.current.sealMessage(k, msg);
        setR(out);
        setSealedText(msg);
        timers.current.forEach(clearTimeout);
        if (prefersReducedMotion()) setPhase(PHASES);
        else {
          setPhase(0);
          timers.current = Array.from({ length: PHASES }, (_, i) => window.setTimeout(() => setPhase(i + 1), (i + 1) * PHASE_MS));
        }
      } catch {
        setFailed(true);
      } finally {
        setBusy(false);
      }
    },
    []
  );

  // keys once, on first view; then the first seal
  useEffect(() => {
    if (!seen || keys) return;
    let off = false;
    setBusy(true);
    import('@site/lib/seal')
      .then(async (m) => {
        lib.current = m;
        const k = await m.prepare();
        if (off) return;
        setKeys(k);
        await run(k, text);
      })
      .catch(() => setFailed(true))
      .finally(() => !off && setBusy(false));
    return () => {
      off = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seen]);

  // re-seal as the reader types (debounced)
  useEffect(() => {
    if (!keys || text === sealedText || !text) return;
    const id = window.setTimeout(() => run(keys, text), 450);
    return () => window.clearTimeout(id);
  }, [text, keys, sealedText, run]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const on = (i: number) => (r && phase > i) || undefined;
  const every = r ? r.legs[0] + r.legs[1] + r.legs[2] + r.hkdf + r.inner + r.outer + r.open : 0;
  const clip = (h: string, n: number) => (h.length > n ? `${h.slice(0, n)}…` : h);

  return (
    <div ref={root} className={s.seal}>
      <div className={s.sealInput}>
        <label className={s.fieldLabel} htmlFor="seal-message">
          {c.label}
        </label>
        <textarea
          id="seal-message"
          className={s.field}
          rows={3}
          maxLength={280}
          value={text}
          placeholder={c.placeholder}
          onChange={(e) => setText(e.target.value)}
          spellCheck={false}
        />

        <p className={s.stageLabel}>{c.exchange}</p>
        <ol className={s.legs}>
          {c.legs.map((l, i) => (
            <li key={l} data-on={on(i)} data-pq={i === 2 || undefined}>
              <b>{l}</b>
              <span>{c.legNotes[i]}</span>
              <em className={s.num}>{r && phase > i ? fmtMs(r.legs[i]) : ''}</em>
            </li>
          ))}
        </ol>
        <svg className={s.merge} viewBox="0 0 300 28" preserveAspectRatio="none" aria-hidden>
          <path d="M 50 0 V 10 H 150 V 28 M 150 0 V 28 M 250 0 V 10 H 150" data-on={on(2)} />
        </svg>
        <div className={s.hkdf} data-on={on(3)}>
          <b>{c.hkdf}</b>
          <span>{c.hkdfNote}</span>
          <em className={s.num}>{r && phase > 3 ? fmtMs(r.hkdf) : ''}</em>
        </div>
      </div>

      <figure className={s.layersFig} aria-label={`${c.outer} around ${c.inner} around ${c.message}`}>
        {/* plates, bottom up: the message, AES-256-GCM, ChaCha20-Poly1305 */}
        <svg viewBox={tall ? '0 0 500 368' : '0 0 540 268'} className={r4.stack} data-tall={tall || undefined} aria-hidden>
          {[
            { id: 'msg', y: Ys[0], on: true, name: c.message, note: sealedText || text || '…', stat: r ? `${r.bytes.message} B` : '' },
            { id: 'aes', y: Ys[1], on: !!on(4), name: c.inner, note: c.innerNote, stat: r && phase > 4 ? `${fmtMs(r.inner)} · ${r.bytes.inner} B` : '' },
            { id: 'cha', y: Ys[2], on: !!on(5), name: c.outer, note: c.outerNote, stat: r && phase > 5 ? `${fmtMs(r.outer)} · ${r.bytes.outer} B` : '' },
          ].map((pl) => (
            <g key={pl.id} className={r4.plate} data-l={pl.id} data-on={pl.on || undefined}>
              <path d={`M40 ${pl.y + 8} L150 ${pl.y + 63} L260 ${pl.y + 8} L260 ${pl.y} L150 ${pl.y + 55} L40 ${pl.y} Z`} className={r4.plateSide} />
              <path d={`M40 ${pl.y} L150 ${pl.y - 55} L260 ${pl.y} L150 ${pl.y + 55} Z`} className={r4.plateTop} />
              <path d={`M260 ${pl.y} H300`} className={r4.leader} />
              <text x="310" y={pl.y - (tall ? 12 : 6)} className={r4.plateName}>
                {pl.name}
              </text>
              <text x="310" y={pl.y + (tall ? 12 : 12)} className={r4.plateNote}>
                {pl.note.length > (tall ? 24 : 34) ? `${pl.note.slice(0, tall ? 23 : 33)}…` : pl.note}
              </text>
              <text x="310" y={pl.y + (tall ? 34 : 28)} className={r4.plateStat}>
                {pl.stat}
              </text>
            </g>
          ))}
        </svg>
        <div className={s.wire} data-on={(r && phase >= PHASES) || undefined}>
          <div>
            <span>{c.wire}</span>
            <p className={s.hexWire}>{r && phase >= PHASES ? clip(r.outerHex, 180) : ''}</p>
          </div>
          <div className={s.opened} data-ok={(r && phase >= PHASES && r.ok) || undefined}>
            <span>
              {r && phase >= PHASES && r.ok && <b className={s.tick} aria-hidden />}
              {c.opened}
            </span>
            <em className={s.num}>{r && phase >= PHASES ? fmtMs(r.open) : ''}</em>
          </div>
        </div>
      </figure>

      <div className={s.measured}>
        <p>
          <b>{c.measured}</b>
          {r && keys ? (
            <span className={s.num}>
              {c.keygen}: {fmtMs(keys.ms)} · {c.every}: <em>{fmtMs(every)}</em>
            </span>
          ) : (
            <span>{failed ? c.failed : busy ? c.preparing : ''}</span>
          )}
        </p>
        <button type="button" onClick={() => keys && run(keys, text || c.initial)} disabled={!keys || busy}>
          {c.run}
        </button>
      </div>
      <p className={s.caption}>{c.foot}</p>
    </div>
  );
}
