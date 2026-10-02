'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap, useGSAP, ScrollTrigger, prefersReducedMotion } from '@site/lib/motion';
import { useNetworkPulse, useAge, fmt } from '@site/lib/useNetworkPulse';
import { hero } from '@site/content/homeV3';
import type { RingWorld, Place, Card } from '@site/three/RingWorld';
import { GLYPH } from '@site/components/endpointGlyphs';
import s from './Hero.module.css';

const FEATURED = 20; // keep in sync with RingWorld (slots 0–19 featured, 20–39 quiet)

/* each example endpoint carries its glyph key (content/useCases.ts) */
const glyphFor = (g: string) => GLYPH[g] ?? GLYPH.device;

function placeFor(w: number, h: number): Place {
  if (w < 860) return { cx: w * 0.5, cy: h * 0.74, r: Math.min(w * 0.34, h * 0.2) };
  return { cx: w * 0.5, cy: h * 0.6, r: Math.min(h * 0.235, w * 0.18) };
}

function LiveLine() {
  const pulse = useNetworkPulse();
  const age = useAge(pulse.at);
  if (!pulse.ok) return null;
  return (
    <p data-readouts className={s.live}>
      <span className={s.dot}>live</span>
      <span>
        latest block <b>{fmt(pulse.height)}</b>
      </span>
      <span>
        <b>{fmt(pulse.dlt)}</b> DLT nodes
      </span>
      <span>
        <b>{fmt(pulse.s2)}</b> S2 nodes
      </span>
      <span className={s.age}>updated {age ?? 0} s ago</span>
    </p>
  );
}

