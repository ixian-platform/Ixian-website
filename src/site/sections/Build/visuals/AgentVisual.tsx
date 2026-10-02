'use client';

import { useEffect, useRef } from 'react';
import { gsap, prefersReducedMotion } from '@site/lib/motion';
import s from './flat.module.css';
import { mulberry32 } from '@site/lib/rng';

// Plays once per tile hover or focus: a request goes agent → relay → person, a reply returns from the service.
// Reduced motion shows the still frame with the request resting on the route.

const W = 640;
const H = 480;
const AGENT = { x: 142, y: 170, w: 216, h: 140 };
const MID = AGENT.y + AGENT.h / 2; // 240
const RELAY = { x: 432, y: MID };
const PERSON = { x: 506, y: 118, w: 104, h: 60 };
const SERVICE = { x: 506, y: 302, w: 104, h: 60 };
const K = 12; // corner radius on the wiring

const up = (ex: number, ey: number) => `M${RELAY.x} ${RELAY.y} H${RELAY.x + 22 - K} Q${RELAY.x + 22} ${RELAY.y} ${RELAY.x + 22} ${RELAY.y - K} V${ey + K} Q${RELAY.x + 22} ${ey} ${RELAY.x + 22 + K} ${ey} H${ex}`;
const down = (ex: number, ey: number) => `M${RELAY.x} ${RELAY.y} H${RELAY.x + 22 - K} Q${RELAY.x + 22} ${RELAY.y} ${RELAY.x + 22} ${RELAY.y + K} V${ey - K} Q${RELAY.x + 22} ${ey} ${RELAY.x + 22 + K} ${ey} H${ex}`;
const P_IN = `M${AGENT.x + AGENT.w} ${MID} H${RELAY.x}`;
const P_PERSON = up(PERSON.x, PERSON.y + PERSON.h / 2);
const P_SERVICE = down(SERVICE.x, SERVICE.y + SERVICE.h / 2);
/** the request, end to end, and the reply */
const P_REQ = `${P_IN} ${P_PERSON.replace(/^M[\d.]+ [\d.]+/, '')}`;
const P_REPLY = `M${SERVICE.x} ${SERVICE.y + SERVICE.h / 2} H${RELAY.x + 22 + K} Q${RELAY.x + 22} ${SERVICE.y + SERVICE.h / 2} ${RELAY.x + 22} ${SERVICE.y + SERVICE.h / 2 - K} V${RELAY.y + K} Q${RELAY.x + 22} ${RELAY.y} ${RELAY.x + 22 - K} ${RELAY.y} H${AGENT.x + AGENT.w}`;

/** a key fingerprint as a 5 × 5 mirrored identicon, seeded, so server and browser agree */
function identicon(seed: number) {
  const r = mulberry32(seed);
  const cells: [number, number][] = [];
  for (let row = 0; row < 5; row++)
    for (let col = 0; col < 3; col++)
      if (r() > 0.45) {
        cells.push([col, row]);
        if (col < 2) cells.push([4 - col, row]);
      }
  return cells;
}
const CELLS = identicon(7);

/** glyphs drawn for this tile (24-unit boxes) */
const PERSON_GLYPH = 'M12 11.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM5.5 19.5c.8-3.6 3.4-5.5 6.5-5.5s5.7 1.9 6.5 5.5';
const SERVICE_GLYPH = 'M4.5 4.5h15v6h-15zM4.5 13.5h15v6h-15zM7.5 7.5h.01M7.5 16.5h.01M11 7.5h5.5M11 16.5h5.5';
const AGENT_MARK = 'M12 3l7.5 4.3v9.4L12 21l-7.5-4.3V7.3z M12 8.2l3.3 1.9v3.8L12 15.8l-3.3-1.9v-3.8z';
const CHIPS = [
  'M5 6.5h14v9H10l-4 3v-3H5z', // message
  'M12 19.5a7.5 7.5 0 1 0 0-15 7.5 7.5 0 0 0 0 15zM9.8 9.5h4.4M9.8 14.5h4.4M12 9.5v5', // pay
  'M5 19l2-6 9-9 4 4-9 9zM14 6l4 4', // sign
];

