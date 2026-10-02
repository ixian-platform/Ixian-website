'use client';

import { useEffect, useRef, type ReactNode, type RefObject, type SVGProps } from 'react';
import { GLYPH } from '@site/components/endpointGlyphs';
import { prefersReducedMotion } from '@site/lib/motion';
import s from './Flat.module.css';
import { mulberry32 } from '@site/lib/rng';

// SVG drawing primitives shared by the site's diagrams (same parts as Build/visuals).

export { s as flat };

/** orthogonal wiring through the given points, each corner rounded by k */
export function route(pts: [number, number][], k = 12) {
  let d = `M${pts[0][0]} ${pts[0][1]}`;
  for (let i = 1; i < pts.length - 1; i++) {
    const [px, py] = pts[i - 1];
    const [x, y] = pts[i];
    const [nx, ny] = pts[i + 1];
    const inx = Math.sign(x - px);
    const iny = Math.sign(y - py);
    const outx = Math.sign(nx - x);
    const outy = Math.sign(ny - y);
    const kk = Math.min(k, Math.abs(x - px || y - py) / 2, Math.abs(nx - x || ny - y) / 2);
    d += ` L${x - inx * kk} ${y - iny * kk} Q${x} ${y} ${x + outx * kk} ${y + outy * kk}`;
  }
  const [lx, ly] = pts[pts.length - 1];
  return `${d} L${lx} ${ly}`;
}

/** a key fingerprint as an n × n mirrored identicon, seeded, so server and browser agree */
export function identicon(seed: number, n = 5) {
  const r = mulberry32(seed);
  const half = Math.ceil(n / 2);
  const cells: [number, number][] = [];
  for (let row = 0; row < n; row++)
    for (let col = 0; col < half; col++)
      if (r() > 0.45) {
        cells.push([col, row]);
        if (col < n - 1 - col) cells.push([n - 1 - col, row]);
      }
  return cells;
}

const r2 = (n: number) => Math.round(n * 100) / 100;

export function Fingerprint({ x, y, seed, n = 3, cell = 5, gap = 1.4, pad = 4, dim, bare }: { x: number; y: number; seed: number; n?: number; cell?: number; gap?: number; pad?: number; dim?: boolean; bare?: boolean }) {
  const size = n * cell + (n - 1) * gap;
  return (
    <g>
      {!bare && <rect className={s.chip} x={x} y={y} width={size + pad * 2} height={size + pad * 2} rx={Math.max(3, cell * 0.8)} />}
      {identicon(seed, n).map(([c, r]) => (
        <rect key={`${c}-${r}`} className={dim ? s.cellDim : s.cell} x={r2(x + pad + c * (cell + gap))} y={r2(y + pad + r * (cell + gap))} width={cell} height={cell} rx={r2(cell * 0.17)} opacity={r2(0.4 + ((c + r) % 3) * 0.2)} />
      ))}
    </g>
  );
}

export function Glow({ id, cx, cy, rx, ry, color = 'var(--ix-route)', o = 0.11 }: { id: string; cx: number; cy: number; rx: number; ry: number; color?: string; o?: number }) {
  return (
    <>
      <defs>
        <radialGradient id={id} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor={color} stopOpacity={o} />
          <stop offset="1" stopColor={color} stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill={`url(#${id})`} />
    </>
  );
}

