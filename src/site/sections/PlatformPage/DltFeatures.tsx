import { dltFeatures as f } from '@site/content/platform';
import s from './S2.module.css';

/* Shares its feature styles with S2 (S2.module.css). Green because on the DLT green means confirmed. */

function Glyph({ id }: { id: string }) {
  if (id === 'sign')
    // many signatures converging on one block
    return (
      <svg viewBox="0 0 160 64" aria-hidden>
        {[8, 22, 36, 50].map((y, i) => (
          <g key={y}>
            <path d={`M${18 + i * 6} ${y} L86 32`} className={s.gConfirmThin} />
            <circle cx={18 + i * 6} cy={y} r="2.6" className={s.gSigner} />
          </g>
        ))}
        {[14, 44].map((y) => (
          <g key={y}>
            <path d={`M148 ${y} L98 32`} className={s.gConfirmThin} />
            <circle cx="148" cy={y} r="2.6" className={s.gSigner} />
          </g>
        ))}
        <rect x="86" y="26" width="12" height="12" className={s.gBlock} />
      </svg>
    );
  if (id === 'final')
    // one arc reaching back five blocks; the block it reaches is final
    return (
      <svg viewBox="0 0 160 64" aria-hidden>
        <path d="M4 46 H156" className={s.gLine} />
        {Array.from({ length: 7 }, (_, i) => (
          <rect key={i} x={14 + i * 22} y="41" width="10" height="10" className={i <= 1 ? s.gBlockFinal : s.gBlockOpen} />
        ))}
        <path d="M151 40 C151 8, 41 8, 41 40" className={s.gConfirm} />
      </svg>
    );
  // volume: a block filling with transactions
  return (
    <svg viewBox="0 0 160 64" aria-hidden>
      {[0, 1, 2].map((b) => (
        <g key={b}>
          <rect x={20 + b * 44} y="10" width="32" height="44" className={b === 2 ? s.gBlockOpen : s.gBlockFinal} />
          {Array.from({ length: b === 2 ? 5 : 9 }, (_, i) => (
            <path key={i} d={`M${25 + b * 44} ${48 - i * 4.4} h22`} className={s.gTx} />
          ))}
        </g>
      ))}
    </svg>
  );
}

export default function DltFeatures() {
  return (
    <section className={s.features} data-tight aria-label={f.label}>
      <p className={s.featLabel}>{f.label}</p>
      <ul className={s.featGrid}>
        {f.items.map((it) => (
          <li key={it.id}>
            <a href={it.href} target="_blank" rel="noreferrer" className={s.feat} data-tone="dlt">
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
