import { memo, type ReactNode } from 'react';
import type { UseCase } from '@site/content/how';
import { GLYPH } from '@site/components/endpointGlyphs';
import { W, r2 } from './net';
import { Ghost, Badge, Tokens, Check, ROUTE } from './parts';
import s from './HowItWorks.module.css';

/*
   Isometric scene, 800 × 332. World: x runs down-right, y down-left, z up. The S2 plate is
   centred on the origin; A sits along -x, B along -y, so the relay route is an L meeting at
   the relay post; the direct line is a bridge above; the DLT blocks stand in front.
   Glyphs are etched on the slab's front face, where they aren't foreshortened.
*/

export const ISO_H = 332;
const O = { x: 400, y: 162 };
const K = 0.84; // world → drawing scale
/** steps 1 and 2 show only the endpoints (and the bridge): the composition sits lower, centred */
export const ISO_DY0 = 78;
const Cc = 0.866;
type V3 = [number, number, number];
type P2 = { x: number; y: number };
const iso = (x: number, y: number, z = 0): P2 => ({ x: r2(O.x + (x - y) * Cc * K), y: r2(O.y + ((x + y) * 0.5 - z) * K) });
const pts = (ps: V3[]) => ps.map(([x, y, z]) => iso(x, y, z)).map((p) => `${p.x},${p.y}`).join(' ');
const rev = (ps: V3[]) => [...ps].reverse();

/** a polyline with every corner rounded (radius in drawing units) */
function rounded(ps: V3[], r = 6) {
  const p = ps.map(([x, y, z]) => iso(x, y, z));
  let d = `M${p[0].x} ${p[0].y}`;
  for (let i = 1; i < p.length - 1; i++) {
    const a = p[i - 1];
    const b = p[i];
    const c = p[i + 1];
    const l1 = Math.hypot(b.x - a.x, b.y - a.y);
    const l2 = Math.hypot(c.x - b.x, c.y - b.y);
    if (!l1 || !l2) continue;
    const k1 = Math.min(r, l1 / 2) / l1;
    const k2 = Math.min(r, l2 / 2) / l2;
    d += ` L${r2(b.x - (b.x - a.x) * k1)} ${r2(b.y - (b.y - a.y) * k1)} Q${b.x} ${b.y} ${r2(b.x + (c.x - b.x) * k2)} ${r2(b.y + (c.y - b.y) * k2)}`;
  }
  const e = p[p.length - 1];
  return `${d} L${e.x} ${e.y}`;
}

const EDGE = 'rgba(243, 247, 244, 0.09)';
const EDGE_KEY = 'rgba(243, 247, 244, 0.22)';
const WIRE = 'rgba(243, 247, 244, 0.06)';
const FACE = { top: '#161a18', left: '#0e1110', right: '#0a0c0b' };
/** what stands on a slab is lighter and crisper than the slab, so the outline carries the kind */
const MASS_EDGE = 'rgba(243, 247, 244, 0.36)';
const MASS_FACE = { top: '#1f2422', left: '#141816', right: '#0e1110' };
const LINE = 'rgba(243, 247, 244, 0.55)';
const SLAB_EDGE = 'rgba(243, 247, 244, 0.14)';

const topFace = (x: number, y: number, z: number, w: number, d: number): V3[] => [[x, y, z], [x + w, y, z], [x + w, y + d, z], [x, y + d, z]];

function Box({ x, y, z = 0, w, d, h, edge = EDGE, hatch, hot, faces = FACE }: { x: number; y: number; z?: number; w: number; d: number; h: number; edge?: string; hatch?: boolean; hot?: 'a' | 'b'; faces?: typeof FACE }) {
  const left: V3[] = [[x, y + d, z], [x + w, y + d, z], [x + w, y + d, z + h], [x, y + d, z + h]];
  const right: V3[] = [[x + w, y, z], [x + w, y + d, z], [x + w, y + d, z + h], [x + w, y, z + h]];
  return (
    <g stroke={edge} strokeWidth={1} strokeLinejoin="round">
      <polygon points={pts(left)} fill={faces.left} />
      <polygon points={pts(right)} fill={faces.right} />
      {hatch && <polygon points={pts(right)} fill="url(#hw-iso-hatch)" stroke="none" />}
      <polygon points={pts(topFace(x, y, z + h, w, d))} fill={faces.top} data-hot={hot} data-rest={hot ? edge : undefined} />
    </g>
  );
}

