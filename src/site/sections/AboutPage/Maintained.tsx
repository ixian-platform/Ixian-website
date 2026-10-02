'use client';

import SectionBoundary from '@site/components/SectionBoundary';
import Keepers from './Keepers';
import Contours from './Contours';
import p from '@site/components/page/page.module.css';
import s from './About2.module.css';

export default function Maintained({ title, lead }: { title: string; lead: string }) {
  return (
    <section id="maintainers" className={`${p.section} ${s.warm}`} aria-labelledby="maintainers-title">
      <Contours />
      <SectionBoundary />
      <div className={p.wrap}>
        <div className={s.warmCol}>
          <h2 id="maintainers-title" className={p.title} data-reveal data-reveal-delay="0.24">
            {title}
          </h2>
          <p className={`${p.lead} ${s.warmLead}`} data-reveal>
            {lead}
          </p>
          <div data-reveal>
            <Keepers drawing={false} />
          </div>
        </div>
      </div>
    </section>
  );
}
