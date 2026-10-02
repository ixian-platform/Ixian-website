import { Metadata } from 'next';
import { pageMeta } from '@site/lib/seo';
import { PageHero, Section, Btn, TextLink } from '@site/components/page/kit';
import p from '@site/components/page/page.module.css';
import Session from '@site/sections/DevelopersPage/Session';
import Faq from '@site/components/page/Faq';
import Chapters from '@site/components/Chapters';
import Quickstarts from '@site/sections/DevelopersPage/Quickstarts';
import NotBuilt from '@site/sections/DevelopersPage/NotBuilt';
import Langs from '@site/sections/DevelopersPage/Langs';
import QuixiFlow from '@site/sections/DevelopersPage/QuixiFlow';
import GuideRows from '@site/sections/DevelopersPage/GuideRows';
import WhereNext from '@site/sections/PlatformPage/WhereNext';
import { meta, hero, heroV2, notBuilt, langs, quickstarts, guides, quixi, resources, faq, chapters } from '@site/content/developers';
import { links } from '@site/content/links';
import s from '@site/sections/DevelopersPage/Dev2.module.css';
import d from '@site/sections/DevelopersPage/DevelopersPage.module.css';

export const metadata: Metadata = pageMeta({ ...meta, path: '/build', og: 'build' });

const NEXT = [
  { label: 'See how it works', href: links.platform, body: 'How the DLT, S2 and the security model work.', tone: 's2', glyph: 'docs' },
  { label: 'The ecosystem', href: links.ecosystem, body: 'Spixi, Mini Apps, QuIXI, nodes and the community.', tone: 'dlt', glyph: 'node' },
  { label: 'Work with IXI Labs', href: links.ixiLabs, body: 'Integration, support or a custom build from the core maintainer.', tone: 'build', glyph: 'build' },
];

export default function DevelopersPage() {
  return (
    <>
      <PageHero title={hero.title} lead={hero.lead} actions={heroV2.actions} index={hero.index} wide aside={<Session copy={hero.session} />} />

      <Section id="paths" title={notBuilt.title} lead={notBuilt.lead}>
        <NotBuilt />
      </Section>

      <Section id="languages" split="4-8" title={langs.title} lead={langs.lead}>
        <div data-reveal>
          <Langs />
        </div>
      </Section>

      <Section id="quickstarts" split="4-8" tone="stage" title={quickstarts.title} lead={quickstarts.lead}>
        <div data-reveal>
          <Quickstarts items={quickstarts.items} labels={quickstarts} />
        </div>
      </Section>

      <Section id="quixi" title={quixi.title} lead={quixi.lead}>
        <div data-reveal>
          <QuixiFlow />
        </div>
        <p className={d.topics}>
          {quixi.topicsLabel}
          {quixi.topics.map((t) => (
            <code key={t}>{t}</code>
          ))}
        </p>
      </Section>

      <Section id="guides" title={guides.title} lead={guides.lead}>
        <div data-reveal>
          <GuideRows />
        </div>
        <div style={{ marginTop: 'var(--ix-s-5)' }}>
          <TextLink {...guides.all} small />
        </div>
      </Section>

      <Section id="resources" title={resources.title} lead={resources.lead}>
        <ul className={s.res} data-reveal>
          {resources.items.map((r) => (
            <li key={r.href}>
              <a href={r.href} target="_blank" rel="noreferrer">
                <b>
                  {r.name} <i aria-hidden>↗</i>
                </b>
                <span>{r.body}</span>
              </a>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="faq" split="4-8" title={faq.title}>
        <div className={d.faqGrid}>
          <div className={d.faqAside}>
            <Btn {...faq.help} kind="secondary" />
            <TextLink {...faq.issues} small />
          </div>
          <div data-reveal>
            <Faq items={faq.items} />
          </div>
        </div>
      </Section>

      <div className={p.wrap}>
        <WhereNext items={NEXT} />
      </div>
      <Chapters chapters={chapters} />
    </>
  );
}
