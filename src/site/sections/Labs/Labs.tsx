'use client';

import { useEffect, useRef } from 'react';
import { labs as homeLabs } from '@site/content/homeV3';
import SectionBoundary from '@site/components/SectionBoundary';
import Icon from '@site/components/Icon';
import { MARK_D, MARK_RINGS } from '@site/components/Logo';
import { prefersReducedMotion } from '@site/lib/motion';
import s from './Labs.module.css';
import { mulberry32 as rng } from '@site/lib/rng';

/* Two canvas layers: a static seeded glow (repainted on resize) and the animated lines.
   Reduced motion: the lines and the mark, still, no green. */

type LabsCopy = { text: string; sub: string; cta: { label: string; href: string } };


/** where the mark sits: right of the copy on wide screens, above it on phones */
const layout = (W: number, H: number) => {
  if (W < 760) {
    const size = Math.min(W * 0.62, 260);
    return { cx: W / 2, cy: 40 + size / 2, size };
  }
  const size = Math.min(H * 0.92, W * 0.4, 560);
  return { cx: W * (W < 1080 ? 0.8 : 0.74), cy: H * 0.5, size };
};

function paintGlow(cv: HTMLCanvasElement, W: number, H: number, dpr: number) {
  const ctx = cv.getContext('2d');
  if (!ctx) return;
  cv.width = Math.round(W * dpr);
  cv.height = Math.round(H * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, W, H);
  const r = rng(113);
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
  // scattered rather than centred, so it reads as warmth, not a spotlight
  const warm = ['236, 184, 112', '214, 156, 86', '176, 122, 70', '206, 140, 120', '150, 96, 110', '98, 62, 84'];
  // muted brand greens under the warmth
  const green = ['92, 201, 109', '84, 150, 104', '120, 190, 150'];
  const K = 1.05;
  ctx.globalCompositeOperation = 'screen';
  for (let i = 0; i < 14; i++) {
    const rx = W * (0.06 + r() * 0.2);
    const ry = rx * (0.3 + r() * 0.6);
    // biased right, where the mark forms, but spread over the whole band
    const x = W * (0.12 + Math.pow(r(), 0.7) * 0.92);
    const y = H * (-0.1 + r() * 1.2);
    blob(x, y, rx, ry, (r() - 0.5) * 1.6, warm[Math.floor(r() * warm.length)], (0.06 + r() * 0.13) * K);
  }
  for (let i = 0; i < 5; i++) {
    const rx = W * (0.08 + r() * 0.16);
    const ry = rx * (0.3 + r() * 0.5);
    const x = W * (0.05 + r() * 0.95);
    const y = H * (r() * 1.1 - 0.05);
    blob(x, y, rx, ry, (r() - 0.5) * 1.4, green[Math.floor(r() * green.length)], (0.05 + r() * 0.07) * K);
  }
  const L = layout(W, H);
  blob(L.cx + L.size * 0.08, L.cy + L.size * 0.12, L.size * 0.7, L.size * 0.4, -0.5, '240, 196, 132', 0.2 * K);
  blob(L.cx - L.size * 0.4, L.cy - L.size * 0.3, L.size * 0.5, L.size * 0.26, 0.6, '206, 140, 120', 0.1 * K);
  blob(W * 0.04, H * 0.9, W * 0.26, 140, 0.2, '160, 150, 196', 0.06 * K);
  blob(L.cx + L.size * 0.35, L.cy + L.size * 0.45, L.size * 0.55, L.size * 0.22, 0.3, '92, 201, 109', 0.08 * K);
  ctx.globalCompositeOperation = 'source-over';

  // grain
  const tile = document.createElement('canvas');
  tile.width = tile.height = 128;
  const t = tile.getContext('2d')!;
  const img = t.createImageData(128, 128);
  const n = rng(19);
  for (let i = 0; i < img.data.length; i += 4) {
    const v = n() < 0.5 ? 255 : 0;
    img.data[i] = img.data[i + 1] = img.data[i + 2] = v;
    img.data[i + 3] = Math.floor(n() * 8.5);  }
  t.putImageData(img, 0, 0);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillStyle = ctx.createPattern(tile, 'repeat')!;
  ctx.fillRect(0, 0, cv.width, cv.height);
}

/* Parallel lines slide sideways; on first view they fade round the mark's contour
   while the mark draws on, then a green light circles its outline every EVERY s. */
const ANGLE = (23 * Math.PI) / 180; // from the vertical
const DIR = { x: Math.sin(ANGLE), y: -Math.cos(ANGLE) }; // along a line, bottom to top, leaning right
const NRM = { x: -DIR.y, y: DIR.x };
const GAP = 30; // px between lines, measured across them
const SPEED = 16; // px per second, left to right
const QUIET = 1.2; // s of lines only, once
const IN = 2; // lines fade round the contour, the mark draws on
const EVERY = 8; // s between the green runs
const RUN = 2.6; // s for one run round the outline
const GREEN = '92, 201, 109';
const WARM = '255, 236, 214';
const SLIM = 1; // 1 = the logo's own ring width; narrowing distorts the cuts

