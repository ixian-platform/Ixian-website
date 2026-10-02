'use client';

import { useEffect, useRef, useState } from 'react';
import { prefersReducedMotion } from '@site/lib/motion';
import { useMedia } from '@site/components/PinSteps';
import s from './About2.module.css';
// Turbopack (dev) links a CSS module only when a client component imports it (see PlatformPage/Numbers.tsx)
import '@site/components/page/page.module.css';
import '@site/components/SectionBoundary.module.css';

// Isometric floor with blocks that rise once on load; reduced motion shows the settled state.

const S = 92; // cell size
const A = S * 0.866; // iso x step
const B = S * 0.5; // iso y step
const N = 22; // cells per side
const W = 1600;
const H = 900;
const OX = 820; // the floor's back corner
const OY = -250;
const G = 0; // inset of a block within its cells
const q = (n: number) => Math.round(n * 100) / 100;
const pt = (x: number, y: number, h: number) => [q(OX + (x - y) * A), q(OY + (x + y) * B - h)] as const;
const P = (ps: readonly (readonly [number, number])[]) => `M${ps.map((p) => p.join(' ')).join(' L')} Z`;

type Block = { i: number; j: number; n: number; h: number; delay: number; dur: number; hub?: boolean };
/* n: footprint in cells (2 = the joined block) */
const BLOCKS: Block[] = [
  { i: 6, j: 0, n: 1, h: 16, delay: 900, dur: 1500 },
  { i: 11, j: 1, n: 1, h: 22, delay: 1150, dur: 1500 },
  { i: 7, j: 3, n: 1, h: 28, delay: 700, dur: 1600 },
  { i: 9, j: 3, n: 2, h: 58, delay: 250, dur: 2200, hub: true },
  { i: 12, j: 5, n: 1, h: 36, delay: 1000, dur: 1600 },
  { i: 9, j: 8, n: 1, h: 20, delay: 1350, dur: 1500 },
].sort((a, b) => a.i + a.j + a.n - (b.i + b.j + b.n));

function faces(b: Block, h: number) {
  const x0 = b.i + G;
  const x1 = b.i + b.n - G;
  const y0 = b.j + G;
  const y1 = b.j + b.n - G;
  const T = [pt(x0, y0, h), pt(x1, y0, h), pt(x1, y1, h), pt(x0, y1, h)];
  return {
    top: P(T),
    left: P([T[3], T[2], pt(x1, y1, 0), pt(x0, y1, 0)]),
    right: P([T[2], T[1], pt(x1, y0, 0), pt(x1, y1, 0)]),
  };
}

const FLOOR = (() => {
  const d: string[] = [];
  for (let k = 0; k <= N; k++) {
    const a = pt(k, 0, 0);
    const b = pt(k, N, 0);
    const c = pt(0, k, 0);
    const e = pt(N, k, 0);
    d.push(`M${a[0]} ${a[1]} L${b[0]} ${b[1]}`, `M${c[0]} ${c[1]} L${e[0]} ${e[1]}`);
  }
  return d.join(' ');
})();

/* the GitHub mark (Octicons mark-github, MIT), laid flat on the joined block's top */
const MARK =
  'M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z';
function markMatrix(b: Block) {
  const size = 1.05; // in cells
  const k = size / 16;
  const [ox, oy] = pt(b.i + (b.n - size) / 2, b.j + (b.n - size) / 2, 0);
  return `matrix(${q(A * k)} ${q(B * k)} ${q(-A * k)} ${q(B * k)} ${ox} ${oy})`;
}

const ease = (t: number) => 1 - Math.pow(1 - t, 3);
/* the lowest point of the joined GitHub block, plus a margin: the crop keeps it in view */
const HUB_BOTTOM = (() => {
  const hub = BLOCKS.find((b) => b.hub)!;
  return pt(hub.i + hub.n, hub.j + hub.n, 0)[1] + 40;
})();

export default function GridRise() {
  const refs = useRef<(SVGGElement | null)[]>([]);
  // phones: the view moves down the floor so the joined block sits above the title, not behind it
  const phone = useMedia('(max-width: 720px)');
  // on ultrawide heroes the drawing scales to the width; crop the view so the joined block stays in sight
  const field = useRef<HTMLDivElement>(null);
  const [top, setTop] = useState(0);
  useEffect(() => {
    const el = field.current;
    if (!el) return;
    const fit = () => {
      const r = el.clientWidth / Math.max(1, el.clientHeight);
      const vh = W / r; // visible height in drawing units when the width fills
      setTop(r > W / H ? Math.round(Math.min(H - vh, Math.max(0, HUB_BOTTOM - vh))) : 0);
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const set = (k: number, h: number) => {
      const g = refs.current[k];
      if (!g) return;
      const f = faces(BLOCKS[k], h);
      const [l, r, t] = g.querySelectorAll('path');
      l.setAttribute('d', f.left);
      r.setAttribute('d', f.right);
      t.setAttribute('d', f.top);
      const m = g.querySelector('g');
      if (m) m.setAttribute('transform', `translate(0 ${q(-h)})`);
    };
    if (prefersReducedMotion()) {
      BLOCKS.forEach((b, k) => set(k, b.h));
      return;
    }
    let raf = 0;
    const t0 = performance.now();
    const tick = (now: number) => {
      let running = false;
      BLOCKS.forEach((b, k) => {
        const t = Math.min(1, Math.max(0, (now - t0 - b.delay) / b.dur));
        if (t < 1) running = true;
        set(k, b.h * ease(t));
      });
      if (running) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div ref={field} className={s.field} data-v="5" aria-hidden>
      <svg viewBox={phone ? `600 150 1000 1800` : `0 ${top} ${W} ${H - top}`} preserveAspectRatio="xMaxYMin slice" className={s.fieldSvg}>
        <path d={FLOOR} className={s.floor} />
        {BLOCKS.map((b, k) => {
          const f = faces(b, 0);
          return (
            <g
              key={`${b.i}-${b.j}`}
              ref={(el) => {
                refs.current[k] = el;
              }}
              className={b.hub ? s.hub : s.riser}
            >
              <path d={f.left} className={s.fieldL} />
              <path d={f.right} className={s.fieldR} />
              <path d={f.top} className={s.fieldT} />
              {b.hub && (
                <g>
                  <path d={MARK} transform={markMatrix(b)} className={s.hubMark} />
                </g>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
