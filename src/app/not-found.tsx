import type { Metadata } from 'next';
import '@site/styles/tokens.css';
import '@site/styles/base.css';
import Nav from '@site/components/Nav';
import Footer from '@site/components/Footer';
import { PageHero } from '@site/components/page/kit';
import NotFoundTrace from '@site/sections/NotFound/NotFoundTrace';
import { notFound as c } from '@site/content/notFound';

export const metadata: Metadata = { title: 'Page not found | Ixian', robots: { index: false } };

export default function NotFound() {
  return (
    <div className="ix">
      <Nav />
      <main id="main" style={{ minHeight: '70vh' }}>
        <PageHero title={c.title} lead={c.lead} actions={c.actions} aside={<NotFoundTrace />} />
      </main>
      <Footer />
    </div>
  );
}
