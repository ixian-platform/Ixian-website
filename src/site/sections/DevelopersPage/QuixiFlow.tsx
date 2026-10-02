'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { gsap, prefersReducedMotion } from '@site/lib/motion';
import CodeBlock from '@site/components/page/CodeBlock';
import { Endpoint, Fingerprint, Glow, Lock, Ok, Pill, Relay, Ends, route, flat, usePlayInView } from '@site/components/flat/Flat';
import { quixi, quixiLive } from '@site/content/developers';
import { useMedia } from '@site/components/PinSteps';
import s from './Dev2.module.css';

/* Plays once in view and once per lane choice; reduced motion shows the end state. */

const CODE = 'M8.5 7.5L4 12l4.5 4.5M15.5 7.5L20 12l-4.5 4.5M13.5 5.5l-3 13';
const QUEUE = 'M4.5 5.5h15v3.5h-15zM4.5 10.25h15v3.5h-15zM4.5 15h15v3.5h-15z';
const LANE_DEFS = [
  { id: 'rest', label: 'REST', glyph: CODE, note: 'POST :8001' },
  { id: 'mqtt', label: 'MQTT', glyph: 'sensor', note: 'Chat/#  :1883' },
  { id: 'rabbit', label: 'RabbitMQ', glyph: QUEUE, note: 'queue' },
];
const QW = 244;
const QH = 148;

/* Wide: left to right. Phones: top to bottom at a fixed size, so nothing scrolls sideways. */
function geometry(phone: boolean) {
  if (phone) {
    const W = 360;
    const H = 500;
    const Q = { x: (W - QW) / 2, y: 128, w: QW, h: QH };
    const LW = 108;
    const LH = 50;
    const lanes = LANE_DEFS.map((l, i) => {
      const x = 12 + i * 120;
      const cx = x + LW / 2;
      return { ...l, x, y: 34, w: LW, h: LH, end: [cx, 34 + LH] as [number, number], path: route([[cx, 34 + LH], [cx, 106], [W / 2, 106], [W / 2, Q.y]]) };
    });
    const relay: [number, number] = [W / 2, 322];
    const them = { x: (W - 184) / 2, y: 382, w: 184, h: 64 };
    return {
      W, H, Q, lanes, relay, them,
      out: route([[W / 2, Q.y + Q.h], [W / 2, them.y]]),
      back: route([[W / 2, them.y + them.h], [W / 2, 474], [344, 474], [344, Q.y + Q.h / 2], [Q.x + Q.w, Q.y + Q.h / 2]]),
      pill: [262, 474] as [number, number],
      lock: [W / 2, 356] as [number, number],
      sides: `M${relay[0]} ${relay[1]} H${relay[0] - 56} M${relay[0]} ${relay[1]} H${relay[0] + 56}`,
      sideRelays: [[relay[0] - 56, relay[1]], [relay[0] + 56, relay[1]]] as [number, number][],
      s2Label: [relay[0] - 56, relay[1] + 26] as [number, number],
      ok: [them.x - 14, them.y + 14] as [number, number],
      labelY: 22,
    };
  }
  const W = 960;
  const H = 340;
  const Q = { x: 316, y: 96, w: QW, h: QH };
  const MID = Q.y + Q.h / 2; // 170
  const LW = 196;
  const LH = 58;
  const ys = [78, 170, 262];
  const lanes = LANE_DEFS.map((l, i) => ({ ...l, x: 20, y: ys[i] - LH / 2, w: LW, h: LH, end: [20 + LW, ys[i]] as [number, number], path: route([[20 + LW, ys[i]], [266, ys[i]], [266, MID], [Q.x, MID]]) }));
  const relay: [number, number] = [650, MID];
  const them = { x: 756, y: MID - 32, w: 184, h: 64 };
  return {
    W, H, Q, lanes, relay, them,
    out: route([[Q.x + Q.w, MID], [them.x, MID]]),
    back: route([[them.x + them.w / 2, them.y + them.h], [them.x + them.w / 2, 300], [Q.x + Q.w / 2, 300], [Q.x + Q.w / 2, Q.y + Q.h]]),
    pill: [(them.x + them.w / 2 + Q.x + Q.w / 2) / 2, 300] as [number, number],
    lock: [712, MID] as [number, number],
    sides: `M${relay[0]} ${MID} V${MID - 56} M${relay[0]} ${MID} V${MID + 56} M${relay[0] - 22} ${MID - 56} H${relay[0]} M${relay[0] + 22} ${MID + 56} H${relay[0]}`,
    sideRelays: [[relay[0] - 28, MID - 56], [relay[0] + 28, MID + 56]] as [number, number][],
    s2Label: [626, 258] as [number, number],
    ok: [them.x - 16, MID - 18] as [number, number],
    labelY: 30,
  };
}
const r2 = (n: number) => Math.round(n * 100) / 100;

