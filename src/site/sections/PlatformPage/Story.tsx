'use client';

import { useEffect, useRef, useState } from 'react';
import Icon from '@site/components/Icon';
import { DLT, S2, DLT_NODES, DLT_MESH, S2_NODES, S2_MESH } from '@site/sections/Platform/geometry';
import { ScrollTrigger, prefersReducedMotion } from '@site/lib/motion';
import { pin, usePinnedSteps } from '@site/components/PinSteps';
import { useNetworkPulse, fmt } from '@site/lib/useNetworkPulse';
import s from './Story.module.css';
import { palette, rgbOf } from '@site/styles/palette';

/* Pinned scroll story; scroll drives one camera through three views:
     1 assembled    the DLT disc inside the S2 ring, turning slowly
     2 taken apart  the DLT sinks, S2 lifts, a plane of endpoints appears on top
     3 at work      overhead; a packet runs between endpoints, real blocks ripple across the DLT
   The node field is illustrative; the counts are live. Without the pin, one still of view 2. */

type Copy = {
  title: [string, string];
  lead: string;
  actions: { label: string; href: string; kind: 'primary' | 'secondary' }[];
  steps: string[];
  lines: string[];
  viewLabel: string;
  legendLabel: string;
  legend: { s2: { name: string; role: string; unit: string }; dlt: { name: string; role: string; unit: string }; apps: { name: string; role: string }; block: string };
  note: string;
};

// scroll progress at which each view rests (the panel's buttons scroll here)
const VIEW_AT = [0.22, 0.58, 0.97];

const C30 = 0.866;
const clamp = (x: number) => Math.max(0, Math.min(1, x));
const seg = (p: number, a: number, b: number) => clamp((p - a) / (b - a));
const ease = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
const mix = (a: number, b: number, m: number) => a + (b - a) * m;
const STILL = 0.42; // the frame shown without scroll (view 2)

// endpoints (seeded, stable): angle and radius on the top plane
const ENDS = Array.from({ length: 10 }, (_, i) => ({ a: i * 2.3999 + 0.35, r: 150 + ((i * 53) % 90) }));
const GREEN = [140, 222, 156];
const BLUE = rgbOf(palette.route);
const WHITE = [232, 240, 234];
const rgb = (c: number[], a: number) => `rgba(${c[0]}, ${c[1]}, ${c[2]}, ${a})`;
const tint = (c: number[], m: number) => WHITE.map((w, i) => Math.round(w + (c[i] - w) * m));

