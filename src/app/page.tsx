import classes from './page.module.scss';
import LandingContent from '@/app/containers/LandingContent/LandingContent';
import { generateSEO } from '@utils/seo';

export async function generateMetadata() {
  return generateSEO({
    title: 'Ixian | Decentralized Data Streaming Platform',
    description:
      'Bringing together a world of devices with secure, seamless, and reliable connections. Allowing you to cut costs, enhance security, and confidently deploy products and services at scale.',
  });
}

export default async function Home() {
  return (
    <main className={classes.page}>
      <LandingContent />
    </main>
  );
}
