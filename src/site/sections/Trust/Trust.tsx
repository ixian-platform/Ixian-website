'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { gsap, prefersReducedMotion } from '@site/lib/motion';
import { trust } from '@site/content/homeV3';
import { Endpoint, Fingerprint, Glow, Glyph, Lock, No, Ok, Relay, Ends, route, flat, usePlayInView } from '@site/components/flat/Flat';
import SectionBoundary from '@site/components/SectionBoundary';
import Icon from '@site/components/Icon';
import { pin, usePinnedSteps, useMedia } from '@site/components/PinSteps';
import s from './Trust.module.css';

/* The real sender's message is accepted; the lookalike's is refused at the receiver.
   Plays once in view; reduced motion shows the end state. */

type Pt = [number, number];
type Box = { x: number; y: number; w: number; h: number };
type Layout = {
  W: number;
  H: number;
  real: Box;
  fake: Box;
  recv: Box;
  row1: number;
  row2: number;
  pReal: Pt[];
  pFake: Pt[];
  relayReal: Pt;
  relayFake: Pt;
  lock: Pt;
  stop: Pt;
};

const SEED_REAL = 5;
const SEED_FAKE = 17;

const WIDE: Layout = {
  W: 680,
  H: 380,
  real: { x: 40, y: 64, w: 196, h: 66 },
  fake: { x: 40, y: 250, w: 196, h: 66 },
  recv: { x: 446, y: 96, w: 224, h: 196 },
  row1: 196,
  row2: 252,
  pReal: [
    [236, 97],
    [334, 97],
    [334, 196],
    [446, 196],
  ],
  pFake: [
    [236, 283],
    [334, 283],
    [334, 252],
    [418, 252],
  ],
  relayReal: [334, 146],
  relayFake: [290, 283],
  lock: [396, 196],
  stop: [431, 252],
};
const TALL: Layout = {
  W: 400,
  H: 560,
  real: { x: 16, y: 44, w: 176, h: 66 },
  fake: { x: 208, y: 44, w: 176, h: 66 },
  recv: { x: 100, y: 330, w: 224, h: 196 },
  row1: 430,
  row2: 486,
  pReal: [
    [70, 110],
    [70, 430],
    [100, 430],
  ],
  pFake: [
    [362, 110],
    [362, 486],
    [344, 486],
  ],
  relayReal: [70, 240],
  relayFake: [362, 270],
  lock: [70, 340],
  stop: [336, 486],
};

const r2 = (n: number) => Math.round(n * 100) / 100;

/** the lookalike address with the characters that differ picked out */
function Diff({ a, b }: { a: string; b: string }) {
  return (
    <>
      {b.split('').map((ch, i) =>
        ch === a[i] ? (
          <tspan key={i}>{ch}</tspan>
        ) : (
          <tspan key={i} className={s.diffCh}>
            {ch}
          </tspan>
        )
      )}
    </>
  );
}

/** a message on the wire: the packet, with what it says riding above it */
function Msg({ text, ghost, gref }: { text: string; ghost?: boolean; gref: React.Ref<SVGGElement> }) {
  const w = Math.round(text.length * 5.7 + 22);
  return (
    <g ref={gref} opacity={0} className={s.fly}>
      <rect className={ghost ? flat.pillGhost : flat.pill} x={-w / 2} y={-32} width={w} height={20} rx={10} />
      <text className={`${flat.mono} ${ghost ? flat.pillGhostText : flat.pillText}`} x={0} y={-18.6} fontSize="9.5" textAnchor="middle">
        {text}
      </text>
      {!ghost && <rect className={flat.packetGlow} x={-9} y={-6} width={18} height={12} rx={4} />}
      <rect className={ghost ? flat.packetGhost : flat.packet} x={-5} y={-3} width={10} height={6} rx={2} />
    </g>
  );
}

