'use client';

import { useRef } from 'react';
import { gsap } from '@site/lib/motion';
import { GLYPH } from '@site/components/endpointGlyphs';
import { Fingerprint, Ok, Lock, To, Packet, usePlayOnce } from './flatParts';
import s from './flat.module.css';

// Plays once per hover or keyboard focus; reduced motion shows the still.

const W = 640;
const H = 480;
const K = 12;
const A = { x: 44, y: 86, w: 150, h: 66 }; // temperature sensor
const B = { x: 250, y: 206, w: 176, h: 78 }; // line controller
const C = { x: 462, y: 350, w: 150, h: 66 }; // machine
const D = { x: 458, y: 84, w: 140, h: 60 }; // air-quality logger

const aY = A.y + A.h / 2;
const bX = B.x + 58;
// sensor → controller: out of the sensor, along, down into the controller
const P_AB = `M${A.x + A.w} ${aY} H${bX - K} Q${bX} ${aY} ${bX} ${aY + K} V${B.y}`;
// controller → machine: down out of the controller, along, into the machine
const cY = C.y + C.h / 2;
const bX2 = B.x + B.w / 2 + 22;
const P_BC = `M${bX2} ${B.y + B.h} V${cY - K} Q${bX2} ${cY} ${bX2 + K} ${cY} H${C.x}`;
// controller ↔ logger: up and across, quiet
const bX3 = B.x + B.w - 30;
const dX = D.x + D.w / 2;
const dY = D.y + D.h + 22;
const P_BD = `M${bX3} ${B.y} V${dY + K} Q${bX3} ${dY} ${bX3 + K} ${dY} H${dX - K} Q${dX} ${dY} ${dX} ${dY - K} V${D.y + D.h}`;
const P_DB = `M${dX} ${D.y + D.h} V${dY - K} Q${dX} ${dY} ${dX - K} ${dY} H${bX3 + K} Q${bX3} ${dY} ${bX3} ${dY + K} V${B.y}`;
/** where the reading and the command rest in the still */
const REST = { ab: { x: bX - 70, y: aY }, bc: { x: bX2, y: cY - 24 } };

const AIR = 'M4 9.5h10a3 3 0 1 0-3-3M4 13.5h14a3 3 0 1 1-3 3M4 17.5h6';

function Device({ x, y, w, h, glyph, addr, seed, end, quiet }: { x: number; y: number; w: number; h: number; glyph: string; addr: string; seed: number; end?: string; quiet?: boolean }) {
  return (
    <g opacity={quiet ? 0.78 : 1}>
      <rect className={s.tray} x={x - 6} y={y - 6} width={w + 12} height={h + 12} rx={10} />
      <rect className={end === 'ctl' ? s.cardKey : s.card} x={x} y={y} width={w} height={h} rx={6} />
      {end && <rect className={s.outline} data-end={end} x={x} y={y} width={w} height={h} rx={6} />}
      <g transform={`translate(${x + 14} ${y + h / 2 - 11}) scale(${22 / 24})`}>
        <path className={s.glyph} d={glyph} />
      </g>
      <rect className={s.chip} x={x + 48} y={y + h / 2 - 10} width={46} height={4} rx={2} />
      <text className={`${s.mono} ${s.dim}`} x={x + 48} y={y + h / 2 + 12} fontSize="9.5">
        {addr}
      </text>
      <Fingerprint x={x + w - 34} y={y + h / 2 - 15} seed={seed} />
    </g>
  );
}

