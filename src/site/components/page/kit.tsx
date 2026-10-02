/** Shared inner-page building blocks. Server-safe (no hooks); interactive pieces live in client files. */
import Link from 'next/link';
import type { ReactNode } from 'react';
import Icon from '@site/components/Icon';
import SectionBoundary from '@site/components/SectionBoundary';
import s from './page.module.css';

export type Href = { label: string; href: string };
const isExternal = (href: string) => /^https?:/.test(href);

/** Page header: two-tone H1 (statement, then a grey continuation), lead,
    actions, an optional static aside and an on-this-page index. */
export function PageHero({
  title,
  lead,
  actions,
  aside,
  index,
  wide,
}: {
  wide?: boolean;
  title: [string, string?];
  lead: ReactNode;
  actions?: (Href & { kind?: 'primary' | 'secondary' })[];
  aside?: ReactNode;
  index?: { id: string; label: string }[];
}) {
  return (
    <header id="top" className={s.hero}>
      <div className={s.wrap}>
        <div className={s.heroGrid} data-solo={aside ? undefined : ''} data-wide={wide || undefined}>
          <div>
            <h1 className={s.h1}>
              {title[0]}
              {title[1] && <span>{title[1]}</span>}
            </h1>
            <p className={s.heroLead}>{lead}</p>
            {actions && actions.length > 0 && (
              <div className={s.actions}>
                {actions.map((a) => (
                  <Btn key={a.label} {...a} />
                ))}
              </div>
            )}
          </div>
          {aside && <div className={s.aside}>{aside}</div>}
        </div>
        {index && (
          <nav aria-label="On this page">
            <ol className={s.index}>
              {index.map((i, n) => (
                <li key={i.id}>
                  <a href={`#${i.id}`}>
                    <small>{String(n + 1).padStart(2, '0')}</small>
                    {i.label}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        )}
      </div>
    </header>
  );
}

/** The numbered on-this-page index on its own (for pages with a custom hero). */
export function PageIndex({ index }: { index: { id: string; label: string }[] }) {
  return (
    <nav aria-label="On this page">
      <ol className={s.index} style={{ marginTop: 0 }}>
        {index.map((i, n) => (
          <li key={i.id}>
            <a href={`#${i.id}`}>
              <small>{String(n + 1).padStart(2, '0')}</small>
              {i.label}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

/** A page section: hairline boundary, the 4/8 intro, then content. */
export function Section({
  id,
  title,
  lead,
  children,
  tone = 'plain',
  labelledBy,
  split,
}: {
  id: string;
  title?: ReactNode;
  lead?: ReactNode | ReactNode[];
  children?: ReactNode;
  tone?: 'plain' | 'stage';
  labelledBy?: string;
  /** '4-8': the intro takes the same 4:8 columns as a two-column body below it, so title and lead line up with it */
  split?: '4-8';
}) {
  const leads = Array.isArray(lead) ? lead : lead ? [lead] : [];
  const tid = `${id}-title`;
  return (
    <section id={id} className={s.section} data-tone={tone} aria-labelledby={title ? tid : labelledBy}>
      <SectionBoundary />
      <div className={s.wrap}>
        {title && (
          <div className={s.intro} data-split={split}>
            <h2 id={tid} className={s.title} data-reveal data-reveal-delay="0.24">
              {title}
            </h2>
            {leads.length > 0 && (
              <div data-reveal>
                {leads.map((l, i) => (
                  <p key={i} className={s.lead}>
                    {l}
                  </p>
                ))}
              </div>
            )}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}

/** Button: green primary (the main action on a view) or outlined secondary. */
export function Btn({ label, href, kind = 'primary' }: Href & { kind?: 'primary' | 'secondary' }) {
  const ext = isExternal(href);
  const icon = <Icon name={ext ? 'external' : 'arrow'} size={15} data-dir={ext ? 'out' : 'right'} />;
  return ext ? (
    <a className={s.btn} data-kind={kind} data-outline={kind === 'secondary' ? '' : undefined} href={href} target="_blank" rel="noreferrer">
      {label}
      {icon}
    </a>
  ) : (
    <Link className={s.btn} data-kind={kind} data-outline={kind === 'secondary' ? '' : undefined} href={href}>
      {label}
      {icon}
    </Link>
  );
}

/** Text link with the external arrow (docs, GitHub) or an inner arrow. */
export function TextLink({ label, href, small }: Href & { small?: boolean }) {
  const ext = isExternal(href);
  const inner = (
    <>
      {label}
      <Icon name={ext ? 'external' : 'arrow'} size={small ? 13 : 14} />
    </>
  );
  return ext ? (
    <a className={s.link} data-small={small || undefined} href={href} target="_blank" rel="noreferrer">
      {inner}
    </a>
  ) : (
    <Link className={s.link} data-small={small || undefined} href={href}>
      {inner}
    </Link>
  );
}

export function DocLinks({ links, small }: { links: Href[]; small?: boolean }) {
  return (
    <ul className={s.docs}>
      {links.map((l) => (
        <li key={l.href + l.label}>
          <TextLink {...l} small={small} />
        </li>
      ))}
    </ul>
  );
}
