import { guides, guidesV2 } from '@site/content/developers';
import { Fingerprint } from '@site/components/flat/Flat';
import s from './Dev2.module.css';

const Key = ({ x, y, seed }: { x: number; y: number; seed: number }) => (
  <>
    <rect x={x} y={y} width={18} height={18} rx={4} data-chip />
    <Fingerprint x={x + 3} y={y + 3} seed={seed} n={3} cell={3.4} gap={0.9} pad={0} bare dim />
  </>
);

function Glyph({ id }: { id: string }) {
  switch (id) {
    case 'p2p': // two browsers talking directly; the server between them isn't there
      return (
        <svg viewBox="0 0 132 60" aria-hidden>
          <path d="M40 34 H92" data-wire />
          <rect x={56} y={4} width={20} height={14} rx={3} data-ghost />
          <path d="M52 20 L80 2" data-strike />
          <rect x={61} y={31} width={10} height={6} rx={2} data-packet />
          {[2, 92].map((x, i) => (
            <g key={x}>
              <rect x={x - 3} y={15} width={44} height={38} rx={9} data-tray />
              <rect x={x} y={18} width={38} height={32} rx={6} data-card />
              <path d={`M${x} 26 H${x + 38}`} data-wire />
              <circle cx={x + 5} cy={22} r={1.2} data-dot />
              <circle cx={x + 9} cy={22} r={1.2} data-dot />
              <rect x={x + 6} y={32} width={18} height={3} rx={1.5} data-bar />
              <rect x={x + 6} y={39} width={i ? 24 : 12} height={3} rx={1.5} data-bar data-hi={i === 1 || undefined} />
            </g>
          ))}
        </svg>
      );
    case 'ai': // a local model with its own key, wired to a chat
      return (
        <svg viewBox="0 0 132 60" aria-hidden>
          <rect x={1} y={9} width={48} height={42} rx={10} data-tray />
          <rect x={4} y={12} width={42} height={36} rx={7} data-card />
          <path d="M14 22 l4 -4 h14 l4 4 v14 l-4 4 h-14 l-4 -4 z" data-wire />
          <Key x={16} y={21} seed={7} />
          <path d="M46 30 H76" data-wire />
          <rect x={56} y={27} width={10} height={6} rx={2} data-packet />
          <rect x={76} y={8} width={52} height={18} rx={9} data-card />
          <rect x={84} y={15} width={30} height={3} rx={1.5} data-bar />
          <rect x={86} y={32} width={42} height={18} rx={9} data-card />
          <rect x={94} y={39} width={22} height={3} rx={1.5} data-bar data-hi />
        </svg>
      );
    case 'iot': // a board with its own key, and the light it switches
      return (
        <svg viewBox="0 0 132 60" aria-hidden>
          <rect x={1} y={9} width={70} height={44} rx={10} data-tray />
          <rect x={4} y={12} width={64} height={38} rx={7} data-card />
          {[12, 20, 28, 36, 44, 52, 60].map((x) => (
            <rect key={x} x={x - 1.5} y={6} width={3} height={6} rx={1} data-bar />
          ))}
          <Key x={12} y={22} seed={17} />
          <rect x={38} y={24} width={22} height={3} rx={1.5} data-bar />
          <rect x={38} y={31} width={14} height={3} rx={1.5} data-bar />
          <path d="M68 31 H100" data-dash />
          <circle cx={112} cy={31} r={11} data-card />
          <circle cx={112} cy={31} r={4.5} data-light />
        </svg>
      );
    case 'pq': // two keys, one sealed line between them, two layers
      return (
        <svg viewBox="0 0 132 60" aria-hidden>
          <path d="M26 24 H106 M26 36 H106" data-wire />
          <rect x={56} y={20} width={20} height={20} rx={5} data-card />
          <path d="M61.5 30h9v6h-9zM63.5 30v-2.4a2.5 2.5 0 0 1 5 0V30" data-lock />
          {[34, 42, 88, 96].map((x) => (
            <rect key={x} x={x} y={22.5} width={3} height={3} rx={0.8} data-bit />
          ))}
          {[38, 46, 84, 92].map((x) => (
            <rect key={x} x={x} y={34.5} width={3} height={3} rx={0.8} data-bit />
          ))}
          <Key x={4} y={21} seed={5} />
          <Key x={110} y={21} seed={17} />
        </svg>
      );
    default: // docker: one machine, three nodes on it
      return (
        <svg viewBox="0 0 132 60" aria-hidden>
          <rect x={2} y={6} width={128} height={50} rx={12} data-tray />
          <path d="M34 31 H50 M78 31 H94" data-wire />
          {[8, 50, 92].map((x, i) => (
            <g key={x}>
              <rect x={x} y={16} width={30} height={30} rx={6} data-card />
              {i === 1 ? <rect x={x + 10} y={26} width={10} height={10} rx={2.5} data-relay /> : <circle cx={x + 15} cy={31} r={3.4} data-hi-dot />}
            </g>
          ))}
        </svg>
      );
  }
}

export default function GuideRows() {
  return (
    <ul className={s.guides}>
      {guides.items.map((g, i) => (
        <li key={g.href}>
          <a href={g.href} target="_blank" rel="noreferrer">
            <span className={s.guideGlyph}>
              <Glyph id={guidesV2.glyphs[i]} />
            </span>
            <b>{g.name}</b>
            <span className={s.guideBody}>{g.body}</span>
            <span className={s.guideGo} aria-hidden>
              ↗
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}
