'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import Logo from './Logo';
import Icon from './Icon';
import { nav, type NavItem } from '@site/content/site';
import { gsap, prefersReducedMotion } from '@site/lib/motion';
import { useNetworkPulse, fmt } from '@site/lib/useNetworkPulse';
import s from './Nav.module.css';

type LenisLike = { stop: () => void; start: () => void };
const getLenis = () => (window as unknown as { __lenis?: LenisLike }).__lenis;

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  // Glass on scroll, hide on scroll-down, reveal on scroll-up
  useEffect(() => {
    let last = window.scrollY;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const y = window.scrollY;
        setScrolled(y > 16);
        if (Math.abs(y - last) > 6) {
          setHidden(y > last && y > 480);
          last = y;
        }
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  // the menu belongs to small screens: close it when the window grows past the breakpoint
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 960px)');
    const f = () => mq.matches && setOpen(false);
    mq.addEventListener('change', f);
    return () => mq.removeEventListener('change', f);
  }, []);

  // tell the page when the bar is away, so sticky bars under it can move up
  // into its place (the Quickstart setup bar)
  useEffect(() => {
    const away = hidden && !open;
    document.documentElement.toggleAttribute('data-nav-hidden', away);
    return () => document.documentElement.removeAttribute('data-nav-hidden');
  }, [hidden, open]);

  // Mobile menu: lock scroll, animate items, Escape to close
  useEffect(() => {
    const lenis = getLenis();
    if (open) {
      lenis?.stop();
      document.body.style.overflow = 'hidden';
      if (!prefersReducedMotion() && menuRef.current) {
        gsap.fromTo(
          menuRef.current.querySelectorAll('[data-menu-item]'),
          { y: 14, opacity: 0 },
          { y: 0, opacity: 1, stagger: 0.04, duration: 0.6, ease: 'expo.out', delay: 0.05, clearProps: 'transform,opacity' }
        );
      }
    } else {
      lenis?.start();
      document.body.style.overflow = '';
    }
    const onKey = (e: KeyboardEvent) => {
      if (!open) return;
      if (e.key === 'Escape') {
        setOpen(false);
        toggleRef.current?.focus();
      }
      // keep Tab inside the open menu and its toggle (a modal sheet)
      if (e.key === 'Tab' && menuRef.current) {
        const list = [toggleRef.current, ...menuRef.current.querySelectorAll<HTMLElement>('a[href], button')].filter(
          (el): el is HTMLElement => !!el && el.offsetParent !== null
        );
        const first = list[0];
        const last = list[list.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <>
    <header
      className={s.header}
      data-scrolled={scrolled || open}
      data-menu={open || undefined}
      data-hidden={hidden && !open}
    >
      <div className={`ix-container ${s.bar}`}>
        <Link href="/" className={s.logo} aria-label="Ixian home">
          <Logo />
        </Link>

        <nav className={s.links} aria-label="Main">
          {nav.items.map((item) =>
            item.children ? (
              <Dropdown key={item.label} item={item} />
            ) : item.external ? (
              <a key={item.label} href={item.href} target="_blank" rel="noreferrer" className={s.link}>
                {item.label}
                <Icon name="external" size={13} className={s.ext} />
              </a>
            ) : (
              <Link key={item.label} href={item.href} className={s.link}>
                {item.label}
              </Link>
            )
          )}
        </nav>

        <div className={s.actions}>
          <a href={nav.cta.href} className={`ix-btn ix-btn--primary ix-btn--sm ${s.cta}`}>
            {nav.cta.label}
          </a>
          <button
            ref={toggleRef}
            className={s.toggle}
            aria-expanded={open}
            aria-controls="ix-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((o) => !o)}
          >
            <span className={s.burger} data-open={open} />
          </button>
        </div>
      </div>

    </header>
    {/* outside the header: the header's blur makes it the containing block of anything fixed inside it */}
    <MobileMenu open={open} menuRef={menuRef} onClose={() => setOpen(false)} />
    </>
  );
}

/** Phone menu: each row's label links to its page; the chevron discloses its parts (one open at a time). */
function MobileMenu({ open, menuRef, onClose }: { open: boolean; menuRef: React.RefObject<HTMLDivElement | null>; onClose: () => void }) {
  const [section, setSection] = useState<string | null>(null);
  const p = useNetworkPulse();
  useEffect(() => {
    if (!open) setSection(null);
  }, [open]);
  return (
    <div id="ix-menu" ref={menuRef} className={s.menu} data-open={open || undefined} hidden={!open} role="dialog" aria-modal="true" aria-label="Menu">
      <nav aria-label="Main">
        <ul className={s.menuList}>
          {nav.items.map((item) => {
            const id = `ix-m-${item.label.toLowerCase()}`;
            const expanded = section === item.label;
            return (
              <li key={item.label} className={s.menuRow} data-menu-item data-expanded={expanded || undefined}>
                <div className={s.menuHead}>
                  {item.external ? (
                    <a href={item.href} className={s.menuLink} target="_blank" rel="noreferrer" onClick={onClose}>
                      {item.label}
                      <Icon name="external" size={15} className={s.ext} />
                    </a>
                  ) : (
                    <Link href={item.href} className={s.menuLink} onClick={onClose}>
                      {item.label}
                    </Link>
                  )}
                  {item.children && (
                    <button
                      type="button"
                      className={s.menuChev}
                      aria-expanded={expanded}
                      aria-controls={id}
                      aria-label={`${item.label}: show its parts`}
                      onClick={() => setSection(expanded ? null : item.label)}
                    >
                      <svg width="14" height="14" viewBox="0 0 10 10" aria-hidden>
                        <path d="M2 3.5l3 3 3-3" fill="none" stroke="currentColor" strokeWidth="1.2" />
                      </svg>
                    </button>
                  )}
                </div>
                {item.children && (
                  <div id={id} className={s.menuPanel} hidden={!expanded}>
                    <ul className={s.menuSub}>
                      {item.children.map((c) => {
                        const inner = (
                          <>
                            {c.icon && (
                              <span className={s.itemIcon}>
                                <Icon name={c.icon as Parameters<typeof Icon>[0]['name']} size={16} />
                              </span>
                            )}
                            <span className={s.itemText}>
                              <b>
                                {c.label}
                                {c.external && <Icon name="external" size={11} className={s.ext} />}
                              </b>
                              {c.note && <span>{c.note}</span>}
                            </span>
                          </>
                        );
                        return (
                          <li key={c.label}>
                            {c.external ? (
                              <a href={c.href} target="_blank" rel="noreferrer" onClick={onClose}>
                                {inner}
                              </a>
                            ) : (
                              <Link href={c.href} onClick={onClose}>
                                {inner}
                              </Link>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                    {item.footer && (
                      <Link href={item.footer.href} className={s.panelFoot} onClick={onClose}>
                        {item.footer.label}
                        <Icon name="arrow" size={13} />
                      </Link>
                    )}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </nav>
      <div className={s.menuFoot} data-menu-item>
        <p className={s.menuLive} aria-live="off">
          <i data-on={p.ok || undefined} aria-hidden />
          {p.ok ? (
            <>
              <b>{fmt(p.dlt)}</b> DLT · <b>{fmt(p.s2)}</b> S2 nodes · block <b>{fmt(p.height)}</b>
            </>
          ) : (
            'Reading the network…'
          )}
        </p>
      </div>
    </div>
  );
}

function Feature({ f, onGo }: { f: NonNullable<NavItem['feature']>; onGo: () => void }) {
  const p = useNetworkPulse();
  const body = (
    <>
      <span className={s.featEyebrow}>
        {f.live && <i data-on={p.ok || undefined} aria-hidden />}
        {f.eyebrow}
      </span>
      <b className={s.featTitle}>{f.title}</b>
      {f.live ? (
        <span className={s.featStats}>
          <span>
            <em>{p.dlt != null ? fmt(p.dlt) : '…'}</em> DLT nodes
          </span>
          <span>
            <em>{p.s2 != null ? fmt(p.s2) : '…'}</em> S2 nodes
          </span>
          <span>
            <em>{p.height != null ? fmt(p.height) : '…'}</em> latest block
          </span>
        </span>
      ) : (
        <span className={s.featBody}>{f.body}</span>
      )}
      <span className={s.featCta}>
        {f.cta}
        <Icon name={f.external ? 'external' : 'arrow'} size={14} />
      </span>
    </>
  );
  return f.external ? (
    <a className={s.feat} href={f.href} target="_blank" rel="noreferrer" onClick={onGo}>
      {body}
    </a>
  ) : (
    <Link className={s.feat} href={f.href} onClick={onGo}>
      {body}
    </Link>
  );
}

function Dropdown({ item }: { item: NavItem }) {
  const [open, setOpen] = useState(false);
  const timer = useRef(0);
  const btn = useRef<HTMLButtonElement>(null);
  const wrap = useRef<HTMLDivElement>(null);
  const hoveredAt = useRef(0);
  const id = `ix-nav-${item.label.toLowerCase()}`;
  const show = () => {
    window.clearTimeout(timer.current);
    hoveredAt.current = Date.now();
    timer.current = window.setTimeout(() => setOpen(true), 60);
  };
  const hide = () => {
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setOpen(false), 160);
  };
  const close = () => setOpen(false);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        btn.current?.focus();
      }
    };
    const onDown = (e: PointerEvent) => {
      if (!wrap.current?.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    window.addEventListener('pointerdown', onDown);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('pointerdown', onDown);
    };
  }, [open]);
  useEffect(() => () => window.clearTimeout(timer.current), []);
  const many = (item.children?.length ?? 0) > 4;
  return (
    <div
      ref={wrap}
      className={s.drop}
      data-open={open || undefined}
      // opens only from the item itself; stays open while the pointer travels down into the panel
      onMouseLeave={hide}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setOpen(false);
      }}
    >
      <span className={s.trigger} onMouseEnter={show}>
      <Link href={item.href} className={s.link} data-active={open || undefined}>
        {item.label}
      </Link>
      <button
        ref={btn}
        type="button"
        className={s.chev}
        aria-expanded={open}
        aria-controls={id}
        aria-label={`${item.label} menu`}
        // a click right after the hover opened it keeps it open (touch and fast pointers)
        onClick={() => setOpen((o) => (Date.now() - hoveredAt.current < 500 ? true : !o))}
      >
        <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden>
          <path d="M2 3.5l3 3 3-3" fill="none" stroke="currentColor" strokeWidth="1.4" />
        </svg>
      </button>
      </span>
      <div id={id} className={s.panel} onMouseEnter={() => window.clearTimeout(timer.current)} data-open={open || undefined} hidden={!open}>
        <div className={s.panelMain}>
          <ul className={s.panelList} data-many={many || undefined}>
            {item.children!.map((c) => {
              const inner = (
                <>
                  {c.icon && (
                    <span className={s.itemIcon}>
                      <Icon name={c.icon as Parameters<typeof Icon>[0]['name']} size={16} />
                    </span>
                  )}
                  <span className={s.itemText}>
                    <b>
                      {c.label}
                      {c.external && <Icon name="external" size={11} className={s.ext} />}
                    </b>
                    {c.note && <span>{c.note}</span>}
                  </span>
                </>
              );
              return (
                <li key={c.label}>
                  {c.external ? (
                    <a href={c.href} target="_blank" rel="noreferrer" onClick={close}>
                      {inner}
                    </a>
                  ) : (
                    <Link href={c.href} onClick={close}>
                      {inner}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
          {item.footer && (
            <Link href={item.footer.href} className={s.panelFoot} onClick={close}>
              {item.footer.label}
              <Icon name="arrow" size={13} />
            </Link>
          )}
        </div>
        {item.feature && <Feature f={item.feature} onGo={close} />}
      </div>
    </div>
  );
}
