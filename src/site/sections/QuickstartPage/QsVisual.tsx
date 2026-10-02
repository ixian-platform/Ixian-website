'use client';

import { useEffect, useRef, useState } from 'react';
import { prefersReducedMotion } from '@site/lib/motion';
import { Fingerprint, Lock, Ok } from '@site/sections/Build/visuals/flatParts';
import f from '@site/sections/Build/visuals/flat.module.css';
import s from './QsVisual.module.css';

/* Each drawing plays once when in view (and on Replay); reduced motion shows the end state. */

type Mode = 'send' | 'pair' | 'phone' | 'phonePair';

const QX_ADDR = '4hLm…c7Rq'; // QuIXI's, drawn
const ME_ADDR = '1BvK…m9fQ'; // the phone's, drawn

function Phone({ x, y, mode }: { x: number; y: number; mode: Mode }) {
  const W = 150;
  const H = 300;
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect className={f.tray} x={-8} y={-8} width={W + 16} height={H + 16} rx={22} />
      <rect className={f.card} x={0} y={0} width={W} height={H} rx={18} />
      <rect x={W / 2 - 16} y={9} width={32} height={4} rx={2} fill="rgba(243, 247, 244, 0.14)" />
      {/* chat header: QuIXI's key and address */}
      <Fingerprint x={12} y={26} seed={41} n={3} cell={4} gap={1.2} />
      <text className={`${f.mono} ${s.addr}`} x={40} y={39}>
        {QX_ADDR}
      </text>
      <path className={f.quiet} d={`M0 58H${W}`} />
      {mode === 'pair' ? (
        <g className={s.request}>
          {/* the request card */}
          <rect className={s.reqCard} x={14} y={96} width={W - 28} height={118} rx={10} />
          <Fingerprint x={W / 2 - 13} y={110} seed={41} n={3} cell={6} gap={1.6} />
          <rect className={f.chip} x={34} y={152} width={W - 68} height={5} rx={2.5} />
          <rect className={f.chip} x={48} y={163} width={W - 96} height={5} rx={2.5} />
          <g className={s.decline}>
            <circle cx={W / 2 - 24} cy={192} r={11} className={s.btnGhost} />
            <path d={`M${W / 2 - 28} 188l8 8M${W / 2 - 20} 188l-8 8`} className={s.btnMark} />
          </g>
          <g className={s.accept}>
            <circle cx={W / 2 + 24} cy={192} r={11} className={s.btnSolid} />
            <path d={`M${W / 2 + 19.5} 192.2l3 3 5.6-6`} className={s.btnMarkDark} />
          </g>
          {/* the tap */}
          <circle className={s.tap} cx={W / 2 + 24} cy={192} r={11} />
          {/* added: the card gives way to a check */}
          <g className={s.added}>
            <rect className={s.reqCard} x={14} y={128} width={W - 28} height={40} rx={10} />
            <Fingerprint x={24} y={137} seed={41} n={3} cell={4} gap={1.2} />
            <text className={`${f.mono} ${s.addr}`} x={52} y={151}>
              {QX_ADDR}
            </text>
            <Ok x={W - 30} y={148} />
          </g>
        </g>
      ) : (
        <g>
          {/* earlier lines of the thread, quiet */}
          <rect className={s.bubbleOut} x={W - 88} y={82} width={74} height={22} rx={8} />
          <rect className={s.bubbleIn} x={14} y={114} width={92} height={22} rx={8} />
          {/* the new message lands */}
          <g className={s.landing}>
            <rect className={s.bubbleNew} x={14} y={H - 86} width={104} height={34} rx={9} />
            <rect className={s.bar} x={24} y={H - 76} width={70} height={4.5} rx={2.2} />
            <rect className={s.bar} x={24} y={H - 66} width={48} height={4.5} rx={2.2} />
          </g>
          <g className={s.read}>
            <Ok x={128} y={H - 69} />
          </g>
        </g>
      )}
      <rect className={f.chip} x={12} y={H - 30} width={W - 24} height={18} rx={9} />
    </g>
  );
}

