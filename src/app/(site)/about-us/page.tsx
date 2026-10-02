import { Metadata } from 'next';
import { pageMeta } from '@site/lib/seo';
import { PageIndex, Section, DocLinks, TextLink } from '@site/components/page/kit';
import p from '@site/components/page/page.module.css';
import Chapters from '@site/components/Chapters';
import Labs from '@site/sections/Labs/Labs';
import HistoryScroll from '@site/sections/AboutPage/HistoryScroll';
import GridRise from '@site/sections/AboutPage/GridRise';
import Maintained from '@site/sections/AboutPage/Maintained';
import Pipeline from '@site/sections/AboutPage/Pipeline';
import { meta, hero, mission, history, maintainers, decisions, builtOn, labs, chapters } from '@site/content/about';
import s from '@site/sections/AboutPage/About2.module.css';
import { Fingerprint } from '@site/components/flat/Flat';

export const metadata: Metadata = pageMeta({ ...meta, path: '/about-us', og: 'about-us' });

/* Mission point drawings */
const Card = ({ x, seed }: { x: number; seed: number }) => (
  <g>
    <rect x={x - 4} y={14} width={44} height={36} rx={9} data-tray />
    <rect x={x} y={18} width={36} height={28} rx={6} data-card />
    <Fingerprint x={x + 10} y={24} seed={seed} n={3} cell={4.4} gap={1} pad={0} bare dim />
  </g>
);
const GLYPH: Record<string, React.ReactNode> = {
  Direct: (
    <svg viewBox="0 0 160 64" aria-hidden>
      <path d="M40 32 H120" data-wire />
      <rect x={62} y={2} width={36} height={16} rx={4} data-ghost />
      <path d="M58 20 L102 0" data-strike />
      <rect x={75} y={29} width={10} height={6} rx={2} data-packet />
      <Card x={4} seed={5} />
      <Card x={120} seed={17} />
    </svg>
  ),
  'Private by design': (
    <svg viewBox="0 0 160 64" aria-hidden>
      <path d="M40 32 H120" data-wire />
      <rect x={71} y={25} width={18} height={14} rx={4} data-lockbg />
      <path d="M75.5 31.5h9v6h-9zM77.5 31.5v-2.2a2.5 2.5 0 0 1 5 0v2.2" data-lock />
      {[48, 54, 60, 98, 104, 110].map((x) => (
        <rect key={x} x={x} y={30.5} width={3} height={3} rx={0.8} data-bit />
      ))}
      <Card x={4} seed={5} />
      <Card x={120} seed={17} />
    </svg>
  ),
  'Run by its users': (
    <svg viewBox="0 0 160 64" aria-hidden>
      <circle cx={32} cy={32} r={24} data-wire />
      {Array.from({ length: 10 }, (_, i) => {
        const a = (i / 10) * Math.PI * 2 - Math.PI / 2;
        const x = Math.round((32 + 24 * Math.cos(a)) * 100) / 100;
        const y = Math.round((32 + 24 * Math.sin(a)) * 100) / 100;
        return i === 3 ? <rect key={i} x={x - 5} y={y - 5} width={10} height={10} rx={2.5} data-you /> : <rect key={i} x={x - 3.5} y={y - 3.5} width={7} height={7} rx={2} data-node />;
      })}
      <text x={50} y={10} data-label>
        YOU
      </text>
    </svg>
  ),
};

