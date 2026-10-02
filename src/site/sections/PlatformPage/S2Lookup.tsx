'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { sha3_512 } from '@noble/hashes/sha3.js';
import { base58Decode, hex } from '@site/lib/sha3';
import { useNetworkPulse } from '@site/lib/useNetworkPulse';
import { prefersReducedMotion, useInView } from '@site/lib/motion';
import Scramble from '@site/components/Scramble';
import { s2, s2Map, s2Trace as c } from '@site/content/platform';
import s from './S2.module.css';

/* The sector is the first 10 bytes of SHA3-512 over the address without its checksum.
   Reduced motion and no JavaScript show every stage resolved. */

const STAGE_MS = 520;
const SERVE = 7;
const STAGES = 6; // address, hash, sector, relays, presence, connect

function compute(input: string) {
  const bytes = base58Decode(input.trim());
  if (!bytes || bytes.length < 20) return null;
  const t0 = performance.now();
  const digest = sha3_512(bytes.slice(0, bytes.length - 3)); // without the checksum
  return { digest, ms: performance.now() - t0 };
}
const short = (a: string) => (a.length > 22 ? `${a.slice(0, 10)}…${a.slice(-8)}` : a);
const fmtMs = (n: number) => (n < 0.1 ? '<0.1 ms' : `${n.toFixed(1)} ms`);
const group = (h: string) => h.match(/.{1,4}/g)!.join(' ');

