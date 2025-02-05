import classes from '@/app/page.module.scss';
import TextElement from '@components/TextElement/TextElement';
import Button from '@components/Button/Button';
import MyIcon from '@components/MyIcon/MyIcon';
import HeroSection from '@/app/containers/HeroSection/HeroSection';
import { useTranslations } from 'next-intl';
import Founders from '@/app/containers/Founders/Founders';
import Partnership from '@/app/containers/Partnership/Partnership';

export default function AboutUsPage() {
  const t = useTranslations('AboutUsPage.hero');

  return (
    <section className={classes.page}>
      <HeroSection
        className={classes.techHero}
        title={<TextElement type={'display-md'}>{t('title')}</TextElement>}
        subtitle={t('subtitle')}
        ctaContent={
          <Button leadingIcon={<MyIcon name={'EastRounded'} />}>
            {t('cta')}
          </Button>
        }
      />
      <Founders />
      <Partnership />
    </section>
  );
}
