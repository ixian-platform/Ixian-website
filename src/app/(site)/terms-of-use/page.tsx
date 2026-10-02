import { Metadata } from 'next';
import { pageMeta } from '@site/lib/seo';
import LegalPage from '@site/sections/Legal/LegalPage';
import doc from '@site/content/legal/terms';

export const metadata: Metadata = pageMeta({
  title: 'Terms of use | Ixian',
  description: 'The terms that apply when you use the Ixian website, its live network data, in-browser demos and code samples.',
  path: '/terms-of-use',
  og: 'legal',
});

export default function Page() {
  return <LegalPage doc={doc} path="/terms-of-use" />;
}
