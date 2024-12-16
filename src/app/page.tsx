import classes from './page.module.scss';
import LandingContent from '@/app/containers/LandingContent/LandingContent';

export default function Home() {
  // TODO: check all unused shadcn components and uninstall them
  return (
    <main className={classes.page}>
      <LandingContent />
    </main>
  );
}
