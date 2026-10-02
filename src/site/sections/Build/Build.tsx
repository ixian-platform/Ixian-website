'use client';

import { useEffect, useRef } from 'react';
import { build, buildMedia } from '@site/content/homeV3';
import Icon from '@site/components/Icon';
import AgentVisual from './visuals/AgentVisual';
import DevicesVisual from './visuals/DevicesVisual';
import MiniAppVisual from './visuals/MiniAppVisual';
import PaidVisual from './visuals/PaidVisual';
import SectionBoundary from '@site/components/SectionBoundary';
import s from './Build.module.css';

/** Tiles drawn in code; an image in buildMedia wins over these. */
const DRAWN: Record<string, () => React.JSX.Element> = {
  agents: AgentVisual,
  devices: DevicesVisual,
  miniapps: MiniAppVisual,
  paid: PaidVisual,
};

export default function Build() {
  return (
    <section id="build" className={s.build} aria-labelledby="build-title">
      <SectionBoundary />
      <div className={s.wrap}>
        <header className={s.intro}>
          <h2 id="build-title" className={s.title} data-reveal data-reveal-delay="0.24">
            {build.title}
          </h2>
          <p className={s.lead} data-reveal>
            {build.lead}
          </p>
        </header>

        <ul className={s.grid} data-reveal data-reveal-delay="0.32">
          {build.tiles.map((t) => (
            <Tile key={t.id} tile={t} />
          ))}
        </ul>

        <div className={s.cta} data-reveal>
          <a className={s.ctaBtn} href={build.cta.href} data-outline="" data-arrow="right">
            {build.cta.label}
            <Icon name="arrow" size={16} />
          </a>
          <a className={s.guide} href={build.more.href} target="_blank" rel="noreferrer">
            {build.more.label}
            <Icon name="external" size={14} />
          </a>
        </div>
      </div>
    </section>
  );
}

type TileData = (typeof build.tiles)[number] & { note?: string };

function Tile({ tile }: { tile: TileData }) {
  const media = buildMedia[tile.id];
  const Drawn = DRAWN[tile.id];
  const li = useRef<HTMLLIElement>(null);

  // touch screens have no hover: the tile colours (and plays once) while it is well in view
  useEffect(() => {
    const el = li.current;
    if (!el || !window.matchMedia('(hover: none)').matches) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          if (!el.hasAttribute('data-lit')) el.dispatchEvent(new Event('ix-play'));
          el.setAttribute('data-lit', '');
        } else el.removeAttribute('data-lit');
      },
      { threshold: 0.6 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <li ref={li} className={`${s.tile} ix-build-tile`}>
      <figure className={s.media}>
        {media ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={media.src} alt={media.alt} loading="lazy" decoding="async" />
        ) : Drawn ? (
          <Drawn />
        ) : (
          <figcaption className={s.slot}>
            <span>Product still</span>
            <span>{tile.title}</span>
          </figcaption>
        )}
      </figure>

      <div className={s.body}>
        <h3 className={s.tileTitle}>{tile.title}</h3>
        <p className={s.text}>{tile.body}</p>
        {tile.note && <p className={s.note}>{tile.note}</p>}

        <div className={s.actions}>
          <a className={s.guide} href={tile.guide.href} target="_blank" rel="noreferrer">
            {tile.guide.label}
            <Icon name="external" size={14} />
          </a>
        </div>
      </div>

    </li>
  );
}
