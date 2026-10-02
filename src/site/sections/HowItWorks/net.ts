/* Shared How it works geometry: canvas size, DLT tiles and the eye layout (S2 ring round the DLT disc).
   Every value is an integer or rounded to two decimals and every random choice is seeded,
   so the server and the browser draw the same thing. */

import { mulberry32 } from '@site/lib/rng';

export type P = { x: number; y: number };

export const W = 800;
export const H = 460;
export const r2 = (n: number) => Math.round(n * 100) / 100;

export const rng = mulberry32;
export const d2 = (a: P, b: P) => (a.x - b.x) ** 2 + (a.y - b.y) ** 2;

/** DLT blocks: a row of tiles, centre of tile i */
export const TILES = 5;

/** every scene hands the contract these paths (screen space) */
export type Paths = {
  direct: string;
  directBack: string;
  /** A → relay → B, and back */
  route: string;
  back: string;
  /** A → relay */
  ar: string;
  /** A → relay → the next block: the transaction, traced from the sender */
  pay: string;
};

/* ------------------------------------------------------------------ eye */
/** one lightable point of the eye: angle a, radius t (0 centre, 1 rim) */
export type EyeNode = P & { a: number; t: number };
export type Eye = {
  ring: EyeNode[];
  disc: EyeNode[];
  ringMesh: [number, number][];
  discMesh: [number, number][];
  relay: number;
  sector: boolean[];
  R: P;
};
export const EYE = (() => {
  const C = { x: 400, y: 258 };
  const RX = 178;
  const RY = 86;
  const card = { w: 176, h: 60 };
  const A = { x: 14, y: C.y - 30 };
  const B = { x: W - 14 - card.w, y: C.y - 30 };
  // the blocks sit in the middle of the eye: the DLT is where a payment settles
  const tile = { w: 24, h: 16, gap: 4 };
  const TY = C.y - tile.h / 2;
  const TX = (i: number) => C.x + (i - 2) * (tile.w + tile.gap);
  const next = TX(TILES - 1);
  return { C, RX, RY, card, A, B, mid: C.y, tile, TY, TX, next };
})();

function mesh(ns: P[], k: number, maxD: number) {
  const seen = new Set<string>();
  const out: [number, number][] = [];
  ns.forEach((p, i) =>
    ns
      .map((q, j) => ({ j, d: d2(p, q) }))
      .filter((o) => o.j !== i && o.d < maxD * maxD)
      .sort((x, y) => x.d - y.d)
      .slice(0, k)
      .forEach(({ j }) => {
        const key = i < j ? `${i}-${j}` : `${j}-${i}`;
        if (!seen.has(key)) {
          seen.add(key);
          out.push([i, j]);
        }
      })
  );
  return out;
}

export function makeEye(): Eye {
  const { C, RX, RY } = EYE;
  const r = rng(23);
  const make = (n: number, t0: number, t1: number, minD: number) => {
    const out: EyeNode[] = [];
    for (let tries = 0; out.length < n && tries < n * 80; tries++) {
      const a = r() * Math.PI * 2;
      const t = Math.sqrt(t0 * t0 + (t1 * t1 - t0 * t0) * r());
      const p = { x: r2(C.x + Math.cos(a) * t * RX), y: r2(C.y + Math.sin(a) * t * RY), a: r2(a), t: r2(t) };
      if (out.every((o) => d2(o, p) > minD * minD)) out.push(p);
    }
    return out;
  };
  const ring = make(64, 0.72, 1, 17);
  const disc = make(18, 0.05, 0.36, 15);
  // the relay: the S2 point nearest the front of the ring, where the route passes
  const target = { x: C.x, y: C.y + RY * 0.86 };
  const relay = ring.reduce((best, n, i) => (d2(n, target) < d2(ring[best], target) ? i : best), 0);
  const R = { x: ring[relay].x, y: ring[relay].y };
  const ra = ring[relay].a;
  const sector = ring.map((n, i) => i !== relay && Math.abs(Math.atan2(Math.sin(n.a - ra), Math.cos(n.a - ra))) < 0.42);
  return { ring, disc, ringMesh: mesh(ring, 2, 40), discMesh: mesh(disc, 2, 36), relay, sector, R };
}

export function eyePaths(R: P): Paths {
  const { card, A, B, mid, next, TY } = EYE;
  const aFoot = { x: A.x + card.w / 2, y: A.y + card.h };
  const bFoot = { x: B.x + card.w / 2, y: B.y + card.h };
  const ar = `M${aFoot.x} ${aFoot.y} C${aFoot.x} ${aFoot.y + 50} ${r2(R.x - 150)} ${R.y} ${R.x} ${R.y}`;
  const rb = `C${r2(R.x + 150)} ${R.y} ${bFoot.x} ${bFoot.y + 50} ${bFoot.x} ${bFoot.y}`;
  // the direct line arcs over the back of the ring, in the same plane
  const ax = A.x + card.w;
  const bx = B.x;
  return {
    direct: `M${ax} ${mid} C${ax + 90} ${mid - 150} ${bx - 90} ${mid - 150} ${bx} ${mid}`,
    directBack: `M${bx} ${mid} C${bx - 90} ${mid - 150} ${ax + 90} ${mid - 150} ${ax} ${mid}`,
    route: `${ar} ${rb}`,
    back: `M${bFoot.x} ${bFoot.y} C${bFoot.x} ${bFoot.y + 50} ${r2(R.x + 150)} ${R.y} ${R.x} ${R.y} C${r2(R.x - 150)} ${R.y} ${aFoot.x} ${aFoot.y + 50} ${aFoot.x} ${aFoot.y}`,
    ar,
    // through the relay, inward across the ring, into the next block at the centre
    pay: `${ar} C${R.x} ${r2(R.y - 40)} ${next} ${TY + 60} ${next} ${TY + EYE.tile.h}`,
  };
}