type Pt = { x: number; y: number };
/** the mark's closed outlines, sampled, with each ring's band narrowed by
    SLIM towards its centre line (the cuts keep their shape) */
function slimOutlines(measure: SVGSVGElement): Pt[][] {
  const subs = MARK_D.split(/(?=M)/).filter(Boolean);
  const loops: Pt[][] = [];
  for (const d of subs) {
    const el = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    el.setAttribute('d', d);
    measure.appendChild(el);
    const len = el.getTotalLength();
    const n = Math.max(80, Math.round(len * 4));
    loops.push(
      Array.from({ length: n + 1 }, (_, i) => {
        const q = el.getPointAtLength((len * i) / n);
        // pull the point towards the centre line of the ring it belongs to
        let best = { x: q.x, y: q.y };
        let bestOff = Infinity;
        for (const c of MARK_RINGS) {
          const dx = q.x - c.cx;
          const dy = q.y - c.cy;
          const r = Math.hypot(dx, dy) || 1;
          const off = r - c.r;
          if (Math.abs(off) < Math.abs(bestOff)) {
            bestOff = off;
            const nr = c.r + off * SLIM;
            best = { x: c.cx + (dx / r) * nr, y: c.cy + (dy / r) * nr };
          }
        }
        return best;
      })
    );
    measure.removeChild(el);
  }
  return loops;
}

