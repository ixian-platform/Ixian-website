'use client';

import { useCallback, useRef, useState } from 'react';
import { gsap, prefersReducedMotion } from '@site/lib/motion';
import { Fingerprint, Ok, Lock, Packet } from './flatParts';
import s from './flat.module.css';

// Interactive: clicking a cell syncs it to each phone; reduced motion skips the travel.

const W = 640;
const H = 480;
const APP = { x: 218, y: 136, w: 212, h: 188 };
const PH = { w: 54, h: 92 };
const A = { x: 70, y: 226 };
const B = { x: 520, y: 110 };
const C = { x: 500, y: 316 };
const K = 12;
const COLS = 4;
const ROWS = 3;
const START = ['0-0', '1-1', '2-1', '1-2'];
const HINT = '3-0';

type Who = 'a' | 'b' | 'c';
const WHO: Who[] = ['a', 'b', 'c'];

// the widget → each phone
const aY = A.y + 40;
const bY = B.y + 44;
const cY = C.y + 44;
const exX = APP.x + APP.w - 40;
const PATH: Record<Who, string> = {
  a: `M${APP.x} ${aY} H${A.x + PH.w}`,
  b: `M${APP.x + APP.w} ${bY} H${B.x}`,
  c: `M${exX} ${APP.y + APP.h} V${cY - K} Q${exX} ${cY} ${exX + K} ${cY} H${C.x}`,
};
const APP_GLYPH = 'M4.5 4.5h6v6h-6zM13.5 4.5h6v6h-6zM4.5 13.5h6v6h-6zM13.5 13.5h6v6h-6z';
const CODE = 'M8.5 7.5L4 12l4.5 4.5M15.5 7.5L20 12l-4.5 4.5M13.5 5.5l-3 13';

const cellsOf = () => {
  const out: [number, number][] = [];
  for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) out.push([c, r]);
  return out;
};

function MiniBoard({ x, y, on }: { x: number; y: number; on: Set<string> }) {
  return (
    <g>
      {cellsOf().map(([c, r]) => {
        const k = `${c}-${r}`;
        const px = x + c * 9;
        const py = y + r * 9;
        return (
          <g key={k}>
            <rect className={s.chip} x={px} y={py} width={7} height={7} rx={1.5} />
            {on.has(k) && <rect className={s.cell} x={px} y={py} width={7} height={7} rx={1.5} opacity={0.7} />}
          </g>
        );
      })}
    </g>
  );
}

function Phone({ x, y, seed, addr, who, on, quiet }: { x: number; y: number; seed: number; addr: string; who: Who; on: Set<string>; quiet?: boolean }) {
  return (
    <g opacity={quiet ? 0.82 : 1}>
      <rect className={s.tray} x={x - 6} y={y - 6} width={PH.w + 12} height={PH.h + 12} rx={13} />
      <rect className={s.card} x={x} y={y} width={PH.w} height={PH.h} rx={9} />
      <rect className={s.outline} data-end={who} x={x} y={y} width={PH.w} height={PH.h} rx={9} />
      <rect x={x + 21} y={y + 6} width={12} height={2.5} rx={1.25} fill="rgba(243, 247, 244, 0.14)" />
      <MiniBoard x={x + 9} y={y + 20} on={on} />
      <rect className={s.chip} x={x + 9} y={y + 56} width={36} height={4} rx={2} />
      <rect className={s.chip} x={x + 9} y={y + 65} width={24} height={4} rx={2} />
      <Fingerprint x={x + PH.w + 10} y={y + 4} seed={seed} n={3} cell={4} gap={1.2} />
      <text className={`${s.mono} ${s.dim}`} x={x + PH.w / 2} y={y + PH.h + 20} textAnchor="middle" fontSize="9.5">
        {addr}
      </text>
    </g>
  );
}

