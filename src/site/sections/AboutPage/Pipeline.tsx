'use client';

import { useRef } from 'react';
import { useInView } from '@site/lib/motion';
import { decisions } from '@site/content/about';
import { Glyph, Ok, flat } from '@site/components/flat/Flat';
import s from './About2.module.css';

// A packet travels the wire once when in view, checking each station; reduced motion shows all checked.

const WHERE = ['IXIUP · community', 'GitHub · public repos', 'public testnet', 'versioned release'];
const GLYPHS = [
  'M7 3.5h7l4 4v13H7zM14 3.5v4h4M9.5 12h6M9.5 15.5h4',
  'M7 4.5v15M17 4.5v4a4 4 0 0 1-4 4H7M17 4.5h.01',
  'M9 3.5h6M10 3.5v6l-5 9a1.5 1.5 0 0 0 1.3 2h11.4a1.5 1.5 0 0 0 1.3-2l-5-9v-6M7.5 15h9',
  'M4.5 12.5l8-8h7v7l-8 8zM15.5 8.5h.01',
];

export default function Pipeline() {
  const root = useRef<HTMLDivElement>(null);
  const seen = useInView(root, { once: true, margin: '0px 0px -25% 0px' });
  return (
    <div ref={root} className={s.pipe} data-seen={seen || undefined}>
      <div className={s.pipeLine} aria-hidden>
        <i />
        <b />
      </div>
      <ol className={s.pipeSteps}>
        {decisions.steps.map((st, i) => (
          <li key={st.title} style={{ ['--i' as string]: i }}>
            <svg viewBox="0 0 212 64" className={`${flat.svg} ${s.pipeCard}`} fill="none" aria-hidden>
              <rect className={flat.tray} x={1} y={1} width={210} height={62} rx={10} />
              <rect className={i === 3 ? flat.cardKey : flat.card} x={6} y={6} width={200} height={52} rx={6} />
              <Glyph name={GLYPHS[i]} x={18} y={16} size={18} />
              <rect className={flat.bar} x={46} y={21} width={i === 3 ? 38 : 56} height={3.5} rx={1.75} />
              <text className={`${flat.mono} ${flat.dim}`} x={46} y={43} fontSize="9">
                {WHERE[i].toUpperCase()}
              </text>
              <g className={s.pipeOk}>
                <Ok x={188} y={20} />
              </g>
            </svg>
            <h3>{st.title}</h3>
            <p>{st.body}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
