'use client';

import { useEffect, useRef, useState } from 'react';
import { ScrollTrigger, prefersReducedMotion } from '@site/lib/motion';
import s from './PinSteps.module.css';

/* Pinned steps on phones: vertical scroll or a sideways swipe on the rail picks the step.
   Markup: <div className={pin.outer} style={{'--n': count}}> <div className={pin.inner}>
   <div ref={rail} className={pin.rail}> <button className={pin.card}>… </div> drawing </div></div> */

export const pin = s;

type Lenisish = { scrollTo: (y: number, o?: { immediate?: boolean; force?: boolean }) => void };

export function usePinnedSteps({
  enabled,
  count,
  step,
  setStep,
  outer,
  rail,
}: {
  enabled: boolean;
  count: number;
  step: number;
  setStep: (i: number) => void;
  outer: React.RefObject<HTMLElement | null>;
  rail: React.RefObject<HTMLElement | null>;
}) {
  const stepRef = useRef(step);
  stepRef.current = step;
  const lastV = useRef(-1);
  const setRef = useRef(setStep);
  setRef.current = setStep;

  // vertical scroll through the pinned stretch: one step per share
  useEffect(() => {
    const el = outer.current;
    if (!enabled || !el) return;
    lastV.current = -1;
    const st = ScrollTrigger.create({
      trigger: el,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (t) => {
        const k = Math.min(count - 1, Math.floor(t.progress * count));
        if (k === lastV.current) return;
        lastV.current = k;
        if (k !== stepRef.current) setRef.current(k);
      },
    });
    ScrollTrigger.refresh();
    return () => st.kill();
  }, [enabled, count, outer]);

  /** move the page to step k's share of the pinned stretch (invisible while pinned) */
  const syncPage = (k: number) => {
    const o = outer.current;
    if (!o) return;
    const top = o.getBoundingClientRect().top + window.scrollY;
    const span = o.offsetHeight - window.innerHeight;
    const y = Math.round(top + ((k + 0.5) / count) * span);
    lastV.current = k;
    const lenis = (window as unknown as { __lenis?: Lenisish }).__lenis;
    if (lenis) lenis.scrollTo(y, { immediate: true, force: true });
    else window.scrollTo({ top: y, behavior: 'auto' });
  };
  const syncRef = useRef(syncPage);
  syncRef.current = syncPage;

  // a sideways swipe on the rail picks the step, and moves the page to match
  useEffect(() => {
    const r = rail.current;
    if (!enabled || !r) return;
    let t = 0;
    const onScroll = () => {
      window.clearTimeout(t);
      t = window.setTimeout(() => {
        if (!rail.current) return;
        const cards = Array.from(r.children) as HTMLElement[];
        if (cards.length < 2) return;
        const stride = cards[1].offsetLeft - cards[0].offsetLeft;
        const k = Math.max(0, Math.min(count - 1, Math.round(r.scrollLeft / stride)));
        if (k === stepRef.current) return;
        setRef.current(k);
        syncRef.current(k);
      }, 110);
    };
    r.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.clearTimeout(t);
      r.removeEventListener('scroll', onScroll);
    };
  }, [enabled, count, rail]);

  // the rail follows the step
  useEffect(() => {
    const r = rail.current;
    if (!enabled || !r) return;
    const card = r.children[step] as HTMLElement | undefined;
    if (!card) return;
    const first = r.children[0] as HTMLElement;
    const left = card.offsetLeft - first.offsetLeft;
    if (Math.abs(r.scrollLeft - left) < 4) return;
    r.scrollTo({ left, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
  }, [enabled, step, rail]);

  // one native snap point per step (scroll-snap-stop: always), so a fast flick or momentum
  // scrolling can't skip a step
  useEffect(() => {
    const el = outer.current;
    if (!enabled || !el) return;
    const marks: HTMLElement[] = [];
    const place = () => {
      const span = el.offsetHeight - window.innerHeight;
      marks.forEach((m, k) => (m.style.top = `${Math.round(((k + 0.5) / count) * span)}px`));
    };
    for (let k = 0; k < count; k++) {
      const m = document.createElement('span');
      m.className = s.snap;
      m.setAttribute('aria-hidden', 'true');
      el.appendChild(m);
      marks.push(m);
    }
    place();
    const ro = new ResizeObserver(place);
    ro.observe(el);
    document.documentElement.dataset.pinSnap = '';
    return () => {
      ro.disconnect();
      marks.forEach((m) => m.remove());
      delete document.documentElement.dataset.pinSnap;
    };
  }, [enabled, count, outer]);

  // a swipe while pinned becomes exactly one step; if the move can't be cancelled (momentum),
  // it is left to the browser and the snap points stop it instead
  useEffect(() => {
    const el = outer.current;
    if (!enabled || !el) return;
    let x0 = 0;
    let y0 = 0;
    let owned = false;
    let decided = false;
    let onRail = false;
    const pinned = () => {
      const r = el.getBoundingClientRect();
      return r.top <= 2 && r.bottom >= window.innerHeight - 2;
    };
    const onStart = (e: TouchEvent) => {
      x0 = e.touches[0].clientX;
      y0 = e.touches[0].clientY;
      owned = false;
      decided = false;
      onRail = !!rail.current && rail.current.contains(e.target as Node);
    };
    const onMove = (e: TouchEvent) => {
      if (e.touches.length > 1 || onRail) return;
      if (!decided) {
        const dy = y0 - e.touches[0].clientY; // > 0: towards the next step
        if (dy === 0) return;
        decided = true;
        const k = stepRef.current;
        owned = pinned() && (dy > 0 ? k < count - 1 : k > 0);
      }
      if (!owned) return;
      if (e.cancelable) e.preventDefault();
      else owned = false; // the browser is scrolling already: native snapping takes it from here
    };
    const onEnd = (e: TouchEvent) => {
      if (!owned) return;
      owned = false;
      const t = e.changedTouches[0];
      const dy = y0 - (t?.clientY ?? y0);
      const dx = (t?.clientX ?? x0) - x0;
      if (Math.abs(dy) < 24 || Math.abs(dx) > Math.abs(dy)) return;
      const k = Math.max(0, Math.min(count - 1, stepRef.current + (dy > 0 ? 1 : -1)));
      if (k === stepRef.current) return;
      setRef.current(k);
      syncRef.current(k);
    };
    el.addEventListener('touchstart', onStart, { passive: true });
    el.addEventListener('touchmove', onMove, { passive: false });
    el.addEventListener('touchend', onEnd, { passive: true });
    return () => {
      el.removeEventListener('touchstart', onStart);
      el.removeEventListener('touchmove', onMove);
      el.removeEventListener('touchend', onEnd);
    };
  }, [enabled, count, outer, rail]);

  /** a tap on a card, a dot or a link: the step at once, the page and the rail follow */
  return (k: number) => {
    setRef.current(k);
    syncRef.current(k);
  };
}

/** true on phones and narrow tablets, where the pinned layout is used */
export function useMedia(query = '(max-width: 860px)') {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const f = () => setOn(mq.matches);
    f();
    mq.addEventListener('change', f);
    return () => mq.removeEventListener('change', f);
  }, [query]);
  return on;
}
