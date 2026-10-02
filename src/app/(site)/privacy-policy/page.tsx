import { Metadata } from 'next';
import { pageMeta } from '@site/lib/seo';
import LegalPage from '@site/sections/Legal/LegalPage';
import doc from '@site/content/legal/privacy';

export const metadata: Metadata = pageMeta({
  title: 'Privacy policy | Ixian',
  description: 'How the Ixian website handles personal data: no accounts, no analytics, no tracking, and what little is processed to deliver the site.',
  path: '/privacy-policy',
  og: 'legal',
});

export default function Page() {
  return <LegalPage doc={doc} path="/privacy-policy" />;
}
