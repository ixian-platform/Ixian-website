import classes from './page.module.scss';
import LandingContent from '@/app/containers/LandingContent/LandingContent';

export default function Home() {
  return (
    <main className={classes.page}>
      <LandingContent />
    </main>
  );
}