export default function S2Lookup() {
  const copy = s2.lookup;
  const pulse = useNetworkPulse();
  const R = pulse.s2;
  const [value, setValue] = useState(copy.example.value);
  const [origin, setOrigin] = useState<'example' | 'generated' | 'typed'>('example');
  const [busy, setBusy] = useState(false);
  const [client, setClient] = useState(false);
  useEffect(() => setClient(true), []);
  const res = useMemo(() => compute(value), [value]);
  const last = useRef(res ?? compute(copy.example.value)!);
  if (res) last.current = res;
  const hx = hex(last.current.digest);
  const sector = hx.slice(0, 20);

  // which of the live relays are drawn serving this sector: the SERVE nearest its position
  const serving = useMemo(() => {
    if (!R) return new Set<number>();
    const pos = parseInt(sector.slice(0, 4), 16) / 65536;
    const dist = (i: number) => {
      const d = Math.abs((i + 0.5) / R - pos);
      return Math.min(d, 1 - d);
    };
    return new Set([...Array(R).keys()].sort((a, b) => dist(a) - dist(b)).slice(0, Math.min(SERVE, R)));
  }, [R, sector]);

  // one run per address, and once on first view
  const root = useRef<HTMLDivElement>(null);
  const seen = useInView(root, { once: true, margin: '0px 0px -25% 0px' });
  const [stage, setStage] = useState(STAGES); // STAGES = at rest, all resolved
  const [run, setRun] = useState(0);
  const timers = useRef<number[]>([]);
  useEffect(() => {
    timers.current.forEach(clearTimeout);
    if (!seen || prefersReducedMotion()) return setStage(STAGES);
    setStage(1);
    timers.current = Array.from({ length: STAGES - 1 }, (_, i) => window.setTimeout(() => setStage(i + 2), (i + 1) * STAGE_MS));
    return () => timers.current.forEach(clearTimeout);
  }, [seen, run]);
  const again = () => setRun((r) => r + 1);

  const onInput = (v: string) => {
    setValue(v);
    setOrigin('typed');
    if (compute(v)) again();
  };
  const generate = async () => {
    setBusy(true);
    try {
      const { createIdentity } = await import('@site/lib/ixianAddress');
      const id = await createIdentity();
      setValue(id.address);
      setOrigin('generated');
      again();
    } catch {
      /* the example stays */
    } finally {
      setBusy(false);
    }
  };
  const on = (k: number) => stage > k || undefined;
  const now = (k: number) => stage === k + 1 || undefined;

  return (
    <div ref={root} className={s.lookup}>
      <div className={s.space}>
        <p className={s.spaceNum} aria-label="2 to the power of 80">
          2<sup>80</sup>
        </p>
        <p className={s.spaceLabel}>{c.big.label}</p>
        <p className={s.spaceBody}>{c.big.body}</p>
      </div>

      <div className={s.trace} style={{ ['--prog' as string]: Math.min(1, stage / STAGES) }}>
        <div className={s.track}>
        <div className={s.rail} aria-hidden>
          <i />
        </div>
        <ol>
          <li className={s.row} data-on>
            <span className={s.k}>{c.rows.address}</span>
            <span className={s.node} aria-hidden />
            <div className={s.v}>
              <input
                className={s.input}
                value={value}
                onChange={(e) => onInput(e.target.value)}
                aria-label={copy.label}
                aria-invalid={!res || undefined}
                spellCheck={false}
                autoComplete="off"
              />
              <div className={s.chips}>
                <button type="button" onClick={() => { setValue(copy.example.value); setOrigin('example'); again(); }} data-on={origin === 'example' || undefined}>
                  {copy.example.label}
                </button>
                <button type="button" onClick={generate} disabled={busy} data-on={origin === 'generated' || undefined}>
                  {busy ? s2Map.generate.busy : s2Map.generate.label}
                </button>
              </div>
              <small className={s.note} aria-live="polite">
                {!res ? copy.invalid : origin === 'generated' ? s2Map.generate.note : origin === 'example' ? copy.example.note : copy.computed}
              </small>
            </div>
          </li>

          <li className={s.row} data-on={on(1)} data-now={now(1)}>
            <span className={s.k}>{c.rows.hash}</span>
            <span className={s.node} aria-hidden />
            <div className={s.v}>
              <code className={s.hash}>
                <Scramble key={`h${run}`} text={hx.slice(0, 48)} idle={hx.slice(0, 48)} active={stage > 1} duration={500} />…
              </code>
              <small className={s.note}>{client ? `${fmtMs(last.current.ms)} ${c.notes.hash}` : c.notes.hash}</small>
            </div>
          </li>

          <li className={s.row} data-on={on(2)} data-now={now(2)}>
            <span className={s.k}>{c.rows.sector}</span>
            <span className={s.node} aria-hidden />
            <div className={s.v}>
              <code className={s.sector}>
                <Scramble key={`s${run}`} text={group(sector)} idle={group(sector)} active={stage > 2} duration={600} />
              </code>
              <small className={s.note}>{c.notes.sector}</small>
            </div>
          </li>

          <li className={s.row} data-on={on(3)} data-now={now(3)}>
            <span className={s.k}>{c.rows.relays}</span>
            <span className={s.node} aria-hidden />
            <div className={s.v}>
              <span className={s.relays} aria-hidden={R ? true : undefined}>
                {R
                  ? Array.from({ length: R }, (_, i) => <i key={i} data-serve={serving.has(i) || undefined} style={{ transitionDelay: `${i * 30}ms` }} />)
                  : <em>{s2Map.relays.reading}</em>}
              </span>
              <small className={s.note}>{R ? c.notes.relays(serving.size, R) : ''}</small>
            </div>
          </li>

          <li className={s.row} data-on={on(4)} data-now={now(4)}>
            <span className={s.k}>{c.rows.presence}</span>
            <span className={s.node} aria-hidden />
            <div className={s.v}>
              <span className={s.ok}>
                <b className={s.tick} aria-hidden /> {short(value.trim())}
              </span>
              <small className={s.note}>{c.notes.presence}</small>
            </div>
          </li>

          <li className={s.row} data-on={on(5)} data-now={now(5)} data-last>
            <span className={s.k}>{c.rows.connect}</span>
            <span className={s.node} aria-hidden />
            <div className={s.v}>
              <span className={s.link} aria-hidden>
                <b />
                <i />
                <b data-far />
              </span>
              <small className={s.note}>{c.notes.connect}</small>
            </div>
          </li>
        </ol>
        </div>
        <div className={s.traceFoot}>
          <p>{c.caption}</p>
          <button type="button" onClick={again}>
            {c.replay}
          </button>
        </div>
      </div>
    </div>
  );
}
