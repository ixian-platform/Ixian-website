import classes from './page.module.scss';
import LandingContent from '@/app/containers/LandingContent/LandingContent';
import { generateSEO } from '@utils/seo';

export async function generateMetadata() {
  return generateSEO({
    title: 'Ixian',
    description: '',
    keywords: [],
    image: '/',
    path: '/',
  });
}

export default function Home() {
  return (
    <main className={classes.page}>
      <LandingContent />
    </main>
  );
}