export default function MiniAppVisual() {
  const root = useRef<HTMLDivElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);
  const [app, setApp] = useState(() => new Set(START));
  const [phones, setPhones] = useState<Record<Who, Set<string>>>(() => ({ a: new Set(START), b: new Set(START), c: new Set(START) }));
  const [synced, setSynced] = useState<Record<Who, boolean>>({ a: true, b: true, c: true });

  const flip = useCallback(
    (k: string) => {
      const el = root.current;
      if (!el) return;
      const next = new Set(app);
      if (next.has(k)) next.delete(k);
      else next.add(k);
      setApp(next);
      tl.current?.progress(1).kill();
      const arrive = (who: Who) => {
        setPhones((p) => ({ ...p, [who]: new Set(next) }));
        setSynced((v) => ({ ...v, [who]: true }));
      };
      setSynced({ a: false, b: false, c: false });
      const q = gsap.utils.selector(el);
      gsap.fromTo(q(`[data-ripple="${k}"]`), { opacity: 0.9, scale: 1 }, { opacity: 0, scale: 1.5, duration: 0.6, ease: 'expo.out', transformOrigin: '50% 50%' });
      if (prefersReducedMotion()) {
        WHO.forEach(arrive);
        return;
      }
      const t = gsap.timeline();
      tl.current = t;
      WHO.forEach((who, i) => {
        const p = el.querySelector<SVGPathElement>(`[data-motion="${who}"]`)!;
        const pkt = q(`[data-packet="${who}"]`);
        const at = 0.1 + i * 0.12;
        t.set(pkt, { opacity: 1 }, at)
          .to(pkt, { motionPath: { path: p, align: p, alignOrigin: [0.5, 0.5] }, duration: 0.9, ease: 'power2.inOut' }, at)
          .to(pkt, { opacity: 0, duration: 0.15 }, at + 0.9)
          .call(() => arrive(who), [], at + 0.9)
          .fromTo(q(`[data-end="${who}"]`), { attr: { stroke: 'rgba(157, 185, 255, 0.6)' } }, { attr: { stroke: 'rgba(243, 247, 244, 0.14)' }, duration: 0.8 }, at + 0.9);
      });
    },
    [app]
  );

  const hint = () => {
    const el = root.current;
    if (!el || prefersReducedMotion()) return;
    gsap.fromTo(gsap.utils.selector(el)(`[data-ripple="${HINT}"]`), { opacity: 0.7, scale: 1 }, { opacity: 0, scale: 1.35, duration: 0.9, ease: 'power2.out', transformOrigin: '50% 50%' });
  };

  const all = WHO.every((w) => synced[w]);
  const cell = 26;
  const gap = 7;
  const bx = APP.x + 20;
  const by = APP.y + 60;
  return (
    <div ref={root} className={s.vis} onMouseEnter={hint}>
      <p className="ix-sr">
        Example: a Mini App shared in a chat, as a small widget with a shared board. Three phones, each with its own key and Ixian
        address, keep their own copy of the same board. Change a cell and the change travels from the app to every phone,
        encrypted end to end. There is no backend to run.
      </p>
      <svg className={s.svg} viewBox={`0 0 ${W} ${H}`} fill="none">
        <defs>
          <radialGradient id="ixMiniGlow" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="var(--ix-route)" stopOpacity="0.1" />
            <stop offset="1" stopColor="var(--ix-route)" stopOpacity="0" />
          </radialGradient>
        </defs>
        <g aria-hidden>
          <ellipse cx={APP.x + APP.w / 2} cy={APP.y + APP.h / 2} rx={240} ry={170} fill="url(#ixMiniGlow)" />

          {/* build once: the app comes into the chat */}
          <g transform="translate(96 84)">
            <rect className={s.chip} x={-18} y={-14} width={36} height={28} rx={6} />
            <g transform="translate(-9 -9) scale(0.75)">
              <path className={s.chipGlyph} d={CODE} />
            </g>
          </g>
          <path className={s.faint} d={`M114 84 H${APP.x + 28 - K} Q${APP.x + 28} 84 ${APP.x + 28} ${84 + K} V${APP.y}`} />

          {/* the state travels: widget → every phone */}
          <path className={s.live} d={PATH.a} />
          <path className={s.live} d={PATH.b} />
          <path className={s.live} d={PATH.c} strokeDasharray="3 5" />
          {WHO.map((w) => (
            <path key={w} data-motion={w} d={PATH[w]} opacity={0} />
          ))}
          <Lock x={(A.x + PH.w + APP.x) / 2} y={aY} />
          <Lock x={(APP.x + APP.w + B.x) / 2} y={bY} />

          {/* the widget */}
          <rect className={s.tray} x={APP.x - 8} y={APP.y - 8} width={APP.w + 16} height={APP.h + 16} rx={16} />
          <rect className={s.cardKey} x={APP.x} y={APP.y} width={APP.w} height={APP.h} rx={10} />
          <rect className={s.chip} x={APP.x + 18} y={APP.y + 16} width={26} height={26} rx={6} />
          <g transform={`translate(${APP.x + 23} ${APP.y + 21}) scale(${16 / 24})`}>
            <path className={s.chipGlyph} d={APP_GLYPH} />
          </g>
          <rect className={s.chip} x={APP.x + 54} y={APP.y + 21} width={60} height={4} rx={2} />
          <rect className={s.chip} x={APP.x + 54} y={APP.y + 32} width={38} height={4} rx={2} />
          {/* who is in: a dot per participant, filled once they have the latest state */}
          {WHO.map((w, i) => (
            <circle key={w} cx={APP.x + APP.w - 48 + i * 13} cy={APP.y + 29} r={5} fill={synced[w] ? 'rgba(157, 185, 255, 0.55)' : 'var(--ix-bg)'} stroke="rgba(157, 185, 255, 0.55)" />
          ))}
          <line x1={APP.x + 18} y1={APP.y + 50} x2={APP.x + APP.w - 18} y2={APP.y + 50} stroke="rgba(243, 247, 244, 0.06)" />
          {/* footer: the sync mark */}
          <line x1={APP.x + 18} y1={APP.y + APP.h - 30} x2={APP.x + APP.w - 18} y2={APP.y + APP.h - 30} stroke="rgba(243, 247, 244, 0.06)" />
          <rect className={s.chip} x={APP.x + 18} y={APP.y + APP.h - 17} width={70} height={4} rx={2} />
          <g transform={`translate(${APP.x + APP.w - 28} ${APP.y + APP.h - 15})`} opacity={all ? 1 : 0.35}>
            <circle r={6.5} className={s.ok} />
            <path className={s.okMark} d="M-2.6 0.2l1.8 1.8 3.4-3.6" />
          </g>
        </g>

        {/* the board: each cell is a button */}
        {cellsOf().map(([c, r]) => {
          const k = `${c}-${r}`;
          const px = bx + c * (cell + gap);
          const py = by + r * (cell + gap);
          const on = app.has(k);
          return (
            <g
              key={k}
              role="button"
              tabIndex={0}
              aria-pressed={on}
              aria-label={`Cell ${r * COLS + c + 1}`}
              className={s.hit}
              onClick={() => flip(k)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  flip(k);
                }
              }}
            >
              <rect className={s.chip} x={px} y={py} width={cell} height={cell} rx={5} />
              {on && <rect className={s.cell} x={px} y={py} width={cell} height={cell} rx={5} opacity={0.6} />}
              <rect data-ripple={k} x={px} y={py} width={cell} height={cell} rx={5} fill="none" stroke="var(--ix-route)" strokeWidth={1.2} opacity={0} />
            </g>
          );
        })}

        <g aria-hidden>
          <Phone {...A} who="a" seed={2} addr="1Ana4…Qe7c" on={phones.a} />
          <Phone {...B} who="b" seed={25} addr="1Bo8…Lk3x" on={phones.b} />
          <Phone {...C} who="c" seed={33} addr="1Cy2…Rv9m" on={phones.c} quiet />
          {WHO.map((w) => {
            const p = w === 'a' ? { x: A.x + PH.w + 16, y: aY + 16 } : w === 'b' ? { x: B.x - 16, y: bY + 16 } : { x: C.x - 16, y: cY + 16 };
            return (
              <g key={w} opacity={synced[w] ? 1 : 0.25}>
                <Ok {...p} />
              </g>
            );
          })}
          {WHO.map((w) => (
            <Packet key={w} id={w} x={0} y={0} hidden dim={w === 'c'} />
          ))}
        </g>
      </svg>
    </div>
  );
}
