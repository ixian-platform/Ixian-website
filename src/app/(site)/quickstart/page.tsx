import { Metadata } from 'next';
import { pageMeta } from '@site/lib/seo';
import Quickstart from '@site/sections/QuickstartPage/Quickstart';
import { meta } from '@site/content/quickstart';

export const metadata: Metadata = pageMeta({ ...meta, path: '/quickstart', og: 'quickstart' });

export default function QuickstartPage() {
  return <Quickstart />;
}