/* ------------------------------------------------------------------ endpoints */
const PLATE = 96; // half-size of the S2 plate
const PZ = 3; // its thickness: a sheet, not a slab
const A = { x: -176, y: 0 };
const B = { x: 0, y: -176 };
const EP = 24; // half-size of the base slab, the same for every endpoint
const SLAB = 14; // its height: tall enough to carry the etched glyph
const BRIDGE = 74; // height of the direct line
const POST = 24; // the relay post
const TILE_Y = 150;
const tileX = (i: number) => -8 + i * 30;
const NEXT = tileX(4);

/**
 * What stands on the slab, by kind. Proportion is part of the code: the
 * sensor is smallest, the phone small and upright, the agent a big stacked
 * machine, the car low and wide.
 */
function Mass({ kind, c }: { kind: string; c: P2 }): ReactNode {
  const z = SLAB;
  const x = c.x;
  const y = c.y;
  switch (kind) {
    case 'spixi': // phone: a thin upright rectangle, portrait
      return (
        <>
          <Box x={x - 2} y={y - 10} z={z} w={4} d={20} h={34} edge={MASS_EDGE} faces={MASS_FACE} />
          <polygon points={pts([[x + 2, y - 7, z + 29], [x + 2, y + 7, z + 29], [x + 2, y + 7, z + 5], [x + 2, y - 7, z + 5]])} stroke="rgba(243, 247, 244, 0.2)" fill="none" />
        </>
      );
    case 'agent': // AI agent: two offset plates, a machine, not a handheld
      return (
        <>
          <Box x={x - 15} y={y - 15} z={z} w={30} d={30} h={14} edge={MASS_EDGE} faces={MASS_FACE} hatch />
          <Box x={x - 12} y={y - 12} z={z + 18} w={22} d={22} h={12} edge={MASS_EDGE} faces={MASS_FACE} />
          <polygon points={pts(topFace(x - 7, y - 7, z + 30, 12, 12))} stroke="rgba(243, 247, 244, 0.14)" fill="none" />
        </>
      );
    case 'sensor': {
      // IoT sensor: a short post with waves rising off it
      const t = iso(x, y, z + 20);
      return (
        <>
          <Box x={x - 2.5} y={y - 2.5} z={z} w={5} d={5} h={20} edge={MASS_EDGE} faces={MASS_FACE} />
          <g stroke={LINE} strokeWidth={1.4} fill="none">
            {[6, 11, 16].map((r) => (
              <path key={r} d={`M${r2(t.x - r)} ${r2(t.y - 4)} A${r} ${r} 0 0 1 ${r2(t.x + r)} ${r2(t.y - 4)}`} opacity={1.1 - r / 22} />
            ))}
          </g>
        </>
      );
    }
    case 'service': // laptop / dashboard: an open wedge
      return (
        <>
          <Box x={x - 13} y={y - 10} z={z} w={26} d={20} h={2} edge={MASS_EDGE} faces={MASS_FACE} />
          <polygon points={pts([[x - 13, y - 10, z + 2], [x + 13, y - 10, z + 2], [x + 13, y - 16, z + 22], [x - 13, y - 16, z + 22]])} fill={FACE.top} stroke={EDGE_KEY} />
          <polygon points={pts([[x - 10, y - 11, z + 5], [x + 10, y - 11, z + 5], [x + 10, y - 15, z + 19], [x - 10, y - 15, z + 19]])} fill="none" stroke="rgba(243, 247, 244, 0.1)" />
        </>
      );
    case 'device': // a board computer: a low board, one chip, one port
      return (
        <>
          <Box x={x - 17} y={y - 13} z={z + 5} w={34} d={26} h={3} edge={MASS_EDGE} faces={MASS_FACE} />
          <path d={rounded([[x - 15, y + 11, z], [x - 15, y + 11, z + 5]], 0)} stroke={MASS_EDGE} />
          <path d={rounded([[x + 15, y + 11, z], [x + 15, y + 11, z + 5]], 0)} stroke={MASS_EDGE} />
          <Box x={x - 7} y={y - 5} z={z + 8} w={10} d={10} h={4} edge={MASS_EDGE} faces={MASS_FACE} />
          <Box x={x + 7} y={y - 12} z={z + 8} w={9} d={10} h={13} edge={MASS_EDGE} faces={MASS_FACE} />
        </>
      );
    case 'car': // low and wide, a small cabin bump
      return (
        <>
          <Box x={x - 22} y={y - 11} z={z + 3} w={44} d={22} h={8} edge={MASS_EDGE} faces={MASS_FACE} hatch />
          <polygon points={pts([[x - 10, y - 9, z + 11], [x + 6, y - 9, z + 11], [x + 2, y - 9, z + 19], [x - 7, y - 9, z + 19]])} fill={MASS_FACE.right} stroke={MASS_EDGE} />
          <polygon points={pts([[x - 10, y - 9, z + 11], [x - 10, y + 9, z + 11], [x - 7, y + 9, z + 19], [x - 7, y - 9, z + 19]])} fill={MASS_FACE.top} stroke={MASS_EDGE} />
          <polygon points={pts([[x - 7, y - 9, z + 19], [x + 2, y - 9, z + 19], [x + 2, y + 9, z + 19], [x - 7, y + 9, z + 19]])} fill={MASS_FACE.top} stroke={MASS_EDGE} />
          <polygon points={pts([[x + 6, y - 9, z + 11], [x + 6, y + 9, z + 11], [x + 2, y + 9, z + 19], [x + 2, y - 9, z + 19]])} fill={MASS_FACE.left} stroke={MASS_EDGE} />
          {[-13, 13].map((dx) => {
            const w = iso(x + dx, y + 11, z + 3);
            return <ellipse key={dx} cx={w.x} cy={w.y} rx={4.5} ry={4} fill="#0a0c0b" stroke={MASS_EDGE} />;
          })}
        </>
      );
    case 'robot': {
      // an arm: a base, an upright, a reach
      const a = iso(x, y, z + 28);
      const b = iso(x + 18, y, z + 40);
      return (
        <>
          <Box x={x - 7} y={y - 7} z={z} w={14} d={14} h={5} edge={MASS_EDGE} faces={MASS_FACE} />
          <Box x={x - 3} y={y - 3} z={z + 5} w={6} d={6} h={23} edge={MASS_EDGE} faces={MASS_FACE} />
          <path d={`M${a.x} ${a.y} L${b.x} ${b.y}`} stroke={LINE} strokeWidth={3.2} />
          <path d={`M${b.x - 3} ${b.y + 9} L${b.x} ${b.y} L${b.x + 3} ${b.y + 9}`} stroke={LINE} strokeWidth={1.5} />
        </>
      );
    }
    case 'drone': {
      // a flat cross on short legs, four rotors
      const h = z + 12;
      const ends: V3[] = [[x - 16, y - 16, h], [x + 16, y + 16, h], [x - 16, y + 16, h], [x + 16, y - 16, h]];
      return (
        <>
          <Box x={x - 5} y={y - 5} z={h - 3} w={10} d={10} h={4} edge={MASS_EDGE} faces={MASS_FACE} />
          <g stroke={LINE} strokeWidth={2}>
            <path d={rounded([ends[0], ends[1]], 0)} />
            <path d={rounded([ends[2], ends[3]], 0)} />
          </g>
          {ends.map(([ex, ey, ez], i) => {
            const p = iso(ex, ey, ez);
            return <ellipse key={i} cx={p.x} cy={p.y} rx={8} ry={4} stroke={LINE} fill="rgba(10, 12, 11, 0.8)" />;
          })}
          <path d={rounded([[x - 3, y + 3, z], [x - 3, y + 3, h - 3]], 0)} stroke={EDGE_KEY} />
          <path d={rounded([[x + 3, y - 3, z], [x + 3, y - 3, h - 3]], 0)} stroke={EDGE_KEY} />
        </>
      );
    }
    default: // anything else: a plain block
      return <Box x={x - 11} y={y - 11} z={z} w={22} d={22} h={16} edge={MASS_EDGE} faces={MASS_FACE} />;
  }
}
/** every kind the cycler or a use case can show */
export const KINDS = ['spixi', 'agent', 'sensor', 'service', 'device', 'car', 'robot', 'drone'];

