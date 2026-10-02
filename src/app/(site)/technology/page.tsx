import { Metadata } from 'next';
import { pageMeta } from '@site/lib/seo';
import { PageIndex, Section, DocLinks, TextLink } from '@site/components/page/kit';
// the kit's styles, imported directly: Turbopack (dev) links a CSS module only when a component imports it
import p from '@site/components/page/page.module.css';
import SectionBoundary from '@site/components/SectionBoundary';
import Chapters from '@site/components/Chapters';
import Story from '@site/sections/PlatformPage/Story';
import Numbers from '@site/sections/PlatformPage/Numbers';
import BlockChain from '@site/sections/PlatformPage/BlockChain';
import S2Lookup from '@site/sections/PlatformPage/S2Lookup';
import S2Features from '@site/sections/PlatformPage/S2Features';
import DltFeatures from '@site/sections/PlatformPage/DltFeatures';
import S2Backdrop from '@site/sections/PlatformPage/S2Backdrop';
import Seal from '@site/sections/PlatformPage/Seal';
import Decompose from '@site/sections/PlatformPage/Decompose';
import IxiFlow from '@site/sections/PlatformPage/IxiFlow';
import QuantumLocks from '@site/sections/PlatformPage/QuantumLocks';
import BuildPath from '@site/sections/PlatformPage/BuildPath';
import RoadmapV2 from '@site/sections/PlatformPage/RoadmapV2';
import WhereNext from '@site/sections/PlatformPage/WhereNext';
import IdPoints from '@site/sections/PlatformPage/IdPoints';
import WarmField from '@site/sections/PlatformPage/WarmField';
import r4 from '@site/sections/PlatformPage/Round4.module.css';
import { meta, hero, dlt, dltFeatures, s2, s2Features, security, identity, decompose, ixi, build, roadmap, chapters, identityV2 } from '@site/content/platform';
import s from '@site/sections/PlatformPage/Instruments.module.css';

export const metadata: Metadata = pageMeta({ ...meta, path: '/technology', og: 'technology' });

/** Toggles Identity's "Found / Reached / Paid" row. */
const SHOW_JOBS = false;

