'use client';

import { useRef } from 'react';
import { gsap } from '@site/lib/motion';
import { Fingerprint, Ok, Lock, To, Packet, usePlayOnce } from './flatParts';
import s from './flat.module.css';

/* Services that charge per request. Three lanes share one route: request (solid),
   response (dashed) and IXI (green). Plays once per hover or focus; reduced motion shows the still. */

const W = 640;
const H = 480;
const K = 14;
const REQ = { x: 48, y: 98, w: 156, h: 96 }; // the requester, an agent
const SVC = { x: 392, y: 250, w: 196, h: 172 }; // the service, with its wallet

// three lanes on one route: out of the requester's right side, along, down into the service's top
const lane = (i: number) => ({ y: REQ.y + 26 + i * 18, x: SVC.x + 132 - i * 18 });
const fwd = (i: number) => {
  const { x, y } = lane(i);
  return `M${REQ.x + REQ.w} ${y} H${x - K} Q${x} ${y} ${x} ${y + K} V${SVC.y}`;
};
const back = (i: number) => {
  const { x, y } = lane(i);
  return `M${x} ${SVC.y} V${y + K} Q${x} ${y} ${x - K} ${y} H${REQ.x + REQ.w}`;
};
const P_REQ = fwd(0);
const P_RESP = back(1);
const P_PAY = fwd(2);
/** a person's approval, on the IXI lane near the requester: above a limit they set */
const CHECK = { x: REQ.x + REQ.w + 82, y: REQ.y + 26 + 2 * 18 };
const P_PAY1 = `M${REQ.x + REQ.w} ${CHECK.y} H${CHECK.x}`;
const P_PAY2 = P_PAY.replace(/^M[\d.]+ [\d.]+/, `M${CHECK.x} ${CHECK.y}`);
/** where the IXI rests in the still: on its lane, on the way down */
const REST = { x: lane(2).x, y: SVC.y - 44 };

const AGENT_MARK = 'M12 3l7.5 4.3v9.4L12 21l-7.5-4.3V7.3z M12 8.2l3.3 1.9v3.8L12 15.8l-3.3-1.9v-3.8z';
const SERVICE = 'M4.5 4.5h15v6h-15zM4.5 13.5h15v6h-15zM7.5 7.5h.01M7.5 16.5h.01M11 7.5h5.5M11 16.5h5.5';
const PERSON = 'M12 11.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM5.5 19.5c.8-3.6 3.4-5.5 6.5-5.5s5.7 1.9 6.5 5.5';
const WALLET = 'M4 7.5h14.5a1.5 1.5 0 0 1 1.5 1.5v9a1.5 1.5 0 0 1-1.5 1.5H5.5A1.5 1.5 0 0 1 4 18V7.5zM4 7.5l11-3v3M15.5 13.5h.01';

function Coin({ id, x, y }: { id: string; x: number; y: number }) {
  return (
    <g data-coin={id} transform={`translate(${x} ${y})`}>
      <circle r={11} className={s.coinGlow} />
      <circle r={7} fill="var(--ix-bg)" stroke="var(--ix-live)" strokeWidth={1.2} />
      <text y={2.4} textAnchor="middle" fontSize="6.5" fontWeight="600" fill="var(--ix-live)" className={s.mono}>
        IXI
      </text>
    </g>
  );
}

/** a small arrowhead at a lane's end, pointing the way it runs */
const Head = ({ x, y, dir, color, opacity }: { x: number; y: number; dir: 'down' | 'left'; color: string; opacity?: number }) => (
  <path
    d={dir === 'down' ? `M${x - 3.5} ${y - 7} L${x} ${y - 2} L${x + 3.5} ${y - 7}` : `M${x + 7} ${y - 3.5} L${x + 2} ${y} L${x + 7} ${y + 3.5}`}
    stroke={color}
    strokeWidth={1.2}
    strokeLinecap="round"
    strokeLinejoin="round"
    opacity={opacity}
  />
);