export default function Trust() {
  const [sel, setSel] = useState(0);
  const [phase, setPhase] = useState(0); // 0 rest, 1 accepted, 2 refused too
  const [L, setL] = useState<Layout>(WIDE);
  const seen = useRef(false);
  const stage = useRef<HTMLDivElement>(null);
  const pReal = useRef<SVGPathElement>(null);
  const pFake = useRef<SVGPathElement>(null);
  const trace = useRef<SVGPathElement>(null);
  const gReal = useRef<SVGGElement>(null);
  const gFake = useRef<SVGGElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);
  const c = trust.cases[sel];
  /* phones: the cases ride in a PinSteps rail above the pinned drawing */
  const phone = useMedia('(max-width: 860px)');
  const pinOuter = useRef<HTMLDivElement>(null);
  const rail = useRef<HTMLDivElement>(null);
  const jump = usePinnedSteps({ enabled: phone, count: trust.cases.length, step: sel, setStep: setSel, outer: pinOuter, rail });
  const pick = (i: number) => {
    if (phone) jump(i);
    else setSel(i);
  };

  /* wide beside the tabs, tall on phones */
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 720px)');
    const on = () => setL(mq.matches ? TALL : WIDE);
    on();
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);

  const place = (g: SVGGElement | null, p: SVGPathElement | null, k: number) => {
    if (!g || !p) return;
    const pt = p.getPointAtLength(p.getTotalLength() * k);
    g.setAttribute('transform', `translate(${r2(pt.x)} ${r2(pt.y)})`);
  };

  const still = useCallback(() => {
    tl.current?.kill();
    gReal.current?.setAttribute('opacity', '0');
    gFake.current?.setAttribute('opacity', '0');
    if (trace.current) trace.current.style.strokeDashoffset = '0';
    setPhase(2);
  }, []);

  const play = useCallback(() => {
    seen.current = true;
    if (prefersReducedMotion()) return still();
    tl.current?.kill();
    setPhase(0);
    const tr = trace.current;
    if (tr) tr.style.strokeDashoffset = '1';
    const a = { k: 0 };
    const b = { k: 0 };
    place(gReal.current, pReal.current, 0);
    place(gFake.current, pFake.current, 0);
    tl.current = gsap
      .timeline()
      .set(gReal.current, { attr: { opacity: 1 } }, 0.25)
      .to(a, {
        k: 1,
        duration: 1.6,
        ease: 'power2.inOut',
        onUpdate: () => {
          place(gReal.current, pReal.current, a.k);
          if (tr) tr.style.strokeDashoffset = String(r2(1 - a.k));
        },
      })
      .to(gReal.current, { attr: { opacity: 0 }, duration: 0.25 })
      .call(() => setPhase(1), [], '<')
      .set(gFake.current, { attr: { opacity: 1 } }, '+=0.45')
      .to(b, { k: 1, duration: 1.4, ease: 'power2.inOut', onUpdate: () => place(gFake.current, pFake.current, b.k) })
      .call(() => setPhase(2))
      .to(gFake.current, { attr: { opacity: 0 }, duration: 0.5 }, '+=0.35');
  }, [still]);

  usePlayInView(stage, play, still);
  useEffect(() => () => void tl.current?.kill(), []);

  /* a new case or layout replays once the drawing has been seen */
  useEffect(() => {
    if (seen.current) play();
  }, [sel, L, play]);

  const onKey = (e: React.KeyboardEvent) => {
    let step = 0;
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') step = 1;
    if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') step = -1;
    if (!step) return;
    e.preventDefault();
    const n = (sel + step + trust.cases.length) % trust.cases.length;
    setSel(n);
    (e.currentTarget.querySelectorAll('button')[n] as HTMLButtonElement | undefined)?.focus();
  };

  const { real, fake, recv } = L;
  const dReal = route(L.pReal);
  const dFake = route(L.pFake);
  const label = `${trust.example}. ${c.from.name} sends “${c.msg}” to ${c.to.name}. The signature matches the key it trusts: ${c.ok} A lookalike address sends “${c.fakeMsg}”: ${c.no}`;

  return (
    <section id="trust" className={s.trust} aria-labelledby="trust-title">
      <SectionBoundary />
      <div className={s.wrap}>
        <header className={s.intro}>
          <h2 id="trust-title" className={s.title} data-reveal data-reveal-delay="0.24">
            {trust.title}
          </h2>
          <p className={s.lead} data-reveal>
            {trust.lead}
          </p>
        </header>

        <div ref={pinOuter} className={pin.outer} style={{ '--n': trust.cases.length } as React.CSSProperties}>
        <div className={pin.inner}>
        <div ref={rail} className={pin.rail} aria-label={trust.label}>
          {trust.cases.map((k, i) => (
            <button key={k.id} type="button" className={pin.card} data-on={i === sel || undefined} onClick={() => pick(i)} aria-pressed={i === sel}>
              <span className={pin.cardHead}>
                <span className={pin.cardNo}>0{i + 1}</span>
                <span className={pin.cardName}>{k.tab}</span>
              </span>
              <span className={pin.cardText}>{k.short}</span>
            </button>
          ))}
        </div>
        <div className={s.body} data-reveal data-reveal-delay="0.2">
          <div className={s.tabs} role="tablist" aria-label={trust.label} aria-orientation="vertical" onKeyDown={onKey}>
            {trust.cases.map((k, i) => (
              <button key={k.id} type="button" role="tab" id={`trust-tab-${k.id}`} aria-selected={i === sel} aria-controls="trust-stage" tabIndex={i === sel ? 0 : -1} className={s.tab} onClick={() => setSel(i)}>
                <span className={s.tabNo}>0{i + 1}</span>
                <span className={s.tabName}>{k.tab}</span>
                <span className={s.tabWhy}>
                  <span>{k.why}</span>
                </span>
              </button>
            ))}
          </div>

          <div ref={stage} className={`${flat.well} ${s.stage}`} id="trust-stage" role="tabpanel" aria-labelledby={`trust-tab-${c.id}`}>
            <div className={s.stageBar}>
              <span>{trust.example}</span>
              <button type="button" className={s.replay} onClick={play}>
                {trust.replay}
              </button>
            </div>
            <svg viewBox={`0 0 ${L.W} ${L.H}`} className={flat.svg} fill="none" role="img" aria-label={label}>
              <Glow id="ixTrustGlow" cx={recv.x + recv.w / 2} cy={recv.y + recv.h / 2} rx={230} ry={180} o={phase >= 1 ? 0.14 : 0.08} />

              {/* the wiring: the real route is live, the lookalike's is faint */}
              <path ref={pReal} className={flat.wire} d={dReal} />
              <path className={`${flat.live} ${phase >= 1 ? flat.liveOn : ''}`} d={dReal} />
              <path ref={trace} className={flat.trace} d={dReal} pathLength={1} strokeDasharray="1" strokeDashoffset="1" />
              <path ref={pFake} className={flat.faint} d={dFake} stroke="rgba(243, 247, 244, 0.22)" strokeDasharray="3 4" />
              <Ends pts={[L.pReal[0], L.pFake[0]]} />
              <Relay x={L.relayReal[0]} y={L.relayReal[1]} />
              <Relay x={L.relayFake[0]} y={L.relayFake[1]} />
              <Lock x={L.lock[0]} y={L.lock[1]} />

              {/* the two senders */}
              <text className={flat.caps} x={real.x} y={real.y - 16} fontSize="9">
                {trust.real.toUpperCase()}
              </text>
              <Endpoint {...real} glyph={c.from.glyph} name={c.from.name} addr={trust.addr.real} seed={SEED_REAL} />
              <text className={flat.caps} x={fake.x} y={fake.y - 16} fontSize="9">
                {trust.fake.toUpperCase()}
              </text>
              <Endpoint {...fake} ghost glyph={c.from.glyph} name={`“${c.from.name}”`} addr={<Diff a={trust.addr.real} b={trust.addr.fake} />} seed={SEED_FAKE} />

              {/* the receiver: the key it trusts, and what it made of each message */}
              <rect className={flat.tray} x={recv.x - 8} y={recv.y - 8} width={recv.w + 16} height={recv.h + 16} rx={14} />
              <rect className={`${flat.cardKey} ${phase >= 1 ? flat.cardKeyOn : ''}`} x={recv.x} y={recv.y} width={recv.w} height={recv.h} rx={10} />
              <Glyph name={c.to.glyph} x={recv.x + 14} y={recv.y + 14} size={18} />
              <text className={`${flat.sans} ${flat.bright}`} x={recv.x + 40} y={recv.y + 27} fontSize="12.5" fontWeight={600}>
                {c.to.name}
              </text>
              <path d={`M${recv.x + 14} ${recv.y + 44} H${recv.x + recv.w - 14}`} stroke="rgba(243, 247, 244, 0.06)" />
              <text className={flat.caps} x={recv.x + 14} y={recv.y + 66} fontSize="8.5">
                {trust.trusts.toUpperCase()}
              </text>
              <Fingerprint x={recv.x + 66} y={recv.y + 53} seed={SEED_REAL} n={3} cell={4.2} gap={1.2} pad={3.5} />
              <text className={`${flat.mono} ${flat.addr}`} x={recv.x + 96} y={recv.y + 66} fontSize="9">
                {trust.addr.real}
              </text>
              <path d={`M${recv.x + 14} ${recv.y + 82} H${recv.x + recv.w - 14}`} stroke="rgba(243, 247, 244, 0.06)" />

              <g className={flat.show} data-on={phase >= 1 || undefined}>
                <Ok x={recv.x + 20} y={L.row1} />
                <text className={`${flat.sans} ${flat.bright}`} x={recv.x + 34} y={L.row1 + 4} fontSize="11" fontWeight={500}>
                  {c.ok}
                </text>
                <Fingerprint x={recv.x + 34} y={L.row1 + 11} seed={SEED_REAL} n={3} cell={3} gap={0.9} pad={0} bare />
                <text className={`${flat.mono} ${flat.dim}`} x={recv.x + 50} y={L.row1 + 20} fontSize="8.5">
                  {trust.signed} {trust.addr.real}
                </text>
              </g>
              <g className={flat.show} data-on={phase >= 2 || undefined}>
                <No x={recv.x + 20} y={L.row2} />
                <text className={`${flat.sans} ${flat.addr}`} x={recv.x + 34} y={L.row2 + 4} fontSize="11">
                  {c.no}
                </text>
                <Fingerprint x={recv.x + 34} y={L.row2 + 11} seed={SEED_FAKE} n={3} cell={3} gap={0.9} pad={0} bare dim />
                <text className={`${flat.mono} ${flat.dim} ${s.struck}`} x={recv.x + 50} y={L.row2 + 20} fontSize="8.5">
                  {trust.signed} <Diff a={trust.addr.real} b={trust.addr.fake} />
                </text>
              </g>
              {/* where the lookalike's message stops */}
              <g className={flat.show} data-on={phase >= 2 || undefined}>
                <No x={L.stop[0]} y={L.stop[1]} />
              </g>

              <Msg gref={gReal} text={c.msg} />
              <Msg gref={gFake} text={c.fakeMsg} ghost />
            </svg>
          </div>
        </div>
        </div>
        </div>

        <div className={s.foot} data-reveal>
          {trust.note && <p>{trust.note}</p>}
          <span className={s.links}>
            {trust.links.map((l) => (
              <a key={l.href} href={l.href} target="_blank" rel="noreferrer">
                {l.label}
                <Icon name="external" size={13} />
              </a>
            ))}
          </span>
        </div>
      </div>
    </section>
  );
}
