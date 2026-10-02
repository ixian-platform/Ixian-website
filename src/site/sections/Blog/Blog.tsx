'use client';

import Link from 'next/link';
import { Fragment, useEffect, useRef, useState, type ReactNode } from 'react';
import Icon from '@site/components/Icon';
import { blog, fmtDate, postsByDate, type Block, type Post } from '@site/content/blog';
import Phones from '@site/sections/Spixi/Phones';
import { useConsent, writeConsent } from '@site/lib/consent';
import s from './Blog.module.css';

const isExternal = (href: string) => /^https?:/.test(href);

function Band({ tone, children, narrow }: { tone: React.CSSProperties; children: ReactNode; narrow?: boolean }) {
  return (
    <div className={s.band} style={tone} data-narrow={narrow || undefined}>
      <div className={s.bandInner}>{children}</div>
    </div>
  );
}

/** **bold** and [links](url), nothing else */
function Inline({ text }: { text: string }) {
  const out: ReactNode[] = [];
  const re = /\*\*(.+?)\*\*|\[(.+?)\]\((.+?)\)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let k = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index));
    if (m[1]) out.push(<strong key={k++}>{m[1]}</strong>);
    else if (m[2] && m[3])
      out.push(
        isExternal(m[3]) ? (
          <a key={k++} href={m[3]} target="_blank" rel="noreferrer">
            {m[2]}
          </a>
        ) : (
          <Link key={k++} href={m[3]}>
            {m[2]}
          </Link>
        )
      );
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return <>{out}</>;
}

/* crops 1% off the top (a line baked into some Medium originals) without changing the box;
   `scale` composes with the hover transforms */
const TRIM: React.CSSProperties = { scale: '1.01', transformOrigin: '50% 100%', clipPath: 'inset(1% 0.5% 0 0.5%)' };

// covers also exist as NAME-800.webp and NAME-1600.webp
const coverSet = (src: string) => {
  const m = /^(\/site\/blog\/covers\/[a-z0-9-]+)\.jpg$/.exec(src);
  return m ? `${m[1]}-800.webp 800w, ${m[1]}-1600.webp 1600w` : undefined;
};
export const SIZES = {
  cover: '(max-width: 1100px) 100vw, 1100px',
  feature: '(max-width: 860px) 100vw, 700px',
  card: '(max-width: 640px) 100vw, (max-width: 1100px) 50vw, 400px',
} as const;

/** A post image. Falls back to the Medium original only with consent (lib/consent.ts). */
export function Img({ src, remote, alt, w, h, className, eager, inLink, trim, sizes }: { src: string; remote?: string; alt: string; w?: number; h?: number; className?: string; eager?: boolean; inLink?: boolean; trim?: boolean; sizes?: string }) {
  const ref = useRef<HTMLImageElement>(null);
  const consent = useConsent();
  const [missing, setMissing] = useState(false);
  const [once, setOnce] = useState(false);
  const useRemote = missing && !!remote && (once || !!consent?.external);
  useEffect(() => {
    // a failed load can happen before hydration
    const im = ref.current;
    if (im && im.complete && im.naturalWidth === 0) setMissing(true);
  }, []);
  if (missing && remote && !useRemote) {
    return (
      <span className={`${className ?? ''} ${s.imgGate}`} style={{ aspectRatio: w && h ? `${w} / ${h}` : undefined }}>
        <span className={s.imgGateText}>
          Image hosted on Medium{alt && <span className="ix-sr">: {alt}</span>}
        </span>
        {!inLink && (
        <span className={s.imgGateActions}>
          <button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); setOnce(true); }}>
            Load it
          </button>
          <button type="button" data-quiet onClick={(e) => { e.preventDefault(); e.stopPropagation(); writeConsent({ external: true }); }}>
            Always allow
          </button>
        </span>
        )}
      </span>
    );
  }
  const srcSet = useRemote ? undefined : coverSet(src);
  // eslint-disable-next-line @next/next/no-img-element
  return <img ref={ref} className={className} src={useRemote ? remote : src} srcSet={srcSet} sizes={srcSet ? (sizes ?? SIZES.cover) : undefined} alt={alt} width={w} height={h} loading={eager ? 'eager' : 'lazy'} fetchPriority={eager ? 'high' : undefined} decoding="async" style={trim ? TRIM : undefined} onError={() => !useRemote && setMissing(true)} />;
}

