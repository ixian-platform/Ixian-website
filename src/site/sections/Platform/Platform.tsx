'use client';

import { useEffect, useRef, useState } from 'react';
import { platform, platformLayers } from '@site/content/homeV3';
import SectionBoundary from '@site/components/SectionBoundary';
import Icon from '@site/components/Icon';
import { prefersReducedMotion } from '@site/lib/motion';
import { useNetworkPulse, fmt } from '@site/lib/useNetworkPulse';
import { W, H, CX, CY, DLT, S2, DLT_NODES, DLT_MESH, S2_NODES, S2_MESH, TRACKS, polarV } from './geometry';
import { PLANES_B, CAM, ENDPOINTS, TALK, TALK_ROUTE, PAYER, PAY_DLT, ADDR, TRACKS_B, joinAt } from './scene';
import { metrics, formatMetric } from '@site/content/metrics';
import { pin, usePinnedSteps, useMedia } from '@site/components/PinSteps';
import { GLYPH } from '@site/components/endpointGlyphs';
import s from './Platform.module.css';

/* Each step's sequence plays once when it opens. Reduced motion: every step shows its
   end state, no autoplay. */

type Layer = 'dlt' | 's2' | 'apps' | 'run';
const ORDER: Layer[] = ['dlt', 's2', 'apps', 'run'];
// each step's sequence must finish before its time runs out
const STEP_MS: Record<Layer, number> = { dlt: 4550, s2: 4550, apps: 6300, run: 6300 };
const GREEN = '120, 220, 140';
const BLUE = '157, 185, 255';
const WHITE = '243, 247, 244';

const clamp = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n);
const easeOut = (n: number) => 1 - Math.pow(1 - clamp(n), 3);
const easeInOut = (n: number) => {
  const x = clamp(n);
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
};

/** where each metric belongs: it stays bright while one of these is in view */
const METRIC_LAYERS: Record<string, Layer[]> = {
  s2: ['s2', 'run'],
  dlt: ['dlt', 'run'],
  tps: ['dlt', 'apps'],
  tx: ['dlt', 'apps'],
};

/* callout anchors in drawing space (the diagram's right-hand margin) */
const CALLOUT = { s2: { x: 812, y: 132 }, dlt: { x: 812, y: 560 } };

