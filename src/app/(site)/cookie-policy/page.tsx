import { Metadata } from 'next';
import { pageMeta } from '@site/lib/seo';
import LegalPage from '@site/sections/Legal/LegalPage';
import doc from '@site/content/legal/cookies';

export const metadata: Metadata = pageMeta({
  title: 'Cookie policy | Ixian',
  description: 'The Ixian website sets no cookies. What it keeps in your browser, and how to choose whether blog images load from Medium.',
  path: '/cookie-policy',
  og: 'legal',
});

export default function Page() {
  return <LegalPage doc={doc} path="/cookie-policy" />;
}
