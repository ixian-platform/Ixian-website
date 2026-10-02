'use client';

import { useEffect, type RefObject } from 'react';
import { prefersReducedMotion } from '@site/lib/motion';
import s from './flat.module.css';
import { mulberry32 } from '@site/lib/rng';

/* Shared parts of the flat Build illustrations. */

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

/** a small identicon inside a chip: the device's or agent's key, at a glance */
export function Fingerprint({ x, y, seed, n = 3, cell = 5, gap = 1.4 }: { x: number; y: number; seed: number; n?: number; cell?: number; gap?: number }) {
  const size = n * cell + (n - 1) * gap;
  return (
    <g>
      <rect className={s.chip} x={x} y={y} width={size + 8} height={size + 8} rx={3} />
      {identicon(seed, n).map(([c, r]) => (
        <rect key={`${c}-${r}`} className={s.cell} x={x + 4 + c * (cell + gap)} y={y + 4 + r * (cell + gap)} width={cell} height={cell} rx={0.8} opacity={0.4 + ((c + r) % 3) * 0.2} />
      ))}
    </g>
  );
}

/** a check: the other end verified the signature */
export function Ok({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <circle className={s.ok} r={6.5} />
      <path className={s.okMark} d="M-2.6 0.2l1.8 1.8 3.4-3.6" />
    </g>
  );
}

/**
 * Play a short sequence once per hover or focus of the tile (on touch screens, each time it
 * comes into view), then hold still. Nothing plays on scroll, since several tiles moving at
 * once reads as shaking, and nothing plays with reduced motion.
 */
export function usePlayOnce(root: RefObject<HTMLElement | null>, make: (el: HTMLElement) => { play: () => void; kill: () => void }) {
  useEffect(() => {
    const el = root.current;
    if (!el || prefersReducedMotion()) return;
    const seq = make(el);
    const tile = el.closest('.ix-build-tile');
    tile?.addEventListener('mouseenter', seq.play);
    tile?.addEventListener('focusin', seq.play);
    tile?.addEventListener('ix-play', seq.play); // phones: sent when the tile comes into view
    return () => {
      tile?.removeEventListener('ix-play', seq.play);
      tile?.removeEventListener('mouseenter', seq.play);
      tile?.removeEventListener('focusin', seq.play);
      seq.kill();
    };
    // make is static per illustration
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

/** the address a line goes to, riding on it: device → address → device */
export function To({ x, y, addr, w = 104 }: { x: number; y: number; addr: string; w?: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x={-w / 2} y={-10} width={w} height={20} rx={10} fill="var(--ix-bg)" stroke="rgba(157, 185, 255, 0.45)" />
      <path d={`M${-w / 2 + 12} 0h7M${-w / 2 + 16} -3l3 3-3 3`} stroke="var(--ix-route)" strokeWidth={1.1} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <text className={s.mono} x={-w / 2 + 25} y={3.4} fontSize="9.5" fill="var(--ix-route)">
        {addr}
      </text>
    </g>
  );
}

/** sealed end to end */
export function Lock({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x={-7} y={-7} width={14} height={14} rx={3} fill="var(--ix-bg)" />
      <path d="M-3.5 -0.5h7v5h-7zM-2 -0.5v-2a2 2 0 0 1 4 0v2" stroke="var(--ix-route)" strokeWidth={1.1} fill="none" />
    </g>
  );
}

/** a message on its way; `hidden` until the motion shows it */
export function Packet({ id, x, y, dim, hidden, green }: { id: string; x: number; y: number; dim?: boolean; hidden?: boolean; green?: boolean }) {
  return (
    <g data-packet={id} transform={`translate(${x} ${y})`} opacity={hidden ? 0 : undefined}>
      <rect className={green ? s.coinGlow : s.packetGlow} x={-9} y={-6} width={18} height={12} rx={4} />
      <rect className={green ? s.coin : s.packet} x={-5} y={-3} width={10} height={6} rx={2} opacity={dim ? 0.65 : 1} />
    </g>
  );
}