function Computer({ x, y }: { x: number; y: number }) {
  // a terminal card: prompt and three lines
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect className={f.tray} x={-8} y={-8} width={196} height={146} rx={10} />
      <rect className={`${f.card} ${s.senderCard}`} x={0} y={0} width={180} height={130} rx={6} />
      <path className={f.quiet} d="M0 22H180" />
      <circle cx={12} cy={11} r={2.5} fill="rgba(243, 247, 244, 0.16)" />
      <circle cx={21} cy={11} r={2.5} fill="rgba(243, 247, 244, 0.1)" />
      <circle cx={30} cy={11} r={2.5} fill="rgba(243, 247, 244, 0.07)" />
      <path d="M14 40l6 4-6 4" className={s.prompt} />
      <rect className={s.typed} x={26} y={41.5} width={112} height={5} rx={2.5} />
      <rect className={`${f.chip} ${s.senderLine}`} x={14} y={60} width={130} height={4.5} rx={2.2} />
      <rect className={`${f.chip} ${s.senderLine}`} x={14} y={72} width={96} height={4.5} rx={2.2} />
      <rect className={`${f.chip} ${s.senderLine}`} x={14} y={84} width={118} height={4.5} rx={2.2} />
      <Fingerprint x={14} y={100} seed={41} n={3} cell={4} gap={1.2} />
      <text className={`${f.mono} ${s.addr}`} x={42} y={113}>
        {QX_ADDR}
      </text>
    </g>
  );
}

export default function QsVisual({ mode, label, bare, backdrop }: { mode: Mode; label: string; bare?: boolean; backdrop?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const [play, setPlay] = useState(0); // 0 = still (the start), n = nth play
  const [still, setStill] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion()) {
      setStill(true);
      return;
    }
    const io = new IntersectionObserver(
      ([en]) => {
        if (en.intersectionRatio > 0.55) {
          setPlay((p) => (p === 0 ? 1 : p));
          io.disconnect();
        }
      },
      { threshold: [0, 0.55, 1] }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const phoneOnly = mode === 'phone' || mode === 'phonePair';
  const vb = phoneOnly ? '0 0 260 340' : mode === 'pair' ? '-200 -10 1040 420' : backdrop ? '0 0 760 400' : '0 0 640 400';
  return (
    <div ref={ref} className={s.wrap} data-mode={mode === 'phonePair' ? 'pair' : mode} data-bare={bare || undefined} data-backdrop={backdrop || undefined}>
      <svg
        key={play}
        className={s.svg}
        viewBox={vb}
        role={label ? 'img' : undefined}
        aria-label={label || undefined}
        data-play={play > 0 || undefined}
        data-still={still || undefined}
      >
        {phoneOnly ? (
          <Phone x={55} y={20} mode={mode === 'phonePair' ? 'pair' : 'send'} />
        ) : (
          <>
            {/* the sender is drawn larger so it reads first */}
            <g transform="translate(130 200) scale(1.2) translate(-130 -200)" className={s.sender}>
              <Computer x={40} y={135} />
            </g>
            {/* the route: computer → phone, its address riding on it */}
            <path className={f.wire} d="M242 200H440" />
            <path className={s.route} d="M242 200H440" pathLength={1} />
            <g className={s.packet}>
              <rect className={mode === 'pair' ? s.pktKey : s.pkt} x={-6} y={-4} width={12} height={8} rx={2} />
            </g>
            <Lock x={334} y={200} />
            <text className={`${f.mono} ${s.to}`} x={334} y={224} textAnchor="middle">
              {ME_ADDR}
            </text>
            <Phone x={458} y={50} mode={mode} />
          </>
        )}
      </svg>
      {!still && !backdrop && (
        <button type="button" className={s.replay} onClick={() => setPlay((p) => p + 1)} aria-label="Replay the drawing">
          <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden>
            <path d="M4 12a8 8 0 1 0 2.4-5.7M4 4v4.5h4.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      )}
    </div>
  );
}