export function Glyph({ name, x, y, size = 20, dim }: { name: string; x: number; y: number; size?: number; dim?: boolean }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${r2(size / 24)})`}>
      <path className={`${s.glyph} ${dim ? s.glyphDim : ''}`} d={GLYPH[name] ?? name} />
    </g>
  );
}

type Box = { x: number; y: number; w: number; h: number };

/** a small endpoint: tray, card, glyph, a name (or a bar), its address, and its key */
export function Endpoint({ x, y, w, h, glyph, name, addr, seed, on, ghost, tray = true, children }: Box & { glyph: string; name?: ReactNode; addr?: ReactNode; seed?: number; on?: boolean; ghost?: boolean; tray?: boolean; children?: ReactNode }) {
  const fp = seed != null;
  return (
    <g>
      {tray && !ghost && <rect className={s.tray} x={x - 6} y={y - 6} width={w + 12} height={h + 12} rx={10} />}
      <rect className={ghost ? s.ghost : `${s.card} ${on ? s.cardOn : ''}`} x={x} y={y} width={w} height={h} rx={6} />
      <Glyph name={glyph} x={x + 12} y={y + (addr ? 12 : h / 2 - 10)} size={18} dim={ghost} />
      {name != null ? (
        <text className={`${s.sans} ${ghost ? s.addr : s.bright}`} x={x + 38} y={y + 25} fontSize="12" fontWeight={600}>
          {name}
        </text>
      ) : (
        <rect className={s.bar} x={x + 38} y={y + 19} width={Math.min(52, w - 80)} height={4} rx={2} />
      )}
      {addr != null && (
        <text className={`${s.mono} ${s.dim}`} x={x + 12} y={y + h - 13} fontSize="9.5">
          {addr}
        </text>
      )}
      {fp && <Fingerprint x={x + w - 31} y={y + 9} seed={seed} n={3} cell={5} gap={1.4} dim={ghost} />}
      {children}
    </g>
  );
}

export function Relay({ x, y, size = 14 }: { x: number; y: number; size?: number }) {
  const h = size / 2;
  return (
    <g>
      <rect className={s.relay} x={x - h} y={y - h} width={size} height={size} rx={size / 4} />
      <rect className={s.relayCore} x={x - size * 0.18} y={y - size * 0.18} width={size * 0.36} height={size * 0.36} rx={1} />
    </g>
  );
}

export function Ok({ x, y, ...rest }: { x: number; y: number } & SVGProps<SVGGElement>) {
  return (
    <g transform={`translate(${x} ${y})`} {...rest}>
      <circle className={s.ok} r={6.5} />
      <path className={s.okMark} d="M-2.6 0.2l1.8 1.8 3.4-3.6" />
    </g>
  );
}

export function No({ x, y, ...rest }: { x: number; y: number } & SVGProps<SVGGElement>) {
  return (
    <g transform={`translate(${x} ${y})`} {...rest}>
      <circle className={s.no} r={6.5} />
      <path className={s.noMark} d="M-2.4 -2.4l4.8 4.8M2.4 -2.4l-4.8 4.8" />
    </g>
  );
}

export function Lock({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect className={s.lockBg} x={-7} y={-7} width={14} height={14} rx={3} />
      <path className={s.lock} d="M-3.5 -0.5h7v5h-7zM-2 -0.5v-2a2 2 0 0 1 4 0v2" />
    </g>
  );
}

/** an address or a topic riding on a wire */
export function Pill({ x, y, text, w, ghost, arrow = true }: { x: number; y: number; text: ReactNode; w?: number; ghost?: boolean; arrow?: boolean }) {
  const len = typeof text === 'string' ? text.length : 12;
  const ww = w ?? Math.round(len * 5.9 + (arrow ? 34 : 20));
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect className={ghost ? s.pillGhost : s.pill} x={-ww / 2} y={-10} width={ww} height={20} rx={10} />
      {arrow && <path d={`M${-ww / 2 + 12} 0h7M${-ww / 2 + 16} -3l3 3-3 3`} className={ghost ? s.noMark : s.lock} strokeLinecap="round" strokeLinejoin="round" />}
      <text className={`${s.mono} ${ghost ? s.pillGhostText : s.pillText}`} x={arrow ? -ww / 2 + 25 : 0} y={3.4} fontSize="9.5" textAnchor={arrow ? 'start' : 'middle'}>
        {text}
      </text>
    </g>
  );
}

export function Ends({ pts }: { pts: [number, number][] }) {
  return (
    <>
      {pts.map(([x, y]) => (
        <circle key={`${x}-${y}`} className={s.end} cx={x} cy={y} r={2} />
      ))}
    </>
  );
}

/** Runs `play` once when the element is in view, or `still` (the end state) under reduced motion. */
export function usePlayInView(ref: RefObject<Element | null>, play: () => void, still: () => void, threshold = 0.35) {
  const fns = useRef({ play, still });
  fns.current = { play, still };
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion()) {
      fns.current.still();
      return;
    }
    const io = new IntersectionObserver(
      (es) => {
        if (es.some((e) => e.isIntersecting)) {
          io.disconnect();
          fns.current.play();
        }
      },
      { threshold }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, threshold]);
}