/* Built on Ixian: one drawing per project */
const BUILT: Record<string, React.ReactNode> = {
  Spixi: (
    <svg viewBox="0 0 96 40" aria-hidden>
      <rect x={2} y={1} width={26} height={38} rx={6} data-card />
      <rect x={7} y={9} width={13} height={5} rx={2} data-bar />
      <rect x={11} y={17} width={12} height={5} rx={2} data-hi />
      <rect x={7} y={25} width={10} height={5} rx={2} data-bar />
      <path d="M28 20 H56" data-wire />
      <rect x={56} y={6} width={28} height={28} rx={6} data-card />
      <Fingerprint x={61.5} y={11.5} seed={5} n={3} cell={4.8} gap={1.2} pad={0} bare dim />
    </svg>
  ),
  'Spixi Mini Apps': (
    <svg viewBox="0 0 96 40" aria-hidden>
      <rect x={2} y={1} width={26} height={38} rx={6} data-card />
      <rect x={68} y={1} width={26} height={38} rx={6} data-card />
      {[0, 1].map((p) =>
        [0, 1, 2, 3].map((c) => <rect key={`${p}${c}`} x={7 + p * 66 + (c % 2) * 9} y={11 + Math.floor(c / 2) * 9} width={7} height={7} rx={1.5} data-cell={c === 1 || undefined} data-slot={c !== 1 || undefined} />)
      )}
      <path d="M28 20 H68" data-dash />
      <rect x={43} y={17} width={10} height={6} rx={2} data-hi />
    </svg>
  ),
  QuIXI: (
    <svg viewBox="0 0 96 40" aria-hidden>
      {[5, 17, 29].map((y) => (
        <rect key={y} x={2} y={y} width={22} height={7} rx={2} data-card />
      ))}
      <path d="M24 8.5 H32 V20 H44 M24 20.5 H44 M24 32.5 H32 V20" data-wire />
      <rect x={44} y={4} width={34} height={32} rx={7} data-card data-key />
      <Fingerprint x={51} y={10.5} seed={7} n={5} cell={3.2} gap={0.8} pad={0} bare dim />
      <path d="M78 20 H94" data-wire />
    </svg>
  ),
  ixiscope: (
    <svg viewBox="0 0 96 40" aria-hidden>
      {[0, 1, 2, 3, 4].map((i) => (
        <rect key={i} x={2 + i * 14} y={14} width={11} height={11} rx={2.5} data-card data-hi={i === 4 || undefined} />
      ))}
      <circle cx={80} cy={17} r={10} data-wire />
      <path d="M87 24 L93 30" data-wire />
    </svg>
  ),
};

export default function AboutPage() {
  return (
    <>
      <header id="top" className={s.hero}>
        <GridRise />
        <div className={`${p.wrap} ${s.heroText}`}>
          <p className={s.eyebrow}>{hero.eyebrow}</p>
          <h1 className={s.h1}>{hero.title}</h1>
          <p className={s.lead}>{hero.lead}</p>
        </div>
        <div className={`${p.wrap} ${s.heroIndex}`}>
          <PageIndex index={hero.index} />
        </div>
      </header>

      <Section id="mission" labelledBy="mission-title">
        <h2 id="mission-title" className={s.statement} data-reveal>
          <span className="ix-sr">{mission.title} </span>
          {mission.statement[0]} <span>{mission.statement[1]}</span>
        </h2>
        <ul className={s.points} data-reveal>
          {mission.points.map((pt) => (
            <li key={pt.title}>
              {GLYPH[pt.title]}
              <h3>{pt.title}</h3>
              <p>{pt.body}</p>
            </li>
          ))}
        </ul>
      </Section>

      <HistoryScroll copy={history} />

      <Maintained title={maintainers.title} lead={maintainers.lead} />

      <Section id="decisions" title={decisions.title} lead={decisions.lead}>
        <div data-reveal>
          <Pipeline />
        </div>
        <div style={{ marginTop: 'var(--ix-s-7)' }}>
          <DocLinks links={decisions.links} small />
        </div>
      </Section>

      <Section id="built-on-ixian" title={builtOn.title} lead={builtOn.lead}>
        <ul className={s.built} data-reveal>
          {builtOn.items.map((b) => (
            <li key={b.name}>
              <a href={b.href} target="_blank" rel="noreferrer">
                {BUILT[b.name]}
                <b>
                  {b.name} <i aria-hidden>↗</i>
                </b>
                <span>{b.body}</span>
              </a>
            </li>
          ))}
        </ul>
        <div style={{ marginTop: 'var(--ix-s-5)' }}>
          <TextLink {...builtOn.cta} small />
        </div>
      </Section>

      <Labs copy={labs} id="partner" />
      <Chapters chapters={chapters} />
    </>
  );
}