export default function QuixiFlow() {
  const [tab, setTab] = useState(0);
  const [phase, setPhase] = useState(0); // 0 rest, 1 delivered, 2 answered
  const root = useRef<HTMLDivElement>(null);
  const pinRef = useRef<SVGPathElement>(null);
  const poutRef = useRef<SVGPathElement>(null);
  const pbackRef = useRef<SVGPathElement>(null);
  const pkt = useRef<SVGGElement>(null);
  const rep = useRef<SVGGElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);
  const seen = useRef(false);
  const phone = useMedia('(max-width: 640px)');
  const G = geometry(phone);
  const { Q } = G;
  const t = quixi.tabs[tab];
  const cfg = t.id === 'config';
  const lane = t.id === 'mqtt' ? G.lanes[1] : G.lanes[0];
  const topic = lane.id === 'mqtt' ? 'Chat' : 'getLastMessages';

  const place = (g: SVGGElement | null, p: SVGPathElement | null, k: number) => {
    if (!g || !p) return;
    const pt = p.getPointAtLength(p.getTotalLength() * k);
    g.setAttribute('transform', `translate(${r2(pt.x)} ${r2(pt.y)})`);
  };

  const still = useCallback(() => {
    tl.current?.kill();
    pkt.current?.setAttribute('opacity', '0');
    rep.current?.setAttribute('opacity', '0');
    setPhase(2);
  }, []);

  const play = useCallback(() => {
    seen.current = true;
    tl.current?.kill();
    if (prefersReducedMotion() || cfg) return still();
    setPhase(0);
    const a = { k: 0 };
    const b = { k: 0 };
    const c = { k: 0 };
    tl.current = gsap
      .timeline()
      .call(() => place(pkt.current, pinRef.current, 0))
      .set(pkt.current, { attr: { opacity: 1 } }, 0.2)
      .to(a, { k: 1, duration: 0.9, ease: 'power2.in', onUpdate: () => place(pkt.current, pinRef.current, a.k) })
      .to(b, { k: 1, duration: 1.2, ease: 'power2.out', onUpdate: () => place(pkt.current, poutRef.current, b.k) }, '+=0.12')
      .to(pkt.current, { attr: { opacity: 0 }, duration: 0.2 })
      .call(() => setPhase(1), [], '<')
      .call(() => place(rep.current, pbackRef.current, 0), [], '+=0.3')
      .set(rep.current, { attr: { opacity: 1 } })
      .to(c, { k: 1, duration: 1.3, ease: 'power2.inOut', onUpdate: () => place(rep.current, pbackRef.current, c.k) })
      .to(rep.current, { attr: { opacity: 0 }, duration: 0.25 })
      .call(() => setPhase(2), [], '<');
  }, [cfg, still]);

  usePlayInView(root, play, still);
  useEffect(() => () => void tl.current?.kill(), []);
  useEffect(() => {
    if (seen.current) play();
  }, [tab, play]);
  // the layout changed under a running timeline: show the end state
  useEffect(() => {
    if (seen.current) still();
  }, [phone, still]);

  return (
    <div ref={root} className={s.qx}>
      <div className={`${flat.well} ${s.qxWell}`}>
        <div className={s.qxScroll}>
          <svg viewBox={`0 0 ${G.W} ${G.H}`} data-phone={phone || undefined} className={`${flat.svg} ${s.qxSvg}`} fill="none" role="img" aria-label={`${quixiLive.flow.in}. ${quixiLive.flow.out}. ${quixiLive.flow.back}.`}>
            <Glow id="ixQuixiGlow" cx={Q.x + Q.w / 2} cy={Q.y + Q.h / 2} rx={260} ry={170} o={cfg ? 0.16 : 0.1} />
            <text className={flat.caps} x={phone ? 12 : 20} y={G.labelY} fontSize="9">
              YOUR SYSTEMS
            </text>
            <text className={flat.caps} x={G.s2Label[0]} y={G.s2Label[1]} fontSize="9" textAnchor={phone ? 'middle' : undefined}>
              IXIAN S2
            </text>

            {/* your systems into QuIXI: the chosen lane is live */}
            {G.lanes.map((l) => {
              const on = !cfg && l.id === lane.id;
              return (
                <g key={l.id}>
                  <path className={flat.wire} d={l.path} />
                  {on && <path ref={pinRef} className={`${flat.live} ${flat.liveOn}`} d={l.path} />}
                  <Endpoint x={l.x} y={l.y} w={l.w} h={l.h} glyph={l.glyph} name={l.label} addr={l.note} on={on} tray={on} />
                </g>
              );
            })}
            <Ends pts={G.lanes.map((l) => l.end)} />

            {/* out to the network, sealed, to the other end */}
            <path className={flat.wire} d={G.out} />
            <path ref={poutRef} className={`${flat.live} ${phase >= 1 ? flat.liveOn : ''}`} d={G.out} />
            <path className={flat.faint} d={G.sides} />
            {G.sideRelays.map(([x, y]) => (
              <Relay key={`${x}-${y}`} x={x} y={y} size={12} />
            ))}
            <Relay x={G.relay[0]} y={G.relay[1]} />
            <Lock x={G.lock[0]} y={G.lock[1]} />

            {/* the answer, back on a topic */}
            <path className={flat.wire} d={G.back} />
            <path ref={pbackRef} className={flat.live} d={G.back} strokeDasharray="3 5" />
            <g className={flat.show} data-on={(!cfg && phase >= 2) || undefined}>
              <Pill x={G.pill[0]} y={G.pill[1]} text={topic} />
            </g>

            {/* QuIXI: an identity, with its ports */}
            <rect className={flat.tray} x={Q.x - 8} y={Q.y - 8} width={Q.w + 16} height={Q.h + 16} rx={14} />
            <rect className={`${flat.cardKey} ${cfg || phase >= 1 ? flat.cardKeyOn : ''}`} x={Q.x} y={Q.y} width={Q.w} height={Q.h} rx={10} />
            <Fingerprint x={Q.x + 18} y={Q.y + 18} seed={7} n={5} cell={7} gap={1.4} pad={6} />
            <text className={`${flat.sans} ${flat.bright}`} x={Q.x + 90} y={Q.y + 36} fontSize="17" fontWeight={600}>
              QuIXI
            </text>
            <text className={`${flat.mono} ${flat.addr}`} x={Q.x + 90} y={Q.y + 56} fontSize="9.5">
              1Qx7Rk9w…3mPvT
            </text>
            <path d={`M${Q.x + 18} ${Q.y + 90} H${Q.x + Q.w - 18}`} stroke="rgba(243, 247, 244, 0.06)" />
            {[
              ['8001', 'API'],
              ['1883', 'MQTT'],
              ['cfg', 'ixian.cfg'],
            ].map(([k, v], i) => {
              const x = Q.x + 18 + i * 72;
              const on = cfg ? i === 2 : (lane.id === 'mqtt' ? 1 : 0) === i;
              return (
                <g key={k}>
                  <rect className={flat.chip} x={x} y={Q.y + 104} width={64} height={26} rx={5} stroke={on ? 'rgba(157, 185, 255, 0.55)' : undefined} />
                  <text className={`${flat.mono} ${on ? flat.pillText : flat.dim}`} x={x + 32} y={Q.y + 121} fontSize="9" textAnchor="middle">
                    {i === 2 ? v : `${k} ${v}`}
                  </text>
                </g>
              );
            })}

            {/* the other end checks who sent it */}
            <Endpoint {...G.them} glyph="agent" name="Any address" addr="1EXSqPpj…JdaWm" seed={17} on={phase >= 1} />
            <g className={flat.show} data-on={(!cfg && phase >= 1) || undefined}>
              <Ok x={G.ok[0]} y={G.ok[1]} />
            </g>

            <Packet gref={pkt} />
            <Packet gref={rep} dim />
          </svg>
        </div>
      </div>

      <div className={s.qxTabs} role="tablist" aria-label="QuIXI examples">
        {quixi.tabs.map((x, i) => (
          <button key={x.id} type="button" role="tab" aria-selected={i === tab} onClick={() => setTab(i)}>
            {x.label}
          </button>
        ))}
        <span className={s.qxFlowNote}>{quixiLive.note}</span>
      </div>
      <CodeBlock lines={t.lines} file={t.file} lang={t.lang} source={t.source} />
    </div>
  );
}

function Packet({ gref, dim }: { gref: React.Ref<SVGGElement>; dim?: boolean }) {
  return (
    <g ref={gref} opacity={0}>
      <rect className={flat.packetGlow} x={-9} y={-6} width={18} height={12} rx={4} />
      <rect className={flat.packet} x={-5} y={-3} width={10} height={6} rx={2} opacity={dim ? 0.7 : 1} />
    </g>
  );
}
