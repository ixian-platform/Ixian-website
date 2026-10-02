/* Seeded and rounded so server and client markup match. */
import { S2, S2_NODES, S2_MESH, DLT_NODES } from './geometry';
import { mulberry32 as rng } from '@site/lib/rng';

const r2 = (n: number) => Math.round(n * 100) / 100;


/** layer heights per step (world units); `app` is the endpoints' plane */
export const PLANES_B: Record<string, { dlt: number; s2: number; app: number }> = {
  rest: { dlt: 0, s2: 0, app: 150 },
  dlt: { dlt: 34, s2: -50, app: 150 },
  s2: { dlt: -50, s2: 34, app: 150 },
  apps: { dlt: -96, s2: -40, app: 110 },
  run: { dlt: 0, s2: 0, app: 150 },
};
/** camera per step: scale about the platform centre, then a shift */
export const CAM: Record<string, { k: number; dx: number; dy: number }> = {
  // k < 1 keeps the S2 ring's ticks inside on the right; dlt lifts so the lowered S2 sheet stays in view
  rest: { k: 0.95, dx: 0, dy: 0 },
  dlt: { k: 0.95, dx: 0, dy: -34 },
  s2: { k: 0.95, dx: 0, dy: 0 },
  apps: { k: 0.74, dx: 0, dy: 48 },
  run: { k: 0.9, dx: -80, dy: 6 },
};

/** one massing per kind of endpoint (world units): no colour per kind */
export type Kind = { g: string; label: string; h: number };
/* `g` is a glyph key (components/endpointGlyphs.ts); `h` is the card's height above
   the plane, varied so the cards don't line up. */
const KINDS: Kind[] = [
  { g: 'agent', label: 'AI agent', h: 20 },
  { g: 'sensor', label: 'sensor', h: 14 },
  { g: 'spixi', label: 'phone', h: 17 },
  { g: 'robot', label: 'robot', h: 22 },
  { g: 'service', label: 'service', h: 15 },
  { g: 'car', label: 'car', h: 18 },
  { g: 'drone', label: 'drone', h: 26 },
  { g: 'lock', label: 'smart lock', h: 14 },
  { g: 'charger', label: 'charger', h: 16 },
  { g: 'app', label: 'Mini App', h: 19 },
  { g: 'camera', label: 'camera', h: 21 },
  { g: 'home', label: 'home hub', h: 15 },
  { g: 'device', label: 'IoT board', h: 17 },
];

export type Endpoint = { r: number; a: number; kind: Kind; at: number; s2: number };

/** nearest S2 node to a point on the plane (index) */
function nearestS2(r: number, a: number) {
  const x = r * Math.cos(a);
  const y = r * Math.sin(a);
  let best = 0;
  let bd = Infinity;
  S2_NODES.forEach((n, i) => {
    const d = (n.r * Math.cos(n.a) - x) ** 2 + (n.r * Math.sin(n.a) - y) ** 2;
    if (d < bd) {
      bd = d;
      best = i;
    }
  });
  return best;
}

/** endpoints spread over the plane, over the S2 ring, with a minimum spacing */
function makeEndpoints(n: number, seed: number): Endpoint[] {
  const r = rng(seed);
  const out: Endpoint[] = [];
  let tries = 0;
  while (out.length < n && tries < 4000) {
    tries++;
    const rad = r2(S2.r0 + 18 + (S2.r1 - S2.r0 - 30) * r());
    const ang = r2(r() * Math.PI * 2);
    const x = rad * Math.cos(ang);
    const y = rad * Math.sin(ang);
    if (out.some((p) => (p.r * Math.cos(p.a) - x) ** 2 + (p.r * Math.sin(p.a) - y) ** 2 < 62 * 62)) continue;
    out.push({ r: rad, a: ang, kind: KINDS[out.length % KINDS.length], at: 0, s2: nearestS2(rad, ang) });
  }
  // appear in a sweep round the plane, not in creation order
  const sorted = [...out].sort((p, q) => p.a - q.a);
  sorted.forEach((e, i) => (e.at = r2(0.35 + i * 0.07)));
  return out;
}
export const ENDPOINTS = makeEndpoints(13, 23);

