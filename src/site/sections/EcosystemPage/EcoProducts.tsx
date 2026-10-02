'use client';

import { useEffect, useRef, useState } from 'react';
import { useNetworkPulse, fmt } from '@site/lib/useNetworkPulse';
import { prefersReducedMotion } from '@site/lib/motion';
import { eco } from '@site/content/ecosystem';
import { Fingerprint, Glow, Glyph, Lock, Pill, Relay, route, flat } from '@site/components/flat/Flat';
import s from './Eco.module.css';

const P = Object.fromEntries(eco.products.items.map((p) => [p.id, p]));

function Meta({ id }: { id: string }) {
  const p = P[id];
  return (
    <span className={s.cellMeta}>
      <span>{p.kind}</span>
      <span data-status={p.status === 'Coming soon' ? 'progress' : 'live'}>
        <i aria-hidden />
        {p.status}
      </span>
    </span>
  );
}

function Text({ id }: { id: string }) {
  const p = P[id];
  return (
    <div className={s.cellText}>
      <Meta id={id} />
      <b className={s.cellName}>{p.name}</b>
      <p className={s.cellBody}>{p.body}</p>
      <span className={s.cellLinks}>
        {p.links.map((l) => (
          <a key={l.href} href={l.href} target={/^https?:/.test(l.href) ? '_blank' : undefined} rel="noreferrer">
            {l.label} {/^https?:/.test(l.href) ? '↗' : '→'}
          </a>
        ))}
      </span>
    </div>
  );
}

/* ixiscope: the height, large, and the chain */
function Scope() {
  const pulse = useNetworkPulse();
  const h = pulse.height;
  const [pt, setPt] = useState<number | null>(null);
  const row = useRef<HTMLDivElement>(null);
  const prev = useRef<number | null>(null);
  useEffect(() => {
    const was = prev.current;
    prev.current = h;
    if (h == null || was == null || h === was || prefersReducedMotion()) return;
    row.current?.animate([{ transform: 'translateX(28px)' }, { transform: 'none' }], { duration: 800, easing: 'cubic-bezier(0.65, 0, 0.35, 1)' });
  }, [h]);
  const cells = h == null ? [] : Array.from({ length: 24 }, (_, i) => h - 23 + i);
  return (
    <div className={s.scope2}>
      <p className={s.scopeBig}>
        <span className={s.scopeLabel}>
          <i data-on={pulse.ok || undefined} aria-hidden /> {pt != null ? `Block ${fmt(pt)}` : 'Latest block, live'}
        </span>
        <b className={s.num}>{h != null ? fmt(pt ?? h) : '…'}</b>
      </p>
      <div ref={row} className={s.chain2} onPointerLeave={() => setPt(null)}>
        {cells.map((n, i) => (
          <span key={n} data-new={i === cells.length - 1 || undefined} data-on={pt === n || undefined} onPointerEnter={() => setPt(n)} style={{ opacity: 0.25 + (i / cells.length) * 0.75 }} />
        ))}
      </div>
    </div>
  );
}

/* QuIXI: one drawing per transport */
const CODE = 'M8.5 7.5L4 12l4.5 4.5M15.5 7.5L20 12l-4.5 4.5M13.5 5.5l-3 13';
function Transports() {
  const T = ['REST', 'MQTT', 'RabbitMQ'] as const;
  const [t, setT] = useState<(typeof T)[number]>('REST');
  const note = { REST: 'Your code calls QuIXI over HTTP, and QuIXI replies.', MQTT: 'Publish to a topic; QuIXI delivers, and pushes what arrives.', RabbitMQ: 'Queue the message; QuIXI picks it up and sends it.' }[t];
  const MID = 58;
  return (
    <div className={s.tx}>
      <div className={s.txTabs} role="group" aria-label="Transport">
        {T.map((x) => (
          <button key={x} type="button" aria-pressed={t === x} onClick={() => setT(x)} onPointerEnter={() => setT(x)}>
            {x}
          </button>
        ))}
      </div>
      <svg viewBox="0 0 320 116" className={`${flat.svg} ${s.txSvg}`} fill="none" aria-hidden key={t}>
        <Glow id="ixTxGlow" cx={160} cy={MID} rx={120} ry={70} o={0.1} />
        {/* your app */}
        <rect className={flat.card} x={4} y={MID - 22} width={64} height={44} rx={6} />
        <Glyph name={CODE} x={14} y={MID - 16} size={16} />
        <rect className={flat.bar} x={14} y={MID + 8} width={34} height={3} rx={1.5} />
        {/* QuIXI, an identity */}
        <rect className={flat.tray} x={128} y={MID - 32} width={76} height={64} rx={10} />
        <rect className={`${flat.cardKey} ${flat.cardKeyOn}`} x={134} y={MID - 26} width={64} height={52} rx={8} />
        <Fingerprint x={148} y={MID - 20} seed={7} n={5} cell={3.6} gap={1} pad={4} />
        <text className={`${flat.mono} ${flat.dim}`} x={166} y={MID + 20} fontSize="7.5" textAnchor="middle">
          QuIXI
        </text>
        {/* out to S2, sealed, to the other end */}
        <path className={flat.wire} d={`M198 ${MID} H280`} />
        <path className={flat.live} d={`M198 ${MID} H280`} />
        <Relay x={228} y={MID} size={11} />
        <Lock x={254} y={MID} />
        <rect className={flat.card} x={280} y={MID - 16} width={36} height={32} rx={6} />
        <Fingerprint x={289} y={MID - 7} seed={17} n={3} cell={3.4} gap={0.9} pad={0} bare />
        {t === 'REST' && (
          <>
            <path className={flat.live} d={`M68 ${MID - 7} H134`} />
            <path className={flat.live} d={`M134 ${MID + 7} H68`} strokeDasharray="3 4" />
            <Packet x={96} y={MID - 7} />
            <Packet x={108} y={MID + 7} dim />
          </>
        )}
        {t === 'MQTT' && (
          <>
            <path className={flat.wire} d={`M68 ${MID} H134`} />
            <path className={flat.live} d={route([[68, MID], [84, MID], [84, 20], [118, 20], [118, MID], [134, MID]], 8)} />
            <Pill x={101} y={20} text="Chat/#" arrow={false} w={52} />
            <Packet x={118} y={40} />
          </>
        )}
        {t === 'RabbitMQ' && (
          <>
            <path className={flat.wire} d={`M68 ${MID} H134`} />
            <path className={flat.live} d={`M68 ${MID} H76 M126 ${MID} H134`} />
            {[0, 1, 2, 3].map((i) => (
              <rect key={i} className={i === 3 ? flat.cell : flat.chip} x={80 + i * 11.5} y={MID - 9} width={8} height={18} rx={2} opacity={i === 3 ? 0.85 : 1} />
            ))}
            <text className={`${flat.mono} ${flat.dim}`} x={101} y={MID + 26} fontSize="7.5" textAnchor="middle">
              queue
            </text>
          </>
        )}
      </svg>
      <p className={s.txNote}>{note}</p>
    </div>
  );
}