function Blocks({ body }: { body: Block[] }) {
  return (
    <>
      {body.map((b, i) => {
        switch (b.t) {
          case 'p':
            return (
              <p key={i} className={s.p}>
                <Inline text={b.text} />
              </p>
            );
          case 'h2':
            return (
              <h2 key={i} className={s.h2}>
                {b.text}
              </h2>
            );
          case 'h3':
            return (
              <h3 key={i} className={s.h3}>
                {b.text}
              </h3>
            );
          case 'ul':
          case 'ol': {
            const L = b.t;
            return (
              <L key={i} className={s.list}>
                {b.items.map((it, j) => (
                  <li key={j}>
                    <Inline text={it} />
                  </li>
                ))}
              </L>
            );
          }
          case 'quote':
            return (
              <blockquote key={i} className={s.quote}>
                <Inline text={b.text} />
              </blockquote>
            );
          case 'pull':
            return (
              <blockquote key={i} className={s.pull}>
                {b.text}
              </blockquote>
            );
          case 'tldr':
            return (
              <aside key={i} className={s.tldr}>
                {b.title && <p className={s.tldrTitle}>{b.title}</p>}
                <p>
                  <Inline text={b.text} />
                </p>
              </aside>
            );
          case 'img':
            return (
              <figure key={i} className={s.figure} data-wide={b.wide || undefined}>
                <Img src={b.src} remote={b.remote} alt={b.alt} w={b.w} h={b.h} />
                {b.caption && <figcaption>{b.caption}</figcaption>}
              </figure>
            );
          case 'gallery':
            return (
              <figure key={i} className={s.figure} data-wide="">
                <div className={s.gallery} style={{ '--n': b.images.length } as React.CSSProperties}>
                  {b.images.map((im) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img key={im.src} src={im.src} alt={im.alt} width={im.w} height={im.h} loading="lazy" decoding="async" />
                  ))}
                </div>
                {b.caption && <figcaption>{b.caption}</figcaption>}
              </figure>
            );
          case 'phones':
            return <PhonesFigure key={i} images={b.images} caption={b.caption} />;
          case 'code':
            return (
              <pre key={i} className={s.code} data-lang={b.lang}>
                <code>{b.code}</code>
              </pre>
            );
          case 'hr':
            return (
              <hr key={i} className={s.hr} />
            );
          default:
            return <Fragment key={i} />;
        }
      })}
    </>
  );
}

function PhonesFigure({ images, caption }: { images: { src: string; alt: string; label: string }[]; caption?: string }) {
  const [on, setOn] = useState(0);
  return (
    <figure className={s.figure} data-wide="">
      <div className={s.phones}>
        <Phones shots={images} active={on} onPick={setOn} idPrefix="post-phones" />
      </div>
      <div className={s.phoneTabs}>
        {images.map((im, i) => (
          <button key={im.src} type="button" aria-pressed={i === on} onClick={() => setOn(i)}>
            {im.label}
          </button>
        ))}
      </div>
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  );
}