export default function DevicesVisual() {
  const root = useRef<HTMLDivElement>(null);

  usePlayOnce(root, (el) => {
    const q = gsap.utils.selector(el);
    const path = (k: string) => el.querySelector<SVGPathElement>(`[data-motion="${k}"]`)!;
    let tl: gsap.core.Timeline | null = null;
    const hop = (t: gsap.core.Timeline, k: string, end: string, ok: string, dur: number) => {
      const p = path(k);
      const pkt = q(`[data-packet="${k}"]`);
      t.set(pkt, { opacity: 1 })
        .to(pkt, { motionPath: { path: p, align: p, alignOrigin: [0.5, 0.5] }, duration: dur, ease: 'power2.inOut' })
        .to(q(`[data-end="${end}"]`), { attr: { stroke: 'rgba(157, 185, 255, 0.6)' }, duration: 0.2 }, '-=0.1')
        .to(pkt, { opacity: 0, duration: 0.2 }, '<')
        .fromTo(q(`[data-ok="${ok}"]`), { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, duration: 0.3, ease: 'back.out(2)', transformOrigin: '50% 50%' }, '<')
        .to(q(`[data-end="${end}"]`), { attr: { stroke: 'rgba(243, 247, 244, 0.14)' }, duration: 0.7 }, '+=0.15');
    };
    return {
      play: () => {
        if (tl?.isActive()) return;
        tl?.kill();
        const t = gsap.timeline();
        tl = t;
        t.set(q('[data-ok], [data-packet]'), { opacity: 0 });
        hop(t, 'ab', 'ctl', 'b', 1.3); // the reading
        hop(t, 'bc', 'mch', 'c', 1.1); // the command
        hop(t, 'db', 'ctl', 'd', 0.9); // the logger answers
        // the still: the reading and the command resting on their lines
        t.set(q('[data-packet="ab"]'), { x: REST.ab.x, y: REST.ab.y, rotation: 0 })
          .set(q('[data-packet="bc"]'), { x: REST.bc.x, y: REST.bc.y, rotation: 0 })
          .to(q('[data-packet="ab"], [data-packet="bc"]'), { opacity: 1, duration: 0.4 });
      },
      kill: () => void tl?.kill(),
    };
  });

  return (
    <div ref={root} className={s.vis}>
      <p className="ix-sr">
        Example: devices talking directly, each with its own key and Ixian address. A temperature sensor sends its reading straight
        to a line controller, the controller sends a command straight to a machine, and an air-quality logger listens and answers.
        Every message is encrypted end to end. No cloud and no broker of your own.
      </p>
      <svg className={s.svg} viewBox={`0 0 ${W} ${H}`} fill="none" aria-hidden>
        <defs>
          <radialGradient id="ixDevicesGlow" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="var(--ix-route)" stopOpacity="0.1" />
            <stop offset="1" stopColor="var(--ix-route)" stopOpacity="0" />
          </radialGradient>
        </defs>
        <ellipse cx={B.x + B.w / 2} cy={B.y + B.h / 2} rx={250} ry={170} fill="url(#ixDevicesGlow)" />

        {/* device to device: the chain is live, the logger's line is quiet */}
        <path className={s.live} d={P_AB} />
        <path className={s.live} d={P_BC} />
        <path className={s.live} d={P_BD} strokeDasharray="3 5" style={{ opacity: 0.35 }} />
        <path data-motion="ab" d={P_AB} opacity={0} />
        <path data-motion="bc" d={P_BC} opacity={0} />
        <path data-motion="db" d={P_DB} opacity={0} />
        {[
          [A.x + A.w, aY],
          [bX, B.y],
          [bX2, B.y + B.h],
          [C.x, cY],
        ].map(([x, y]) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r={2} fill="var(--ix-grey-700)" />
        ))}

        {/* each line carries the address it goes to, sealed end to end */}
        <To x={A.x + A.w + 88} y={aY - 22} addr="1Ctl7…9QaR" />
        <Lock x={A.x + A.w + 24} y={aY} />
        <To x={bX2} y={B.y + B.h + 34} addr="1Mch2…Pw6e" />
        <Lock x={bX2 + 40} y={cY} />

        <Device {...A} glyph={GLYPH.sensor} addr="1Tmp3…Kd8s" seed={1} />
        <Device {...B} glyph={GLYPH.device} addr="1Ctl7…9QaR" seed={18} end="ctl" />
        <Device {...C} glyph={GLYPH.robot} addr="1Mch2…Pw6e" seed={36} end="mch" />
        <Device {...D} glyph={AIR} addr="1Air5…Hm2v" seed={9} quiet />

        {/* arrivals: each end checked who sent it */}
        <g data-ok="b">
          <Ok x={bX - 16} y={B.y - 14} />
        </g>
        <g data-ok="c">
          <Ok x={C.x - 16} y={cY + 16} />
        </g>
        <g data-ok="d">
          <Ok x={bX3 + 16} y={B.y - 14} />
        </g>

        <Packet id="ab" {...REST.ab} />
        <Packet id="bc" {...REST.bc} />
        <Packet id="db" x={dX} y={D.y + D.h} hidden dim />
      </svg>
    </div>
  );
}
