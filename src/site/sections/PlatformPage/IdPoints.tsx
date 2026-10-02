import { identityV2 } from '@site/content/platform';
import s from './Round4.module.css';


function Glyph({ id }: { id: string }) {
  if (id === 'derived')
    // the sign-up form you never fill in (dashed, struck through), then just a key and its address
    return (
      <svg viewBox="0 0 240 54" aria-hidden>
        <rect x="2" y="3" width="84" height="48" rx="3" className={s.idForm} />
        <rect x="10" y="11" width="68" height="9" rx="1.5" className={s.idForm} />
        <rect x="10" y="24" width="68" height="9" rx="1.5" className={s.idForm} />
        <rect x="10" y="38" width="30" height="7" rx="1.5" className={s.idForm} />
        <path d="M0 52 L88 2" className={s.idStrike} />
        <rect x="124" y="21" width="12" height="12" className={s.manyKey} />
        <path d="M136 27 H150" className={s.manyLine} />
        <rect x="154" y="25.5" width="82" height="3" className={s.manyAddr} />
      </svg>
    );
  if (id === 'proof')
    // a key signs a message; on the other side the signature's key and the known address line up, so it is accepted
    return (
      <svg viewBox="0 0 240 54" aria-hidden>
        <rect x="2" y="21" width="12" height="12" className={s.manyKey} />
        <path d="M14 27 H44" className={s.manyLine} />
        <rect x="44" y="9" width="64" height="36" className={s.idMsg} />
        <rect x="52" y="16" width="40" height="3" className={s.manyAddr} />
        <rect x="52" y="23" width="28" height="3" className={s.manyAddr} />
        <path d="M52 37 c3 -5 6 5 9 0 s6 -5 9 0 s6 5 9 0" className={s.idSig} />
        <path d="M108 27 H146" className={s.manyLine} />
        <rect x="150" y="20" width="62" height="3" className={s.manyAddr} />
        <rect x="150" y="31" width="62" height="3" className={s.idPillText} />
        <path d="M216 19 H222 V35 H216" className={s.manyLine} />
        <rect x="228" y="22" width="10" height="10" className={s.idPillText} />
      </svg>
    );
  if (id === 'names')
    // a long address (48 bytes of ticks) gathered under a bracket into one short readable name
    return (
      <svg viewBox="0 0 240 54" aria-hidden>
        {Array.from({ length: 48 }, (_, i) => (
          <rect key={i} x={2 + i * 4.9} y={4 + ((i * 7) % 5)} width="2.2" height={8 - ((i * 7) % 5)} className={s.manyAddr} />
        ))}
        <path d="M2 17 V20 H236 V17 M119 20 V30" className={s.manyLine} />
        <rect x="84" y="32" width="70" height="18" rx="9" className={s.manyKey} />
        <rect x="98" y="39.5" width="42" height="3" className={s.idPillText} />
      </svg>
    );
  return (
    <svg viewBox="0 0 240 54" aria-hidden>
      <rect x="2" y="21" width="12" height="12" className={s.manyKey} />
      {Array.from({ length: 9 }, (_, i) => (
        <g key={i}>
          <path d={`M14 27 C 60 27, 80 ${6 + i * 5.25}, 120 ${6 + i * 5.25}`} className={s.manyLine} />
          <rect x={124} y={4 + i * 5.25} width={40 + ((i * 37) % 90)} height="3" className={s.manyAddr} />
        </g>
      ))}
    </svg>
  );
}

export default function IdPoints() {
  return (
    <ul className={s.idPoints}>
      {identityV2.points.map((pt) => (
        <li key={pt.id}>
          <Glyph id={pt.id} />
          <b>
            {pt.title}
            {'status' in pt && typeof pt.status === 'string' && <span className={s.idStatus}>{pt.status}</span>}
          </b>
          <p>{pt.body}</p>
          <a href={pt.href} target="_blank" rel="noreferrer">
            Docs ↗
          </a>
        </li>
      ))}
    </ul>
  );
}