export default function Story({ copy }: { copy: Copy }) {
  const root = useRef<HTMLElement>(null);
  const cv = useRef<HTMLCanvasElement>(null);
  const [step, setStep] = useState(0);
  const [pinned, setPinned] = useState(false);
  /* phones: the three views sit in a sideways rail above the pinned drawing,
     which animates to the chosen view */
  const [railMode, setRailMode] = useState(false);
  const pinOuter = useRef<HTMLDivElement>(null);
  const rail = useRef<HTMLDivElement>(null);
  const railTarget = useRef<number>(VIEW_AT[0]);
  const redraw = useRef<() => void>(() => {});
  const jump = usePinnedSteps({ enabled: railMode, count: 3, step, setStep, outer: pinOuter, rail });
  useEffect(() => {
    railTarget.current = VIEW_AT[step];
    redraw.current();
  }, [step]);
  const pulse = useNetworkPulse();
  const ripple = useRef(-1);
  const lastH = useRef<number | null>(null);
  useEffect(() => {
    if (pulse.height == null) return;
    if (lastH.current != null && pulse.height > lastH.current) ripple.current = performance.now();
    lastH.current = pulse.height;
  }, [pulse.height]);

  useEffect(() => {
    const el = root.current;
    const c = cv.current;
    const ctx = c?.getContext('2d');
    if (!el || !c || !ctx) return;
    const reduced = prefersReducedMotion();
    const asRail = window.innerWidth <= 860;
    const still = () => prefersReducedMotion() || window.innerWidth < 960 || window.innerHeight < 620;
    // on phones the drawing moves (to the rail's view), unless motion is reduced
    const isStill = asRail ? reduced : still();
    setPinned(!asRail && !isStill);
    setRailMode(asRail);
    // apply the pinned height now, so ScrollTrigger measures the tall section
    if (!asRail && !isStill) el.setAttribute('data-pinned', '');
    let target = asRail ? railTarget.current : isStill ? STILL : 0;
    let p = target;
    let W = 0;
    let H = 0;
    let dpr = 1;
    const size = () => {
      W = c.clientWidth;
      H = c.clientHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      c.width = Math.round(W * dpr);
      c.height = Math.round(H * dpr);
    };
    const bufD = new Float32Array(DLT_NODES.length * 2);
    const bufS = new Float32Array(S2_NODES.length * 2);

    const draw = (now: number) => {
      const t = isStill ? 0 : now / 1000;
      const ex = ease(seg(p, 0.28, 0.52));
      const top = ease(seg(p, 0.64, 0.9));
      const intro = 1 - ease(seg(p, 0.04, 0.18));
      el.style.setProperty('--ex', ex.toFixed(3));
      el.style.setProperty('--top', top.toFixed(3));
      el.style.setProperty('--intro', intro.toFixed(3));
      if (intro < 0.5) el.setAttribute('data-panel', '');
      else el.removeAttribute('data-panel');

      const narrow = W < 960;
      // without the pin on a wide screen the still sits right of the headline
      const S = Math.min(W / 1180, H / 820) * (narrow ? 1.5 : isStill ? 0.8 : 1.16);
      const ST = Math.min(W * 0.9, H) / 740;
      const cx = narrow ? W / 2 : isStill ? W * 0.66 : W * mix(0.69, 0.6, seg(p, 0.04, 0.3));
      const tcx = narrow ? W / 2 : W * 0.62;
      const cy = H * (narrow ? 0.52 : mix(0.54, 0.6, ex));
      const zD = -120 * ex;
      const zS = 30 * ex;
      const zA = 150 * ex;
      const rot = t * 0.018;
      const P = (r: number, a: number, z: number) => {
        const x = r * Math.cos(a);
        const y = r * Math.sin(a);
        const ix = cx + (x - y) * C30 * S;
        const iy = cy + (x + y) * 0.5 * S - z * S;
        if (top <= 0) return { x: ix, y: iy };
        const tx = tcx + r * Math.cos(a - Math.PI / 4) * ST;
        const ty = H * 0.5 + r * Math.sin(a - Math.PI / 4) * ST;
        return { x: mix(ix, tx, top), y: mix(iy, ty, top) };
      };

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, c.width, c.height);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // guides between the planes while they are apart
      const g = ex * (1 - top);
      if (g > 0.02) {
        ctx.setLineDash([3, 6]);
        ctx.strokeStyle = `rgba(243, 247, 244, ${0.18 * g})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        for (let q = 0; q < 4; q++) {
          const a = Math.PI / 4 + (q * Math.PI) / 2 + rot;
          const p0 = P(DLT.r, a, zD);
          const p1 = P(DLT.r, a, zS);
          ctx.moveTo(p0.x, p0.y);
          ctx.lineTo(p1.x, p1.y);
        }
        const a0 = P(0, 0, zD);
        const a1 = P(0, 0, zA + 40);
        ctx.moveTo(a0.x, a0.y);
        ctx.lineTo(a1.x, a1.y);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      const layer = (nodes: typeof DLT_NODES, mesh: [number, number][], buf: Float32Array, z: number, r0: number, col: number[], wave: number, rip = -1) => {
        nodes.forEach((n, i) => {
          const q = P(n.r, n.a + r0, z + wave * Math.sin(n.r * 0.04 + n.a * 2 - t * 0.8));
          buf[i * 2] = q.x;
          buf[i * 2 + 1] = q.y;
        });
        ctx.beginPath();
        for (const [i, j] of mesh) {
          ctx.moveTo(buf[i * 2], buf[i * 2 + 1]);
          ctx.lineTo(buf[j * 2], buf[j * 2 + 1]);
        }
        ctx.strokeStyle = rgb(col, 0.17);
        ctx.lineWidth = 0.9;
        ctx.stroke();
        nodes.forEach((n, i) => {
          const near = rip > 0 ? Math.max(0, 1 - Math.abs(n.r - rip) / 18) : 0;
          const hub = n.w > 0.93;
          ctx.beginPath();
          ctx.arc(buf[i * 2], buf[i * 2 + 1], (hub ? 2.8 : 1 + n.w * 1.4) + near * 1.6, 0, Math.PI * 2);
          ctx.fillStyle = near > 0.15 ? rgb(GREEN, Math.min(1, 0.6 + near)) : rgb(col, 0.45 + n.w * 0.5);
          ctx.fill();
          if (hub) {
            ctx.beginPath();
            ctx.arc(buf[i * 2], buf[i * 2 + 1], 6.5, 0, Math.PI * 2);
            ctx.strokeStyle = rgb(col, 0.28);
            ctx.stroke();
          }
        });
      };

      // a real new block: a green ring out across the DLT
      let rip = -1;
      if (ripple.current > 0 && !isStill) {
        rip = ((now - ripple.current) / 1600) * (DLT.r + 30);
        if (rip > DLT.r + 30) ripple.current = -1;
      }
      const sep = Math.max(ex, top);
      layer(DLT_NODES, DLT_MESH, bufD, zD, rot, tint(GREEN, 0.72 + sep * 0.2), 1.2 * (1 - top), rip);
      if (rip > 0) {
        ctx.beginPath();
        for (let d = 0; d <= 64; d++) {
          const q = P(Math.min(rip, DLT.r + 12), (d / 64) * Math.PI * 2, zD);
          if (d) ctx.lineTo(q.x, q.y);
          else ctx.moveTo(q.x, q.y);
        }
        ctx.strokeStyle = rgb(GREEN, 0.55 * (1 - rip / (DLT.r + 30)));
        ctx.lineWidth = 1.2;
        ctx.stroke();
      }
      layer(S2_NODES, S2_MESH, bufS, zS, -rot * 0.8, tint(BLUE, 0.75 + sep * 0.2), 2.6 * (1 - top));

      // endpoints: squares on the top plane, dropped to S2; from above they
      // sit on an outer orbit
      const ea = ex;
      if (ea > 0.02) {
        const ends = ENDS.map((e) => {
          const r = mix(e.r, 300, top);
          return { top: P(r, e.a + rot * 0.5, zA), base: P(mix(e.r, 244, top), e.a + rot * 0.5, zS) };
        });
        ctx.setLineDash([2, 5]);
        ctx.strokeStyle = `rgba(243, 247, 244, ${0.16 * ea})`;
        ctx.beginPath();
        ends.forEach((e) => {
          ctx.moveTo(e.top.x, e.top.y);
          ctx.lineTo(e.base.x, e.base.y);
        });
        ctx.stroke();
        ctx.setLineDash([]);
        ends.forEach((e) => {
          ctx.fillStyle = palette.page;
          ctx.strokeStyle = `rgba(243, 247, 244, ${0.9 * ea})`;
          ctx.lineWidth = 1.2;
          ctx.fillRect(e.top.x - 4, e.top.y - 4, 8, 8);
          ctx.strokeRect(e.top.x - 4, e.top.y - 4, 8, 8);
        });

        // at work: two things travel, in turn, on a 6.4 s cycle while this view is up
        //   blue  a message: endpoint → into S2 → round the ring → out to another endpoint
        //   green a payment: endpoint → into S2 → round the ring → out to its payee, and from
        //         S2 the transaction goes to the DLT (dashed) where it settles (a green ring)
        if (top > 0.4 && !isStill) {
          const vis = (top - 0.4) / 0.6;
          const R = (S2.r0 + S2.r1) / 2;
          const route = (from: number, to: number) => {
            const aA = ENDS[from].a + rot * 0.5;
            let aB = ENDS[to].a + rot * 0.5;
            while (aB < aA) aB += Math.PI * 2;
            if (aB - aA > Math.PI) aB -= Math.PI * 2;
            const pts: { x: number; y: number }[] = [];
            for (let q = 0; q <= 10; q++) pts.push(P(mix(300, R, q / 10), aA, zS));
            for (let q = 1; q <= 40; q++) pts.push(P(R, mix(aA, aB, q / 40), zS));
            for (let q = 1; q <= 10; q++) pts.push(P(mix(R, 300, q / 10), aB, zS));
            return { pts, aA };
          };
          const packet = (pts: { x: number; y: number }[], k: number, col: number[], head: number[], a: number) => {
            const h = Math.floor(clamp(k) * (pts.length - 1));
            const tail = Math.max(0, h - 14);
            ctx.beginPath();
            for (let q = tail; q <= h; q++) (q === tail ? ctx.moveTo : ctx.lineTo).call(ctx, pts[q].x, pts[q].y);
            ctx.strokeStyle = rgb(col, 0.85 * a);
            ctx.lineWidth = 1.6;
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(pts[h].x, pts[h].y, 2.8, 0, Math.PI * 2);
            ctx.fillStyle = rgb(head, a);
            ctx.fill();
          };
          const CYCLE = 6.4;
          // the message, first half of the cycle
          const km = (t % CYCLE) / CYCLE;
          if (km < 0.5) {
            const { pts } = route(1, 6);
            packet(pts, km / 0.42, BLUE, [235, 241, 255], vis * (km > 0.42 ? 1 - (km - 0.42) / 0.08 : 1));
          }
          // the payment, second half
          const kp = ((t + CYCLE / 2) % CYCLE) / CYCLE;
          if (kp < 0.5) {
            const { pts, aA } = route(3, 8);
            const fade = vis * (kp > 0.44 ? 1 - (kp - 0.44) / 0.06 : 1);
            packet(pts, kp / 0.4, GREEN, [214, 250, 220], fade);
            // the transaction, from S2 down to the DLT: dashed, drawn once the payment is in S2
            const kr = seg(kp, 0.1, 0.26);
            if (kr > 0) {
              const from = P(R, aA, zS);
              const to = P(DLT.r * 0.5, aA, zD);
              const x = mix(from.x, to.x, ease(kr));
              const y = mix(from.y, to.y, ease(kr));
              ctx.setLineDash([3, 4]);
              ctx.beginPath();
              ctx.moveTo(from.x, from.y);
              ctx.lineTo(x, y);
              ctx.strokeStyle = rgb(GREEN, 0.95 * fade);
              ctx.lineWidth = 1.5;
              ctx.stroke();
              ctx.setLineDash([]);
              // settled: a small green ring where it lands
              const kk = seg(kp, 0.26, 0.44);
              if (kk > 0) {
                ctx.beginPath();
                ctx.arc(to.x, to.y, 3 + kk * 14, 0, Math.PI * 2);
                ctx.strokeStyle = rgb(GREEN, 0.8 * (1 - kk) * fade);
                ctx.lineWidth = 1.2;
                ctx.stroke();
                ctx.beginPath();
                ctx.arc(to.x, to.y, 2.6, 0, Math.PI * 2);
                ctx.fillStyle = rgb(GREEN, fade);
                ctx.fill();
              }
            }
          }
        }
      }

    };

    size();
    draw(performance.now());
    // phones with reduced motion: jump straight to the chosen view
    redraw.current = () => {
      if (!asRail) return;
      target = railTarget.current;
      if (isStill) {
        p = target;
        draw(performance.now());
      }
    };
    const ro = new ResizeObserver(() => {
      size();
      draw(performance.now());
    });
    ro.observe(c);

    let st: ScrollTrigger | null = null;
    if (asRail) {
      /* the rail drives the view (PinSteps) */
    } else if (!isStill) {
      st = ScrollTrigger.create({
        trigger: el,
        start: 'top top',
        end: 'bottom bottom',
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          target = self.progress;
          setStep(self.progress < 0.4 ? 0 : self.progress < 0.76 ? 1 : 2);
        },
      });
      requestAnimationFrame(() => ScrollTrigger.refresh());
    } else setStep(1);

    let raf = 0;
    let visible = true;
    const loop = (now: number) => {
      if (asRail) target = railTarget.current;
      p += (target - p) * 0.12;
      draw(now);
      raf = requestAnimationFrame(loop);
    };
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      cancelAnimationFrame(raf);
      raf = 0;
      if (visible && !isStill && !document.hidden) raf = requestAnimationFrame(loop);
    });
    io.observe(el);
    const onVis = () => {
      cancelAnimationFrame(raf);
      raf = 0;
      if (!document.hidden && visible && !isStill) raf = requestAnimationFrame(loop);
    };
    document.addEventListener('visibilitychange', onVis);
    const onResize = () => {
      const now = window.innerWidth <= 860 ? 'rail' : still() ? 'still' : 'pin';
      const was = asRail ? 'rail' : isStill ? 'still' : 'pin';
      if (now !== was) window.location.reload(); // rare: crossing a layout threshold
    };
    window.addEventListener('resize', onResize);
    return () => {
      ro.disconnect();
      io.disconnect();
      st?.kill();
      cancelAnimationFrame(raf);
      document.removeEventListener('visibilitychange', onVis);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  const live = (v: number | null) => (v != null ? fmt(v) : '…');

  // the view control: scroll to where that view rests (Lenis when it runs)
  const go = (i: number) => {
    const el = root.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const y = top + VIEW_AT[i] * (el.offsetHeight - window.innerHeight);
    // eslint-disable-next-line no-unused-vars
    const lenis = (window as unknown as { __lenis?: { scrollTo: (target: number, opts: { duration?: number }) => void } }).__lenis;
    if (lenis) lenis.scrollTo(y, { duration: 1.6 });
    else window.scrollTo({ top: y, behavior: 'smooth' });
  };

  return (
    <section ref={root} id="top" className={s.story} data-pinned={pinned || undefined} aria-labelledby="platform-h1">
      <div className={s.stage}>
        <div className={s.intro}>
          <h1 id="platform-h1" className={s.h1}>
            {copy.title[0]}
            <span>{copy.title[1]}</span>
          </h1>
          <p className={s.lead}>{copy.lead}</p>
          <div className={s.actions}>
            {copy.actions.map((a) => (
              <a key={a.label} href={a.href} target="_blank" rel="noreferrer" className={s.btn} data-kind={a.kind} data-outline={a.kind === 'secondary' ? '' : undefined}>
                {a.label}
                <Icon name="external" size={15} />
              </a>
            ))}
          </div>
        </div>

        <div ref={pinOuter} className={pin.outer} style={{ '--n': 3 } as React.CSSProperties}>
        <div className={pin.inner}>
        {railMode && (
          <div ref={rail} className={pin.rail} aria-label={copy.viewLabel}>
            {copy.steps.map((label, i) => (
              <button key={label} type="button" className={pin.card} data-on={i === step || undefined} onClick={() => jump(i)} aria-current={i === step ? 'step' : undefined}>
                <span className={pin.cardHead}>
                  <span className={pin.cardNo}>{String(i + 1).padStart(2, '0')}</span>
                  <span className={pin.cardName}>{label}</span>
                </span>
                <span className={pin.cardText}>{copy.lines[i]}</span>
              </button>
            ))}
          </div>
        )}
        <div className={s.scene}>
          <canvas ref={cv} className={s.canvas} aria-hidden />
        </div>

        <aside className={s.panel} aria-label={copy.legendLabel}>
          {pinned && (
            <div className={s.views}>
              <p className={s.panelLabel}>{copy.viewLabel}</p>
              <ol>
                {copy.steps.map((label, i) => (
                  <li key={label}>
                    <button type="button" onClick={() => go(i)} aria-current={i === step ? 'step' : undefined} data-on={i === step || undefined}>
                      <span className={s.viewNo}>{String(i + 1).padStart(2, '0')}</span>
                      {label}
                    </button>
                  </li>
                ))}
              </ol>
              <p className={s.viewLine} key={step} aria-live="polite">
                {copy.lines[step]}
              </p>
            </div>
          )}
          {!pinned && !railMode && <p className={s.viewLine}>{copy.lines[1]}</p>}

          <div className={s.key}>
            <p className={s.panelLabel}>{copy.legendLabel}</p>
            <ul>
              <li data-tone="s2">
                <i />
                <span>
                  <b>{copy.legend.s2.name}</b> {copy.legend.s2.role}
                </span>
                <em className={s.count}>{live(pulse.s2)}</em>
              </li>
              <li data-tone="dlt">
                <i />
                <span>
                  <b>{copy.legend.dlt.name}</b> {copy.legend.dlt.role}
                </span>
                <em className={s.count}>{live(pulse.dlt)}</em>
              </li>
              <li data-tone="apps">
                <i />
                <span>
                  <b>{copy.legend.apps.name}</b> {copy.legend.apps.role}
                </span>
              </li>
            </ul>
            <p className={s.note}>
              <i data-on={pulse.ok || undefined} aria-hidden />
              <span>
                {copy.note} {pulse.height != null && <>Latest block <b className={s.count}>{fmt(pulse.height)}</b>.</>}
              </span>
            </p>
          </div>
        </aside>
        </div>
        </div>
        <p className="ix-sr">{`Live now: ${pulse.dlt ?? 'unknown'} DLT nodes, ${pulse.s2 ?? 'unknown'} S2 nodes, latest block ${pulse.height ?? 'unknown'}.`}</p>
      </div>
    </section>
  );
}
