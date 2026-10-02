'use client';

import { useEffect, useRef } from 'react';
import { prefersReducedMotion } from '@site/lib/motion';
import { scrollBusy } from '@site/lib/scrollBusy';
import s from './HistoryScroll.module.css';
import { mulberry32 as rng } from '@site/lib/rng';

// Static glow + grain layer, repainted on resize; a moving layer of two counter-rotating line fans
// whose crossings form a slow moiré. ~20 fps while on screen; a single frame under reduced motion.

function paintGlow(cv: HTMLCanvasElement, W: number, H: number, dpr: number) {
  const ctx = cv.getContext('2d');
  if (!ctx) return;
  cv.width = Math.round(W * dpr);
  cv.height = Math.round(H * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, W, H);
  const r = rng(131);
  const warm = ['236, 184, 112', '214, 156, 86', '176, 122, 70', '206, 140, 120', '98, 62, 84'];
  ctx.globalCompositeOperation = 'screen';
  for (let i = 0; i < 10; i++) {
    const rx = W * (0.1 + r() * 0.22);
    const ry = rx * (0.22 + r() * 0.3);
    const x = W * (0.05 + r() * 0.95);
    const y = H * (-0.08 + r() * 0.3);
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate((r() - 0.5) * 0.6);
    ctx.scale(1, ry / rx);
    const a = 0.06 + r() * 0.11;
    const c = warm[Math.floor(r() * warm.length)];
    const g = ctx.createRadialGradient(0, 0, 0, 0, 0, rx);
    g.addColorStop(0, `rgba(${c}, ${a})`);
    g.addColorStop(0.5, `rgba(${c}, ${a * 0.4})`);
    g.addColorStop(1, `rgba(${c}, 0)`);
    ctx.fillStyle = g;
    ctx.fillRect(-rx, -rx, rx * 2, rx * 2);
    ctx.restore();
  }
  // the fade to nothing lower down, baked in (a CSS mask on a full-screen canvas made scrolling stutter)
  ctx.globalCompositeOperation = 'destination-in';
  const fade = ctx.createLinearGradient(0, 0, 0, H);
  fade.addColorStop(0, '#000');
  fade.addColorStop(0.3, '#000');
  fade.addColorStop(0.55, 'rgba(0,0,0,0.35)');
  fade.addColorStop(0.78, 'rgba(0,0,0,0)');
  ctx.fillStyle = fade;
  ctx.fillRect(0, 0, W, H);
  ctx.globalCompositeOperation = 'source-over';
  // grain, faded with the glow instead of stopping at a hard line
  const tile = document.createElement('canvas');
  tile.width = tile.height = 160;
  const t = tile.getContext('2d')!;
  const img = t.createImageData(160, 160);
  const n = rng(5);
  for (let i = 0; i < img.data.length; i += 4) {
    const v = n() < 0.5 ? 255 : 0;
    img.data[i] = img.data[i + 1] = img.data[i + 2] = v;
    img.data[i + 3] = Math.floor(n() * 8.4);
  }
  t.putImageData(img, 0, 0);
  const g2 = document.createElement('canvas');
  g2.width = cv.width;
  g2.height = cv.height;
  const gc = g2.getContext('2d')!;
  gc.fillStyle = gc.createPattern(tile, 'repeat')!;
  gc.fillRect(0, 0, g2.width, g2.height);
  gc.globalCompositeOperation = 'destination-in';
  const gf = gc.createLinearGradient(0, 0, 0, g2.height);
  gf.addColorStop(0, '#000');
  gf.addColorStop(0.3, '#000');
  gf.addColorStop(0.6, 'rgba(0,0,0,0.3)');
  gf.addColorStop(0.85, 'rgba(0,0,0,0)');
  gc.fillStyle = gf;
  gc.fillRect(0, 0, g2.width, g2.height);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.drawImage(g2, 0, 0);
}

export default function HistoryField() {
  const wrap = useRef<HTMLDivElement>(null);
  const bg = useRef<HTMLCanvasElement>(null);
  const fg = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const el = wrap.current;
    const cb = bg.current;
    const cl = fg.current;
    const ctx = cl?.getContext('2d');
    if (!el || !cb || !cl || !ctx) return;
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
      paintGlow(cb, W, H, Math.min(window.devicePixelRatio || 1, 1.5));
    };
    const fan = (ox: number, oy: number, a0: number, spread: number, n: number, color: string) => {
      const R = Math.hypot(W, H) * 2.2;
      ctx.beginPath();
      for (let i = 0; i < n; i++) {
        const a = a0 + (i / (n - 1) - 0.5) * spread;
        ctx.moveTo(ox, oy);
        ctx.lineTo(ox + Math.cos(a) * R, oy + Math.sin(a) * R);
      }
      ctx.strokeStyle = color;
      ctx.lineWidth = 0.6;
      ctx.stroke();
    };
    const draw = (t: number) => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      // two far-off sources, left and right above the frame, rotating against each other
      const wob = Math.sin(t * 0.05) * 0.012;
      fan(-W * 0.9, -H * 1.4, 0.9 + wob, 0.34, 110, 'rgba(255, 232, 206, 0.075)');
      fan(W * 1.9, -H * 1.2, Math.PI - 0.95 - wob * 1.3, 0.3, 110, 'rgba(255, 232, 206, 0.075)');
      // the band: lines only near the top, faded in the canvas itself
      ctx.globalCompositeOperation = 'destination-in';
      const g = ctx.createLinearGradient(0, 0, 0, H);
      g.addColorStop(0.02, 'rgba(0,0,0,0)');
      g.addColorStop(0.14, '#000');
      g.addColorStop(0.32, 'rgba(0,0,0,0.6)');
      g.addColorStop(0.5, 'rgba(0,0,0,0)');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);
      ctx.globalCompositeOperation = 'source-over';
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
      if (now - last < 50 || scrollBusy()) return;
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
    <div ref={wrap} className={s.field} aria-hidden>
      <canvas ref={bg} className={s.fieldGlow} />
      <canvas ref={fg} className={s.fieldLines} />
    </div>
  );
}