export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const world = useRef<RingWorld | null>(null);
  const labels = useRef<(HTMLDivElement | null)[]>([]);
  const [cards, setCards] = useState<(Card & { key: number })[]>([]);
  const cardKey = useRef(0);
  const pulse = useNetworkPulse();

  // the scene is lazy-loaded and paused off screen
  useEffect(() => {
    let alive = true;
    let ro: ResizeObserver | null = null;
    let io: IntersectionObserver | null = null;
    let intro: gsap.core.Timeline | null = null;
    const reduced = prefersReducedMotion();
    import('@site/three/RingWorld')
      .then(({ RingWorld }) => {
        if (!alive || !canvas.current || !root.current) return;
        const w = new RingWorld(canvas.current, reduced);
        world.current = w;
        w.onEndpoints = (views) => {
          const seen = new Set<number>();
          for (const v of views) {
            seen.add(v.slot);
            const el = labels.current[v.slot];
            if (!el) continue;
            if (el.dataset.id !== v.key) {
              el.dataset.id = v.key;
              el.querySelector('path')?.setAttribute('d', glyphFor(v.g));
              const label = el.querySelector('span');
              if (label) label.textContent = v.label;
            }
            el.style.opacity = String(v.quiet ? v.a * 0.5 : v.a);
            // the glyph's frame is centred on the endpoint; near the right edge the label goes on its left
            const half = v.quiet ? 8 : 11;
            const flip = v.x > (root.current?.clientWidth ?? 9999) - (v.quiet ? 120 : 160);
            if ((el.dataset.flip === '') !== flip) {
              if (flip) el.dataset.flip = '';
              else delete el.dataset.flip;
            }
            el.style.transform = flip
              ? `translate(${Math.round(v.x + half)}px, ${Math.round(v.y - half)}px) translateX(-100%)`
              : `translate(${Math.round(v.x - half)}px, ${Math.round(v.y - half)}px)`;
          }
          labels.current.forEach((el, i) => el && !seen.has(i) && (el.style.opacity = '0'));
        };
        w.onCard = (c) => {
          const key = ++cardKey.current;
          setCards((cs) => [...cs.slice(-3), { ...c, key }]);
          window.setTimeout(() => setCards((cs) => cs.filter((k) => k.key !== key)), 1900);
        };
        const layout = () => {
          // after navigating away the observer can still fire once, with the section gone
          if (!alive || !root.current) return;
          const R = root.current.getBoundingClientRect();
          // endpoints stay below the copy band (on phones the copy runs down to about half the height)
          w.zone = R.width < 860 ? { minX: 0.04, maxY: 0.86, minY: 0.52 } : { minX: 0.04, maxY: 0.82, minY: 0.36 };
          w.resize(R.width, R.height, placeFor(R.width, R.height));
        };
        layout();
        ro = new ResizeObserver(layout);
        ro.observe(root.current);
        if (reduced) {
          w.renderOnce();
          return;
        }
        // establishing shot: the face-on mark draws, then leans back as the network fades up
        const p = { draw: 0, tilt: 0, fade: 0, zoom: 0.86 };
        w.setIntro(0, 0, 0);
        w.setZoom(p.zoom);
        intro = gsap
          .timeline({ delay: 0.25, onUpdate: () => (w.setIntro(p.tilt, p.draw, p.fade), w.setZoom(p.zoom)) })
          .to(p, { draw: 1, duration: 1.4, ease: 'power2.inOut' }, 0)
          .to(p, { tilt: 1, duration: 2.2, ease: 'expo.inOut' }, 1.0)
          .to(p, { fade: 1, duration: 1.8, ease: 'power2.out' }, 1.2)
          .to(p, { zoom: 1, duration: 3.2, ease: 'expo.out' }, 0.6);
        io = new IntersectionObserver(([e]) => (e.isIntersecting ? w.start() : w.stop()));
        io.observe(root.current);
      })
      .catch(() => {
        /* no WebGL: the copy and live line still work on the plain background */
      });
    const onMove = (e: PointerEvent) => world.current?.setPointer((e.clientX / innerWidth) * 2 - 1, (e.clientY / innerHeight) * 2 - 1);
    window.addEventListener('pointermove', onMove);
    return () => {
      alive = false;
      intro?.kill();
      ro?.disconnect();
      io?.disconnect();
      window.removeEventListener('pointermove', onMove);
      world.current?.dispose();
      world.current = null;
    };
  }, []);

  // real data: node counts, newest block, halo on a new block
  useEffect(() => {
    if (!pulse.ok) return;
    const apply = () => {
      const w = world.current;
      if (!w) return false;
      w.setCounts(pulse.dlt ?? 0, pulse.s2 ?? 0);
      w.setHeight(pulse.height);
      return true;
    };
    if (apply()) return;
    const id = window.setInterval(() => apply() && window.clearInterval(id), 250);
    return () => window.clearInterval(id);
  }, [pulse]);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      if (prefersReducedMotion()) return;
      // the copy animates in with CSS (heroIn) so it shows even when the script is slow to start;
      // only the live readouts wait for the script
      gsap.set(q('[data-readouts]'), { opacity: 0 });
      gsap.to(q('[data-readouts]'), { opacity: 1, duration: 0.6, delay: 2.4 });
      // leaving the hero: drift deeper into the network
      ScrollTrigger.create({
        trigger: root.current,
        start: 'top top',
        end: 'bottom top',
        scrub: 0.5,
        onUpdate: (st) => {
          world.current?.setZoom(1 + st.progress * 0.6);
          // back at the top the copy is always fully there, whatever the scrub left behind
          if (st.progress < 0.005) gsap.set(q('[data-copy]'), { clearProps: 'opacity,transform' });
          else gsap.set(q('[data-copy]'), { opacity: 1 - st.progress * 1.6, y: -st.progress * 60 });
        },
      });
    },
    { scope: root }
  );

  return (
    <section ref={root} id="top" className={s.hero} aria-labelledby="hero-title">
      <canvas ref={canvas} className={s.canvas} aria-hidden />
      <div className={s.layer} aria-hidden>
        {Array.from({ length: 40 }, (_, i) => (
          <div key={i} className={`${s.ep} ${i >= FEATURED ? s.epQuiet : ''}`} style={{ opacity: 0 }} ref={(el) => void (labels.current[i] = el)}>
            <i className={s.epMark}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                <path d="" />
              </svg>
            </i>
            <span />
          </div>
        ))}
        {cards.map((c) => (
          <div
            key={c.key}
            className={s.card}
            style={{
              transform:
                c.x > (root.current?.clientWidth ?? 9999) * 0.55
                  ? `translate(${c.x - 14}px, ${c.y + 14}px) translateX(-100%)`
                  : `translate(${c.x + 14}px, ${c.y + 14}px)`,
            }}
          >
            <b>{c.title}</b>
            <span>{c.detail}</span>
          </div>
        ))}
      </div>
      <div className={s.scrim} />
      <div className={s.copy} data-copy>
        <h1 id="hero-title" className={s.h1}>
          <span data-line style={{ '--i': 0 } as React.CSSProperties}>{hero.headline[0]}</span>{' '}
          <span data-line className={s.quiet} style={{ '--i': 1 } as React.CSSProperties}>{hero.headline[1]}</span>
        </h1>
        <p className={s.sub} data-line style={{ '--i': 2 } as React.CSSProperties}>
          {hero.sub}
        </p>
        <div className={s.ctas} data-line style={{ '--i': 3 } as React.CSSProperties}>
          <a className={`${s.btn} ${s.secondary}`} data-outline="" href={hero.primary.href}>
            {hero.primary.label}
            <span className={s.btnArrow} data-arrow="down" aria-hidden>
              ↓
            </span>
          </a>
        </div>
      </div>
      <p className={s.note}>{hero.note}</p>
      <div className={s.readouts}>
        <LiveLine />
      </div>
    </section>
  );
}