function Share({ post }: { post: Post }) {
  const [done, setDone] = useState(false);
  const [url, setUrl] = useState('');
  useEffect(() => setUrl(window.location.href), []);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url || window.location.href);
      setDone(true);
      window.setTimeout(() => setDone(false), 1800);
    } catch {
      /* no clipboard: nothing to do */
    }
  };
  const t = encodeURIComponent(post.title);
  const u = encodeURIComponent(url);
  return (
    <div className={s.share} aria-label={blog.share}>
      <a href={`https://x.com/intent/post?text=${t}&url=${u}`} target="_blank" rel="noreferrer" aria-label="Share on X" title="Share on X">
        <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden>
          <path fill="currentColor" d="M17.8 3h3.1l-6.8 7.8L22 21h-6.2l-4.9-6.4L5.3 21H2.2l7.3-8.3L2 3h6.4l4.4 5.8L17.8 3zm-1.1 16.2h1.7L7.4 4.7H5.6l11.1 14.5z" />
        </svg>
      </a>
      <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${u}`} target="_blank" rel="noreferrer" aria-label="Share on LinkedIn" title="Share on LinkedIn">
        <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden>
          <path fill="currentColor" d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9.5h4V21H3zM9.5 9.5h3.8v1.6h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.78 2.65 4.78 6.1V21h-4v-5.1c0-1.22-.02-2.79-1.7-2.79-1.7 0-1.96 1.33-1.96 2.7V21h-4z" />
        </svg>
      </a>
      <button type="button" onClick={copy} aria-label={blog.copy} title={blog.copy}>
        <Icon name={done ? 'check' : 'copy'} size={16} />
        <span className={s.shareMsg} data-on={done || undefined} aria-live="polite">
          {done ? blog.copied : ''}
        </span>
      </button>
    </div>
  );
}

function Byline({ post, withShare }: { post: Post; withShare?: boolean }) {
  return (
    <div className={s.byline}>
      <span className={s.avatar} aria-hidden>
        <svg viewBox="0 0 24 24" width="20" height="20">
          <path d="M12 3l7.8 4.5v9L12 21l-7.8-4.5v-9z" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        </svg>
      </span>
      <span className={s.bylineText}>
        <b>{post.author}</b>
        <span>
          <time dateTime={post.date}>{fmtDate(post.date)}</time> · {post.readMin} min read
        </span>
      </span>
      {withShare && <Share post={post} />}
    </div>
  );
}

function Progress({ target }: { target: React.RefObject<HTMLElement | null> }) {
  const bar = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let raf = 0;
    const on = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const el = target.current;
        if (!el || !bar.current) return;
        const r = el.getBoundingClientRect();
        const p = Math.min(1, Math.max(0, -r.top / Math.max(1, r.height - window.innerHeight)));
        bar.current.style.transform = `scaleX(${Math.round(p * 1000) / 1000})`;
      });
    };
    on();
    window.addEventListener('scroll', on, { passive: true });
    window.addEventListener('resize', on);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', on);
      window.removeEventListener('resize', on);
    };
  }, [target]);
  return <div ref={bar} className={s.progress} aria-hidden />;
}

export function Card({ post }: { post: Post }) {
  return (
    <Link href={`/blog/${post.slug}`} className={s.card}>
      {post.cover && (
        <Img inLink className={s.cardImg} src={post.cover.src} remote={post.cover.remote} alt="" w={post.cover.w} h={post.cover.h} trim={post.cover.trim} sizes={SIZES.card} />
      )}
      <span className={s.cardMeta}>
        <span>{post.kind}</span>
        <time dateTime={post.date}>{fmtDate(post.date)}</time>
      </span>
      <b className={s.cardTitle}>{post.title}</b>
      <span className={s.cardText}>{post.summary ?? post.subtitle}</span>
      <span className={s.cardMore}>
        {post.readMin} min read
        <Icon name="arrow" size={14} />
      </span>
    </Link>
  );
}

export function Article({ post }: { post: Post }) {
  const art = useRef<HTMLElement>(null);
  const more = postsByDate()
    .filter((p) => p.slug !== post.slug)
    .slice(0, 2);
  return (
    <>
      <Progress target={art} />
      <div className={s.articleTop}>
        <header className={s.head}>
          <Link href="/blog" className={s.crumb}>
            <Icon name="back" size={14} />
            {blog.back}
          </Link>
          <p className={s.kicker}>
            {post.kind}
            {post.tags.slice(0, 1).map((t) => (
              <span key={t}> · {t}</span>
            ))}
          </p>
          <h1 className={s.title}>{post.title}</h1>
          <p className={s.subtitle}>{post.subtitle}</p>
        </header>
      </div>
      <article ref={art} className={s.article}>
        <Byline post={post} withShare />

        {post.cover && (
          <figure className={s.cover}>
            <Img src={post.cover.src} remote={post.cover.remote} alt={post.cover.alt} w={post.cover.w} h={post.cover.h} trim={post.cover.trim} eager />
          </figure>
        )}

        <div className={s.body}>
          {post.archived && <p className={s.archived}>{blog.archived(post.date.slice(0, 4))}</p>}
          <Blocks body={post.body} />
        </div>

        <footer className={s.end}>
          <ul className={s.tags} aria-label="Tags">
            {post.tags.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
          {post.originally && (
            <p className={s.originally}>
              First published on{' '}
              <a href={post.originally.href} target="_blank" rel="noreferrer">
                {post.originally.label}
              </a>
              , {fmtDate(post.date)}.{post.updated ? ` Updated ${fmtDate(post.updated)}.` : ''}
            </p>
          )}
          <Byline post={post} withShare />
        </footer>
      </article>

      {post.cta && (
        <section className={s.cta} aria-label={post.cta.title}>
          <div className={s.ctaInner}>
            <div>
              <h2>{post.cta.title}</h2>
              <p>{post.cta.body}</p>
            </div>
            <div className={s.ctaActions}>
              <Link className={s.btnPrimary} href={post.cta.primary.href}>
                {post.cta.primary.label}
                <Icon name="arrow" size={15} data-dir="right" />
              </Link>
              {post.cta.secondary && (
                <a className={s.btnSecondary} data-outline="" href={post.cta.secondary.href} target={isExternal(post.cta.secondary.href) ? '_blank' : undefined} rel="noreferrer">
                  {post.cta.secondary.label}
                  <Icon name="external" size={15} />
                </a>
              )}
            </div>
          </div>
        </section>
      )}

      {more.length > 0 && (
        <section className={s.more}>
          <div className={s.moreInner}>
            <h2>{blog.more}</h2>
            <div className={s.grid}>
              {more.map((p) => (
                <Card key={p.slug} post={p} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}

export function BlogIndex() {
  const posts = postsByDate();
  const [first, ...rest] = posts;
  const kinds = ['All', ...Array.from(new Set(rest.map((p) => p.kind)))] as const;
  const [kind, setKind] = useState<string>('All');
  const shown = kind === 'All' ? rest : rest.filter((p) => p.kind === kind);
  return (
    <>
    <Band tone={{ '--c1': '111, 140, 255', '--c2': '227, 166, 79' } as React.CSSProperties} narrow>
      <header className={s.indexHead}>
        <h1>{blog.title}</h1>
        <p>{blog.lead}</p>
      </header>
    </Band>
    <div className={s.index}>
      {first && (
        <Link href={`/blog/${first.slug}`} className={s.feature}>
          {first.cover && (
            <Img inLink className={s.featureImg} src={first.cover.src} remote={first.cover.remote} alt="" w={first.cover.w} h={first.cover.h} trim={first.cover.trim} sizes={SIZES.feature} eager />
          )}
          <span className={s.featureText2}>
          <span className={s.cardMeta}>
            <span>{first.kind}</span>
            <time dateTime={first.date}>{fmtDate(first.date)}</time>
          </span>
          <b className={s.featureTitle}>{first.title}</b>
          <span className={s.featureText}>{first.summary ?? first.subtitle}</span>
          <span className={s.cardMore}>
            {first.readMin} min read
            <Icon name="arrow" size={14} />
          </span>
          </span>
        </Link>
      )}
      <div className={s.filters} role="tablist" aria-label="Filter posts">
        {kinds.map((k) => (
          <button key={k} type="button" role="tab" aria-selected={k === kind} onClick={() => setKind(k)}>
            {k === 'All' ? blog.all : k === 'Case study' ? 'Case studies' : k === 'News' || k === 'Research' ? k : `${k}s`}
          </button>
        ))}
      </div>
      <ol className={s.rows}>
        {shown.map((p) => (
          <li key={p.slug}>
            <Link href={`/blog/${p.slug}`} className={s.row}>
              <span className={s.rowText}>
                <span className={s.cardMeta}>
                  <span>{p.kind}</span>
                  <time dateTime={p.date}>{fmtDate(p.date)}</time>
                  <span>{p.readMin} min read</span>
                </span>
                <b className={s.rowTitle}>{p.title}</b>
                <span className={s.rowSummary}>{p.summary ?? p.subtitle}</span>
              </span>
              {p.cover && (
                <Img inLink className={s.rowImg} src={p.cover.src} remote={p.cover.remote} alt="" w={p.cover.w} h={p.cover.h} trim={p.cover.trim} sizes={SIZES.card} />
              )}
            </Link>
          </li>
        ))}
      </ol>
    </div>
    </>
  );
}