export default function Labs({ copy = homeLabs, id = 'labs' }: { copy?: LabsCopy; id?: string } = {}) {
  const labs = copy;
  const band = useRef<HTMLElement>(null);
  const glow = useRef<HTMLCanvasElement>(null);
  const lines = useRef<HTMLCanvasElement>(null);
  const measure = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const el = band.current;
    const cg = glow.current;
    const cl = lines.current;
    const ms = measure.current;
    const ctx = cl?.getContext('2d');
    if (!el || !cg || !cl || !ms || !ctx) return;
    const reduced = prefersReducedMotion();
    const loops = slimOutlines(ms);
    let W = 1;
    let H = 1;
    let dpr = 1;

    const size = () => {
      const r = el.getBoundingClientRect();
      W = Math.max(1, Math.round(r.width));
      H = Math.max(1, Math.round(r.height));
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      cl.width = Math.round(W * dpr);
      cl.height = Math.round(H * dpr);
      paintGlow(cg, W, H, Math.min(window.devicePixelRatio || 1, 1.5));
      mark = null;
      cut = null;
    };

    const cl01 = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x);
    const ease = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);

    /** the mark's outlines in px, as one path, and the loops in px */
    // per-size caches: the mark in px, and its blurred cut-out
    let mark: ReturnType<typeof markAt> | null = null;
    let cut: HTMLCanvasElement | null = null;
    const cutCanvas = () => {
      if (cut) return cut;
      const m = mark ?? (mark = markAt());
      const c = document.createElement('canvas');
      c.width = cl.width;
      c.height = cl.height;
      const x = c.getContext('2d')!;
      x.setTransform(dpr, 0, 0, dpr, 0, 0);
      x.filter = `blur(${Math.round(7 * m.u)}px)`;
      x.lineWidth = m.u * 3.2;
      x.lineJoin = 'round';
      x.strokeStyle = '#000';
      x.fillStyle = '#000';
      x.stroke(m.path);
      x.fill(m.path, 'evenodd');
      // browsers without canvas filters: a softer edge from a second, wider pass
      if (!('filter' in x) || x.filter === 'none') {
        x.globalAlpha = 0.5;
        x.lineWidth = m.u * 5;
        x.stroke(m.path);
      }
      cut = c;
      return c;
    };
    const markAt = () => {
      const L = layout(W, H);
      const u = L.size / 32;
      const px = loops.map((lp) => lp.map((p) => ({ x: L.cx + (p.x - 16) * u, y: L.cy + (p.y - 16) * u })));
      const path = new Path2D();
      for (const lp of px) {
        lp.forEach((p, i) => (i ? path.lineTo(p.x, p.y) : path.moveTo(p.x, p.y)));
        path.closePath();
      }
      return { px, path, u };
    };

    let clock = reduced ? QUIET + IN : 0; // since the band first came into view
    let slide = 0; // the sideways motion, never paused
    const draw = () => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      const c = clock;
      // how present the mark is: it appears once and stays
      const show = ease(cl01((c - QUIET) / IN));

      // the lines
      const R = { x: W / 2, y: H / 2 };
      const reach = Math.hypot(W, H) / 2 + GAP * 2;
      const sh = (slide * SPEED * NRM.x) % GAP;
      const field = new Path2D();
      const jMin = Math.floor((-reach - sh) / GAP);
      const jMax = Math.ceil((reach - sh) / GAP);
      for (let j = jMin; j <= jMax; j++) {
        const o = j * GAP + sh;
        const bx = R.x + NRM.x * o;
        const by = R.y + NRM.y * o;
        field.moveTo(bx - DIR.x * reach, by - DIR.y * reach);
        field.lineTo(bx + DIR.x * reach, by + DIR.y * reach);
      }
      ctx.lineWidth = 0.8;
      ctx.strokeStyle = `rgba(${WARM}, 0.12)`;
      ctx.stroke(field);

      if (show <= 0.001) return;
      const m = mark ?? (mark = markAt());

      // cut the lines away with a soft-edged copy of the mark, blurred once per resize
      // (blurring every frame stutters)
      const cut = cutCanvas();
      ctx.save();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.globalCompositeOperation = 'destination-out';
      ctx.globalAlpha = show;
      ctx.drawImage(cut, 0, 0);
      ctx.restore();

      // the mark, on its own: it draws on as the lines go
      const drawn = show;
      const fadeOut = 1;
      ctx.lineWidth = 0.8;
      ctx.lineJoin = 'round';
      ctx.strokeStyle = `rgba(${WARM}, ${(0.34 * fadeOut).toFixed(3)})`;
      const part = (lp: Pt[], upto: number) => {
        const p = new Path2D();
        const end = Math.max(1, Math.floor(upto * (lp.length - 1)));
        for (let q = 0; q <= end; q++) {
          if (q) p.lineTo(lp[q].x, lp[q].y);
          else p.moveTo(lp[q].x, lp[q].y);
        }
        return p;
      };
      for (const lp of m.px) ctx.stroke(part(lp, drawn));

      // the green: every EVERY s, a short soft light runs once round each outline
      const since = c - QUIET - IN - 1;
      if (!reduced && since >= 0) {
        const t = since % EVERY;
        if (t < RUN) {
          const head = ease(t / RUN); // 0 → 1 round the loop
          const env = Math.sin((t / RUN) * Math.PI); // in and out, gently
          const TAIL = 0.16; // of the loop
          const steps = 8;
          ctx.lineWidth = 1;
          ctx.lineCap = 'round';
          for (const lp of m.px) {
            const n = lp.length - 1;
            for (let s2 = 0; s2 < steps; s2++) {
              const f0 = head - TAIL + (TAIL * s2) / steps;
              const f1 = head - TAIL + (TAIL * (s2 + 1)) / steps;
              const path = new Path2D();
              for (let q = Math.floor(f0 * n); q <= Math.ceil(f1 * n); q++) {
                const i = ((q % n) + n) % n;
                if (q === Math.floor(f0 * n)) path.moveTo(lp[i].x, lp[i].y);
                else path.lineTo(lp[i].x, lp[i].y);
              }
              ctx.strokeStyle = `rgba(${GREEN}, ${(0.55 * env * ((s2 + 1) / steps)).toFixed(3)})`;
              ctx.stroke(path);
            }
          }
        }
      }
    };

    size();
    draw();
    let lastW = W;
    let lastH = H;
    const ro = new ResizeObserver(() => {
      const r = el.getBoundingClientRect();
      if (Math.round(r.width) === lastW && Math.round(r.height) === lastH) return;
      size();
      lastW = W;
      lastH = H;
      draw();
    });
    ro.observe(el);
    if (reduced) return () => ro.disconnect();

    // runs only on screen, at about 30 fps
    let raf = 0;
    let on = false;
    let last = 0;
    const loop = (now: number) => {
      if (!on) return;
      raf = requestAnimationFrame(loop);
      if (now - last < 32) return;
      const dt = Math.min(0.1, last ? (now - last) / 1000 : 0);
      last = now;
      clock += dt;
      slide += dt;
      draw();
    };
    const io = new IntersectionObserver(([e]) => {
      on = e.isIntersecting && !document.hidden;
      cancelAnimationFrame(raf);
      if (on) {
        last = 0;
        raf = requestAnimationFrame(loop);
      }
    });
    io.observe(el);
    const onVis = () => {
      if (document.hidden) {
        on = false;
        cancelAnimationFrame(raf);
      }
    };
    document.addEventListener('visibilitychange', onVis);
    return () => {
      on = false;
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      document.removeEventListener('visibilitychange', onVis);
    };
  }, []);

  return (
    <section ref={band} id={id} className={s.band} aria-labelledby={`${id}-title`}>
      <SectionBoundary />
      <div className={s.art} aria-hidden>
        <canvas ref={glow} className={s.glow} />
        <canvas ref={lines} className={s.lines} />
        <svg ref={measure} className={s.measure} viewBox="0 0 32 32" />
      </div>

      <div className={s.wrap}>
        <div className={s.copy}>
          <h2 id={`${id}-title`} className={s.title} data-reveal data-reveal-delay="0.24">
            {labs.text}
          </h2>
          <p className={s.sub} data-reveal data-reveal-delay="0.32">
            {labs.sub}
          </p>
        </div>
        <a
          className={s.cta}
          href={labs.cta.href}
          target="_blank"
          rel="noreferrer"
          data-reveal
          data-reveal-delay="0.4"
        >
          {labs.cta.label}
          <Icon name="arrow" size={16} className={s.arrow} />
        </a>
      </div>
      <SectionBoundary edge="bottom" />
    </section>
  );
}
