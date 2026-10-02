'use client';

import { useEffect, useRef } from 'react';
import { palette, rgbOf } from '@site/styles/palette';
import s from './S2.module.css';

/* Painted per pixel with dither: a CSS gradient fading from ~7% alpha to 0 has too few
   8-bit steps and bands visibly. Repainted only on resize. */

type Field = { x: number; y: number; w: number; a: number };
const TINT = { blue: rgbOf(palette.route), amber: rgbOf(palette.build), green: rgbOf(palette.live) } as const;

function fieldsFor(): Field[] {
  const r = (a: number, b: number) => a + Math.random() * (b - a);
  return [
    { x: r(62, 92), y: r(6, 30), w: r(860, 1120), a: r(0.06, 0.085) },
    { x: r(0, 26), y: r(40, 70), w: r(640, 880), a: r(0.04, 0.06) },
    { x: r(40, 80), y: r(78, 100), w: r(700, 940), a: r(0.035, 0.055) },
  ];
}

function paint(cv: HTMLCanvasElement, W: number, H: number, fields: Field[], tint: readonly number[]) {
  const ctx = cv.getContext('2d');
  if (!ctx) return;
  cv.width = W;
  cv.height = H;
  const img = ctx.createImageData(W, H);
  const d = img.data;
  const F = fields.map((f) => ({ cx: (f.x / 100) * W, cy: (f.y / 100) * H, r: f.w / 2, a: f.a * 255 }));
  // only the pixels inside some field's circle can be tinted: walk each row between the
  // leftmost and rightmost circle edge instead of the whole canvas
  const y0 = Math.max(0, Math.floor(Math.min(...F.map((f) => f.cy - f.r))));
  const y1 = Math.min(H, Math.ceil(Math.max(...F.map((f) => f.cy + f.r))));
  for (let y = y0; y < y1; y++) {
    let x0 = W;
    let x1 = 0;
    for (const f of F) {
      const dy = y - f.cy;
      if (Math.abs(dy) >= f.r) continue;
      const half = Math.sqrt(f.r * f.r - dy * dy);
      x0 = Math.min(x0, Math.max(0, Math.floor(f.cx - half)));
      x1 = Math.max(x1, Math.min(W, Math.ceil(f.cx + half)));
    }
    for (let x = x0; x < x1; x++) {
      let a = 0;
      for (const f of F) {
        const dx = x - f.cx;
        const dy = y - f.cy;
        const t = Math.sqrt(dx * dx + dy * dy) / f.r;
        if (t < 1) {
          const u = 1 - t;
          a += f.a * u * u * (3 - 2 * u); // smoothstep: no hard rim, no bright core
        }
      }
      if (a <= 0) continue;
      const i = (y * W + x) * 4;
      d[i] = tint[0];
      d[i + 1] = tint[1];
      d[i + 2] = tint[2];
      d[i + 3] = Math.min(255, Math.floor(a + Math.random())); // dither: round up with the fractional part's odds
    }
  }
  ctx.putImageData(img, 0, 0);
}

/** tone: blue for S2 (traffic), amber for Build (developer action), green for IXI (value). */
export default function S2Backdrop({ tone = 'blue' }: { tone?: 'blue' | 'amber' | 'green' }) {
  const wrap = useRef<HTMLDivElement>(null);
  const cv = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const el = wrap.current;
    const c = cv.current;
    if (!el || !c) return;
    const fields = fieldsFor();
    let lastW = 0;
    let lastH = 0;
    let t = 0;
    const run = () => {
      const r = el.getBoundingClientRect();
      const W = Math.round(r.width);
      const H = Math.round(r.height);
      if (W < 2 || H < 2) return;
      if (W === lastW && Math.abs(H - lastH) < 48) return;
      lastW = W;
      lastH = H;
      paint(c, W, H, fields, TINT[tone]);
      c.setAttribute('data-on', '');
    };
    // painted when the section comes within a screen of the viewport, not on page load
    let near = false;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting || near) return;
        near = true;
        io.disconnect();
        run();
      },
      { rootMargin: '100% 0px' },
    );
    io.observe(el);
    const ro = new ResizeObserver(() => {
      if (!near) return;
      clearTimeout(t);
      t = window.setTimeout(run, 200);
    });
    ro.observe(el);
    return () => {
      clearTimeout(t);
      io.disconnect();
      ro.disconnect();
    };
  }, [tone]);
  return (
    <div ref={wrap} className={s.backdrop} data-tone={tone} aria-hidden>
      <canvas ref={cv} />
    </div>
  );
}
