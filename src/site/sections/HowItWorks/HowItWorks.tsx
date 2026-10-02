'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { gsap, ScrollTrigger, prefersReducedMotion } from '@site/lib/motion';
import { useNetworkPulse, fmt } from '@site/lib/useNetworkPulse';
import { HOW_INTRO, HOW_STEPS, ANY_ENDPOINT, EXAMPLE_ADDRESSES, USE_CASES, REPLACES, type UseCase } from '@site/content/how';
import { GLYPH } from '@site/components/endpointGlyphs';
import type { RoundTrip } from '@site/lib/roundTrip';
import { ROUTE } from './parts';
import { stepLines, fmtMs, shortAddr } from './log';
import { KINDS } from './IsoScene';
import { EyeScene } from './EyeScene';
import { IsoScene } from './IsoScene';
import SectionBoundary from '@site/components/SectionBoundary';
import { pin, usePinnedSteps, useMedia } from '@site/components/PinSteps';
import s from './HowItWorks.module.css';

// Scenes share the data-* animation contract in parts.tsx. Each step plays once when active, then holds
// its final frame; reduced motion jumps straight to that frame, so the still frame is the source of truth.

/** autoplay (phones, short windows): about 5.5 s a step, with the story played 1.3× faster */
const STEP_MS = 5600;
const AUTO_SPEED = 1.3;
/** how present the network is in each step (it exists from Find on) */
const LEVEL = [0, 0, 1, 0.9, 0.55];
const LEVEL_DIRECT = 0.3; // the network nearly disappears once it isn't the subject
/** the event each step ends on (the slot shows it in reduced motion) */
const LAST_EVENT = (uc: UseCase): [string, string][] => [
  ['Key pair', 'made on the device, never leaves it'],
  ['Verified', 'the signature matches B’s address'],
  ['Found', 'wherever it is right now'],
  ['Delivered', 'readable only by B'],
  [`+${uc.amount}`, 'the address is also the wallet'],
];
/** 'iso' is the default; 'eye' is selectable with ?how=eye */
type Variant = 'eye' | 'iso';
/** secondary line for the Talk step */
const TALK_SUB = 'Behind a firewall, a relay passes it on and sees only ciphertext';
const r3 = (n: number) => Math.round(n * 1000) / 1000;

/* ------------------------------------------------------------------ events */
type Ev = { id: number; step: number; i: number };
type Toast = { id: number; title: string; detail: string };
/** a noun for the endpoint label, from ANY_ENDPOINT's phrase: 'an AI agent' → 'AI agent' */
const noun = (phrase: string) => {
  const n = phrase.replace(/^an? /, '');
  return n.charAt(0).toUpperCase() + n.slice(1);
};

/** the reserved event spot, bottom left of the drawing: one event at a time, never over the drawing */
function Slot({ step, toast, sub }: { step: number; toast: Toast | null; sub: string | null }) {
  return (
    <div className={s.slot} aria-hidden>
      <span className={s.slotKicker}>{HOW_STEPS[step].term}</span>
      {toast ? (
        <p key={toast.id} className={s.slotBody}>
          <b>{toast.title}</b>
          <span>{toast.detail}</span>
        </p>
      ) : (
        <p className={s.slotBody} data-idle>
          <b>{HOW_STEPS[step].tab}</b>
          <span>&nbsp;</span>
        </p>
      )}
      {/* a second, smaller line: breadth, never in place of the claim */}
      <span className={s.slotSub} data-on={sub ? '' : undefined}>
        {sub ?? '\u00a0'}
      </span>
    </div>
  );
}

