import { GLYPH } from '@site/components/endpointGlyphs';
import s from './HowItWorks.module.css';
import { palette } from '@site/styles/palette';

/* The timeline in HowItWorks.tsx drives these parts only through their data-* attributes;
   keep the two in sync (data-from="k": shown from step k on). */

export const ROUTE = palette.route; // GSAP colour tweens need a literal
export const EDGE = 'rgba(243, 247, 244, 0.16)';
export const WIRE = 'rgba(243, 247, 244, 0.12)';
export const CARD_FILL = '#111413';

/** a 2D endpoint card: glyph, name in sentence case, address */
export function Card({ side, x, y, w, h, glyph, name, addr }: { side: 'a' | 'b'; x: number; y: number; w: number; h: number; glyph: string; name: string; addr: string }) {
  const right = side === 'b';
  return (
    <g data-ep={side} transform={`translate(${x} ${y})`}>
      <rect x={-7} y={-7} width={w + 14} height={h + 14} rx={10} fill="rgba(243, 247, 244, 0.012)" stroke="rgba(243, 247, 244, 0.05)" />
      <rect data-bring={side} x={0} y={0} width={w} height={h} rx={6} stroke={ROUTE} strokeWidth={1} opacity={0} />
      <rect data-hot={side} data-rest={EDGE} x={0} y={0} width={w} height={h} rx={6} fill={CARD_FILL} stroke={EDGE} strokeWidth={1} />
      <g transform={`translate(14 ${h / 2 - 10}) scale(${20 / 24})`}>
        <path data-glyph={side} d={GLYPH[glyph] ?? GLYPH.device} stroke="var(--ix-text-2)" strokeWidth={1.5} fill="none" strokeLinejoin="round" />
      </g>
      <text className={s.epName} data-name={side} data-final={name.charAt(0).toUpperCase() + name.slice(1)} x={44} y={27} fontSize="13.5" fontWeight="500" fill="var(--ix-text)">
        {name.charAt(0).toUpperCase() + name.slice(1)}
      </text>
      <text data-addr={side} data-final={addr} x={44} y={44} fontSize="10.5" fill="var(--ix-text-3)" className={s.addr}>
        {addr}
      </text>
      <g data-key={side} opacity={0} transform={`translate(${w - 22} 9)`}>
        <path d="M11.5 7.5a4 4 0 1 1-2.2 3.6L2 18.5M4.5 16l2 2M6.5 14l2 2" stroke={ROUTE} strokeWidth={1.3} fill="none" strokeLinecap="round" transform="scale(0.72)" />
      </g>
      <Check side={side} x={right ? w : 0} y={-16} anchor={right ? 'end' : 'start'} />
    </g>
  );
}

export function Check({ side, x, y, anchor }: { side: 'a' | 'b'; x: number; y: number; anchor: 'start' | 'end' }) {
  return (
    <text data-check={side} x={x} y={y} textAnchor={anchor} fontSize="11.5" fill={ROUTE} opacity={0} className={s.note}>
      ✓ verified
    </text>
  );
}

/** the account provider nobody asks (proof) */
export function Ghost({ x, y }: { x: number; y: number }) {
  return (
    <g data-ghost opacity={0}>
      <rect x={x - 70} y={y} width={140} height={26} rx={4} stroke="var(--ix-text-3)" strokeDasharray="3 4" />
      <text x={x} y={y + 17} textAnchor="middle" fontSize="9.5" letterSpacing="0.1em" fill="var(--ix-text-3)" className={s.tag}>
        ACCOUNT PROVIDER
      </text>
      <path data-strike d={`M${x - 78} ${y + 13} H${x + 78}`} stroke="var(--ix-text-2)" strokeWidth={1.2} />
    </g>
  );
}

/** a small pill on a line: post-quantum (talk), signed (pay) */
export function Badge({ attr, x, y, w, text, color = ROUTE, lock }: { attr: 'pq' | 'signed'; x: number; y: number; w: number; text: string; color?: string; lock?: boolean }) {
  return (
    <g {...{ [`data-${attr}`]: '' }} opacity={0} transform={`translate(${x} ${y})`}>
      <g data-badge-in>
        <rect x={-w / 2} y={-10} width={w} height={20} rx={4} fill="var(--ix-bg)" stroke={color} strokeWidth={1} strokeOpacity={0.55} />
        {lock ? (
          <path d={`M${-w / 2 + 10} -1.5h7v6h-7zM${-w / 2 + 11.5} -1.5v-2a2 2 0 0 1 4 0v2`} stroke={color} strokeWidth={1.1} fill="none" />
        ) : (
          <path d={`M${-w / 2 + 10} 0.5l2.2 2.2 4.4-4.6`} stroke={color} strokeWidth={1.3} fill="none" />
        )}
        <text x={-w / 2 + 22} y={3.8} fontSize="11" fill={color}>
          {text}
        </text>
      </g>
    </g>
  );
}

/** the tokens that travel, drawn last so they ride over everything */
export function Tokens() {
  return (
    <>
      <g data-challenge opacity={0}>
        <rect x={-6} y={-6} width={12} height={12} rx={2} fill="var(--ix-bg)" stroke="var(--ix-text)" strokeWidth={1.3} />
        <text x={0} y={3.2} textAnchor="middle" fontSize="8" fill="var(--ix-text)" fontWeight="600">
          ?
        </text>
      </g>
      <g data-sig opacity={0}>
        <rect x={-6} y={-6} width={12} height={12} rx={2} fill="var(--ix-text)" />
        <path d="M-3 0.2l2 2 4-4.2" stroke="var(--ix-bg)" strokeWidth={1.5} />
      </g>
      <g data-kem opacity={0}>
        <rect x={-5} y={-5} width={10} height={10} rx={2} fill="var(--ix-bg)" stroke={ROUTE} strokeWidth={1.3} />
        <rect x={-1.5} y={-1.5} width={3} height={3} fill={ROUTE} />
      </g>
      <g data-kem2 opacity={0}>
        <rect x={-5} y={-5} width={10} height={10} rx={2} fill="var(--ix-bg)" stroke={ROUTE} strokeWidth={1.3} />
        <rect x={-1.5} y={-1.5} width={3} height={3} fill={ROUTE} />
      </g>
      <g data-msg opacity={0}>
        <rect x={-7} y={-5} width={14} height={10} rx={2} fill="var(--ix-text)" />
        <path d="M-4 -5 v-3 a4 4 0 0 1 8 0 v3" stroke="var(--ix-text)" strokeWidth={1.5} />
      </g>
      <g data-coin opacity={0}>
        <circle r={7} fill="var(--ix-bg)" stroke="var(--ix-text)" strokeWidth={1.5} />
        <text y={3} textAnchor="middle" fontSize="7.5" fill="var(--ix-text)" fontWeight="600">
          IXI
        </text>
      </g>
      <text data-tok-label className={s.tag} x={0} y={0} fontSize="10" fill="var(--ix-text-2)" opacity={0} />
    </>
  );
}

/** "one of N relays": the live S2 count when the network answered, never a made-up number */
export const relayCount = (n: number | null) => (n != null ? `one of ${n.toLocaleString('en-US')} relays` : 'one of many relays');
