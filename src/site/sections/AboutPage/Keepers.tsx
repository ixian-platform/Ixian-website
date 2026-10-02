'use client';

import { useState } from 'react';
import { useNetworkPulse, fmt } from '@site/lib/useNetworkPulse';
import { maintainers } from '@site/content/about';
import { Fingerprint, Glow, Relay, flat } from '@site/components/flat/Flat';
import s from './About2.module.css';

const q = (n: number) => Math.round(n * 100) / 100;
const CONTRIB = [5, 7, 17, 3, 18, 25, 9, 33, 2, 6, 19, 36];

/** `drawing={false}` hides the rings and legend; the Operators row keeps the live count */
export default function Keepers({ drawing = true }: { drawing?: boolean } = {}) {
  const p = useNetworkPulse();
  const n = p.dlt != null && p.s2 != null ? p.dlt + p.s2 : null;
  const [on, setOn] = useState<number | null>(null);
  const dim = (i: number) => (on != null && on !== i ? 0.35 : 1);
  const R = [0, 104, 150, 184];
  return (
    <div className={s.keep} data-bare={!drawing || undefined}>
      {drawing && (
      <figure className={s.keepFig}>
      <svg viewBox="-210 -210 420 420" className={`${flat.svg} ${s.rings}`} fill="none" aria-hidden>
        <Glow id="ixKeepGlow" cx={0} cy={0} rx={200} ry={200} o={0.12} />
        {/* orbits */}
        <circle r={R[1]} className={flat.faint} opacity={dim(1)} />
        <circle r={R[2]} className={on === 2 ? flat.live : flat.wire} opacity={dim(2)} />
        <circle r={R[3]} className={on === 2 ? flat.live : flat.wire} opacity={dim(2)} />

        {/* operators: the S2 relays and the DLT nodes online now */}
        <g opacity={dim(2)}>
          {p.s2 != null &&
            Array.from({ length: p.s2 }, (_, i) => {
              const a = (i / p.s2!) * Math.PI * 2 - Math.PI / 2 + 0.13;
              return (
                <g key={`s${i}`} className={s.op} style={{ animationDelay: `${i * 40}ms` }}>
                  <Relay x={q(R[2] * Math.cos(a))} y={q(R[2] * Math.sin(a))} size={11} />
                </g>
              );
            })}
          {p.dlt != null &&
            Array.from({ length: p.dlt }, (_, i) => {
              const a = (i / p.dlt!) * Math.PI * 2 - Math.PI / 2;
              return <circle key={`d${i}`} cx={q(R[3] * Math.cos(a))} cy={q(R[3] * Math.sin(a))} r={2.8} className={`${flat.dlt} ${s.op}`} style={{ animationDelay: `${i * 14}ms` }} />;
            })}
        </g>

        {/* contributors: keys around the core */}
        <g opacity={dim(1)}>
          {CONTRIB.map((seed, i) => {
            const a = (i / CONTRIB.length) * Math.PI * 2 + 0.26;
            const x = q(R[1] * Math.cos(a));
            const y = q(R[1] * Math.sin(a));
            return (
              <g key={i}>
                <rect className={flat.chip} x={x - 11} y={y - 11} width={22} height={22} rx={4} fill="#0a0d0c" stroke={on === 1 ? 'rgba(157, 185, 255, 0.5)' : undefined} />
                <Fingerprint x={x - 8} y={y - 8} seed={seed} n={3} cell={4.4} gap={1} pad={0} bare dim={on !== 1} />
              </g>
            );
          })}
        </g>

        {/* the core maintainer */}
        <g opacity={dim(0)}>
          <rect className={flat.tray} x={-70} y={-38} width={140} height={76} rx={14} />
          <rect className={`${flat.cardKey} ${on === 0 ? flat.cardKeyOn : ''}`} x={-62} y={-30} width={124} height={60} rx={10} />
          <Fingerprint x={-50} y={-18} seed={7} n={5} cell={4.4} gap={1} pad={4} />
          <text className={`${flat.sans} ${flat.bright}`} x={-2} y={-2} fontSize="13" fontWeight={600}>
            IXI Labs
          </text>
          <rect className={flat.bar} x={-2} y={8} width={44} height={3} rx={1.5} />
        </g>
      </svg>
        <figcaption className={s.keepLegend}>
          <span>
            <i data-k="dlt" aria-hidden /> DLT nodes {p.dlt != null ? fmt(p.dlt) : '…'}
          </span>
          <span>
            <i data-k="s2" aria-hidden /> S2 relays {p.s2 != null ? fmt(p.s2) : '…'}
          </span>
          <span>Live</span>
        </figcaption>
      </figure>
      )}
      <ol className={s.keepList}>
        {maintainers.items.map((m, i) => (
          <li key={m.title} onMouseEnter={() => setOn(i)} onMouseLeave={() => setOn(null)} onFocus={() => setOn(i)} onBlur={() => setOn(null)} data-on={on === i || undefined}>
            {drawing && <span className={s.keepNo}>{['Centre', 'Around it', 'Outside'][i]}</span>}
            <b>
              {m.title}
              {i === 2 && (
                <span className={s.keepLive}>
                  <i data-on={n != null || undefined} aria-hidden />
                  {n != null ? `${fmt(n)} nodes online now` : '…'}
                </span>
              )}
            </b>
            <p>{m.body}</p>
            <a href={m.link.href} target={/^https?:/.test(m.link.href) ? '_blank' : undefined} rel="noreferrer">
              {m.link.label} {/^https?:/.test(m.link.href) ? '↗' : '→'}
            </a>
          </li>
        ))}
      </ol>
    </div>
  );
}
