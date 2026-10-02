import { memo, useMemo } from 'react';
import type { UseCase } from '@site/content/how';
import { useNetworkPulse, fmt } from '@site/lib/useNetworkPulse';
import { EYE, W, H, TILES, makeEye, eyePaths, r2 } from './net';
import { Card, Ghost, Badge, Tokens, ROUTE, WIRE, relayCount } from './parts';
import s from './HowItWorks.module.css';

// Alternate scene (?how=eye): the S2 ring around the DLT disc, in the endpoints' plane.
// Uses the same data-* reveal hooks as the flat diagram.

const RING = 'rgb(200, 214, 250)';
const DISC = 'rgb(170, 228, 182)';

export const EyeScene = memo(function EyeScene({ uc, addrs }: { uc: UseCase; addrs: [string, string] }) {
  const { C, RX, RY, card, A, B, tile, TY, TX, next } = EYE;
  const eye = useMemo(() => makeEye(), []);
  const paths = useMemo(() => eyePaths(eye.R), [eye]);
  const { ring, disc, ringMesh, discMesh, relay, sector, R } = eye;
  const pulse = useNetworkPulse();
  const h = pulse.height;
  return (
    <svg className={s.svg} viewBox={`0 0 ${W} ${H}`} fill="none" strokeLinecap="round" aria-hidden>
      <Ghost x={W / 2} y={40} />

      <g data-from="1">
        <path d={paths.direct} stroke={WIRE} strokeWidth={1} strokeDasharray="2 5" />
        <path data-direct d={paths.direct} stroke={ROUTE} strokeWidth={1.5} opacity={0} />
      </g>

      <g data-from="2">
        <g data-platform>
          {/* the plane: two quiet ellipses, the rim of S2 and of the DLT */}
          <ellipse cx={C.x} cy={C.y} rx={RX + 10} ry={RY + 6} stroke="rgba(243, 247, 244, 0.06)" />
          <ellipse cx={C.x} cy={C.y} rx={r2(RX * 0.44)} ry={r2(RY * 0.44)} stroke="rgba(140, 222, 156, 0.12)" strokeDasharray="2 4" />
          <g strokeWidth={0.8}>
            <g stroke="rgba(157, 185, 255, 0.14)">
              {ringMesh.map(([i, j], k) => (
                <line key={k} x1={ring[i].x} y1={ring[i].y} x2={ring[j].x} y2={ring[j].y} />
              ))}
            </g>
            <g stroke="rgba(140, 222, 156, 0.14)">
              {discMesh.map(([i, j], k) => (
                <line key={k} x1={disc[i].x} y1={disc[i].y} x2={disc[j].x} y2={disc[j].y} />
              ))}
            </g>
          </g>
          {ring.map((n, i) => (i === relay ? null : <circle key={i} cx={n.x} cy={n.y} r={1.6} fill={RING} opacity={0.45} />))}
          {disc.map((n, i) => (
            <circle key={i} cx={n.x} cy={n.y} r={1.5} fill={DISC} opacity={0.4} />
          ))}
          <path d={paths.route} stroke={WIRE} strokeWidth={1} />
          <circle cx={R.x} cy={R.y} r={5} fill="var(--ix-bg)" stroke="var(--ix-grey-700)" strokeWidth={1.2} />
          <text className={s.tag} x={C.x - RX} y={C.y - RY - 22} fontSize="9.5" letterSpacing="0.1em" fill="var(--ix-text-3)">
            IXIAN S2 · RELAYS
          </text>
          <text className={s.tag} x={C.x} y={C.y + RY * 0.44 + 16} textAnchor="middle" fontSize="9.5" letterSpacing="0.1em" fill="var(--ix-text-3)">
            IXIAN DLT
          </text>
          <text x={R.x} y={R.y + 26} textAnchor="middle" fontSize="11.5" fill="var(--ix-text-3)" className={s.note}>
            S2 relay, {relayCount(pulse.s2)}
          </text>
        </g>
        {/* the sector the hash lands on: its relays light */}
        <g data-sector-lit opacity={0}>
          {ring.map((n, i) => (sector[i] ? <circle key={i} cx={n.x} cy={n.y} r={2.2} fill={ROUTE} /> : null))}
        </g>
        <path data-query d={paths.ar} stroke={ROUTE} strokeWidth={1.2} strokeDasharray="3 5" opacity={0} />
        <path data-route d={paths.route} stroke={ROUTE} strokeWidth={1.5} opacity={0} />
        <circle data-relay-ring cx={R.x} cy={R.y} r={5} stroke={ROUTE} strokeWidth={1} opacity={0} />
        <circle data-relay-lit cx={R.x} cy={R.y} r={5} fill={ROUTE} opacity={0} />
      </g>

      {/* Pay: the blocks in the middle of the eye */}
      <g data-from="4">
        <path data-pay d={paths.pay} stroke="rgba(92, 201, 109, 0.8)" strokeWidth={1.3} opacity={0} />
        {Array.from({ length: TILES }, (_, i) => {
          const pending = i === TILES - 1;
          return (
            <rect key={i} data-tile={pending ? 'next' : undefined} x={TX(i) - tile.w / 2} y={TY} width={tile.w} height={tile.h} rx={2} fill="var(--ix-bg)" stroke="var(--ix-grey-700)" strokeDasharray={pending ? '2 3' : undefined} />
          );
        })}
        <rect data-settle x={next - tile.w / 2} y={TY} width={tile.w} height={tile.h} rx={2} fill="var(--ix-live)" fillOpacity={0.16} stroke="var(--ix-live)" opacity={0} />
        <text data-settle x={next} y={TY + 11} textAnchor="middle" fontSize="8" fill="var(--ix-live)" opacity={0} className={s.num}>
          {h != null ? fmt(h + 1).slice(-3) : ''}
        </text>
        <Badge attr="signed" x={C.x} y={TY - 18} w={96} text="signed by A" />
      </g>

      <Badge attr="pq" x={W / 2} y={C.y - 112} w={104} text="post-quantum" lock />

      <Card side="a" x={A.x} y={A.y} w={card.w} h={card.h} glyph={uc.glyph[0]} name={uc.names[0]} addr={addrs[0]} />
      <Card side="b" x={B.x} y={B.y} w={card.w} h={card.h} glyph={uc.glyph[1]} name={uc.names[1]} addr={addrs[1]} />
      <path data-direct-back d={paths.directBack} opacity={0} />
      <path data-back d={paths.back} opacity={0} />
      <path data-ar d={paths.ar} opacity={0} />
      <Tokens />
    </svg>
  );
});