function Packet({ x, y, dim }: { x: number; y: number; dim?: boolean }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect className={flat.packetGlow} x={-9} y={-6} width={18} height={12} rx={4} />
      <rect className={flat.packet} x={-5} y={-3} width={10} height={6} rx={2} opacity={dim ? 0.65 : 1} />
    </g>
  );
}

/* Spixi Bot: one channel showing the four uses: your own community, a device, a paid post and an agent */
function Channel() {
  const rows = [
    { k: 'admin', who: 'Admin', text: 'Welcome. This channel runs on our own server.' },
    { k: 'device', who: 'dlt-node-3', text: 'Alert: no new block for 5 minutes.' },
    { k: 'msg', who: 'yourname', text: 'Is the fix out yet?', tag: '0.10 IXI' },
    { k: 'agent', who: 'Agent', text: 'Yes, it shipped this morning. Today: 3 questions answered, 1 alert closed.' },
  ];
  return (
    <div className={s.channel}>
      <div className={s.channelHead}>
        <b># your-community</b>
        <span>Self-hosted</span>
      </div>
      <ul className={s.channelRows}>
        {rows.map((r) => (
          <li key={r.k} data-k={r.k}>
            <i className={s.channelAvatar} aria-hidden />
            <span>
              <b>{r.who}</b> {r.text}
            </span>
            {r.tag && <em className={s.channelTag}>{r.tag}</em>}
          </li>
        ))}
      </ul>
      <p className={s.sharedNote}>Design preview. Agents, devices and payments are planned.</p>
    </div>
  );
}

/* IXI Names: one name, its records */
function Names() {
  const rec = [
    { k: 'wallet', v: '1EXSqPpj49…aBakwNn9sJdaWm' },
    { k: 'endpoint', v: '3WLUy9hQGy…FTZDnavy9E9sT' },
    { k: 'sub', v: 'shop.yourname' },
  ];
  return (
    <div className={s.names}>
      <span className={s.namesPill}>yourname</span>
      <ul className={s.namesRec}>
        {rec.map((r) => (
          <li key={r.k}>
            <span>{r.k}</span>
            <code>{r.v}</code>
          </li>
        ))}
      </ul>
      <p className={s.sharedNote}>Example records.</p>
    </div>
  );
}

export default function EcoProducts() {
  const grid = useRef<HTMLUListElement>(null);
  // --mx/--my drive the pointer-following light in CSS
  const move = (e: React.PointerEvent) => {
    const el = grid.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty('--mx', `${Math.round(e.clientX - r.left)}px`);
    el.style.setProperty('--my', `${Math.round(e.clientY - r.top)}px`);
  };
  return (
    <ul ref={grid} className={s.grid2} data-three onPointerMove={move}>
      <li className={s.cell} data-c="scope">
        <Scope />
        <Text id="ixiscope" />
      </li>
      <li className={s.cell} data-c="quixi">
        <Transports />
        <Text id="quixi" />
      </li>
      <li className={s.cell} data-c="names">
        <Names />
        <Text id="names" />
        <i className={s.cross} data-at="j3" aria-hidden />
      </li>
      <li className={s.cell} data-c="bot">
        <Text id="bot" />
        <Channel />
      </li>
      {['a', 'b', 'c', 'd', 'e3', 'g3', 'h3'].map((k) => (
        <i key={k} className={s.cross} data-at={k} aria-hidden />
      ))}
    </ul>
  );
}
