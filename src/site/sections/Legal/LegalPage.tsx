import Link from 'next/link';
import type { Inline, LegalDoc } from '@site/content/legal/types';
import { links } from '@site/content/links';
import Toc from './Toc';
import s from './Legal.module.css';

/** Legal pages (privacy, terms, cookies), rendered from content/legal/*.ts. */

const id = (n: number | undefined, i: number) => `section-${n ?? i + 1}`;

function Text({ parts }: { parts: Inline[] }) {
  return (
    <>
      {parts.map((p, i) =>
        typeof p === 'string' ? (
          <span key={i}>{p}</span>
        ) : 'b' in p ? (
          <strong key={i}>{p.b}</strong>
        ) : (
          p.href.startsWith('/') ? (
            <Link key={i} href={p.href}>
              {p.a}
            </Link>
          ) : (
            <a key={i} href={p.href} target="_blank" rel="noreferrer">
              {p.a}
            </a>
          )
        )
      )}
    </>
  );
}

const OTHERS = [
  { label: 'Privacy policy', href: links.privacy },
  { label: 'Terms of use', href: links.terms },
  { label: 'Cookie policy', href: links.cookies },
];

export default function LegalPage({ doc, path }: { doc: LegalDoc; path: string }) {
  const toc = doc.sections.filter((x) => x.heading).map((x, i) => ({ id: id(x.n, i), label: x.heading as string, n: x.n ?? i + 1 }));
  return (
    <div className={s.legal}>
      <div className={s.wrap}>
        <header id="top" className={s.head}>
          <nav aria-label="Legal" className={s.others}>
            {OTHERS.map((o) => (
              <Link key={o.href} href={o.href} aria-current={o.href === path ? 'page' : undefined}>
                {o.label}
              </Link>
            ))}
          </nav>
          <h1 className={s.title}>{doc.title}</h1>
          <p className={s.updated}>{doc.updated}</p>
        </header>

        <div className={s.body}>
          <aside className={s.aside}>
            <Toc items={toc} />
          </aside>
          <article className={s.article}>
            {doc.sections.map((sec, i) => (
              <section key={i} id={sec.heading ? id(sec.n, i) : undefined} className={s.section}>
                {sec.heading && (
                  <h2>
                    <span className={s.num}>{sec.n ?? i + 1}.</span> {sec.heading}
                  </h2>
                )}
                {sec.blocks.map((b, j) =>
                  'p' in b ? (
                    <p key={j}>
                      <Text parts={b.p} />
                    </p>
                  ) : 'ul' in b ? (
                    <ul key={j}>
                      {b.ul.map((li, k) => (
                        <li key={k}>
                          <Text parts={li} />
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <ol key={j}>
                      {b.ol.map((li, k) => (
                        <li key={k}>
                          <Text parts={li} />
                        </li>
                      ))}
                    </ol>
                  )
                )}
              </section>
            ))}
          </article>
        </div>
      </div>
    </div>
  );
}