/** use cases: a hairline grid of links into the docs, title and one line each */
function UseCaseGrid() {
  return (
    <div className={s.ucBlock}>
      <p className={s.ucLabel}>Use cases</p>
      <ul className={s.ucGrid}>
        {USE_CASES.map((u) => (
          <li key={u.id}>
            <a href={u.docs.href} target="_blank" rel="noreferrer" aria-label={`${u.label}: ${u.sub}. ${u.docs.label}`}>
              <span className={s.ucTag}>Docs ↗</span>
              <b>{u.label}</b>
              <span className={s.ucSub}>{u.sub}</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

const GLYPHS = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';

/** the round trip in a Web Worker (no jank while RSA-4096 keys are made); on the main thread if workers fail */
function inWorker(): Promise<RoundTrip> {
  return new Promise((resolve, reject) => {
    let w: Worker;
    try {
      w = new Worker(new URL('../../lib/roundTrip.worker.ts', import.meta.url), { type: 'module' });
    } catch {
      import('@site/lib/roundTrip').then((m) => m.runRoundTrip()).then(resolve, reject);
      return;
    }
    w.onmessage = (e: MessageEvent<{ ok: boolean; rt?: RoundTrip; error?: string }>) => {
      w.terminate();
      if (e.data.ok && e.data.rt) resolve(e.data.rt);
      else reject(new Error(e.data.error));
    };
    w.onerror = () => {
      w.terminate();
      import('@site/lib/roundTrip').then((m) => m.runRoundTrip()).then(resolve, reject);
    };
    w.postMessage(null);
  });
}

/** what each step cost, measured: the numbers under the step chips */
function stepTotals(rt: RoundTrip): number[] {
  const t = rt.talk;
  return [rt.identity.keygenA, rt.proof.sign + rt.proof.verify, rt.find.hash, t.ecdh + t.kem + t.rsa + t.hkdf + t.seal + t.open, rt.pay.sign + rt.pay.verify];
}

/** the round trip, promoted: step totals, the live lines with their timings, run again */
function Proof({ rt, running, step, events, uc, height, onRun, onStep }: { rt: RoundTrip | null; running: boolean; step: number; events: Ev[]; uc: UseCase; height: number | null; onRun: () => void; onStep: (i: number) => void }) {
  const totals = rt ? stepTotals(rt) : null;
  // lines are rendered from the latest measurement, so a line logged before it finished fills in
  const lines = events.map((e) => ({ id: e.id, ...stepLines(e.step, rt, uc, height)[e.i] })).filter((l) => l.text);
  return (
    <div className={s.proof}>
      <div className={s.proofHead}>
        <p>
          <b>Round trip, measured in this browser</b>
          {totals ? (
            <span className={s.num}>
              key generation, once: {fmtMs(totals[0])} · every exchange after: <em>{fmtMs(totals.slice(1).reduce((a, b) => a + b, 0))}</em>
            </span>
          ) : (
            <span>{running ? 'measuring…' : ''}</span>
          )}
        </p>
        <button type="button" onClick={onRun} disabled={running}>
          {running ? 'Running…' : 'Run again'}
        </button>
      </div>
      <ol className={s.totals} aria-label="Time per step">
        {HOW_STEPS.map((x, i) => (
          <li key={x.tab} data-on={i === step || undefined}>
            <button type="button" onClick={() => onStep(i)}>
              <span>
                {x.tab}
                {i === 0 && <i> · once</i>}
              </span>
              <b className={s.num}>{totals ? fmtMs(totals[i]) : '…'}</b>
            </button>
          </li>
        ))}
      </ol>
      <ol className={s.log} aria-live="polite">
        {lines.map((e, i) => (
          <li key={e.id} data-new={i === lines.length - 1}>
            <span className={s.logText}>
              {e.text}
              {e.mono && <small className={s.mono}>{e.mono}</small>}
            </span>
            <span className={s.logMs} data-real={e.real || undefined}>
              {e.ms != null ? fmtMs(e.ms) : e.real && running ? '…' : ''}
            </span>
          </li>
        ))}
      </ol>
      <p className={s.proofFoot}>Keys, signatures, hashes and ciphers run in this tab.</p>
    </div>
  );
}
export default function HowItWorks() {
  const root = useRef<HTMLElement>(null);
  const [step, setStep] = useState(0);
  const [ui, setUi] = useState(0);
  const [inView, setInView] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [variant, setVariant] = useState<Variant>('iso');
  /** desktop with room for the whole frame: the reader's scroll sets the pace, not a timer */
  const [scrolly, setScrolly] = useState(false);
  const [events, setEvents] = useState<Ev[]>([]);
  const [toast, setToast] = useState<Toast | null>(null);
  const [sub, setSub] = useState<string | null>(null);
  const [hint, setHint] = useState<number | null>(null); // a step lit from the statement below
  const tabs = useRef<(HTMLLIElement | null)[]>([]);
  const start = useRef(0);
  const pulse = useNetworkPulse();
  const [rt, setRt] = useState<RoundTrip | null>(null);
  const [running, setRunning] = useState(false);
  const rtRef = useRef<RoundTrip | null>(null);
  rtRef.current = rt;
  const addrs = useMemo<[string, string]>(() => (rt ? [shortAddr(rt.identity.a), shortAddr(rt.identity.b)] : EXAMPLE_ADDRESSES), [rt]);
  const uc = USE_CASES[ui];
  const evId = useRef(0);
  const prevStep = useRef(-1);
  /** phones: the step texts ride in a sideways rail above the pinned drawing */
  const phone = useMedia('(max-width: 860px)');
  const pinOuter = useRef<HTMLDivElement>(null);
  const rail = useRef<HTMLDivElement>(null);
  const jump = usePinnedSteps({ enabled: phone, count: HOW_STEPS.length, step, setStep, outer: pinOuter, rail });

  useEffect(() => {
    setReduced(prefersReducedMotion());
    const v = new URLSearchParams(window.location.search).get('how');
    if (v === 'eye') setVariant(v);
    // scroll mode needs at least 720 px of height (small laptop windows); shorter windows autoplay
    const mq = window.matchMedia('(min-width: 861px) and (min-height: 720px)');
    const onMq = () => setScrolly(mq.matches);
    onMq();
    mq.addEventListener('change', onMq);
    // a rootMargin, not a threshold: on phones the pinned section is several screens tall,
    // so an area-based threshold might never be reached
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { rootMargin: '0px 0px -25% 0px' });
    io.observe(root.current!);
    // the steps open and close and the log grows, so this section's height moves: keep the
    // scroll triggers of everything below it (reveals, boundaries) measured
    let t = 0;
    let last = root.current!.offsetHeight;
    const ro = new ResizeObserver(() => {
      const h = root.current?.offsetHeight ?? last;
      if (Math.abs(h - last) < 2) return;
      last = h;
      window.clearTimeout(t);
      t = window.setTimeout(() => ScrollTrigger.refresh(), 200);
    });
    ro.observe(root.current!);
    return () => {
      mq.removeEventListener('change', onMq);
      io.disconnect();
      ro.disconnect();
      window.clearTimeout(t);
    };
  }, []);

  /* the real round trip: once, when the section is first in view (the crypto loads then too) */
  const measure = useCallback(async () => {
    if (!globalThis.crypto?.subtle) return;
    setRunning(true);
    try {
      setRt(await inWorker());
    } catch {
      /* an old browser without P-521 or RSA-4096: the drawing still plays, with no timings */
    } finally {
      setRunning(false);
    }
  }, []);
  const asked = useRef(false);
  useEffect(() => {
    if (!inView || asked.current) return;
    asked.current = true;
    void measure();
  }, [inView, measure]);

  // scroll mode: the step whose block crosses the reading line is the active one; its line fills as you read
  useEffect(() => {
    if (!scrolly) return;
    const sts = tabs.current.map(
      (li, i) =>
        li &&
        ScrollTrigger.create({
          trigger: li,
          start: 'top 55%',
          end: 'bottom 55%',
          onToggle: (st) => void (st.isActive && setStep(i)),
          onUpdate: (st) => li.style.setProperty('--p', String(r3(st.progress))),
        })
    );
    ScrollTrigger.refresh();
    return () => sts.forEach((st) => st?.kill());
  }, [scrolly]);

  // otherwise, autoplay with a progress line beside the active step
  useEffect(() => {
    if (!inView || reduced || scrolly || phone) return;
    start.current = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start.current) / STEP_MS);
      tabs.current.forEach((b, i) => b?.style.setProperty('--p', String(i < step ? 1 : i === step ? p : 0)));
      if (p >= 1) {
        setStep((step + 1) % HOW_STEPS.length);
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [step, inView, reduced, scrolly, phone]);

  // each step plays once on the active scene, then holds its final frame
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const q = gsap.utils.selector(el);
    const one = (sel: string) => el.querySelector<SVGGeometryElement>(sel)!;
    const moving = '[data-challenge], [data-sig], [data-msg], [data-coin], [data-kem], [data-kem2], [data-tok-label]';
    const all = q(
      `[data-from], [data-platform], [data-sector-lit], [data-direct], [data-route], [data-query], [data-pay], [data-relay-lit], [data-relay-ring], [data-ghost], [data-strike], [data-check], [data-key], [data-bring], [data-hot], [data-settle], [data-tile], [data-pq], [data-signed], [data-badge-in], ${moving}`
    );
    gsap.killTweensOf(all);
    const S = step;
    // the picture grows forward; stepping back (or the loop restarting) shows that step's frame at once
    const forward = S === prevStep.current + 1;
    prevStep.current = S;
    evId.current += 1;
    setEvents([]);
    setToast(null);
    const logL = (i: number) => setEvents((es) => [...es, { id: ++evId.current, step: S, i }]);
    /** write an event into the slot; `same` swaps the text without a new fade (the kind flashing) */
    const card = (title: string, detail: string, same = false) => setToast((t) => ({ id: same && t ? t.id : ++evId.current, title, detail }));
    const rest = (_: number, t: Element) => t.getAttribute('data-rest') ?? '';

    // base state for this step
    q('[data-addr]').forEach((t) => void ((t as Element).textContent = (t as Element).getAttribute('data-final') ?? ''));
    /** the endpoint's glyph and its name change together, so the picture always agrees with the sentence */
    const setKind = (side: 'a' | 'b', glyph: string, name?: string) => {
      q(`[data-glyph="${side}"]`).forEach((p) => (p as Element).setAttribute('d', GLYPH[glyph] ?? GLYPH.device));
      q(`[data-name="${side}"]`).forEach((n) => void ((n as Element).textContent = name ?? (n as Element).getAttribute('data-final') ?? ''));
      // the iso scene also changes what stands on the slab
      const kind = KINDS.includes(glyph) ? glyph : 'agent';
      q(`[data-mass="${side}"]`).forEach((m) => (m as Element).setAttribute('display', (m as Element).getAttribute('data-kind') === kind ? 'inline' : 'none'));
    };
    setKind('a', uc.glyph[0]);
    setKind('b', uc.glyph[1]);
    setSub(null);
    // the iso scene drops its composition while only the endpoints show (steps 1 and 2)
    const centre = q('[data-center]');
    const dy = (k: number) => (k <= 1 ? Number((centre[0] as Element | undefined)?.getAttribute('data-dy0') ?? 0) : 0);
    const instant = reduced || !forward;
    q('[data-from]').forEach((g) => {
      const k = Number((g as Element).getAttribute('data-from'));
      gsap.set(g, { opacity: k < S || (k === S && instant) ? 1 : 0 });
    });
    gsap.set(q('[data-platform]'), { opacity: S === 3 && instant ? LEVEL_DIRECT : LEVEL[S] || 1 });
    gsap.set(q('[data-sector-lit], [data-relay-lit], [data-relay-ring], [data-bring], [data-check], [data-ghost], [data-key], [data-settle], [data-signed]'), { opacity: 0 });
    gsap.set(q('[data-route]'), { strokeDasharray: 'none', strokeDashoffset: 0, opacity: S === 3 ? 0.9 : S === 4 ? 0.22 : 0 });
    gsap.set(q('[data-direct]'), { strokeDasharray: 'none', strokeDashoffset: 0, opacity: S === 4 ? 0.3 : 0 });
    gsap.set(q('[data-query], [data-pay]'), { opacity: 0, strokeDashoffset: 0 });
    if (S === 3) gsap.set(q('[data-relay-lit]'), { opacity: 1 });
    gsap.set(q(moving), { opacity: 0 });
    gsap.set(q('[data-hot]'), { attr: { stroke: rest } });
    gsap.set(q('[data-tile="next"]'), { opacity: 1 });
    gsap.set(q('[data-pq]'), { opacity: 0 });
    gsap.set(q('[data-badge-in]'), { scale: 1, transformOrigin: '50% 50%' });
    gsap.set(q('[data-bring], [data-relay-ring]'), { scale: 1, transformOrigin: '50% 50%' });
    if (centre.length) gsap.set(centre, { y: S === 2 && forward && !reduced ? dy(1) : dy(S) });

    if (reduced) {
      // the final frame of each step, at once
      const [t0, d0] = LAST_EVENT(uc)[S];
      setToast({ id: ++evId.current, title: t0, detail: d0 });
      if (S === 0) setSub('An endpoint can be anything with a key pair');
      if (S === 3) setSub(TALK_SUB);
      if (S === 0) gsap.set(q('[data-key]'), { opacity: 0.9 });
      if (S === 1) gsap.set(q('[data-ghost], [data-check="a"]'), { opacity: 1 });
      if (S === 1) gsap.set(q('[data-direct]'), { opacity: 0.5, strokeDasharray: '3 5' });
      if (S === 2) {
        gsap.set(q('[data-route], [data-relay-lit], [data-sector-lit]'), { opacity: 0.9 });
      }
      if (S === 3) {
        gsap.set(q('[data-route]'), { opacity: 0.22 });
        gsap.set(q('[data-relay-lit]'), { opacity: 0 });
        gsap.set(q('[data-direct]'), { opacity: 0.9 });
        gsap.set(q('[data-pq]'), { opacity: 1 });
      }
      if (S === 4) {
        gsap.set(q('[data-settle], [data-signed]'), { opacity: 1 });
        gsap.set(q('[data-pay]'), { opacity: 0.85 });
        gsap.set(q('[data-tile="next"]'), { opacity: 0 });
      }
      return;
    }

    const tl = gsap.timeline();
    tl.timeScale(scrolly ? 1 : AUTO_SPEED);
    // the network arrives: the composition rises into place first, once
    if (centre.length && S === 2 && forward) tl.to(centre, { y: 0, duration: 0.8, ease: 'power2.inOut' }, 0);
    /** the new part of the picture arrives first, then the story plays on it */
    q(`[data-from="${S}"]`).forEach((g) => void (forward && tl.fromTo(g, { opacity: 0 }, { opacity: 1, duration: 0.6, ease: 'power1.out' }, 0.1)));
    const follow = (sel: string, path: string, at: number, dur: number, label?: string, dx = 12, dy = -12) => {
      const tok = q(sel)[0];
      const lab = q('[data-tok-label]')[0];
      const pathEl = one(path);
      tl.set(tok, { opacity: 1 }, at).to(
        tok,
        {
          motionPath: { path: pathEl, align: pathEl, alignOrigin: [0.5, 0.5] },
          duration: dur,
          ease: 'power2.inOut',
          onStart: () => void (label != null && lab && (lab.textContent = label)),
          onUpdate() {
            if (label == null || !lab) return;
            const m = (this.targets()[0] as SVGGElement).getCTM();
            if (m) gsap.set(lab, { attr: { x: m.e + dx, y: m.f + dy }, opacity: 1 });
          },
        },
        at
      );
      return at + dur;
    };
    /** an endpoint or the relay acknowledges: its outline steps out once and fades */
    const ping = (sel: string, at: number, to = 1.08) => tl.fromTo(q(sel), { scale: 1, opacity: 0.8 }, { scale: to, opacity: 0, duration: 1, ease: 'expo.out', transformOrigin: '50% 50%' }, at);
    const pingRelay = (at: number) => ping('[data-relay-ring]', at, 2.6);
    const heat = (side: 'a' | 'b', at: number) =>
      tl.to(q(`[data-hot="${side}"]`), { attr: { stroke: ROUTE }, duration: 0.2 }, at).to(q(`[data-hot="${side}"]`), { attr: { stroke: rest }, duration: 0.8 }, at + 1.2);
    const at = (t: number, fn: () => void) => tl.call(fn, [], t);
    /** a line draws itself from its start, in the time a token takes to travel it */
    const draw = (sel: string, t: number, dur = 1, opacity = 0.9, dash?: string) => {
      const p = one(sel);
      const len = Math.ceil(p.getTotalLength());
      tl.set(q(sel), { strokeDasharray: len, strokeDashoffset: len, opacity }, t)
        .to(q(sel), { strokeDashoffset: 0, duration: dur, ease: 'power2.inOut' }, t)
        .set(q(sel), { strokeDasharray: dash ?? 'none' }, t + dur);
    };

    if (S === 0) {
      // identity: the claim first (keys made on the device), then the breadth, as a smaller line
      ping('[data-bring="a"]', 0.2);
      ping('[data-bring="b"]', 0.4);
      tl.fromTo(q('[data-key="a"]'), { opacity: 0 }, { opacity: 1, duration: 0.4 }, 0.4);
      tl.fromTo(q('[data-key="b"]'), { opacity: 0 }, { opacity: 1, duration: 0.4 }, 0.7);
      heat('a', 0.4);
      heat('b', 0.7);
      at(0.4, () => {
        logL(0);
        card('Key pair', 'made on the device, never leaves it');
      });
      // the addresses keep deriving while this step runs, so something is visibly at work
      const addrEls = q('[data-addr]') as Element[];
      const finals = addrEls.map((e) => e.getAttribute('data-final') ?? '');
      const churn = () =>
        addrEls.forEach((e, i) => void (e.textContent = finals[i].split('').map((ch) => (ch === '…' ? ch : GLYPHS[Math.floor(Math.random() * GLYPHS.length)])).join('')));
      tl.to({}, { duration: 0.09, repeat: -1, onRepeat: churn }, 0.9);
      at(1.6, () => logL(1));
      // one object morphs, and its name with it: phone → car → drone…, then back
      const kinds = ANY_ENDPOINT.filter(([g]) => g !== uc.glyph[0]);
      kinds.forEach(([gl, phrase], k) =>
        at(2.2 + k * 0.72, () => {
          setKind('a', gl, noun(phrase));
          setSub(`An endpoint can be ${phrase}`);
        })
      );
      at(2.2 + kinds.length * 0.72, () => {
        setKind('a', uc.glyph[0]);
        setSub('An endpoint can be anything with a key pair');
      });
      at(5.6, () => logL(2));
    }
    if (S === 1) {
      // authentication: challenge out, signature back, checked at the edge; no provider involved
      tl.set(q('[data-direct]'), { strokeDasharray: '3 5', opacity: 0 }, 0).to(q('[data-direct]'), { opacity: 0.5, duration: 0.5 }, 0.5);
      tl.to(q('[data-ghost]'), { opacity: 0.85, duration: 0.4 }, 0.2)
        .fromTo(q('[data-strike]'), { strokeDasharray: 160, strokeDashoffset: 160 }, { strokeDashoffset: 0, duration: 0.5, ease: 'power2.out' }, 0.7)
        .to(q('[data-ghost]'), { opacity: 0.5, duration: 0.4 }, 1.4);
      at(0.7, () => card('No account provider', 'nobody else is asked'));
      heat('a', 1.2);
      at(1.2, () => logL(0));
      let t = follow('[data-challenge]', '[data-direct]', 1.2, 1.4, 'challenge');
      tl.set(q('[data-challenge]'), { opacity: 0 }, t);
      heat('b', t);
      ping('[data-bring="b"]', t);
      at(t, () => {
        logL(1);
        card('Signed', 'with the key behind B’s address');
      });
      t = follow('[data-sig]', '[data-direct-back]', t + 0.4, 1.4, 'signature');
      tl.set(q('[data-sig], [data-tok-label]'), { opacity: 0 }, t);
      ping('[data-bring="a"]', t);
      tl.to(q('[data-check="a"]'), { opacity: 1, duration: 0.4 }, t + 0.1);
      at(t + 0.1, () => {
        logL(2);
        card('Verified', 'the signature matches B’s address');
      });
      at(t + 1.2, () => logL(3));
    }
    if (S === 2) {
      // discovery: the relay appears; hash the address, ask that sector's relays, draw the route
      heat('a', 0.8);
      at(0.9, () => {
        logL(0);
        card('Sector', 'from the hash of B’s address');
      });
      draw('[data-query]', 1.2, 1, 0.9, '3 5');
      tl.to(q('[data-sector-lit]'), { opacity: 0.9, duration: 0.4 }, 2.1);
      tl.to(q('[data-relay-lit]'), { opacity: 1, duration: 0.3 }, 2.2);
      pingRelay(2.25);
      at(2.4, () => {
        logL(1);
        card('Presence', 'signed by B, expires after 300 s');
      });
      tl.to(q('[data-query]'), { opacity: 0, duration: 0.3 }, 3.6);
      draw('[data-route]', 3.6, 1.2);
      ping('[data-bring="b"]', 4.8);
      heat('b', 4.8);
      at(4.9, () => {
        logL(2);
        card('Found', 'wherever it is right now');
      });
    }
    if (S === 3) {
      // private communication: hybrid key exchange via the relay, then the direct line and a sealed message
      at(0.6, () => {
        logL(0);
        card('Key exchange', 'hybrid, post-quantum, via the relay');
      });
      follow('[data-kem]', '[data-route]', 0.7, 1.6);
      follow('[data-kem2]', '[data-back]', 0.7, 1.6);
      tl.set(q('[data-kem], [data-kem2]'), { opacity: 0 }, 2.3);
      ping('[data-bring="a"]', 2.3, 1.05);
      ping('[data-bring="b"]', 2.3, 1.05);
      at(2.4, () => logL(1));
      at(2.8, () => logL(2));
      // keys agreed: the ends connect directly, the network recedes, the relay stays as the fallback
      tl.to(q('[data-platform]'), { opacity: LEVEL_DIRECT, duration: 1.2, ease: 'power2.inOut' }, 2.6);
      tl.to(q('[data-route]'), { opacity: 0.22, duration: 0.8 }, 2.6).to(q('[data-relay-lit]'), { opacity: 0, duration: 0.8 }, 2.6);
      draw('[data-direct]', 3.0, 1);
      tl.to(q('[data-pq]'), { opacity: 1, duration: 0.3 }, 3.7).fromTo(q('[data-pq] [data-badge-in]'), { scale: 0.7 }, { scale: 1, duration: 0.4, ease: 'back.out(2)', transformOrigin: '50% 50%' }, 3.7);
      at(3.3, () => {
        card('Direct', 'peer to peer, end to end');
        setSub(TALK_SUB);
      });
      heat('a', 4.3);
      const cipher = rtRef.current ? rtRef.current.talk.cipher.slice(0, 16).replace(/(.{4})(?=.)/g, '$1·') : undefined;
      const t = follow('[data-msg]', '[data-direct]', 4.4, 1.8, cipher, -44, -14);
      at(4.7, () => {
        logL(3);
        card('Ciphertext', 'all anyone on the way could see');
      });
      tl.to(q('[data-msg], [data-tok-label]'), { opacity: 0, duration: 0.15 }, t);
      ping('[data-bring="b"]', t);
      heat('b', t);
      at(t, () => {
        logL(4);
        card('Delivered', 'readable only by B');
      });
    }
    if (S === 4) {
      // value: the blocks appear; the transaction is traced from A, through the relay, into the next block
      heat('a', 0.8);
      at(0.8, () => {
        logL(0);
        card('Transaction', `${uc.amount}, signed by A`);
      });
      const payEl = one('[data-pay]');
      const arEl = one('[data-ar]');
      const dur = 2.6;
      const atRelay = 1.0 + dur * Math.min(0.9, arEl.getTotalLength() / payEl.getTotalLength());
      draw('[data-pay]', 1.0, dur, 0.85);
      const t = follow('[data-coin]', '[data-pay]', 1.0, dur, uc.amount, 12, -12);
      tl.to(q('[data-relay-lit]'), { opacity: 1, duration: 0.2 }, atRelay - 0.1).to(q('[data-relay-lit]'), { opacity: 0, duration: 0.6 }, atRelay + 0.5);
      pingRelay(atRelay);
      at(atRelay, () => {
        logL(1);
        card('Relay', 'passes it to the Ixian DLT');
      });
      tl.to(q('[data-coin], [data-tok-label]'), { opacity: 0, duration: 0.2 }, t);
      tl.to(q('[data-tile="next"]'), { opacity: 0, duration: 0.15 }, t).to(q('[data-settle]'), { opacity: 1, duration: 0.4 }, t);
      tl.to(q('[data-signed]'), { opacity: 1, duration: 0.3 }, t + 0.2).fromTo(q('[data-signed] [data-badge-in]'), { scale: 0.7 }, { scale: 1, duration: 0.4, ease: 'back.out(2)', transformOrigin: '50% 50%' }, t + 0.2);
      at(t, () => {
        logL(2);
        card('Settled', pulse.height != null ? `in block #${fmt(pulse.height + 1)}` : 'in the next block');
      });
      ping('[data-bring="b"]', t + 1.1);
      heat('b', t + 1.1);
      at(t + 1.1, () => {
        logL(3);
        card(`+${uc.amount}`, 'the address is also the wallet');
      });
    }
    return () => {
      tl.kill();
    };
    // pulse.height is read once per step, on purpose: a new block must not restart the step
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, reduced, uc, variant, scrolly]);

  // reduced motion: the log is the step's lines, with timings once measured
  useEffect(() => {
    if (reduced) setEvents(stepLines(step, null, uc, null).map((_, i) => ({ id: i + 1, step, i })));
  }, [reduced, step, uc]);

  const go = (i: number) => {
    // phones: a jump is a move of the rail; the step and the page follow it
    if (phone) {
      jump(i);
      return;
    }
    // in scroll mode a jump is a scroll: the step follows the reader's position
    if (scrolly) {
      document.getElementById(`how-step-${i + 1}`)?.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'center' });
      return;
    }
    setStep(i);
    start.current = performance.now();
  };
  const pick = (i: number) => {
    setUi(i);
    prevStep.current = step - 1; // replay this step with the new pair
    setStep(step);
    start.current = performance.now();
  };

  return (
    <section ref={root} id="how" className={s.hw} aria-labelledby="how-title">
      <SectionBoundary />
      <div className={s.wrap}>
        <header className={s.intro}>
          <h2 id="how-title" className={s.title} data-reveal data-reveal-delay="0.24">
            {HOW_INTRO.title}
          </h2>
          <p className={s.lead} data-reveal>
            {HOW_INTRO.lead}
          </p>
        </header>

        <p className={s.statement} data-top onMouseLeave={() => setHint(null)}>
          {REPLACES.lead}{' '}
          {REPLACES.items.map((it, i) => (
            <span key={it.noun}>
              <a
                className={s.noun}
                href={`#how-step-${it.step + 1}`}
                onMouseEnter={() => setHint(it.step)}
                onFocus={() => setHint(it.step)}
                onBlur={() => setHint(null)}
                onClick={(e) => {
                  e.preventDefault();
                  go(it.step);
                  document.getElementById(`how-step-${it.step + 1}`)?.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'center' });
                }}
              >
                {it.noun}
              </a>
              {i < REPLACES.items.length - 2 ? ', ' : i === REPLACES.items.length - 2 ? ' and ' : '.'}
            </span>
          ))}
        </p>

        {/* two columns, level at the top: the steps on the left, the diagram on the right */}
        <div id="live" className={s.grid} data-scrolly={scrolly || undefined}>
          <ol className={s.steps} data-scrolly={scrolly || undefined}>
            {HOW_STEPS.map((x, i) => (
              <li key={x.tab} id={`how-step-${i + 1}`} ref={(el) => void (tabs.current[i] = el)} data-on={i === step} data-done={i < step} data-hint={hint === i || undefined}>
                <button type="button" onClick={() => go(i)} aria-current={i === step ? 'step' : undefined}>
                  <span className={s.stepNum}>{i + 1}</span>
                  <span className={s.stepName}>
                    {x.tab}
                    <small>{x.term}</small>
                  </span>
                </button>
                <div className={s.body}>
                  <div>
                    <p>{x.body}</p>
                    <ul className={s.facts}>
                      {x.facts.map((f) => (
                        <li key={f}>{f}</li>
                      ))}
                    </ul>
                    {x.means && <p className={s.means}>{x.means}</p>}
                    <a href={x.more.href} target="_blank" rel="noreferrer">
                      Under the hood: {x.more.label} ↗
                    </a>
                  </div>
                </div>
              </li>
            ))}
          </ol>

          <div className={s.side}>
           <div ref={pinOuter} className={pin.outer} style={{ '--n': HOW_STEPS.length } as React.CSSProperties}>
           <div className={pin.inner}>
            {/* phones: the steps, slimmed down, in a sideways rail over the drawing */}
            <div ref={rail} className={pin.rail} aria-label="Steps">
              {HOW_STEPS.map((x, i) => (
                <button key={x.tab} type="button" className={pin.card} data-on={i === step || undefined} onClick={() => go(i)} aria-current={i === step ? 'step' : undefined}>
                  <span className={pin.cardHead}>
                    <span className={pin.cardNo}>0{i + 1}</span>
                    <span className={pin.cardName}>{x.tab}</span>
                    <span className={pin.cardTerm}>{x.term}</span>
                  </span>
                  <span className={pin.cardText}>{x.short}</span>
                </button>
              ))}
            </div>
            <div className={s.frame} data-variant={variant}>
              <div className={s.head}>
                {/* the whole pill swaps the pair; fixed width, so it never moves */}
                <button type="button" className={s.pair} onClick={() => pick((ui + 1) % USE_CASES.length)} aria-label={`${uc.names[0]} and ${uc.names[1]}. Try another pair of endpoints`} title="Try another pair">
                  <span className={s.pairText}>
                    {uc.names[0]} ↔ {uc.names[1]}
                  </span>
                  <span className={s.pairIcon} aria-hidden>
                    ⇄
                  </span>
                </button>
                <span className={s.dots}>
                  {HOW_STEPS.map((x, i) => (
                    <button key={x.tab} type="button" data-on={i === step || undefined} data-done={i < step || undefined} onClick={() => go(i)} aria-label={`Step ${i + 1}: ${x.tab}`} />
                  ))}
                  <span>
                    {step + 1} / 5 · {HOW_STEPS[step].tab}
                  </span>
                </span>
              </div>
              <div className={s.stage}>
                {variant === 'eye' ? <EyeScene uc={uc} addrs={addrs} /> : <IsoScene uc={uc} addrs={addrs} crop={phone} />}
                <Slot step={step} toast={toast} sub={sub} />
              </div>
              <Proof rt={rt} running={running} step={step} events={events} uc={uc} height={pulse.height} onRun={measure} onStep={go} />
            </div>
           </div>
           </div>
          </div>

        </div>


        <UseCaseGrid />
      </div>
    </section>
  );
}
