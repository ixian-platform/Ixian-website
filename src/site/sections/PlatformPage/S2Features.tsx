import { s2Features as f } from '@site/content/platform';
import s from './S2.module.css';

function Glyph({ id }: { id: string }) {
  switch (id) {
    case 'find': // an address, hashed, lands in one cell of a long row of sectors
      return (
        <svg viewBox="0 0 160 64" aria-hidden>
          <rect x="4" y="26" width="30" height="12" rx="2" className={s.gLine} />
          <path d="M38 32 H58" className={s.gTraffic} />
          {Array.from({ length: 12 }, (_, i) => (
            <rect key={i} x={62 + i * 8} y="24" width="6" height="16" className={i === 7 ? s.gHit : s.gCell} />
          ))}
        </svg>
      );
    case 'seven': // one presence held by seven relays
      return (
        <svg viewBox="0 0 160 64" aria-hidden>
          {Array.from({ length: 7 }, (_, i) => {
            const a = (i / 7) * Math.PI * 2 - Math.PI / 2;
            const x = Math.round((80 + 42 * Math.cos(a)) * 100) / 100;
            const y = Math.round((32 + 24 * Math.sin(a)) * 100) / 100;
            return (
              <g key={i}>
                <path d={`M80 32 L${x} ${y}`} className={s.gTrafficThin} />
                <circle cx={x} cy={y} r="3.2" className={s.gRelay} />
              </g>
            );
          })}
          <rect x="75" y="27" width="10" height="10" className={s.gEnd} />
        </svg>
      );
    case 'direct': // two endpoints: a direct line, and a relayed path for the firewalled case
      return (
        <svg viewBox="0 0 160 64" aria-hidden>
          <path d="M26 44 H134" className={s.gTraffic} />
          <path d="M26 44 Q80 0 134 44" className={s.gDashed} />
          <circle cx="80" cy="22" r="3.2" className={s.gRelay} />
          <rect x="16" y="39" width="10" height="10" className={s.gEnd} />
          <rect x="134" y="39" width="10" height="10" className={s.gEnd} />
          <path d="M104 30 V58" className={s.gWall} />
        </svg>
      );
    case 'blind': // ciphertext passing through a relay it cannot read
      return (
        <svg viewBox="0 0 160 64" aria-hidden>
          <path d="M8 32 H152" className={s.gTrafficThin} />
          {[20, 44, 108, 132].map((x) => (
            <rect key={x} x={x} y="27" width="14" height="10" rx="1.5" className={s.gPacket} />
          ))}
          <circle cx="80" cy="32" r="11" className={s.gRelayBig} />
          <path d="M76 32 h8" className={s.gLine} />
        </svg>
      );
    case 'grow': // relays joining the sector tree
      return (
        <svg viewBox="0 0 160 64" aria-hidden>
          <path d="M80 10 V22 M80 22 H40 M80 22 H120 M40 22 V34 M120 22 V34 M40 34 H24 M40 34 H56 M120 34 H104 M120 34 H136" className={s.gLine} />
          {[24, 56, 104].map((x) => (
            <circle key={x} cx={x} cy="44" r="3.2" className={s.gRelay} />
          ))}
          <path d="M24 34 V40 M56 34 V40 M104 34 V40" className={s.gLine} />
          <path d="M136 34 V40" className={s.gTraffic} />
          <circle cx="136" cy="44" r="3.2" className={s.gRelayNew} />
          <path d="M136 52 v8 M132 56 h8" className={s.gTraffic} />
        </svg>
      );
    default: // paid: a transaction through a relay, a fee dropping off to it in IXI
      return (
        <svg viewBox="0 0 160 64" aria-hidden>
          <path d="M8 24 H152" className={s.gTrafficThin} />
          <circle cx="80" cy="24" r="4" className={s.gRelay} />
          <path d="M80 30 V48" className={s.gValue} />
          <circle cx="80" cy="52" r="3.4" className={s.gIxi} />
          <rect x="40" y="19" width="14" height="10" rx="1.5" className={s.gPacket} />
        </svg>
      );
  }
}

export default function S2Features() {
  return (
    <section className={s.features} aria-label={f.label}>
      <p className={s.featLabel}>{f.label}</p>
      <ul className={s.featGrid}>
        {f.items.map((it) => (
          <li key={it.id}>
            <a href={it.href} target="_blank" rel="noreferrer" className={s.feat}>
              <span className={s.glyph}>
                <Glyph id={it.id} />
              </span>
              <b>{it.title}</b>
              <span className={s.featBody}>{it.body}</span>
              <span className={s.featTag}>
                {it.tag} <em>Docs ↗</em>
              </span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
