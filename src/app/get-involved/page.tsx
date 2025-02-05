import classes from '@/app/page.module.scss';
import TextElement from '@components/TextElement/TextElement';
import HeroSection from '@/app/containers/HeroSection/HeroSection';
import { useTranslations } from 'next-intl';
import EcoGetInvolved from '@/app/containers/EcoGetInvolved/EcoGetInvolved';
import PoweringIxian from '@/app/containers/PoweringIxian/PoweringIxian';
import Contribute from '@/app/containers/Contribute/Contribute';

export default function EcosystemGetInvolved() {
  const t = useTranslations('EcosystemPage.hero');
  return (
    <section className={classes.page}>
      <HeroSection
        className={classes.techHero}
        title={<TextElement type={'display-md'}>{t('title')}</TextElement>}
        subtitle={t('subtitle')}
      />
      <EcoGetInvolved />
      <PoweringIxian />
      <Contribute />
    </section>
  );
}