export default function PaidVisual() {
  const root = useRef<HTMLDivElement>(null);

  usePlayOnce(root, (el) => {
    const q = gsap.utils.selector(el);
    const path = (k: string) => el.querySelector<SVGPathElement>(`[data-motion="${k}"]`)!;
    let tl: gsap.core.Timeline | null = null;
    const along = (t: gsap.core.Timeline, target: gsap.TweenTarget, k: string, dur: number) => {
      const p = path(k);
      t.to(target, { motionPath: { path: p, align: p, alignOrigin: [0.5, 0.5] }, duration: dur, ease: 'power2.inOut' });
    };
    const flash = (t: gsap.core.Timeline, end: string) =>
      t.to(q(`[data-end="${end}"]`), { attr: { stroke: 'rgba(157, 185, 255, 0.6)' }, duration: 0.2 }, '-=0.1').to(q(`[data-end="${end}"]`), { attr: { stroke: 'rgba(243, 247, 244, 0.14)' }, duration: 0.7 }, '+=0.2');
    return {
      play: () => {
        if (tl?.isActive()) return;
        tl?.kill();
        const t = gsap.timeline();
        tl = t;
        const ring = el.querySelector<SVGCircleElement>('[data-ring]')!;
        const len = Math.ceil(ring.getTotalLength());
        t.set(q('[data-packet], [data-coin], [data-ok], [data-earned]'), { opacity: 0 }).set(ring, { strokeDasharray: len, strokeDashoffset: len });
        t.set(q('[data-packet="req"]'), { opacity: 1 });
        along(t, q('[data-packet="req"]'), 'req', 1.3);
        t.to(q('[data-packet="req"]'), { opacity: 0, duration: 0.15 });
        flash(t, 'svc');
        // the service works on it
        t.to(q('[data-work]'), { opacity: 1, duration: 0.25, stagger: 0.12, yoyo: true, repeat: 3 }, '-=0.6');
        // response → requester, checked on arrival
        t.set(q('[data-packet="resp"]'), { opacity: 1 });
        along(t, q('[data-packet="resp"]'), 'resp', 1.3);
        t.to(q('[data-packet="resp"]'), { opacity: 0, duration: 0.15 }).fromTo(q('[data-ok="req"]'), { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, duration: 0.3, ease: 'back.out(2)', transformOrigin: '50% 50%' }, '<');
        // IXI: to the person's checkpoint, approved (the ring closes), then along the same route into the wallet
        t.set(q('[data-coin="pay"]'), { opacity: 1, x: REQ.x + REQ.w, y: CHECK.y }, '+=0.15');
        along(t, q('[data-coin="pay"]'), 'pay1', 0.6);
        t.to(ring, { strokeDashoffset: 0, duration: 0.7, ease: 'power1.inOut' });
        along(t, q('[data-coin="pay"]'), 'pay2', 1.3);
        t.to(q('[data-coin="pay"]'), { opacity: 0, duration: 0.15 }).fromTo(q('[data-earned]'), { opacity: 0, scale: 0.4 }, { opacity: 1, scale: 1, duration: 0.4, ease: 'back.out(2)', transformOrigin: '50% 50%' }, '<');
        flash(t, 'svc');
        // the still: the IXI resting on its lane
        t.set(q('[data-coin="pay"]'), { x: REST.x, y: REST.y, rotation: 0 }).to(q('[data-coin="pay"]'), { opacity: 1, duration: 0.4 });
      },
      kill: () => void tl?.kill(),
    };
  });

  const l0 = lane(0);
  const l1 = lane(1);
  const l2 = lane(2);
  return (
    <div ref={root} className={s.vis}>
      <p className="ix-sr">
        Example: an API or AI service with its own Ixian address and wallet charges per request. An agent sends a request to
        the service&apos;s address, the response comes back, and the agent pays in IXI along the same address-to-address route,
        with no payment processor in between.
      </p>
      <svg className={s.svg} viewBox={`0 0 ${W} ${H}`} fill="none" aria-hidden>
        <defs>
          <radialGradient id="ixPaidGlow" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="var(--ix-route)" stopOpacity="0.1" />
            <stop offset="1" stopColor="var(--ix-route)" stopOpacity="0" />
          </radialGradient>
        </defs>
        <ellipse cx={SVC.x + 60} cy={REQ.y + 150} rx={260} ry={180} fill="url(#ixPaidGlow)" />

        {/* one relationship, three lanes: request, response, IXI */}
        <path className={s.live} d={P_REQ} />
        <path className={s.live} d={P_RESP} strokeDasharray="3 5" style={{ opacity: 0.6 }} />
        <path className={s.pay} d={P_PAY} />
        <path data-motion="req" d={P_REQ} opacity={0} />
        <path data-motion="resp" d={P_RESP} opacity={0} />
        <path data-motion="pay1" d={P_PAY1} opacity={0} />
        <path data-motion="pay2" d={P_PAY2} opacity={0} />
        <Head x={l0.x} y={SVC.y} dir="down" color="var(--ix-route)" />
        <Head x={REQ.x + REQ.w} y={l1.y} dir="left" color="var(--ix-route)" opacity={0.7} />
        <Head x={l2.x} y={SVC.y} dir="down" color="var(--ix-live)" opacity={0.8} />
        {[l0, l1, l2].map((l) => (
          <circle key={l.y} cx={REQ.x + REQ.w} cy={l.y} r={2} fill="var(--ix-grey-700)" />
        ))}

        {/* destination address and seal */}
        <To x={REQ.x + REQ.w + 118} y={l0.y - 22} addr="1Svc4…Zr7e" />
        <Lock x={REQ.x + REQ.w + 34} y={l1.y} />
        {/* a person's approval on the IXI lane, above a limit they set */}
        <g transform={`translate(${CHECK.x} ${CHECK.y})`}>
          <circle r={10} fill="var(--ix-bg)" stroke="rgba(243, 247, 244, 0.22)" />
          <circle data-ring r={13.5} stroke="var(--ix-live)" strokeOpacity={0.75} strokeWidth={1.2} transform="rotate(-90)" />
          <g transform="translate(-6 -6.5) scale(0.5)">
            <path className={s.glyph} d={PERSON} />
          </g>
        </g>

        {/* the requester: an agent with its own address */}
        <rect className={s.tray} x={REQ.x - 6} y={REQ.y - 6} width={REQ.w + 12} height={REQ.h + 12} rx={10} />
        <rect className={s.card} x={REQ.x} y={REQ.y} width={REQ.w} height={REQ.h} rx={6} />
        <g transform={`translate(${REQ.x + 14} ${REQ.y + 14}) scale(${20 / 24})`}>
          <path className={s.glyph} d={AGENT_MARK} />
        </g>
        <rect className={s.chip} x={REQ.x + 44} y={REQ.y + 20} width={48} height={4} rx={2} />
        <Fingerprint x={REQ.x + REQ.w - 34} y={REQ.y + 12} seed={7} />
        <text className={`${s.mono} ${s.dim}`} x={REQ.x + 14} y={REQ.y + 66} fontSize="9.5">
          1Agt6…Yb2n
        </text>
        <rect className={s.chip} x={REQ.x + 14} y={REQ.y + 76} width={70} height={4} rx={2} />
        <g data-ok="req">
          <Ok x={REQ.x + REQ.w - 8} y={REQ.y + REQ.h + 16} />
        </g>

        {/* the service: its own address and wallet */}
        <rect className={s.tray} x={SVC.x - 8} y={SVC.y - 8} width={SVC.w + 16} height={SVC.h + 16} rx={14} />
        <rect className={s.cardKey} x={SVC.x} y={SVC.y} width={SVC.w} height={SVC.h} rx={10} />
        <rect className={s.outline} data-end="svc" x={SVC.x} y={SVC.y} width={SVC.w} height={SVC.h} rx={10} />
        <g transform={`translate(${SVC.x + 16} ${SVC.y + 18}) scale(${20 / 24})`}>
          <path className={s.glyph} d={SERVICE} />
        </g>
        <rect className={s.chip} x={SVC.x + 46} y={SVC.y + 24} width={56} height={4} rx={2} />
        <Fingerprint x={SVC.x + SVC.w - 46} y={SVC.y + 16} seed={3} n={5} cell={4} gap={1.2} />
        <text className={`${s.mono} ${s.addr}`} x={SVC.x + 16} y={SVC.y + 68} fontSize="10.5">
          1Svc4…Zr7e
        </text>
        <line x1={SVC.x + 16} y1={SVC.y + 86} x2={SVC.x + SVC.w - 16} y2={SVC.y + 86} stroke="rgba(243, 247, 244, 0.06)" />
        {/* the wallet: what it has earned, one request at a time */}
        <g transform={`translate(${SVC.x + 16} ${SVC.y + 100}) scale(${18 / 24})`}>
          <path className={s.glyph} d={WALLET} />
        </g>
        {Array.from({ length: 9 }, (_, i) => (
          <rect key={i} className={s.chip} x={SVC.x + 46 + i * 14} y={SVC.y + 104} width={10} height={10} rx={2} />
        ))}
        {Array.from({ length: 4 }, (_, i) => (
          <rect key={i} x={SVC.x + 46 + i * 14} y={SVC.y + 104} width={10} height={10} rx={2} fill="var(--ix-live)" opacity={0.35} />
        ))}
        <rect data-earned x={SVC.x + 46 + 4 * 14} y={SVC.y + 104} width={10} height={10} rx={2} fill="var(--ix-live)" opacity={0.85} />
        <rect className={s.chip} x={SVC.x + 16} y={SVC.y + 136} width={110} height={4} rx={2} />
        <rect className={s.chip} x={SVC.x + 16} y={SVC.y + 148} width={72} height={4} rx={2} />
        {/* the service working on the request: its lines light while it answers */}
        <rect data-work x={SVC.x + 16} y={SVC.y + 136} width={110} height={4} rx={2} fill="var(--ix-route)" opacity={0} />
        <rect data-work x={SVC.x + 16} y={SVC.y + 148} width={72} height={4} rx={2} fill="var(--ix-route)" opacity={0} />

        <Packet id="req" x={REQ.x + REQ.w} y={l0.y} hidden />
        <Packet id="resp" x={l1.x} y={SVC.y} hidden dim />
        <Coin id="pay" {...REST} />
      </svg>
    </div>
  );
}