export default function Platform() {
  const pulse = useNetworkPulse();
  const [hoverRaw, setHover] = useState<Layer | null>(null);
  const [step, setStep] = useState<Layer | null>(null);
  const hover: Layer | null = hoverRaw ?? step;
  const canvas = useRef<HTMLCanvasElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const calloutS2 = useRef<HTMLDivElement>(null);
  const calloutDlt = useRef<HTMLDivElement>(null);
  const live = useRef({
    active: null as Layer | null,
    step: 'rest',
    prev: '',
    at: 0,
    ripple: -1,
    blockAt: -1,
    emph: { dlt: 1, s2: 1 },
    zD: 0,
    zS: 0,
    zA: PLANES_B.rest.app,
    A: 0,
    v: 0,
    hd: 0,
    hs: 0,
    cam: { ...CAM.rest },
    join: null as null | { s2: ReturnType<typeof joinAt>; dlt: ReturnType<typeof joinAt> },
  });
  live.current.active = hover;
  live.current.step = step ?? 'rest';

  // a real new block → ripple, and a block drops onto the stack
  const lastH = useRef<number | null>(null);
  useEffect(() => {
    if (pulse.height == null) return;
    if (lastH.current != null && pulse.height > lastH.current) {
      live.current.ripple = performance.now();
      live.current.blockAt = performance.now();
    }
    lastH.current = pulse.height;
  }, [pulse.height]);

  const redraw = useRef<() => void>(() => {});
  useEffect(() => {
    const cv = canvas.current;
    const st = stage.current;
    const ctx = cv?.getContext('2d');
    if (!cv || !st || !ctx) return;
    const reduced = prefersReducedMotion();
    const mono = (getComputedStyle(document.body).getPropertyValue('--font-geist-mono') || '').trim() || 'ui-monospace, monospace';
    const sans = (getComputedStyle(document.body).getPropertyValue('--font-geist-sans') || '').trim() || 'system-ui, sans-serif';
    const paths = new Map<string, Path2D>();
    const glyphPath = (g: string) => {
      if (!paths.has(g) && GLYPH[g]) paths.set(g, new Path2D(GLYPH[g]));
      return paths.get(g);
    };
    let k = 1;
    let last = performance.now();
    const size = () => {
      const w = st.clientWidth;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      cv.width = Math.round(w * dpr);
      cv.height = Math.round(((w * H) / W) * dpr);
      k = (w / W) * dpr;
    };
    const dx = new Float32Array(DLT_NODES.length * 2);
    const sx = new Float32Array(S2_NODES.length * 2);

    const draw = (now: number) => {
      const t = reduced ? 0 : now / 1000;
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const L = live.current;
      // time since the step opened (each step's sequence plays once)
      if (L.step !== L.prev) {
        L.prev = L.step;
        L.at = now;
        if (L.step === 'run') {
          // the new nodes land under the callouts, whatever the layers' turn
          const rotS = -t * 0.015;
          const rotD = t * 0.02;
          L.join = {
            s2: joinAt(S2_NODES, 198, -0.72 + Math.PI / 4 - rotS),
            dlt: joinAt(DLT_NODES, 60, 0.62 + Math.PI / 4 - rotD),
          };
        }
      }
      const tau = reduced ? 99 : (now - L.at) / 1000;
      const act = L.active;
      const stp = L.step;

      // eased emphasis per layer: the one in view glows, the other steps back;
      // on "Connect anything" both step back a little for the plane above
      const target = (l: 'dlt' | 's2') =>
        act == null || act === 'run' ? 1 : act === 'apps' ? 0.5 : act === l ? 1.7 : 0.07;
      const e = L.emph;
      const ease = reduced ? 1 : 1 - Math.exp(-dt * 10);
      e.dlt += (target('dlt') - e.dlt) * ease;
      e.s2 += (target('s2') - e.s2) * ease;

      const tgt = PLANES_B[stp] ?? PLANES_B.rest;
      const kz = reduced ? 1 : 1 - Math.exp(-dt * 3.2);
      L.zD += (DLT.z + tgt.dlt - L.zD) * kz;
      L.zS += (S2.z + tgt.s2 - L.zS) * kz;
      L.zA += (tgt.app - L.zA) * kz;
      L.A += ((stp === 'apps' ? 1 : 0) - L.A) * (reduced ? 1 : 1 - Math.exp(-dt * (stp === 'apps' ? 2.4 : 5)));
      const camT = CAM[stp] ?? CAM.rest;
      const kc = reduced ? 1 : 1 - Math.exp(-dt * 2.8);
      L.cam.k += (camT.k - L.cam.k) * kc;
      L.cam.dx += (camT.dx - L.cam.dx) * kc;
      L.cam.dy += (camT.dy - L.cam.dy) * kc;
      const { zD, zS, zA } = L;
      const A = L.A < 0.004 ? 0 : L.A;
      L.v += ((stp === 'run' ? 1 : 0) - L.v) * (reduced ? 1 : 1 - Math.exp(-dt * 2.6));
      const v = L.v < 0.001 ? 0 : L.v;
      const polar = (r: number, a: number, z: number) => polarV(r, a, z, v);
      const at = (x: number, y: number, z: number) => polarV(Math.hypot(x, y), Math.atan2(y, x), z, v);
      const kh = reduced ? 1 : 1 - Math.exp(-dt * 5);
      const act2 = act ?? (stp === 'rest' ? null : stp);
      L.hd += ((act2 === 'dlt' ? 1 : 0) - L.hd) * kh;
      L.hs += ((act2 === 's2' ? 1 : 0) - L.hs) * kh;
      // the sheets' rims and fills follow their layer's emphasis too, so a layer out of view really steps back
      const rimD = Math.max(0.35, Math.min(1, e.dlt));
      const rimS = Math.max(0.35, Math.min(1, e.s2));
      const mix = (a: string, b: string, m: number) => {
        const x = a.split(',').map(Number);
        const y = b.split(',').map(Number);
        return x.map((n, i) => Math.round(n + (y[i] - n) * m)).join(', ');
      };
      const ex = Math.min(1, Math.abs(zS - zD) / 90);
      const rotS = -t * 0.015;
      const rotD = t * 0.02;

      const ck = L.cam.k;
      const cdx = L.cam.dx;
      const cdy = L.cam.dy;
      // scene space → drawing space (for the callouts, drawn without the camera)
      const toDraw = (x: number, y: number) => ({ x: CX + (x - CX) * ck + cdx, y: CY + (y - CY) * ck + cdy });

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, cv.width, cv.height);
      ctx.setTransform(k * ck, 0, 0, k * ck, k * (CX * (1 - ck) + cdx), k * (CY * (1 - ck) + cdy));

      // sheets: each layer is a thin plate with a hairline rim
      const ring = (r: number, z: number, rot: number, move = true) => {
        for (let d = 0; d <= 72; d++) {
          const p = polar(r, (d / 72) * Math.PI * 2 + rot, z);
          if (d === 0 && move) ctx.moveTo(p.x, p.y);
          else ctx.lineTo(p.x, p.y);
        }
      };
      const ringRev = (r: number, z: number) => {
        for (let d = 72; d >= 0; d--) {
          const p = polar(r, (d / 72) * Math.PI * 2, z);
          if (d === 72) ctx.moveTo(p.x, p.y);
          else ctx.lineTo(p.x, p.y);
        }
      };
      const ticks = (r: number, z: number, rot: number, len: number, a: number) => {
        ctx.beginPath();
        for (let q = 0; q < 4; q++) {
          const ang = Math.PI / 4 + (q * Math.PI) / 2 + rot;
          const p0 = polar(r, ang, z);
          const p1 = polar(r + len, ang, z);
          ctx.moveTo(p0.x, p0.y);
          ctx.lineTo(p1.x, p1.y);
        }
        ctx.strokeStyle = `rgba(${WHITE}, ${a})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      };
      const sheetD = () => {
        const tint = mix(WHITE, GREEN, Math.max(v, L.hd));
        ctx.beginPath();
        ring(DLT.r + 8, zD, 0);
        ctx.fillStyle = `rgba(${tint}, ${(0.022 + 0.03 * L.hd) * rimD})`;
        ctx.fill();
        ctx.strokeStyle = `rgba(${tint}, ${(0.07 + 0.12 * L.hd) * rimD})`;
        ctx.lineWidth = 1;
        ctx.stroke();
        ticks(DLT.r + 8, zD, rotD, 7, (0.12 + 0.2 * L.hd) * rimD);
      };
      const sheetS = () => {
        const tint = mix(WHITE, BLUE, Math.max(v, L.hs));
        ctx.beginPath();
        ring(S2.r1 + 8, zS, 0);
        ringRev(S2.r0 - 6, zS);
        ctx.fillStyle = `rgba(${tint}, ${(0.018 + 0.028 * L.hs) * rimS})`;
        ctx.fill('evenodd');
        ctx.beginPath();
        ring(S2.r1 + 8, zS, 0);
        ctx.strokeStyle = `rgba(${tint}, ${(0.07 + 0.12 * L.hs) * rimS})`;
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.beginPath();
        ring(S2.r0 - 6, zS, 0);
        ctx.strokeStyle = `rgba(${tint}, ${(0.04 + 0.06 * L.hs) * rimS})`;
        ctx.stroke();
        ticks(S2.r1 + 8, zS, rotS, 9, (0.12 + 0.2 * L.hs) * rimS);
      };

      // guides between the layers appear as they separate
      if (ex > 0.02) {
        ctx.setLineDash([3, 5]);
        ctx.strokeStyle = `rgba(${WHITE}, ${0.14 * ex})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        for (let q = 0; q < 4; q++) {
          const a = Math.PI / 4 + (q * Math.PI) / 2;
          const p0 = polar(DLT.r + 8, a, zD);
          const p1 = polar(zS < zD ? S2.r0 - 6 : DLT.r + 8, a, zS);
          ctx.moveTo(p0.x, p0.y);
          ctx.lineTo(p1.x, p1.y);
        }
        const c0 = polar(0, 0, Math.min(zD, zS));
        const c1 = polar(0, 0, Math.max(zD, zS) + 30 * ex);
        ctx.moveTo(c0.x, c0.y);
        ctx.lineTo(c1.x, c1.y);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      const constellation = (
        nodes: typeof DLT_NODES,
        meshE: [number, number][],
        buf: Float32Array,
        z: number,
        rot: number,
        wave: number,
        emph: number,
        tint: string,
        ripple = -1,
      ) => {
        nodes.forEach((n, i) => {
          const p = polar(n.r, n.a + rot, z + wave * Math.sin(n.r * 0.045 + n.a * 2 - t * 0.7));
          buf[i * 2] = p.x;
          buf[i * 2 + 1] = p.y;
        });
        ctx.beginPath();
        for (const [i, j] of meshE) {
          ctx.moveTo(buf[i * 2], buf[i * 2 + 1]);
          ctx.lineTo(buf[j * 2], buf[j * 2 + 1]);
        }
        ctx.strokeStyle = `rgba(${tint}, ${0.17 * Math.min(1.5, emph)})`;
        ctx.lineWidth = 0.9;
        ctx.stroke();
        nodes.forEach((n, i) => {
          const near = ripple > 0 ? Math.max(0, 1 - Math.abs(n.r - ripple) / 16) : 0;
          const hub = n.w > 0.93;
          const rr = hub ? 3 : 1.1 + n.w * 1.5;
          const a = Math.min(1, (0.5 + n.w * 0.5) * Math.min(1.3, emph));
          ctx.beginPath();
          ctx.arc(buf[i * 2], buf[i * 2 + 1], rr + near * 1.5, 0, Math.PI * 2);
          ctx.fillStyle = near > 0.15 ? `rgba(${GREEN}, ${Math.min(1, a + near)})` : `rgba(${tint}, ${a})`;
          ctx.fill();
          if (hub) {
            ctx.beginPath();
            ctx.arc(buf[i * 2], buf[i * 2 + 1], 6.5, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(${tint}, ${0.25 * Math.min(1.3, emph)})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        });
      };

      const rippleR = L.ripple > 0 && !reduced ? ((now - L.ripple) / 1600) * (DLT.r + 30) : -1;
      if (rippleR > DLT.r + 30) L.ripple = -1;
      if (rippleR > 0) {
        ctx.beginPath();
        for (let d = 0; d <= 64; d++) {
          const p = polar(Math.min(rippleR, DLT.r + 12), (d / 64) * Math.PI * 2, zD);
          if (d) ctx.lineTo(p.x, p.y);
          else ctx.moveTo(p.x, p.y);
        }
        ctx.strokeStyle = `rgba(${GREEN}, ${0.5 * (1 - rippleR / (DLT.r + 30))})`;
        ctx.lineWidth = 1.2;
        ctx.stroke();
      }

      // the block stack on the DLT
      const box = (x: number, y: number, z: number, w: number, d: number, h: number, stroke: string, fillTop: string, fillSide: string) => {
        const c = [
          at(x - w / 2, y - d / 2, z),
          at(x + w / 2, y - d / 2, z),
          at(x + w / 2, y + d / 2, z),
          at(x - w / 2, y + d / 2, z),
        ];
        const u = [
          at(x - w / 2, y - d / 2, z + h),
          at(x + w / 2, y - d / 2, z + h),
          at(x + w / 2, y + d / 2, z + h),
          at(x - w / 2, y + d / 2, z + h),
        ];
        const face = (pts: { x: number; y: number }[], fill: string) => {
          ctx.beginPath();
          pts.forEach((p, i) => (i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y)));
          ctx.closePath();
          ctx.fillStyle = fill;
          ctx.fill();
          ctx.strokeStyle = stroke;
          ctx.lineWidth = 0.9;
          ctx.stroke();
        };
        if (v < 0.98) {
          face([c[1], c[2], u[2], u[1]], fillSide); // +x side
          face([c[3], c[2], u[2], u[3]], fillSide); // +y side
        }
        face(u, fillTop);
      };
      const drawStack = () => {
        const vis = (0.35 + 0.65 * Math.max(L.hd, act2 == null ? 0.3 : 0)) * (1 - v) * (1 - 0.6 * A);
        if (vis < 0.02) return;
        const p = L.blockAt > 0 && !reduced ? clamp((now - L.blockAt) / 900) : 1;
        if (p >= 1 && L.blockAt > 0 && now - L.blockAt > 2600) L.blockAt = -1;
        const green = L.blockAt > 0 ? 1 - clamp((now - L.blockAt - 900) / 1700) : 0;
        const slot = (i: number) => zD + 12 + i * 7;
        for (let i = 0; i < 5; i++) {
          // i 0..3: the standing blocks (0 leaves as a new one lands); 4: the new one
          let z: number;
          let a: number;
          if (i < 4) {
            z = slot(i - (p < 1 ? p : 0));
            a = i === 0 && p < 1 ? 1 - p : 1;
          } else {
            if (p >= 1) break;
            z = slot(3) + (1 - easeOut(p)) * 46;
            a = easeOut(p);
          }
          const top = i === 4 || (i === 3 && p >= 1);
          const g = top ? green : 0;
          const tint = mix(WHITE, GREEN, g);
          const al = a * vis * (0.45 + 0.55 * (i / 4));
          box(0, 0, z, 26, 26, 3, `rgba(${tint}, ${0.55 * al})`, `rgba(${tint}, ${0.12 * al})`, `rgba(${tint}, ${0.05 * al})`);
        }
      };

      const tintD = mix('232, 240, 234', '140, 222, 156', Math.max(v, L.hd));
      const tintS = mix('226, 232, 246', '157, 185, 255', Math.max(v, L.hs));
      const drawD = () => {
        sheetD();
        constellation(DLT_NODES, DLT_MESH, dx, zD, rotD, 1.2 * (1 - v), e.dlt, tintD, rippleR);
        drawStack();
      };
      const drawS = () => {
        sheetS();
        constellation(S2_NODES, S2_MESH, sx, zS, rotS, 2.6 * (1 - v), e.s2, tintS);
      };
      if (zD <= zS) {
        drawD();
        drawS();
      } else {
        drawS();
        drawD();
      }

      // S2 traffic; more of it while S2 is in view
      if (!reduced) {
        const tracks = [...TRACKS.map((tr) => ({ ...tr, on: 1 })), ...TRACKS_B.map((tr) => ({ ...tr, on: L.hs }))];
        for (const tr of tracks) {
          const on = tr.on * Math.min(1, e.s2);
          if (on < 0.02) continue;
          const head = tr.phase + t * tr.speed;
          const dir = Math.sign(tr.speed);
          ctx.beginPath();
          for (let q = 0; q <= 12; q++) {
            const p = polar(tr.r, head - dir * tr.len * (q / 12) + rotS, zS);
            if (q === 0) ctx.moveTo(p.x, p.y);
            else ctx.lineTo(p.x, p.y);
          }
          const hp = polar(tr.r, head + rotS, zS);
          const tp = polar(tr.r, head - dir * tr.len + rotS, zS);
          const g = ctx.createLinearGradient(hp.x, hp.y, tp.x, tp.y);
          g.addColorStop(0, `rgba(${BLUE}, ${0.6 * on})`);
          g.addColorStop(1, `rgba(${BLUE}, 0)`);
          ctx.strokeStyle = g;
          ctx.lineWidth = 1.2;
          ctx.stroke();
          ctx.fillStyle = `rgba(230, 238, 255, ${0.8 * on})`;
          ctx.beginPath();
          ctx.arc(hp.x, hp.y, 1.8, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // the endpoints' plane (Connect anything)
      if (A > 0) {
        const tA = stp === 'apps' ? tau : 99;
        // the plane: a faint sheet with a rim, over the S2 ring
        ctx.beginPath();
        ring(S2.r1 + 14, zA, 0);
        ctx.fillStyle = `rgba(${WHITE}, ${0.016 * A})`;
        ctx.fill();
        ctx.strokeStyle = `rgba(${WHITE}, ${0.22 * A})`;
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.beginPath();
        ring(S2.r0 - 10, zA, 0);
        ctx.setLineDash([2, 6]);
        ctx.strokeStyle = `rgba(${WHITE}, ${0.1 * A})`;
        ctx.stroke();
        ctx.setLineDash([]);
        ticks(S2.r1 + 14, zA, rotS, 10, 0.3 * A);

        const ep = ENDPOINTS.map((en) => {
          const a = en.a + rotS;
          const x = en.r * Math.cos(a);
          const y = en.r * Math.sin(a);
          const show = easeOut((tA - en.at) / 0.4);
          return { en, x, y, show, base: at(x, y, zA), top: at(x, y, zA + en.kind.h) };
        });
        // attachments: each endpoint hangs off its nearest S2 node
        ep.forEach((p) => {
          const g = easeInOut((tA - p.en.at - 0.35) / 0.6);
          if (g <= 0) return;
          const nx = sx[p.en.s2 * 2];
          const ny = sx[p.en.s2 * 2 + 1];
          ctx.setLineDash([2, 4]);
          ctx.beginPath();
          ctx.moveTo(p.base.x, p.base.y);
          ctx.lineTo(p.base.x + (nx - p.base.x) * g, p.base.y + (ny - p.base.y) * g);
          ctx.strokeStyle = `rgba(${WHITE}, ${0.26 * A * p.show})`;
          ctx.lineWidth = 1;
          ctx.stroke();
          ctx.setLineDash([]);
          if (g >= 1) {
            ctx.beginPath();
            ctx.arc(nx, ny, 3.2, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(${WHITE}, ${0.45 * A})`;
            ctx.stroke();
          }
        });
        // the endpoints themselves, far to near
        const hitB = clamp((tA - 3.6) / 0.2) * (1 - clamp((tA - 4.8) / 1.2));
        const hitP = clamp((tA - 3.8) / 0.2) * (1 - clamp((tA - 5.4) / 1.2));
        [...ep]
          .sort((p, q) => p.x + p.y - (q.x + q.y))
          .forEach((p) => {
            if (p.show <= 0) return;
            const lift = (1 - p.show) * 14;
            const i = ENDPOINTS.indexOf(p.en);
            const lit = i === TALK[1] ? hitB : i === PAYER ? hitP : 0;
            const al = A * p.show;
            const tint = lit > 0 && i === PAYER ? mix(WHITE, GREEN, lit) : lit > 0 ? mix(WHITE, BLUE, lit) : WHITE;
            // a pad on the plane, a thin stem, and an upright card with glyph and name
            const b = at(p.x, p.y, zA + lift);
            const top = at(p.x, p.y, zA + lift + p.en.kind.h);
            ctx.beginPath();
            ctx.ellipse(b.x, b.y, 6, 3.4, 0, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(${tint}, ${0.4 * al})`;
            ctx.lineWidth = 1;
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(b.x, b.y);
            ctx.lineTo(top.x, top.y + 17);
            ctx.strokeStyle = `rgba(${tint}, ${0.28 * al})`;
            ctx.stroke();
            const cs = 34;
            ctx.beginPath();
            ctx.roundRect(top.x - cs / 2, top.y - cs / 2, cs, cs, 7);
            ctx.fillStyle = `rgba(8, 11, 10, ${0.94 * al})`;
            ctx.fill();
            ctx.strokeStyle = `rgba(${tint}, ${(0.3 + 0.5 * lit) * al})`;
            ctx.stroke();
            const path = glyphPath(p.en.kind.g);
            if (path) {
              ctx.save();
              ctx.translate(top.x - 11, top.y - 11);
              ctx.scale(22 / 24, 22 / 24);
              ctx.lineWidth = 1.7 * (24 / 22);
              ctx.lineCap = 'round';
              ctx.lineJoin = 'round';
              ctx.strokeStyle = `rgba(${tint}, ${0.9 * al})`;
              ctx.stroke(path);
              ctx.restore();
            }
            // the three that act carry an address instead (drawn below)
            if (i !== TALK[0] && i !== TALK[1] && i !== PAYER) {
              ctx.font = `500 16px ${sans}`;
              ctx.textBaseline = 'middle';
              ctx.fillStyle = `rgba(${WHITE}, ${0.5 * al})`;
              ctx.fillText(p.en.kind.label, top.x + cs / 2 + 7, top.y);
            }
          });

        // 1) two endpoints talk: A → S2 → along the relays → B (route colour)
        const route = (pts: { x: number; y: number }[], f: number, rgb: string, alpha: number) => {
          const seg = pts.slice(1).map((p, i) => Math.hypot(p.x - pts[i].x, p.y - pts[i].y));
          const total = seg.reduce((a, b) => a + b, 0);
          let want = total * clamp(f);
          ctx.beginPath();
          ctx.moveTo(pts[0].x, pts[0].y);
          let head = pts[0];
          for (let i = 0; i < seg.length; i++) {
            if (want >= seg[i]) {
              ctx.lineTo(pts[i + 1].x, pts[i + 1].y);
              want -= seg[i];
              head = pts[i + 1];
            } else {
              const u = seg[i] ? want / seg[i] : 0;
              head = { x: pts[i].x + (pts[i + 1].x - pts[i].x) * u, y: pts[i].y + (pts[i + 1].y - pts[i].y) * u };
              ctx.lineTo(head.x, head.y);
              break;
            }
          }
          ctx.strokeStyle = `rgba(${rgb}, ${0.7 * alpha})`;
          ctx.lineWidth = 1.4;
          ctx.stroke();
          if (f > 0 && f < 1) {
            ctx.beginPath();
            ctx.arc(head.x, head.y, 6, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${rgb}, ${0.18 * alpha})`;
            ctx.fill();
            ctx.beginPath();
            ctx.arc(head.x, head.y, 2.6, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${rgb}, ${alpha})`;
            ctx.fill();
          }
        };
        const pa = ep[TALK[0]];
        const pb = ep[TALK[1]];
        const fade = (start: number, end: number) => (tA < start ? 0 : 1 - clamp((tA - end) / 1.6));
        const talkF = easeInOut((tA - 1.9) / 1.8);
        if (talkF > 0) {
          const pts = [pa.base, ...TALK_ROUTE.map((n) => ({ x: sx[n * 2], y: sx[n * 2 + 1] })), pb.base];
          route(pts, talkF, BLUE, A * fade(1.9, 5));
        }
        // 2) a third pays: payer → its S2 node → a DLT node, in green (value)
        const pp = ep[PAYER];
        const payF = easeInOut((tA - 3.9) / 1.4);
        if (payF > 0) {
          const pts = [pp.base, { x: sx[pp.en.s2 * 2], y: sx[pp.en.s2 * 2 + 1] }, { x: dx[PAY_DLT * 2], y: dx[PAY_DLT * 2 + 1] }];
          route(pts, payF, GREEN, A * fade(3.9, 6.4));
        }
        // …and settles: one ring on the DLT where it lands
        const settle = clamp((tA - 5.2) / 1.0); // done by 6.2 s, inside the 6.3 s step
        if (settle > 0 && settle < 1) {
          const c = { x: dx[PAY_DLT * 2], y: dx[PAY_DLT * 2 + 1] };
          ctx.beginPath();
          ctx.ellipse(c.x, c.y, 4 + 30 * easeOut(settle), (4 + 30 * easeOut(settle)) * 0.58, 0, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(${GREEN}, ${0.6 * (1 - settle) * A})`;
          ctx.lineWidth = 1.2;
          ctx.stroke();
        }
        // addresses on the three that act (drawn, not live)
        ctx.font = `500 15px ${mono}`;
        ctx.textBaseline = 'middle';
        [TALK[0], TALK[1], PAYER].forEach((i, n) => {
          const p = ep[i];
          const al = A * easeOut((tA - 1.4 - n * 0.15) / 0.5);
          if (al <= 0) return;
          // beside the endpoint's card, where the others show their name
          const x = p.top.x + 17 + 8;
          const y = p.top.y;
          ctx.fillStyle = `rgba(${WHITE}, ${0.72 * al})`;
          ctx.fillText(ADDR[n], x, y);
        });
      }

      // Run a node: the same top view, as a diagram
      let leaders: { from: { x: number; y: number }; to: { x: number; y: number }; g: number }[] = [];
      if (stp === 'run' && v > 0.6 && L.join) {
        const vis = clamp((v - 0.6) / 0.4);
        const joins = [
          { j: L.join.s2, z: zS, rot: rotS, buf: sx, t0: 0.9, rgb: BLUE, key: 's2' as const },
          { j: L.join.dlt, z: zD, rot: rotD, buf: dx, t0: 1.6, rgb: GREEN, key: 'dlt' as const },
        ];
        for (const J of joins) {
          const p = polar(J.j.r, J.j.a + J.rot, J.z);
          const appear = easeOut((tau - J.t0) / 0.5);
          if (appear <= 0) continue;
          // links to its nearest neighbours draw in
          const g = easeInOut((tau - J.t0 - 0.3) / 0.7);
          ctx.beginPath();
          for (const n of J.j.near) {
            const q = { x: J.buf[n * 2], y: J.buf[n * 2 + 1] };
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p.x + (q.x - p.x) * g, p.y + (q.y - p.y) * g);
          }
          ctx.strokeStyle = `rgba(${WHITE}, ${0.55 * vis})`;
          ctx.lineWidth = 1;
          ctx.stroke();
          // the join: one ring, once
          const ringT = clamp((tau - J.t0) / 1.1);
          if (ringT < 1) {
            ctx.beginPath();
            ctx.arc(p.x, p.y, 5 + 26 * easeOut(ringT), 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(${WHITE}, ${0.5 * (1 - ringT) * vis})`;
            ctx.stroke();
          }
          ctx.beginPath();
          ctx.arc(p.x, p.y, 10, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(${WHITE}, ${0.4 * appear * vis})`;
          ctx.stroke();
          ctx.beginPath();
          ctx.arc(p.x, p.y, 4.2 * appear, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${WHITE}, ${vis})`;
          ctx.fill();
          // then it does its work, once: S2 passes a packet on, the DLT signs
          if (J.key === 's2') {
            const f = easeInOut((tau - 3.4) / 1.2);
            if (f > 0 && f < 1) {
              const a0 = { x: J.buf[J.j.near[0] * 2], y: J.buf[J.j.near[0] * 2 + 1] };
              const a1 = { x: J.buf[J.j.near[1] * 2], y: J.buf[J.j.near[1] * 2 + 1] };
              const h = f < 0.5 ? { x: a0.x + (p.x - a0.x) * f * 2, y: a0.y + (p.y - a0.y) * f * 2 } : { x: p.x + (a1.x - p.x) * (f - 0.5) * 2, y: p.y + (a1.y - p.y) * (f - 0.5) * 2 };
              ctx.beginPath();
              ctx.arc(h.x, h.y, 2.6, 0, Math.PI * 2);
              ctx.fillStyle = `rgba(${BLUE}, ${vis})`;
              ctx.fill();
            }
          } else {
            const f = clamp((tau - 4.1) / 1.3);
            if (f > 0 && f < 1) {
              ctx.beginPath();
              ctx.arc(p.x, p.y, 6 + 44 * easeOut(f), 0, Math.PI * 2);
              ctx.strokeStyle = `rgba(${WHITE}, ${0.35 * (1 - f) * vis})`;
              ctx.stroke();
            }
          }
          leaders.push({ from: toDraw(p.x, p.y), to: CALLOUT[J.key], g: easeInOut((tau - J.t0 - 0.9) / 0.6) * vis });
        }
      } else leaders = [];

      // callouts: leader lines drawn without the camera, labels are HTML
      ctx.setTransform(k, 0, 0, k, 0, 0);
      for (const ld of leaders) {
        if (ld.g <= 0) continue;
        const elbow = { x: ld.to.x - 22, y: ld.to.y + 9 };
        const end = { x: ld.to.x - 6, y: ld.to.y + 9 };
        const a = ld.from;
        const l1 = Math.hypot(elbow.x - a.x, elbow.y - a.y);
        const l2 = end.x - elbow.x;
        let want = (l1 + l2) * ld.g;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        if (want <= l1) ctx.lineTo(a.x + ((elbow.x - a.x) * want) / l1, a.y + ((elbow.y - a.y) * want) / l1);
        else {
          ctx.lineTo(elbow.x, elbow.y);
          want -= l1;
          ctx.lineTo(elbow.x + want, elbow.y);
        }
        ctx.strokeStyle = `rgba(${WHITE}, 0.34)`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
      const show = (el: HTMLDivElement | null, key: 's2' | 'dlt') => {
        if (!el) return;
        const ld = leaders[key === 's2' ? 0 : 1];
        const o = ld ? clamp((ld.g - 0.7) / 0.3) : 0;
        el.style.opacity = String(Math.round(o * 100) / 100);
        el.style.transform = `translateY(${Math.round((1 - o) * 6)}px)`;
      };
      show(calloutS2.current, 's2');
      show(calloutDlt.current, 'dlt');
    };
    redraw.current = () => draw(performance.now());

    size();
    draw(performance.now());
    const ro = new ResizeObserver(() => {
      size();
      draw(performance.now());
    });
    ro.observe(st);
    if (reduced) return () => ro.disconnect();

    let raf = 0;
    let visible = false;
    const loop = (now: number) => {
      draw(now);
      raf = requestAnimationFrame(loop);
    };
    const startL = () => {
      if (!raf && visible && !document.hidden) {
        last = performance.now();
        raf = requestAnimationFrame(loop);
      }
    };
    const stopL = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };
    const io = new IntersectionObserver(([en]) => {
      visible = en.isIntersecting;
      if (visible) startL();
      else stopL();
    });
    io.observe(st);
    const onVis = () => (document.hidden ? stopL() : startL());
    document.addEventListener('visibilitychange', onVis);
    return () => {
      ro.disconnect();
      io.disconnect();
      document.removeEventListener('visibilitychange', onVis);
      stopL();
    };
  }, []);
  useEffect(() => redraw.current(), [hover, step]);

  // autoplay through ORDER; a click restarts the timer; hover or off screen pauses; none with reduced motion
  const [auto0, setAuto] = useState(false);
  // phones: PinSteps rail instead of autoplay
  const phone = useMedia('(max-width: 860px)');
  const auto = auto0 && !phone;
  const pinOuter = useRef<HTMLDivElement>(null);
  const rail = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);
  const [cycle, setCycle] = useState(0);
  const section = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = section.current;
    if (!el) return;
    const reduced = prefersReducedMotion();
    const io = new IntersectionObserver(
      ([en]) => {
        const on = en.intersectionRatio > 0.35;
        setAuto(on && !reduced);
        if (on && reduced) setStep((v) => v ?? 'dlt');
      },
      { threshold: [0, 0.35, 0.6] }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  useEffect(() => {
    if (!auto || paused) return;
    const id = window.setTimeout(
      () => {
        setStep((v) => (v == null ? 'dlt' : ORDER[(ORDER.indexOf(v) + 1) % ORDER.length]));
        setCycle((c) => c + 1);
      },
      step == null ? 1200 : STEP_MS[step]
    );
    return () => window.clearTimeout(id);
  }, [auto, paused, step, cycle]);

  const shown: Layer = step ?? 'dlt';
  const goTo = (id: Layer) => {
    setStep(id);
    setCycle((c) => c + 1);
  };
  const jump = usePinnedSteps({ enabled: phone, count: ORDER.length, step: ORDER.indexOf(shown), setStep: (i) => goTo(ORDER[i]), outer: pinOuter, rail });
  const pickCard = (i: number) => jump(i);

  // metrics: bright while their layer is in view or hovered, dim otherwise
  const bright = (m: string) => hover == null || METRIC_LAYERS[m].includes(hover);
  const metricRow = [
    { id: 'dlt', layer: 'dlt' as Layer, name: 'Ixian DLT', value: pulse.dlt != null ? fmt(pulse.dlt) : '…', unit: 'nodes online' },
    { id: 's2', layer: 's2' as Layer, name: 'Ixian S2', value: pulse.s2 != null ? fmt(pulse.s2) : '…', unit: 'relay nodes online' },
    { id: 'tps', layer: null, name: metrics.peakTps.label, value: formatMetric(metrics.peakTps), unit: 'transactions per second' },
    { id: 'tx', layer: null, name: metrics.onChainTx.label, value: formatMetric(metrics.onChainTx), unit: 'on the Ixian DLT' },
  ];

  // platformLayers overrides platform.layers copy where set
  const byId = Object.fromEntries(platform.layers.map((l) => [l.id, l]));
  const tone: Record<Layer, string> = { dlt: 'green', s2: 'blue', apps: 'white', run: 'white' };
  const stat: Record<Layer, { b: string; span: string } | null> = {
    dlt: { b: pulse.dlt != null ? fmt(pulse.dlt) : '…', span: pulse.height != null ? `nodes · block ${fmt(pulse.height)}` : 'nodes online' },
    s2: { b: pulse.s2 != null ? fmt(pulse.s2) : '…', span: 'relay nodes online' },
    apps: { b: '1', span: 'address, on S2 and the DLT' },
    run: null,
  };
  const rows = platformLayers.layers.map((b, i) => {
    const base = byId[b.id];
    const id = b.id as Layer;
    return {
      id,
      n: String(i + 1).padStart(2, '0'),
      short: b.short,
      role: b.role,
      title: 'title' in b && b.title ? b.title : base.title,
      body: 'body' in b && b.body ? b.body : base.body,
      links: base.links,
      tone: tone[id],
      stat: stat[id],
    };
  });

  return (
    <section ref={section} id="platform" className={s.platform} aria-labelledby="platform-title">
      <SectionBoundary />
      <div className={s.wrap}>
        <header className={s.intro}>
          <h2 id="platform-title" className={s.title} data-reveal data-reveal-delay="0.24">
            {platform.title}
          </h2>
          <p className={s.lead} data-reveal>
            {platform.lead}
          </p>
        </header>

        <dl className={s.metrics} data-reveal>
          {metricRow.map((m) => (
            <div
              key={m.id}
              className={s.metric}
              data-tone={m.layer ?? undefined}
              data-dim={!bright(m.id) || undefined}
              data-on={(m.layer && hover === m.layer) || undefined}
            >
              <dt>
                {m.layer && <i />}
                {m.name}
              </dt>
              <dd>{m.value}</dd>
              <dd className={s.unit}>{m.unit}</dd>
            </div>
          ))}
        </dl>
        <p className={s.note}>
          <i className={s.live} data-on={pulse.ok || undefined} aria-hidden />
          {pulse.ok ? 'Node counts are live.' : 'Reading the network…'}
        </p>

        <div className={s.story}>
          <div ref={pinOuter} className={pin.outer} style={{ '--n': ORDER.length } as React.CSSProperties}>
          <div className={pin.inner}>
          <div ref={rail} className={pin.rail} aria-label="Layers">
            {rows.map((r, i) => (
              <div key={r.id} className={pin.card} data-on={shown === r.id || undefined} onClick={() => pickCard(i)}>
                <button type="button" className={pin.cardHead} onClick={() => pickCard(i)} aria-pressed={shown === r.id}>
                  <span className={pin.cardNo}>{r.n}</span>
                  <span className={pin.cardName}>{r.short}</span>
                  <span className={pin.cardTerm}>{r.role}</span>
                </button>
                <span className={pin.cardText}>{r.body}</span>
                {r.stat && (
                  <span className={s.railStat}>
                    <b>{r.stat.b}</b>
                    <span>{r.stat.span}</span>
                  </span>
                )}
                <span className={s.railLinks}>
                  {r.links.map((a) => (
                    <a key={a.label} href={a.href} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()}>
                      {a.label}
                      <Icon name="external" size={12} />
                    </a>
                  ))}
                </span>
              </div>
            ))}
          </div>
          <div className={s.scene}>
            <div ref={stage} className={s.stage} data-step={shown}>
              <canvas ref={canvas} className={s.canvas} aria-hidden />
              <div ref={calloutS2} className={s.callout} style={{ left: `${(CALLOUT.s2.x / W) * 100}%`, top: `${(CALLOUT.s2.y / H) * 100}%` }} aria-hidden>
                <b>{platformLayers.callouts.s2.label}</b>
                <span>{platformLayers.callouts.s2.body}</span>
              </div>
              <div ref={calloutDlt} className={s.callout} style={{ left: `${(CALLOUT.dlt.x / W) * 100}%`, top: `${(CALLOUT.dlt.y / H) * 100}%` }} aria-hidden>
                <b>{platformLayers.callouts.dlt.label}</b>
                <span>{platformLayers.callouts.dlt.body}</span>
              </div>
            </div>
            {/* phones only */}
            <div className={s.railActions}>
              {shown === 'run' && (
                <a className={s.primary} href={platform.cta.href} target="_blank" rel="noreferrer">
                  {platform.cta.label}
                </a>
              )}
              <a className={s.explore} data-outline="" href={platformLayers.explore.href}>
                {platformLayers.explore.label}
                <Icon name="arrow" size={16} data-dir="right" />
              </a>
            </div>
            <p className="ix-sr">{`Live now: ${pulse.dlt ?? 'unknown'} DLT nodes and ${pulse.s2 ?? 'unknown'} S2 nodes online, latest block ${pulse.height ?? 'unknown'}.`}</p>
          </div>
          </div>
          </div>

          <div className={s.indexCol} onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
            <ol className={s.index}>
              {rows.map((r) => {
                const open = shown === r.id;
                return (
                  <li
                    key={r.id}
                    className={s.row}
                    data-open={open || undefined}
                    data-tone={r.tone}
                    onMouseEnter={() => setHover(r.id)}
                    onMouseLeave={() => setHover(null)}
                  >
                    <span className={s.rule} aria-hidden>
                      {open && auto && step != null && (
                        <span key={cycle} className={s.progress} style={{ animationDuration: `${STEP_MS[r.id]}ms`, animationPlayState: paused ? 'paused' : 'running' }} />
                      )}
                    </span>
                    <button type="button" className={s.rowHead} aria-expanded={open} aria-controls={`pb-${r.id}`} onClick={() => goTo(r.id)}>
                      <span className={s.num}>{r.n}</span>
                      <i className={s.dot} />
                      <span className={s.short}>{r.short}</span>
                      <span className={s.role}>{r.role}</span>
                    </button>
                    <div id={`pb-${r.id}`} className={s.rowBody} inert={!open}>
                      <div className={s.rowInner}>
                        <h3>{r.title}</h3>
                        <p>{r.body}</p>
                        {r.stat && (
                          <div className={s.stat}>
                            <b>{r.stat.b}</b>
                            <span>{r.stat.span}</span>
                          </div>
                        )}
                        <ul className={s.docs}>
                          {r.links.map((a) => (
                            <li key={a.label}>
                              <a href={a.href} target="_blank" rel="noreferrer">
                                {a.label}
                                <Icon name="external" size={13} />
                              </a>
                            </li>
                          ))}
                        </ul>
                        {r.id === 'run' && (
                          <a className={s.primary} href={platform.cta.href} target="_blank" rel="noreferrer">
                            {platform.cta.label}
                          </a>
                        )}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ol>
            <a className={s.explore} data-outline="" href={platformLayers.explore.href}>
              {platformLayers.explore.label}
              <Icon name="arrow" size={16} data-dir="right" />
            </a>
          </div>
        </div>

        <div className={s.scale}>
          <div className={s.scaleHead}>
            <h3>{platformLayers.scale.title}</h3>
            <p>{platformLayers.scale.lead}</p>
            <a href={platformLayers.scale.link.href} target="_blank" rel="noreferrer">
              {platformLayers.scale.link.label}
              <Icon name="external" size={13} />
            </a>
          </div>
          <ul className={s.scalePoints}>
            {platformLayers.scale.points.map((p) => (
              <li key={p.k}>
                <b>{p.k}</b>
                <span>{p.v}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className={s.foot}>
          <ul className={s.community}>
            {platform.community.map((c) => (
              <li key={c.label}>
                <a href={c.href} target="_blank" rel="noreferrer">
                  {c.label}
                  <Icon name="external" size={13} />
                </a>
              </li>
            ))}
          </ul>
          <p className={s.names}>{platform.names}</p>
        </div>
      </div>
    </section>
  );
}
