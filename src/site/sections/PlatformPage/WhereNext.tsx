import Link from 'next/link';
import { next, nextV2 as c } from '@site/content/platform';
import s from './Round4.module.css';

function Glyph({ id }: { id: string }) {
  if (id === 'build')
    return (
      <svg viewBox="0 0 48 48" aria-hidden>
        <path d="M14 18 L6 24 L14 30 M34 18 L42 24 L34 30 M27 12 L21 36" />
      </svg>
    );
  if (id === 'node')
    return (
      <svg viewBox="0 0 48 48" aria-hidden>
        <circle cx="24" cy="24" r="4" />
        <circle cx="10" cy="12" r="2.5" />
        <circle cx="38" cy="12" r="2.5" />
        <circle cx="10" cy="36" r="2.5" />
        <circle cx="38" cy="36" r="2.5" />
        <path d="M12 13.5 L21 21 M36 13.5 L27 21 M12 34.5 L21 27 M36 34.5 L27 27" />
      </svg>
    );
  return (
    <svg viewBox="0 0 48 48" aria-hidden>
      <path d="M12 8 H30 L38 16 V40 H12 Z M30 8 V16 H38 M18 24 H32 M18 30 H32 M18 36 H26" />
    </svg>
  );
}

type Item = { label: string; href: string; body: string; tone: string; glyph: string };

export default function WhereNext({ items = c.items as Item[], title = next.title }: { items?: Item[]; title?: string }) {
  return (
    <section id="next" className={s.next} aria-labelledby="next-title">
      <h2 id="next-title" className={s.nextTitle}>
        {title}
      </h2>
      <ul className={s.nextList}>
        {items.map((it) => {
          const ext = /^https?:/.test(it.href);
          const inner = (
            <>
              <span className={s.nextGlyph}>
                <Glyph id={it.glyph} />
              </span>
              <b>{it.label}</b>
              <span className={s.nextBody}>{it.body}</span>
              <span className={s.nextArrow} aria-hidden>
                {ext ? '↗' : '→'}
              </span>
            </>
          );
          return (
            <li key={it.label} data-tone={it.tone}>
              {ext ? (
                <a href={it.href} target="_blank" rel="noreferrer" className={s.nextRow}>
                  {inner}
                </a>
              ) : (
                <Link href={it.href} className={s.nextRow}>
                  {inner}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