/* ------------------------------------------------------------------ routes */
const AR: V3[] = [[A.x + EP, 0, PZ], [0, 0, PZ]];
const ROUTE_P: V3[] = [...AR, [0, B.y + EP, PZ]];
const DIRECT: V3[] = [[A.x, A.y, SLAB + 36], [A.x, A.y, BRIDGE], [B.x, B.y, BRIDGE], [B.x, B.y, SLAB + 36]];
const PAY: V3[] = [...AR, [0, PLATE, PZ], [0, PLATE, 0], [0, TILE_Y - 18, 0], [NEXT + 10, TILE_Y - 18, 0], [NEXT + 10, TILE_Y, 0]];

export const IsoScene = memo(function IsoScene({ uc, addrs, crop = false }: { uc: UseCase; addrs: [string, string]; crop?: boolean }) {
  const lattice: { x: number; y: number; sector: boolean }[] = [];
  for (let i = -2; i <= 2; i++) for (let j = -2; j <= 2; j++) if (i || j) lattice.push({ x: i * 34, y: j * 34, sector: Math.abs(i) <= 1 && j <= 0 && j >= -1 });
  const label = (side: 'a' | 'b', p: P2, name: string, addr: string, anchor: 'start' | 'end') => (
    <g>
      <text data-name={side} data-final={name.charAt(0).toUpperCase() + name.slice(1)} x={p.x} y={p.y} textAnchor={anchor} fontSize="13.5" fontWeight="500" fill="var(--ix-text)" className={s.epName}>
        {name.charAt(0).toUpperCase() + name.slice(1)}
      </text>
      <text data-addr={side} data-final={addr} x={p.x} y={p.y + 16} textAnchor={anchor} fontSize="10.5" fill="var(--ix-text-3)" className={s.addr}>
        {addr}
      </text>
      <g data-key={side} opacity={0} transform={`translate(${anchor === 'end' ? p.x - 12 : p.x} ${p.y - 34}) scale(0.72)`}>
        <path d="M11.5 7.5a4 4 0 1 1-2.2 3.6L2 18.5M4.5 16l2 2M6.5 14l2 2" stroke={ROUTE} strokeWidth={1.6} fill="none" strokeLinecap="round" />
      </g>
      <Check side={side} x={p.x} y={p.y + 36} anchor={anchor} />
    </g>
  );
  const endpoint = (side: 'a' | 'b', c: P2, g: string) => {
    // the glyph, etched on the slab's front (+y) face: u runs along x, v runs down
    const f = iso(c.x - EP, c.y + EP, SLAB);
    const face = `matrix(${r2(Cc * K)} ${r2(0.5 * K)} 0 ${K} ${f.x} ${f.y})`;
    return (
      <g>
        <Box x={c.x - EP} y={c.y - EP} w={EP * 2} d={EP * 2} h={SLAB} edge={SLAB_EDGE} hot={side} />
        <polygon data-bring={side} points={pts(topFace(c.x - EP, c.y - EP, SLAB, EP * 2, EP * 2))} stroke={ROUTE} strokeWidth={1} opacity={0} />
        <g transform={`${face} translate(${EP - 6} 1.5) scale(0.46)`}>
          <path data-glyph={side} d={GLYPH[g] ?? GLYPH.device} stroke="var(--ix-text-2)" strokeWidth={2.2} fill="none" strokeLinejoin="round" />
        </g>
        {KINDS.map((k) => (
          <g key={k} data-mass={side} data-kind={k} display={k === (KINDS.includes(g) ? g : 'agent') ? undefined : 'none'}>
            <Mass kind={k} c={c} />
          </g>
        ))}
      </g>
    );
  };
  const aL = iso(A.x - EP, A.y + EP, 0);
  const bL = iso(B.x + EP, B.y - EP, 0);
  const relayTop = topFace(-5, -5, PZ + POST, 10, 10);
  const bridgeMid = iso(-88, -88, BRIDGE);
  const nextTop = iso(NEXT + 10, TILE_Y + 10, 14);
  const tile0 = iso(tileX(0), TILE_Y + 20, 0);
  // the plate: a dark sheet with corner ticks, not a finished object
  const corners: V3[] = [[-PLATE, -PLATE, PZ], [PLATE, -PLATE, PZ], [PLATE, PLATE, PZ], [-PLATE, PLATE, PZ]];
  const tick = 16;
  return (
    <svg className={s.svg} data-crop={crop || undefined} viewBox={crop ? `100 0 ${W - 200} ${ISO_H}` : `0 0 ${W} ${ISO_H}`} fill="none" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <defs>
        <pattern id="hw-iso-hatch" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(-30)">
          <line x1="0" y1="0" x2="0" y2="5" stroke="rgba(243, 247, 244, 0.06)" strokeWidth={1} />
        </pattern>
      </defs>
      {/* everything but the tokens moves together, once: centred while only the endpoints show, up into place when the network arrives */}
      <g data-center data-dy0={ISO_DY0}>
        {/* a faint ground grid along the iso axes */}
        <g stroke="rgba(243, 247, 244, 0.016)" strokeWidth={1}>
          {Array.from({ length: 17 }, (_, i) => -208 + i * 26).map((v) => (
            <g key={v}>
              <path d={rounded([[v, -208, 0], [v, 208, 0]], 0)} />
              <path d={rounded([[-208, v, 0], [208, v, 0]], 0)} />
            </g>
          ))}
        </g>

        <Ghost x={W / 2} y={44} />

        {/* Find onwards: the plate, its relays, the post and the L-shaped route */}
        <g data-from="2">
          <g data-platform>
            <polygon points={pts(corners)} fill="rgba(243, 247, 244, 0.014)" stroke="rgba(243, 247, 244, 0.035)" strokeWidth={0.8} />
            <g stroke="rgba(243, 247, 244, 0.12)" strokeWidth={0.8}>
              {corners.map(([cx, cy], i) => {
                const sx = cx < 0 ? 1 : -1;
                const sy = cy < 0 ? 1 : -1;
                return <path key={i} d={rounded([[cx + sx * tick, cy, PZ], [cx, cy, PZ], [cx, cy + sy * tick, PZ]], 0)} />;
              })}
            </g>
            <g stroke="rgba(157, 185, 255, 0.07)" strokeWidth={0.8} strokeDasharray="1 5">
              {[-1, 0, 1].map((i) => (
                <g key={i}>
                  <path d={rounded([[i * 34, -68, PZ], [i * 34, 68, PZ]], 0)} />
                  <path d={rounded([[-68, i * 34, PZ], [68, i * 34, PZ]], 0)} />
                </g>
              ))}
            </g>
            {lattice.map((n, i) => {
              const p = iso(n.x, n.y, PZ);
              return <ellipse key={i} cx={p.x} cy={p.y} rx={2} ry={1.15} fill="rgb(200, 214, 250)" opacity={0.28} />;
            })}
            <path d={rounded(ROUTE_P)} stroke={WIRE} strokeWidth={1} />
            <text className={s.tag} x={iso(PLATE, -PLATE, 0).x + 12} y={iso(PLATE, -PLATE, 0).y + 26} fontSize="9.5" letterSpacing="0.1em" fill="var(--ix-text-3)" opacity={0.8}>
              IXIAN S2 · RELAYS
            </text>
          </g>
          <g data-sector-lit opacity={0}>
            {lattice.map((n, i) => {
              if (!n.sector) return null;
              const p = iso(n.x, n.y, PZ);
              return <ellipse key={i} cx={p.x} cy={p.y} rx={2.6} ry={1.5} fill={ROUTE} />;
            })}
          </g>
          <path data-query d={rounded(AR)} stroke={ROUTE} strokeWidth={1.2} strokeDasharray="3 5" opacity={0} />
          <path data-route d={rounded(ROUTE_P)} stroke={ROUTE} strokeWidth={1.3} opacity={0} />
          <Box x={-5} y={-5} z={PZ} w={10} d={10} h={POST} edge={EDGE_KEY} />
          <polygon data-relay-lit points={pts(relayTop)} fill={ROUTE} fillOpacity={0.55} stroke={ROUTE} opacity={0} />
          <polygon data-relay-ring points={pts(relayTop)} stroke={ROUTE} strokeWidth={1} opacity={0} />
          <text className={s.tag} x={400} y={iso(-PLATE, -PLATE, PZ).y - 12} textAnchor="middle" fontSize="9.5" letterSpacing="0.1em" fill="var(--ix-text-3)">
            S2 RELAY
          </text>
        </g>

        {/* Pay: the blocks on the ground in front, and the transaction's path from A */}
        <g data-from="4">
          <g>
            {Array.from({ length: 5 }, (_, i) => (
              <Box key={i} x={tileX(i)} y={TILE_Y} w={20} d={20} h={i === 4 ? 12 : 8} edge={i === 4 ? EDGE_KEY : EDGE} />
            ))}
            <text className={s.tag} x={tile0.x - 10} y={tile0.y + 4} textAnchor="end" fontSize="9.5" letterSpacing="0.1em" fill="var(--ix-text-3)">
              IXIAN DLT · BLOCKS
            </text>
          </g>
          <path d={rounded(PAY)} stroke={WIRE} strokeWidth={1} strokeDasharray="2 4" />
          <path data-pay d={rounded(PAY)} stroke="rgba(92, 201, 109, 0.75)" strokeWidth={1.2} opacity={0} />
          <polygon data-settle points={pts(topFace(NEXT, TILE_Y, 12, 20, 20))} fill="var(--ix-live)" fillOpacity={0.22} stroke="var(--ix-live)" opacity={0} />
          <Badge attr="signed" x={nextTop.x + 76} y={nextTop.y - 4} w={96} text="signed by A" />
        </g>

        {endpoint('a', A, uc.glyph[0])}
        {endpoint('b', B, uc.glyph[1])}

        {/* Proof onwards: the bridge between the two ends, its corners softened */}
        <g data-from="1">
          <path d={rounded(DIRECT)} stroke={WIRE} strokeWidth={1} strokeDasharray="2 5" />
          <path data-direct d={rounded(DIRECT)} stroke={ROUTE} strokeWidth={1.3} opacity={0} />
        </g>
        <Badge attr="pq" x={bridgeMid.x} y={bridgeMid.y} w={104} text="post-quantum" lock />

        {label('a', { x: aL.x - 12, y: aL.y - 2 }, uc.names[0], addrs[0], 'end')}
        {label('b', { x: bL.x + 12, y: bL.y - 2 }, uc.names[1], addrs[1], 'start')}

        <path data-direct-back d={rounded(rev(DIRECT))} opacity={0} />
        <path data-back d={rounded(rev(ROUTE_P))} opacity={0} />
        <path data-ar d={rounded(AR)} opacity={0} />
      </g>
      <Tokens />
    </svg>
  );
});
