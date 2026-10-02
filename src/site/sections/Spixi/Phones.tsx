'use client';

import s from './phones.module.css';

/* Only transform and opacity animate, so it stays smooth; reduced motion swaps at once. */

export type PhoneShot = { src: string; alt: string; label: string };

export default function Phones({ shots, active, onPick, idPrefix }: { shots: PhoneShot[]; active: number; onPick: (i: number) => void; idPrefix: string }) {
  const n = shots.length;
  return (
    <div className={s.scene}>
      <div className={s.row}>
        {shots.map((p, i) => {
          // depth: 0 is the front, then the others in their order after it
          const depth = (i - active + n) % n;
          return (
            <button
              key={p.src}
              type="button"
              id={`${idPrefix}-panel-${i}`}
              className={s.phone}
              data-depth={depth}
              aria-pressed={depth === 0}
              aria-label={depth === 0 ? `${p.label}, in front` : `Bring ${p.label} to the front`}
              onClick={() => onPick(i)}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.src} alt={p.alt} width={419} height={930} loading="lazy" decoding="async" draggable={false} />
            </button>
          );
        })}
      </div>
    </div>
  );
}
