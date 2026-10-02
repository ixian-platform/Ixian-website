import { Metadata } from 'next';
import { pageMeta } from '@site/lib/seo';
import p from '@site/components/page/page.module.css';
import SectionBoundary from '@site/components/SectionBoundary';
import Chapters from '@site/components/Chapters';
import EcoHero from '@site/sections/EcosystemPage/EcoHero';
import Spixi from '@site/sections/Spixi/Spixi';
import { ecoStage } from '@site/content/spixiStage';
import { spixi as homeSpixi } from '@site/content/homeV3';
import EcoProducts from '@site/sections/EcosystemPage/EcoProducts';
import EcoNodes from '@site/sections/EcosystemPage/EcoNodes';
import MiniAppsBand from '@site/sections/EcosystemPage/MiniAppsBand';
import TakePart from '@site/sections/EcosystemPage/TakePart';
import S2Backdrop from '@site/sections/PlatformPage/S2Backdrop';
import { meta, eco, holdIxi } from '@site/content/ecosystem';
import s from '@site/sections/EcosystemPage/Eco.module.css';

export const metadata: Metadata = pageMeta({ ...meta, path: '/get-involved', og: 'get-involved' });

// `#ixi-mining` is kept as an anchor: links.runNode and external links point to it.

const ecoSpixi = { ...homeSpixi, title: eco.spixi.title, body: 'Chat, call, send files and money, and open Mini Apps together, from games to controls for a lab or a smart home. You sign up with an address, not a phone number or email.' };

export default function EcosystemPage() {
  return (
    <>
      <header id="top" className={s.hero}>
        <div className={p.wrap}>
          <EcoHero />
        </div>
      </header>

      <Spixi content={ecoStage} copy={ecoSpixi} hideNodes />

      <section id="products" className={s.sec} aria-labelledby="products-title">
        <SectionBoundary />
        <div className={p.wrap}>
          <div className={s.intro}>
            <h2 id="products-title" className={s.title} data-reveal>
              {eco.products.title}
            </h2>
            <p className={s.introLead} data-reveal>
              {eco.products.lead}
            </p>
          </div>
          <div data-reveal>
            <EcoProducts />
          </div>
        </div>
      </section>

      <MiniAppsBand />


      <section id="ixi-mining" className={s.sec} aria-labelledby="nodes-title">
        <span id="run-a-node" aria-hidden />
        <S2Backdrop tone="green" />
        <SectionBoundary />
        <div className={p.wrap}>
          <div className={s.intro} data-split="invite">
            <h2 id="nodes-title" className={s.title} data-reveal>
              {eco.nodes.title}
            </h2>
            <p className={s.introLead} data-reveal>
              {eco.nodes.lead}
            </p>
          </div>
          <div data-reveal>
            <EcoNodes />
          </div>
          <div className={s.hold} data-reveal>
            <div className={s.holdHead}>
              <h3>{holdIxi.title}</h3>
              <p>{holdIxi.lead}</p>
            </div>
            <ul className={s.holdList}>
              {holdIxi.items.map((h) => {
                const inner = (
                  <>
                    <span className={s.holdKind}>{h.kind}</span>
                    <b>{h.label}</b>
                    <span className={s.holdBody}>{h.body}</span>
                    <span className={s.holdCta}>
                      {h.cta}
                      {h.href && ' ↗'}
                    </span>
                  </>
                );
                return (
                  <li key={h.label}>
                    {h.href ? (
                      <a href={h.href} target="_blank" rel="noreferrer">
                        {inner}
                      </a>
                    ) : (
                      <div data-soon>{inner}</div>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </section>

      <section id="take-part" className={s.sec} aria-labelledby="part-title">
        <SectionBoundary />
        <div className={p.wrap}>
          <div className={s.intro}>
            <h2 id="part-title" className={s.title} data-reveal>
              {eco.part.title}
            </h2>
            <p className={s.introLead} data-reveal>
              {eco.part.lead}
            </p>
          </div>
          <div data-reveal>
            <TakePart />
          </div>
        </div>
      </section>

      <Chapters chapters={eco.chapters} />
    </>
  );
}
