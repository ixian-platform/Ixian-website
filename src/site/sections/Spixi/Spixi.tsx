'use client';

import { useEffect, useRef, useState } from 'react';
import { spixi } from '@site/content/homeV3';
import Stage, { type StageContent } from './Stage';
import Phones, { type PhoneShot } from './Phones';
import { prefersReducedMotion } from '@site/lib/motion';
import { metrics, formatMetric } from '@site/content/metrics';
import { useNetworkPulse, fmt } from '@site/lib/useNetworkPulse';
import SectionBoundary from '@site/components/SectionBoundary';
import Link from 'next/link';
import Icon from '@site/components/Icon';
import s from './Spixi.module.css';

/* Nodes online are live (DLT + S2); if the read fails, no number is shown rather than a stale one. */

/** The homepage section; other pages reuse it with their own stories and copy. */
export default function Spixi({
  content,
  copy = spixi,
  pre = 'spixi',
  phones,
  caseStudy,
  hideNodes,
}: {
  content?: StageContent;
  copy?: typeof spixi;
  pre?: string;
  /** optional: the real app as three phones instead of the drawn stage */
  phones?: PhoneShot[];
  caseStudy?: { label: string; href: string };
  /** Ecosystem shows node counts elsewhere: hide the live row here */
  hideNodes?: boolean;
} = {}) {
  const names = phones ? phones.map((p) => p.label) : copy.screens;
  const [active, setActive] = useState(0);
  const [manual, setManual] = useState(false); // a click stops the tour on that tab
  const [inView, setInView] = useState(false);
  const [reduced, setReduced] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    setReduced(prefersReducedMotion());
    const el = stageRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  // the phones tour on their own while in view, until a click picks one
  useEffect(() => {
    if (!phones || !inView || manual || reduced) return;
    const id = window.setInterval(() => setActive((i) => (i + 1) % phones.length), 5200);
    return () => window.clearInterval(id);
  }, [phones, inView, manual, reduced]);
  const pick = (i: number) => {
    setManual(true);
    setActive(i);
  };
  const pulse = useNetworkPulse();
  const nodes = pulse.dlt != null && pulse.s2 != null ? pulse.dlt + pulse.s2 : null;

  const onKey = (e: React.KeyboardEvent, i: number) => {
    const n = names.length;
    const next = e.key === 'ArrowRight' ? (i + 1) % n : e.key === 'ArrowLeft' ? (i - 1 + n) % n : e.key === 'Home' ? 0 : e.key === 'End' ? n - 1 : -1;
    if (next < 0) return;
    e.preventDefault();
    pick(next);
    tabs.current[next]?.focus();
  };

  return (
    <section id={pre} className={s.spixi} aria-labelledby={`${pre}-title`}>
      <SectionBoundary />
      <div className={s.wrap}>
        <div className={s.grid}>
          <header className={s.head}>
            <p className={s.eyebrow}>{copy.eyebrow}</p>
            <h2 id={`${pre}-title`} className={s.title} data-reveal data-reveal-delay="0.24">
              {copy.title}
            </h2>
          </header>

          <div className={s.stage}>
            <div ref={stageRef} className={s.frame}>
              {phones ? (
                <Phones shots={phones} active={active} onPick={pick} idPrefix={pre} />
              ) : (
                <Stage
                  skin="spixi"
                  content={content}
                  idPrefix={pre}
                  active={active}
                  reduced={reduced}
                  playing={inView}
                  onDone={() => {
                    if (!manual) setActive((i) => (i + 1) % copy.screens.length);
                  }}
                />
              )}
            </div>
            <div className={s.tabs} role="tablist" aria-label="Spixi screens">
              {names.map((name, i) => (
                <button
                  key={name}
                  ref={(el) => {
                    tabs.current[i] = el;
                  }}
                  type="button"
                  role="tab"
                  id={`${pre}-tab-${i}`}
                  aria-selected={i === active}
                  aria-controls={`${pre}-panel-${i}`}
                  tabIndex={i === active ? 0 : -1}
                  className={s.tab}
                  onClick={() => pick(i)}
                  onKeyDown={(e) => onKey(e, i)}
                >
                  {name}
                </button>
              ))}
            </div>
            <p className={s.previewNote} data-on={(!phones && active === 1) || undefined}>
              {copy.agentsNote}
            </p>
          </div>

          <div className={s.copy}>
            <p className={s.body} data-reveal>
              {copy.body}
            </p>
            <div className={s.actions} data-reveal>
              <a className={s.primary} href={copy.primary.href} target="_blank" rel="noreferrer">
                {copy.primary.label}
              </a>
              {caseStudy && (
                <Link className={s.link} href={caseStudy.href}>
                  {caseStudy.label}
                  <Icon name="arrow" size={15} />
                </Link>
              )}
            </div>

            <dl className={s.numbers} data-reveal>
              {metrics.dataTransfers.definition && (
                <div>
                  <dt title={metrics.dataTransfers.definition}>{metrics.dataTransfers.label}</dt>
                  <dd>{formatMetric(metrics.dataTransfers)}</dd>
                </div>
              )}
              {!hideNodes && (
              <div className={s.liveRow}>
                <dt>
                  <i className={s.live} data-on={nodes != null || undefined} aria-hidden />
                  Nodes online now
                </dt>
                <dd>{nodes != null ? fmt(nodes) : <span className={s.pending}>reading…</span>}</dd>
              </div>
              )}
              <div className={s.platformRow}>
                <dt>Runs on</dt>
                <dd>{copy.platforms.join(' · ')}</dd>
              </div>
            </dl>
            {copy.numbersNote && <p className={s.note}>{copy.numbersNote}</p>}
          </div>
        </div>
      </div>
    </section>
  );
}
