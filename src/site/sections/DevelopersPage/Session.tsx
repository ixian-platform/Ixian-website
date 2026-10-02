'use client';

import { useEffect, useRef, useState } from 'react';
import { prefersReducedMotion } from '@site/lib/motion';
import { Endpoint, Fingerprint, Glow, Lock, Relay, route, flat } from '@site/components/flat/Flat';
import s from './Session.module.css';
import { useMedia } from '@site/components/PinSteps';

/* Typed terminal session; each command reveals its part of the drawing.
   Hover pauses; reduced motion shows the finished state. */

export type SessionStep = { cmd: string; out: string; show: string[] };
type Copy = { title: string; note: string; replay: string; copy: string; copied: string; steps: SessionStep[]; parts: Record<string, string> };

const CPS = 46; // characters per second
const HOLD = 900; // after each output line
const END = 5200; // before the loop restarts

export default function Session({ copy }: { copy: Copy }) {
  const steps = copy.steps;
  const [i, setI] = useState(steps.length); // SSR and reduced motion: finished
  const [n, setN] = useState(0); // characters typed of steps[i]
  const [outOn, setOutOn] = useState(false);
  const [run, setRun] = useState(0);
  const [copied, setCopied] = useState(false);
  const paused = useRef(false);
  const box = useRef<HTMLDivElement>(null);
  const reduced = useRef(true);
  // phones: the drawing crops to the local machine
  const phone = useMedia('(max-width: 640px)');

  useEffect(() => {
    reduced.current = prefersReducedMotion();
    if (reduced.current) return;
    const el = box.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        setRun((r) => r + 1);
        io.disconnect();
      }
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // the typing loop
  useEffect(() => {
    if (run === 0 || reduced.current) return;
    let step = 0;
    let chars = 0;
    let timer = 0;
    let last = performance.now();
    let raf = 0;
    setI(0);
    setN(0);
    setOutOn(false);
    const type = (now: number) => {
      const dt = now - last;
      last = now;
      if (!paused.current) chars += (dt / 1000) * CPS;
      const full = steps[step].cmd.length;
      setN(Math.min(full, Math.floor(chars)));
      if (chars >= full) {
        setOutOn(true);
        timer = window.setTimeout(() => {
          step += 1;
          if (step >= steps.length) {
            setI(steps.length);
            timer = window.setTimeout(() => setRun((r) => r + 1), END);
            return;
          }
          chars = 0;
          setI(step);
          setN(0);
          setOutOn(false);
          last = performance.now();
          raf = requestAnimationFrame(type);
        }, HOLD + steps[step].out.length * 8);
        return;
      }
      raf = requestAnimationFrame(type);
    };
    raf = requestAnimationFrame(type);
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(timer);
    };
  }, [run, steps]);

  // which parts of the drawing are on
  const on = new Set<string>();
  steps.forEach((st, k) => {
    if (k < i || (k === i && outOn)) st.show.forEach((x) => on.add(x));
  });
  const has = (x: string) => on.has(x) || undefined;
  // parts no step uses are not drawn at all
  const used = new Set(steps.flatMap((st) => st.show));
  const drawn = (x: string) => (used.has(x) ? undefined : 'none');

  const doCopy = async () => {
    try {
      await navigator.clipboard.writeText(steps.map((st) => st.cmd).join('\n'));
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      /* no clipboard */
    }
  };

  return (
    <figure
      ref={box}
      className={s.session}
      onMouseEnter={() => (paused.current = true)}
      onMouseLeave={() => (paused.current = false)}
      aria-label={copy.title}
    >
      <figcaption className={s.bar}>
        <span className={s.title}>{copy.title}</span>
        <button type="button" onClick={() => setRun((r) => r + 1)} className={s.ctl}>
          {copy.replay}
        </button>
        <button type="button" onClick={doCopy} className={s.ctl}>
          <span aria-live="polite">{copied ? copy.copied : copy.copy}</span>
        </button>
      </figcaption>

      <div className={s.term}>
        <pre aria-hidden>
          {steps.map((st, k) => {
            if (k > i) return null;
            const typing = k === i;
            const text = typing ? st.cmd.slice(0, n) : st.cmd;
            return (
              <span key={k} className={s.block}>
                <span className={s.line}>
                  <span className={s.prompt}>$ </span>
                  {text}
                  {typing && !outOn && <span className={s.caret} />}
                </span>
                {(!typing || outOn) && <span className={s.out}>→ {st.out}</span>}
              </span>
            );
          })}
          {i >= steps.length && (
            <span className={s.line}>
              <span className={s.prompt}>$ </span>
              <span className={s.caret} />
            </span>
          )}
        </pre>
        <ol className="ix-sr">
          {steps.map((st) => (
            <li key={st.cmd}>
              {st.cmd}: {st.out}
            </li>
          ))}
        </ol>
      </div>

      <div className={`${flat.well} ${s.net}`} aria-hidden>
        <svg viewBox={phone ? '6 8 556 186' : '0 0 720 200'} className={`${flat.svg} ${s.svg}`} fill="none">
          <Glow id="ixSessionGlow" cx={300} cy={100} rx={300} ry={130} o={0.08} />
          {/* your machine: a tray */}
          <rect className={flat.tray} x={14} y={16} width={540} height={170} rx={14} />
          <text className={flat.caps} x={32} y={38} fontSize="8.5">
            {copy.parts.machine.toUpperCase()}
          </text>

          {/* wiring */}
          <path className={flat.wire} d="M132 80 H168 V140 H132 M168 110 H214" />
          <path className={`${flat.wire} ${s.fpart}`} data-on={has('dlt')} d="M132 80 H168 V140 H132 M168 110 H214" stroke="rgba(92, 201, 109, 0.45)" />
          <path className={flat.wire} d="M226 110 H262 M274 110 H310" />
          <path className={flat.wire} d={route([[316, 110], [356, 110], [356, 72], [396, 72]])} />
          <path className={flat.wire} display={drawn('quixi')} d={route([[356, 110], [356, 146], [396, 146]])} />
          <path className={`${flat.live} ${s.fpart}`} data-on={has('explorer')} d={route([[316, 110], [356, 110], [356, 72], [396, 72]])} />
          <path className={`${flat.live} ${s.fpart}`} data-on={has('quixi')} display={drawn('quixi')} d={route([[356, 110], [356, 146], [396, 146]])} />

          {/* the sandbox's two DLT nodes */}
          <g className={s.fpart} data-on={has('dlt')}>
            {[60, 120].map((y, k) => (
              <g key={y}>
                <rect className={flat.card} x={36} y={y} width={96} height={40} rx={6} />
                <circle className={flat.dlt} cx={52} cy={y + 20} r={3.2} />
                <text className={`${flat.sans} ${flat.bright}`} x={64} y={y + 24} fontSize="11" fontWeight={600}>
                  DLT {k + 1}
                </text>
              </g>
            ))}
          </g>
          {/* S2 relays */}
          <g className={s.fpart} data-on={has('s2')}>
            <Relay x={220} y={110} />
            <Relay x={268} y={110} />
            <Relay x={316} y={110} />
            <text className={flat.caps} x={268} y={140} fontSize="8.5" textAnchor="middle">
              S2
            </text>
          </g>
          {/* the explorer: blocks as they arrive */}
          <g className={s.fpart} data-on={has('explorer')}>
            <rect className={flat.card} x={396} y={44} width={140} height={56} rx={6} />
            <text className={`${flat.sans} ${flat.addr}`} x={410} y={64} fontSize="10.5">
              {copy.parts.explorer}
            </text>
            {[0, 1, 2, 3, 4, 5, 6].map((k) => (
              <rect key={k} className={k === 6 ? flat.cell : flat.chip} x={410 + k * 17} y={74} width={13} height={13} rx={2.5} opacity={k === 6 ? 0.85 : 1} />
            ))}
          </g>
          {/* QuIXI joins: its own key and port */}
          <g className={s.fpart} data-on={has('quixi')} display={drawn('quixi')}>
            <rect className={flat.cardKey} x={396} y={120} width={140} height={52} rx={8} />
            <Fingerprint x={406} y={128} seed={7} n={5} cell={5.2} gap={1} pad={3} />
            <text className={`${flat.sans} ${flat.bright}`} x={450} y={143} fontSize="12" fontWeight={600}>
              QuIXI
            </text>
            <text className={`${flat.mono} ${flat.dim}`} x={450} y={160} fontSize="9">
              :8001
            </text>
          </g>
          {/* the first message, sealed, to another address */}
          <g className={s.fpart} data-on={has('send')} display={phone ? 'none' : drawn('send')}>
            <path className={flat.wire} d="M536 146 H604" />
            <path className={`${flat.trace} ${s.route}`} data-on={has('send')} d="M536 146 H604" pathLength={1} />
            <Relay x={560} y={146} size={11} />
            <Lock x={584} y={146} />
            <Endpoint x={604} y={122} w={104} h={48} glyph="agent" addr={copy.parts.address} seed={17} tray={false} />
          </g>
        </svg>
      </div>
      <p className={s.note}>{copy.note}</p>
    </figure>
  );
}
