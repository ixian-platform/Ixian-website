import { mulberry32 as rng } from '@site/lib/rng';
/* One isometric projection shared by the canvas and the HTML legend. */
export const W = 1080; // wide enough that the S2 ring isn't clipped on the right
export const H = 780;
export const S = 1.76;
export const CX = 540;
export const CY = 392; // centre of the platform on screen (assembled)
export const C30 = 0.866;

// the disc sits below the ring, inside its opening when seen from above:
// gap ≤ (S2.r0 - DLT.r) · 0.707
export const DLT = { r: 100, z: 0 };
export const S2 = { r0: 136, r1: 244, z: 0 };

export type P = { x: number; y: number };
export const proj = (x: number, y: number, z: number): P => ({
  x: CX + (x - y) * C30 * S,
  y: CY + (x + y) * 0.5 * S - z * S,
});
export const polar = (r: number, a: number, z: number) => proj(r * Math.cos(a), r * Math.sin(a), z);
/** the same point blended between the isometric view (v = 0) and straight
    above, dead centre (v = 1): ellipses open out into circles */
const ST = 1.5;
const TOP_CY = H / 2 - 20;
export const polarV = (r: number, a: number, z: number, v: number) => {
  if (v <= 0) return polar(r, a, z);
  const p = polar(r, a, z);
  const q = { x: CX + r * Math.cos(a - Math.PI / 4) * ST, y: TOP_CY + r * Math.sin(a - Math.PI / 4) * ST };
  return { x: p.x + (q.x - p.x) * v, y: p.y + (q.y - p.y) * v };
};

export type Node = { r: number; a: number; w: number };


/** k nearest neighbours within maxD, deduplicated (the mesh) */
function mesh(nodes: Node[], k: number, maxD: number): [number, number][] {
  const xy = nodes.map((n) => [n.r * Math.cos(n.a), n.r * Math.sin(n.a)]);
  const seen = new Set<string>();
  const out: [number, number][] = [];
  xy.forEach(([x, y], i) => {
    xy.map(([u, v], j) => ({ j, d: (u - x) ** 2 + (v - y) ** 2 }))
      .filter((o) => o.j !== i && o.d < maxD * maxD)
      .sort((p, q) => p.d - q.d)
      .slice(0, k)
      .forEach(({ j }) => {
        const key = i < j ? `${i}-${j}` : `${j}-${i}`;
        if (!seen.has(key)) {
          seen.add(key);
          out.push([i, j]);
        }
      });
  });
  return out;
}

/** seeded random points with a minimum spacing, a few denser clusters, mixed weights */
function scatter(n: number, r0: number, r1: number, minD: number, seed: number): Node[] {
  const r = rng(seed);
  const out: Node[] = [];
  const clusters = Array.from({ length: 5 }, () => ({ a: r() * Math.PI * 2, r: r0 + (r1 - r0) * r() }));
  let tries = 0;
  while (out.length < n && tries < n * 60) {
    tries++;
    let rad: number;
    let ang: number;
    if (r() < 0.3) {
      // pull some points towards a cluster
      const c = clusters[Math.floor(r() * clusters.length)];
      rad = Math.min(r1, Math.max(r0, c.r + (r() - 0.5) * 34));
      ang = c.a + (r() - 0.5) * (40 / Math.max(rad, 1));
    } else {
      rad = Math.sqrt(r0 * r0 + (r1 * r1 - r0 * r0) * r());
      ang = r() * Math.PI * 2;
    }
    const x = rad * Math.cos(ang);
    const y = rad * Math.sin(ang);
    if (out.every((p) => (p.r * Math.cos(p.a) - x) ** 2 + (p.r * Math.sin(p.a) - y) ** 2 > minD * minD)) {
      out.push({ r: rad, a: ang, w: Math.pow(r(), 1.6) });
    }
  }
  return out;
}
export const DLT_NODES = scatter(130, 4, DLT.r - 2, 9, 7);
export const DLT_MESH = mesh(DLT_NODES, 2, 26);
export const S2_NODES = scatter(420, S2.r0 + 2, S2.r1, 8.5, 11);
export const S2_MESH = mesh(S2_NODES, 3, 26);

/** S2 traffic trails */
export const TRACKS = [
  { r: 176, speed: 0.2, phase: 0.4, len: 0.34 },
  { r: 214, speed: -0.14, phase: 3.3, len: 0.3 },
];
