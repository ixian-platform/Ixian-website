'use client';

import { useEffect, useRef } from 'react';
import s from './Round4.module.css';

// Static backdrop, painted once per resize.

export default function WarmField() {
  const wrap = useRef<HTMLDivElement>(null);
  const cv = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const el = wrap.current;
    const c = cv.current;
    if (!el || !c) return;
    const seed = Math.random();
    const paint = () => {
      const ctx = c.getContext('2d');
      if (!ctx) return;
      const r0 = el.getBoundingClientRect();
      const W = Math.max(1, Math.round(r0.width));
      const H = Math.max(1, Math.round(r0.height));
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      c.width = Math.round(W * dpr);
      c.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      let t = Math.floor(seed * 1e9);
      const r = () => ((t = (t * 16807) % 2147483647) - 1) / 2147483646;
      const blob = (x: number, y: number, rx: number, ry: number, rot: number, rgb: string, a: number) => {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(rot);
        ctx.scale(1, ry / rx);
        const g = ctx.createRadialGradient(0, 0, 0, 0, 0, rx);
        g.addColorStop(0, `rgba(${rgb}, ${a})`);
        g.addColorStop(0.5, `rgba(${rgb}, ${a * 0.4})`);
        g.addColorStop(1, `rgba(${rgb}, 0)`);
        ctx.fillStyle = g;
        ctx.fillRect(-rx, -rx, rx * 2, rx * 2);
        ctx.restore();
      };
      const warm = ['236, 184, 112', '214, 156, 86', '176, 122, 70', '198, 148, 104', '150, 84, 92', '98, 62, 84'];
      ctx.globalCompositeOperation = 'screen';
      // glows anywhere in the section, weighted to the edges so the text stays clear
      for (let i = 0; i < 7; i++) {
        const edge = r() < 0.5 ? r() * 0.3 : 0.7 + r() * 0.3;
        const x = (i % 2 ? edge : r()) * W;
        const y = (i % 2 ? r() : edge) * H;
        const rx = W * (0.14 + r() * 0.22);
        blob(x, y, rx, rx * (0.35 + r() * 0.5), (r() - 0.5) * 1.4, warm[Math.floor(r() * warm.length)], 0.07 + r() * 0.08);
      }
      ctx.globalCompositeOperation = 'source-over';
      // rings round the address mark (the right column, about two thirds down)
      const cx = W >= 1080 ? W * 0.72 : W * 0.5;
      const cy = H * (W >= 1080 ? 0.66 : 0.72);
      for (let k = 1; k <= 14; k++) {
        ctx.beginPath();
        ctx.arc(cx, cy, 90 + k * k * 9, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255, 236, 214, ${0.06 - k * 0.0035})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
      // grain
      const tile = document.createElement('canvas');
      tile.width = tile.height = 128;
      const tc = tile.getContext('2d')!;
      const img = tc.createImageData(128, 128);
      for (let i = 0; i < img.data.length; i += 4) {
        const v = r() < 0.5 ? 255 : 0;
        img.data[i] = img.data[i + 1] = img.data[i + 2] = v;
        img.data[i + 3] = Math.floor(r() * 10);
      }
      tc.putImageData(img, 0, 0);
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.fillStyle = ctx.createPattern(tile, 'repeat')!;
      ctx.fillRect(0, 0, c.width, c.height);
    };
    paint();
    let w = 0;
    const ro = new ResizeObserver(([e]) => {
      if (Math.round(e.contentRect.width) === w) return;
      w = Math.round(e.contentRect.width);
      paint();
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={wrap} className={s.warmField} aria-hidden>
      <canvas ref={cv} />
    </div>
  );
}