/** shortest path over a mesh (node indices) */
function path(mesh: [number, number][], count: number, from: number, to: number): number[] {
  const adj: number[][] = Array.from({ length: count }, () => []);
  for (const [i, j] of mesh) {
    adj[i].push(j);
    adj[j].push(i);
  }
  const prev = new Array(count).fill(-1);
  const seen = new Set([from]);
  const q = [from];
  while (q.length) {
    const c = q.shift()!;
    if (c === to) break;
    for (const n of adj[c]) if (!seen.has(n)) {
      seen.add(n);
      prev[n] = c;
      q.push(n);
    }
  }
  const out = [to];
  while (out[0] !== from && prev[out[0]] !== -1) out.unshift(prev[out[0]]);
  return out[0] === from ? out : [from, to];
}

/** the pair that talks: two endpoints about a quarter turn apart */
function pickPair() {
  let best: [number, number] = [0, 1];
  let bd = Infinity;
  ENDPOINTS.forEach((p, i) =>
    ENDPOINTS.forEach((q, j) => {
      if (j <= i) return;
      let da = Math.abs(p.a - q.a) % (Math.PI * 2);
      if (da > Math.PI) da = Math.PI * 2 - da;
      const d = Math.abs(da - Math.PI / 2.4);
      if (d < bd) {
        bd = d;
        best = [i, j];
      }
    })
  );
  return best;
}
export const TALK = pickPair();
export const TALK_ROUTE = path(S2_MESH, S2_NODES.length, ENDPOINTS[TALK[0]].s2, ENDPOINTS[TALK[1]].s2);

/** the payer: the endpoint furthest round from the talking pair */
export const PAYER = (() => {
  const mid = (ENDPOINTS[TALK[0]].a + ENDPOINTS[TALK[1]].a) / 2;
  let best = 0;
  let bd = -1;
  ENDPOINTS.forEach((e, i) => {
    if (i === TALK[0] || i === TALK[1]) return;
    let da = Math.abs(e.a - mid) % (Math.PI * 2);
    if (da > Math.PI) da = Math.PI * 2 - da;
    if (da > bd) {
      bd = da;
      best = i;
    }
  });
  return best;
})();
/** the DLT node the payment lands on: a hub near the payer's side */
export const PAY_DLT = (() => {
  const a = ENDPOINTS[PAYER].a;
  let best = 0;
  let bd = Infinity;
  DLT_NODES.forEach((n, i) => {
    const d = (n.r * Math.cos(n.a) - 70 * Math.cos(a)) ** 2 + (n.r * Math.sin(n.a) - 70 * Math.sin(a)) ** 2;
    if (d < bd) {
      bd = d;
      best = i;
    }
  });
  return best;
})();

/** illustrative addresses on the three active endpoints (not live) */
export const ADDR = ['1BvK…m9fQ', '3xTr…Qa2c', '1Pn7…Wd4e'];

/** where a new node joins in the "Run a node" diagram: a point in a layer
    and its three nearest neighbours (picked when the step starts, so the
    node lands where the diagram's callout is, whatever the layer's turn) */
export function joinAt(nodes: { r: number; a: number }[], r: number, a: number) {
  const x = r * Math.cos(a);
  const y = r * Math.sin(a);
  const near = nodes
    .map((n, i) => ({ i, d: (n.r * Math.cos(n.a) - x) ** 2 + (n.r * Math.sin(n.a) - y) ** 2 }))
    .sort((p, q) => p.d - q.d)
    .slice(0, 3)
    .map((o) => o.i);
  return { r, a, near };
}

/** more S2 traffic, shown while S2 is the layer in view */
export const TRACKS_B = [
  { r: 152, speed: 0.26, phase: 1.2, len: 0.26 },
  { r: 196, speed: -0.2, phase: 5.1, len: 0.28 },
  { r: 232, speed: 0.17, phase: 2.4, len: 0.22 },
];
