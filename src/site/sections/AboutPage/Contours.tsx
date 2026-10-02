'use client';

import { useEffect, useRef } from 'react';
import { prefersReducedMotion } from '@site/lib/motion';
import { scrollBusy } from '@site/lib/scrollBusy';
import s from './About2.module.css';
import { mulberry32 as rng } from '@site/lib/rng';

// Contour lines lifted by drifting bumps. ~24 fps, only while on screen; reduced motion draws one frame.

const LINES = 40;
const STEP = 10; // px between samples along a line


export default function Contours() {
  const wrap = useRef<HTMLDivElement>(null);
  const fg = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const el = wrap.current;
    const cl = fg.current;
    const ctx = cl?.getContext('2d');
    if (!el || !cl || !ctx) return;
    let W = 1;
    let H = 1;
    let dpr = 1;
    const size = () => {
      const r = el.getBoundingClientRect();
      W = Math.max(1, Math.round(r.width));
      H = Math.max(1, Math.round(r.height));
      dpr = 1;
      cl.width = Math.round(W * dpr);
      cl.height = Math.round(H * dpr);
    };
    // the bumps: each drifts on its own slow loop
    const r = rng(23);
    const bumps = Array.from({ length: 5 }, () => ({ x: 0.45 + r() * 0.5, y: 0.1 + r() * 0.8, ax: 0.08 + r() * 0.12, ay: 0.06 + r() * 0.1, f: 0.05 + r() * 0.06, ph: r() * 6.28, amp: 26 + r() * 30, rad: 0.12 + r() * 0.1 }));

    const draw = (t: number) => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      const B = bumps.map((b) => ({ x: (b.x + Math.sin(t * b.f + b.ph) * b.ax) * W, y: (b.y + Math.cos(t * b.f * 0.8 + b.ph) * b.ay) * H, amp: b.amp, rad: b.rad * Math.max(W, H) }));
      const top = H * 0.06;
      const gap = (H * 0.9) / LINES;
      for (let i = 0; i < LINES; i++) {
        const y0 = top + i * gap;
        ctx.beginPath();
        for (let x = W * 0.3; x <= W + STEP; x += STEP) {
          let dy = Math.sin(x * 0.004 + i * 0.21 + t * 0.12) * 3;
          for (const b of B) {
            const d2 = ((x - b.x) ** 2 + (y0 - b.y) ** 2) / (b.rad * b.rad);
            dy -= b.amp * Math.exp(-d2 * 2.2);
          }
          if (x === W * 0.3) ctx.moveTo(x, y0 + dy);
          else ctx.lineTo(x, y0 + dy);
        }
        // every sixth line a touch brighter, like index contours on a map
        ctx.strokeStyle = i % 6 === 0 ? 'rgba(232, 238, 244, 0.22)' : 'rgba(232, 238, 244, 0.095)';
        ctx.lineWidth = i % 6 === 0 ? 0.9 : 0.7;
        ctx.stroke();
      }
    };

    size();
    draw(0);
    const ro = new ResizeObserver(() => {
      size();
      draw(performance.now() / 1000);
    });
    ro.observe(el);
    if (prefersReducedMotion()) return () => ro.disconnect();
    let raf = 0;
    let last = 0;
    let on = false;
    const loop = (now: number) => {
      if (!on) return;
      raf = requestAnimationFrame(loop);
      if (now - last < 42 || scrollBusy()) return;
      last = now;
      draw(now / 1000);
    };
    const io = new IntersectionObserver(([e]) => {
      on = e.isIntersecting;
      cancelAnimationFrame(raf);
      if (on) raf = requestAnimationFrame(loop);
    });
    io.observe(el);
    return () => {
      on = false;
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
    };
  }, []);

  return (
    <div ref={wrap} className={s.contours} aria-hidden>
      <canvas ref={fg} className={s.contoursLines} />
    </div>
  );
}
