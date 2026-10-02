'use client';

import { useEffect, useRef } from 'react';
import { prefersReducedMotion } from '@site/lib/motion';
import s from './Start.module.css';
import { mulberry32 as rng } from '@site/lib/rng';

// Two canvases: a static glow + grain layer repainted on resize, and a moving layer of wavy lines
// converging on one point. For scroll performance the moving layer draws ~60 paths in a single stroke
// at ~24 fps, capped at 1.25x pixel density, only while on screen; reduced motion draws one frame.

const RAYS = 60;
const SEG = 44;


/** the point everything converges on: low, just under the steps */
const pointFor = (W: number, H: number) => ({ x: W * 0.5, y: H - (W < 860 ? 96 : 118) });
export type FieldPoint = (W: number, H: number) => { x: number; y: number };

function paintStatic(cv: HTMLCanvasElement, W: number, H: number, dpr: number, at: FieldPoint) {
  const ctx = cv.getContext('2d');
  if (!ctx) return;
  cv.width = Math.round(W * dpr);
  cv.height = Math.round(H * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, W, H);
  const P = at(W, H);
  const r = rng(41);
  const blob = (x: number, y: number, rx: number, ry: number, rot: number, rgb: string, a: number) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rot);
    ctx.scale(1, ry / rx);
    const g = ctx.createRadialGradient(0, 0, 0, 0, 0, rx);
    g.addColorStop(0, `rgba(${rgb}, ${a})`);
    g.addColorStop(0.45, `rgba(${rgb}, ${a * 0.45})`);
    g.addColorStop(1, `rgba(${rgb}, 0)`);
    ctx.fillStyle = g;
    ctx.fillRect(-rx, -rx, rx * 2, rx * 2);
    ctx.restore();
  };
  const warm = ['236, 184, 112', '214, 156, 86', '176, 122, 70', '198, 148, 104', '98, 62, 70'];
  const K = 0.74; // overall glow intensity, kept low so it doesn't compete with the steps
  // an irregular warm glow: seeded blobs of different hues, sizes, angles and offsets round the point
  ctx.globalCompositeOperation = 'screen';
  for (let i = 0; i < 9; i++) {
    const rx = W * (0.1 + r() * 0.22);
    const ry = rx * (0.28 + r() * 0.45);
    const x = P.x + (r() - 0.5) * W * 0.62;
    const y = P.y + (r() - 0.35) * 150;
    blob(x, y, rx, ry, (r() - 0.5) * 0.9, warm[Math.floor(r() * warm.length)], (0.1 + r() * 0.16) * K);
  }
  // a small, hotter core, off centre
  blob(P.x - 30, P.y + 12, W * 0.12, 70, -0.2, '240, 196, 132', 0.34 * K);
  // a cool lilac hint far left and a plum hint top right, for depth
  blob(W * 0.08, H * 0.82, W * 0.3, 160, 0.3, '160, 150, 196', 0.1 * K);
  blob(W * 0.9, H * 0.12, W * 0.35, 220, -0.4, '84, 60, 84', 0.12 * K);
  ctx.globalCompositeOperation = 'source-over';

  // static grain, fine and soft
  const tile = document.createElement('canvas');
  tile.width = tile.height = 128;
  const t = tile.getContext('2d')!;
  const img = t.createImageData(128, 128);
  const n = rng(7);
  for (let i = 0; i < img.data.length; i += 4) {
    const v = n() < 0.5 ? 255 : 0;
    img.data[i] = img.data[i + 1] = img.data[i + 2] = v;
    img.data[i + 3] = Math.floor(n() * 9.6); // very low alpha: a soft grain, not sand
  }
  t.putImageData(img, 0, 0);
  ctx.setTransform(1, 0, 0, 1, 0, 0); // grain at device pixels
  ctx.fillStyle = ctx.createPattern(tile, 'repeat')!;
  ctx.fillRect(0, 0, cv.width, cv.height);
}

/** `at`: where the lines converge (default: low and centred, under Start's steps). Also used by About's "Maintained in the open". */
export default function Field({ at = pointFor }: { at?: FieldPoint } = {}) {
  const wrap = useRef<HTMLDivElement>(null);
  const bg = useRef<HTMLCanvasElement>(null);
  const lines = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const el = wrap.current;
    const cb = bg.current;
    const cl = lines.current;
    const ctx = cl?.getContext('2d');
    if (!el || !cb || !cl || !ctx) return;
    const reduced = prefersReducedMotion();
    let W = 1;
    let H = 1;
    let dpr = 1;

    const size = () => {
      const r = el.getBoundingClientRect();
      W = Math.max(1, Math.round(r.width));
      H = Math.max(1, Math.round(r.height));
      dpr = Math.min(window.devicePixelRatio || 1, 1.25);
      cl.width = Math.round(W * dpr);
      cl.height = Math.round(H * dpr);
      paintStatic(cb, W, H, Math.min(window.devicePixelRatio || 1, 1.5), at);
    };

    const draw = (t: number) => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      const P = at(W, H);
      const reach = Math.hypot(Math.max(P.x, W - P.x), Math.max(P.y, H - P.y));
      const flow = t * 1.05; // waves drift inward
      ctx.beginPath();
      for (let i = 0; i < RAYS; i++) {
        const a = (i / RAYS) * Math.PI * 2 + 0.013;
        const ca = Math.cos(a);
        const sa = Math.sin(a);
        for (let k = 0; k <= SEG; k++) {
          const u = k / SEG; // 0 at the point, 1 at the edge
          const d = 22 + u * reach;
          const amp = 3 + u * u * 24; // calm where they arrive
          const w = Math.sin(u * 17 - flow + i * 0.7) * amp;
          const x = P.x + ca * d - sa * w;
          const y = P.y + sa * d * 0.7 + ca * w;
          if (k === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
      }
      ctx.strokeStyle = 'rgba(255, 238, 222, 0.12)';
      ctx.lineWidth = 0.8;
      ctx.stroke(); // one stroke call for every line
    };

    size();
    draw(0);
    let lastW = W;
    let lastH = H;
    const ro = new ResizeObserver(() => {
      const r = el.getBoundingClientRect();
      if (Math.round(r.width) === lastW && Math.round(r.height) === lastH) return;
      size();
      lastW = W;
      lastH = H;
      draw(performance.now() / 1000);
    });
    ro.observe(el);
    if (reduced) return () => ro.disconnect();

    let raf = 0;
    let last = 0;
    let on = false;
    const loop = (now: number) => {
      if (!on) return;
      raf = requestAnimationFrame(loop);
      if (now - last < 42) return; // about 24 fps: plenty for a slow drift
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
  }, [at]);

  return (
    <div ref={wrap} className={s.field} aria-hidden>
      <canvas ref={bg} className={s.fieldBg} />
      <canvas ref={lines} className={s.fieldLines} />
    </div>
  );
}