function Endpoint({ x, y, w, h, glyph, addr }: { x: number; y: number; w: number; h: number; glyph: string; addr: string }) {
  return (
    <g>
      <rect className={s.tray} x={x - 6} y={y - 6} width={w + 12} height={h + 12} rx={10} />
      <rect className={s.card} x={x} y={y} width={w} height={h} rx={6} />
      <g transform={`translate(${x + 12} ${y + h / 2 - 10}) scale(${20 / 24})`}>
        <path className={s.glyph} d={glyph} />
      </g>
      <rect className={s.chip} x={x + 42} y={y + 21} width={46} height={4} rx={2} />
      <text className={`${s.mono} ${s.dim}`} x={x + 42} y={y + 42} fontSize="9.5">
        {addr}
      </text>
    </g>
  );
}

function Ok({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <circle className={s.ok} r={6.5} />
      <path className={s.okMark} d="M-2.6 0.2l1.8 1.8 3.4-3.6" />
    </g>
  );
}

export default function AgentVisual() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el || prefersReducedMotion()) return;
    const q = gsap.utils.selector(el);
    const req = q('[data-packet="req"]');
    const rep = q('[data-packet="rep"]');
    const pathReq = el.querySelector<SVGPathElement>('[data-motion="req"]')!;
    const pathRep = el.querySelector<SVGPathElement>('[data-motion="rep"]')!;
    let tl: gsap.core.Timeline | null = null;
    const play = () => {
      if (tl?.isActive()) return;
      tl?.kill();
      tl = gsap.timeline();
      tl.set(req, { opacity: 1 })
        .to(req, { motionPath: { path: pathReq, align: pathReq, alignOrigin: [0.5, 0.5] }, duration: 1.5, ease: 'power2.inOut' })
        .to(q('[data-end="person"]'), { attr: { stroke: 'rgba(157, 185, 255, 0.55)' }, duration: 0.2 }, '-=0.1')
        .to(req, { opacity: 0, duration: 0.2 }, '<')
        .set(rep, { opacity: 1 }, '+=0.15')
        .to(rep, { motionPath: { path: pathRep, align: pathRep, alignOrigin: [0.5, 0.5] }, duration: 1.3, ease: 'power2.inOut' })
        .to(rep, { opacity: 0, duration: 0.2 })
        .to(q('[data-end="person"]'), { attr: { stroke: 'rgba(243, 247, 244, 0.14)' }, duration: 0.6 }, '-=0.6')
        // the still: the request back on the route, resting
        .set(req, { x: RELAY.x - 40, y: MID, rotation: 0 })
        .to(req, { opacity: 1, duration: 0.4 });
    };
    // hover (or keyboard focus) only: nothing moves on scroll
    const tile = el.closest('.ix-build-tile');
    tile?.addEventListener('mouseenter', play);
    tile?.addEventListener('focusin', play);
    tile?.addEventListener('ix-play', play);
    return () => {
      tile?.removeEventListener('mouseenter', play);
      tile?.removeEventListener('focusin', play);
      tile?.removeEventListener('ix-play', play);
      tl?.kill();
    };
  }, []);

  const addrX = AGENT.x + 86;
  return (
    <div ref={root} className={s.vis}>
      <p className="ix-sr">
        Example: an AI agent with its own Ixian address, shown as an identity card with its key fingerprint, its address and three
        permissions (message, pay, sign). One route runs through an S2 relay to a person and to a service; each end checks the
        agent&apos;s signature. A request travels to the person and a reply comes back from the service.
      </p>
      <svg className={s.svg} viewBox={`0 0 ${W} ${H}`} fill="none" aria-hidden>
        <defs>
          <radialGradient id="ixAgentGlow" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="var(--ix-route)" stopOpacity="0.11" />
            <stop offset="1" stopColor="var(--ix-route)" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* restrained glow behind the identity */}
        <ellipse cx={AGENT.x + AGENT.w / 2} cy={MID} rx={230} ry={170} fill="url(#ixAgentGlow)" />

        {/* agent to agent: a faint line out to another agent, beyond the edge */}
        <path className={s.faint} d={`M${AGENT.x} ${MID} H24`} />
        <rect className={s.ghost} x={-60} y={MID - 30} width={80} height={60} rx={6} />

        {/* the wiring */}
        <path className={s.wire} d={P_IN} />
        <path className={s.wire} d={P_PERSON} />
        <path className={s.wire} d={P_SERVICE} />
        <path className={s.live} d={P_IN} />
        <path className={s.live} d={P_PERSON} />
        <path className={s.live} d={P_SERVICE} strokeDasharray="3 5" />
        <path data-motion="req" d={P_REQ} opacity={0} />
        <path data-motion="rep" d={P_REPLY} opacity={0} />
        {/* start and end points of the wiring */}
        {[
          [AGENT.x + AGENT.w, MID],
          [PERSON.x, PERSON.y + PERSON.h / 2],
          [SERVICE.x, SERVICE.y + SERVICE.h / 2],
        ].map(([x, y]) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r={2} fill="var(--ix-grey-700)" />
        ))}

        {/* one S2 relay */}
        <rect className={s.relay} x={RELAY.x - 7} y={RELAY.y - 7} width={14} height={14} rx={3.5} />
        <rect className={s.relayCore} x={RELAY.x - 2.5} y={RELAY.y - 2.5} width={5} height={5} rx={1} />

        {/* each end checks the agent's signature; the service link is sealed */}
        <Ok x={PERSON.x - 18} y={PERSON.y + PERSON.h / 2 - 14} />
        <Ok x={SERVICE.x - 18} y={SERVICE.y + SERVICE.h / 2 + 14} />
        <g transform={`translate(${RELAY.x + 22} ${(RELAY.y + SERVICE.y + SERVICE.h / 2) / 2})`}>
          <rect x={-7} y={-7} width={14} height={14} rx={3} fill="var(--ix-bg)" />
          <path d="M-3.5 -0.5h7v5h-7zM-2 -0.5v-2a2 2 0 0 1 4 0v2" stroke="var(--ix-route)" strokeWidth={1.1} fill="none" />
        </g>

        {/* the agent: an identity, not a machine */}
        <rect className={s.tray} x={AGENT.x - 8} y={AGENT.y - 8} width={AGENT.w + 16} height={AGENT.h + 16} rx={14} />
        <rect className={s.cardKey} x={AGENT.x} y={AGENT.y} width={AGENT.w} height={AGENT.h} rx={10} />
        {/* key fingerprint */}
        <rect className={s.chip} x={AGENT.x + 18} y={AGENT.y + 18} width={54} height={54} rx={6} />
        {CELLS.map(([c, r]) => (
          <rect key={`${c}-${r}`} className={s.cell} x={AGENT.x + 25 + c * 8.4} y={AGENT.y + 25 + r * 8.4} width={7} height={7} rx={1.2} opacity={0.35 + ((c + r) % 3) * 0.2} />
        ))}
        {/* the agent's mark and its address */}
        <g transform={`translate(${addrX} ${AGENT.y + 20}) scale(${18 / 24})`}>
          <path className={s.glyph} d={AGENT_MARK} />
        </g>
        <rect className={s.chip} x={addrX + 26} y={AGENT.y + 25} width={58} height={4} rx={2} />
        <text className={`${s.mono} ${s.addr}`} x={addrX} y={AGENT.y + 62} fontSize="11">
          1Qx7Rk9w…3mPvT
        </text>
        {/* permissions: message, pay, sign, each checked */}
        <line x1={AGENT.x + 18} y1={AGENT.y + 88} x2={AGENT.x + AGENT.w - 18} y2={AGENT.y + 88} stroke="rgba(243, 247, 244, 0.06)" />
        {CHIPS.map((d, i) => {
          const x = AGENT.x + 18 + i * 62;
          const y = AGENT.y + 100;
          return (
            <g key={i}>
              <rect className={s.chip} x={x} y={y} width={54} height={24} rx={5} />
              <g transform={`translate(${x + 8} ${y + 5}) scale(${14 / 24})`}>
                <path className={s.chipGlyph} d={d} />
              </g>
              <path className={s.okMark} d={`M${x + 34} ${y + 12.5}l2.2 2.2 4.2-4.4`} />
            </g>
          );
        })}

        {/* two endpoints: a person and a service */}
        <Endpoint {...PERSON} glyph={PERSON_GLYPH} addr="1Hk2…w9Ld" />
        <Endpoint {...SERVICE} glyph={SERVICE_GLYPH} addr="1Ma8…Tq4c" />
        <rect className={s.outline} data-end="person" x={PERSON.x} y={PERSON.y} width={PERSON.w} height={PERSON.h} rx={6} />

        {/* traffic: a request out, a reply back */}
        <g data-packet="req" transform={`translate(${RELAY.x - 40} ${MID})`}>
          <rect className={s.packetGlow} x={-9} y={-6} width={18} height={12} rx={4} />
          <rect className={s.packet} x={-5} y={-3} width={10} height={6} rx={2} />
        </g>
        <g data-packet="rep" opacity={0}>
          <rect className={s.packetGlow} x={-9} y={-6} width={18} height={12} rx={4} />
          <rect className={s.packet} x={-5} y={-3} width={10} height={6} rx={2} opacity={0.7} />
        </g>
      </svg>
    </div>
  );
}