export default function PlatformPage() {
  return (
    <>
      <Story copy={{ title: hero.title, lead: hero.lead, actions: hero.actions, ...hero.story }} />

      <div className={p.wrap}>
        <PageIndex index={hero.index} />
        <Numbers />
      </div>

      {/* DLT: the chain, full width and live; then the two rules and the numbers */}
      <section id="dlt" className={s.sec} data-pad="lg" aria-labelledby="dlt-title">
        <SectionBoundary />
        <div className={p.wrap}>
          <div className={p.intro}>
            <h2 id="dlt-title" className={p.title} data-reveal>
              {dlt.title}
            </h2>
            <p className={p.lead} data-reveal>
              {dlt.lead}
            </p>
          </div>
          <div data-reveal>
            <BlockChain />
          </div>
          <DltFeatures />
          <div className={s.after} style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--ix-s-3) var(--ix-s-6)', alignItems: 'baseline' }}>
            <TextLink {...dltFeatures.specs} small />
            <DocLinks links={dlt.links.filter((l) => l.href !== dltFeatures.specs.href)} small />
          </div>
        </div>
      </section>

      {/* S2: near black with soft blue fields; the lookup as a trace; what S2 does */}
      <section id="s2" className={s.sec} data-pad="xl" aria-labelledby="s2-title">
        <S2Backdrop />
        <SectionBoundary />
        <div className={p.wrap}>
          <div className={p.intro}>
            <h2 id="s2-title" className={p.title} data-reveal>
              {s2.title}
            </h2>
            <p className={p.lead} data-reveal>
              {s2.lead}
            </p>
          </div>
          <div data-reveal>
            <S2Lookup />
          </div>
          <S2Features />
          <div className={s.after} style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--ix-s-3) var(--ix-s-6)', alignItems: 'baseline' }}>
            <DocLinks links={s2.links} small />
            <span className={s.portNote}>{s2Features.port}</span>
          </div>
        </div>
      </section>

      {/* Post-quantum: specification-dense, around a seal you can run */}
      <section id="security" className={s.sec} data-pad="lg" aria-labelledby="security-title">
        <SectionBoundary />
        <div className={p.wrap}>
          <div className={p.intro}>
            <h2 id="security-title" className={p.title} data-reveal>
              {security.title}
            </h2>
            <p className={p.lead} data-reveal>
              {security.lead}
            </p>
          </div>
          <div data-reveal>
            <QuantumLocks />
          </div>
          <div className={s.instrument} data-reveal>
            <Seal />
          </div>
          <div className={s.specGrid} data-reveal>
            <dl className={s.specs} data-cols="2">
              {security.specs.map((r) => (
                <div key={r.k}>
                  <dt>{r.k}</dt>
                  <dd>{r.v}</dd>
                </div>
              ))}
            </dl>
            <div>
              <p className={p.note} style={{ marginTop: 0 }}>
                {security.note}
              </p>
              <div style={{ marginTop: 'var(--ix-s-5)' }}>
                <DocLinks links={security.links} small />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Identity: one large statement, then compact data */}
      <section id="identity" className={`${s.sec} ${r4.warm}`} data-pad="lg" aria-labelledby="identity-title">
        <WarmField />
        <SectionBoundary />
        <div className={p.wrap}>
          <h2 id="identity-title" className={s.statement} data-reveal>
            {decompose.statement[0]} <span>{decompose.statement[1]}</span>
          </h2>
          <p className={`${p.lead} ${s.statementLead}`} data-reveal>
            {identity.lead}
          </p>
          <div className={r4.idGrid2}>
            <div data-reveal>
              <IdPoints />
            </div>
            <div className={`${s.instrument} ${r4.sleek}`} data-reveal data-reveal-delay="0.1">
              <Decompose />
            </div>
          </div>
          {SHOW_JOBS && (
          <ul className={r4.jobs} aria-label={identityV2.uses.label} data-reveal>
            {identityV2.uses.items.map((u) => (
              <li key={u.id} data-tone={u.tone}>
                <a href={u.href}>
                  <b className={r4.jobName}>
                    <i aria-hidden />
                    {u.name}
                  </b>
                  <span>{u.body}</span>
                </a>
              </li>
            ))}
          </ul>
          )}
        </div>
      </section>

      {/* IXI: the flow, pulsing on real blocks, over a faint green field */}
      <section id="ixi" className={s.sec} data-pad="lg" aria-labelledby="ixi-title">
        <S2Backdrop tone="green" />
        <SectionBoundary />
        <div className={p.wrap}>
          <div className={p.intro}>
            <h2 id="ixi-title" className={p.title} data-reveal>
              {ixi.title}
            </h2>
            <p className={p.lead} data-reveal>
              {ixi.lead}
            </p>
          </div>
          <div data-reveal>
            <IxiFlow />
          </div>
          {ixi.note && <p className={p.note}>{ixi.note}</p>}
          <div style={{ marginTop: 'var(--ix-s-6)' }}>
            <DocLinks links={ixi.links} small />
          </div>
        </div>
      </section>

      {/* Build: warm, a path from this page to a first message on an amber line */}
      <section id="build" className={s.sec} data-pad="lg" aria-labelledby="build-title">
        <S2Backdrop tone="amber" />
        <SectionBoundary />
        <div className={p.wrap}>
          <div className={p.intro}>
            <h2 id="build-title" className={p.title} data-reveal>
              {build.title}
            </h2>
            <p className={p.lead} data-reveal>
              {build.lead}
            </p>
          </div>
          <div data-reveal>
            <BuildPath />
          </div>
          <div className={s.after} style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--ix-s-3) var(--ix-s-6)' }}>
            {build.links.map((l) => (
              <TextLink key={l.href} {...l} small />
            ))}
          </div>
        </div>
      </section>

      <Section id="roadmap" title={roadmap.title} lead={roadmap.lead}>
        <div data-reveal>
          <RoadmapV2 />
        </div>
        <div style={{ marginTop: 'var(--ix-s-6)', display: 'flex', flexWrap: 'wrap', gap: 'var(--ix-s-3) var(--ix-s-6)' }}>
          <DocLinks links={roadmap.links} small />
          <TextLink {...roadmap.history} small />
        </div>
      </Section>

      <div className={p.wrap}>
        <WhereNext />
      </div>
      <Chapters chapters={chapters} />
    </>
  );
}
