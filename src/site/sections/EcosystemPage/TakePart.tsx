import { eco } from '@site/content/ecosystem';
import s from './Eco.module.css';

export default function TakePart() {
  const c = eco.part;
  return (
    <div className={s.part}>
      <ol className={s.ways}>
        {c.ways.map((w) => (
          <li key={w.n}>
            <a href={w.href} target="_blank" rel="noreferrer">
              <span className={s.wayNo}>{w.n}</span>
              <b>{w.name}</b>
              <span className={s.wayBody}>{w.body}</span>
              <span className={s.wayCta}>{w.cta} ↗</span>
            </a>
          </li>
        ))}
      </ol>
      <p className={s.talkLabel}>{c.talk}</p>
      <ul className={s.channels}>
        {c.channels.map((ch) => (
          <li key={ch.name}>
            <a href={ch.href} target="_blank" rel="noreferrer">
              {ch.name}
              <small>{ch.note}</small>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
