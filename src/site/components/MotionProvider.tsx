'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import Lenis from 'lenis';
import { gsap, ScrollTrigger, REDUCED_QUERY } from '@site/lib/motion';

/** Lenis smooth scrolling (on GSAP's ticker, so ScrollTrigger stays in sync) and [data-reveal]
    reveals, re-run on each navigation since the layout does not remount. Off with reduced motion. */
export default function MotionProvider() {
  const pathname = usePathname();
  const lenisRef = useRef<Lenis | null>(null);
  const first = useRef(true);

  // smooth scrolling, once
  useEffect(() => {
    const root = document.documentElement;
    const mq = window.matchMedia(REDUCED_QUERY);
    if (mq.matches) return;

    root.classList.add('ix-motion');

    // macOS already smooths wheel and trackpad; Lenis easing on top doubles the momentum,
    // so there it only handles anchors and scrollTo.
    const mac = /Mac/i.test(navigator.platform || '') || /Mac OS X/i.test(navigator.userAgent);
    const lenis = new Lenis({
      lerp: 0.16,
      smoothWheel: !mac,
      anchors: { offset: -72 },
      autoRaf: false,
    });
    lenisRef.current = lenis;
    lenis.on('scroll', ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    (window as unknown as { __lenis?: Lenis }).__lenis = lenis;

    const onChange = () => {
      if (mq.matches) {
        gsap.set('[data-reveal]', { clearProps: 'all' });
        lenis.destroy();
        lenisRef.current = null;
        root.classList.remove('ix-motion');
      }
    };
    mq.addEventListener('change', onChange);

    // Fonts/images can shift layout after first paint
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener('load', refresh);
    document.fonts?.ready.then(refresh);

    return () => {
      mq.removeEventListener('change', onChange);
      window.removeEventListener('load', refresh);
      gsap.ticker.remove(tick);
      lenis.destroy();
      lenisRef.current = null;
      root.classList.remove('ix-motion');
    };
  }, []);

  // reveals, for the page that is on screen now (first load and every navigation)
  useEffect(() => {
    if (window.matchMedia(REDUCED_QUERY).matches) return;
    const lenis = lenisRef.current;
    // a new page starts at the top (or at its anchor), not where Lenis left the last one
    if (!first.current && lenis) {
      const hash = window.location.hash;
      const target = hash ? document.querySelector<HTMLElement>(hash) : null;
      lenis.scrollTo(target ?? 0, { immediate: true, offset: target ? -72 : 0 });
    }
    first.current = false;

    /* The MutationObserver picks up content rendered after the route change (streamed or lazy);
       the safety pass shows anything still hidden after 2.5 s. */
    const seen = new WeakSet<Element>();
    const show = (el: HTMLElement, i = 0) => {
      if (el.hasAttribute('data-revealed')) return;
      el.setAttribute('data-revealed', '');
      gsap.fromTo(el, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.52, ease: 'expo.out', delay: Number(el.dataset.revealDelay || 0) + i * 0.08, overwrite: true });
    };
    const io = new IntersectionObserver(
      (entries) => {
        let i = 0;
        for (const e of entries) {
          if (e.isIntersecting || e.boundingClientRect.bottom < 0) {
            io.unobserve(e.target);
            show(e.target as HTMLElement, i++);
          }
        }
      },
      { rootMargin: '0px 0px -10% 0px' },
    );
    const scan = () =>
      document.querySelectorAll<HTMLElement>('[data-reveal]:not([data-revealed])').forEach((el) => {
        if (seen.has(el)) return;
        seen.add(el);
        io.observe(el);
      });
    const main = document.getElementById('main') ?? document.body;
    const mo = new MutationObserver(scan);
    const raf = requestAnimationFrame(() => {
      scan();
      mo.observe(main, { childList: true, subtree: true });
      ScrollTrigger.refresh();
    });
    /* A jump (fast scroll, an anchor, a slow engine) can carry a section past the viewport
       between two observer checks, and the observer never reports it. The sweep shows
       whatever has passed the observer's line (10% up) or is above it: once per frame
       while scrolling, and 2.5 s in. */
    const sweep = () =>
      document.querySelectorAll<HTMLElement>('[data-reveal]:not([data-revealed])').forEach((el) => {
        if (el.getBoundingClientRect().top < window.innerHeight * 0.9) {
          io.unobserve(el);
          show(el);
        }
      });
    let pending = 0;
    const onScroll = () => {
      if (!pending) pending = requestAnimationFrame(() => { pending = 0; sweep(); });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    const safety = window.setTimeout(sweep, 2500);

    return () => {
      cancelAnimationFrame(raf);
      cancelAnimationFrame(pending);
      window.removeEventListener('scroll', onScroll);
      window.clearTimeout(safety);
      io.disconnect();
      mo.disconnect();
    };
  }, [pathname]);

  return null;
}
