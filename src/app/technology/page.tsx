import classes from '@/app/page.module.scss';
import Button from '@components/Button/Button';
import MyIcon from '@components/MyIcon/MyIcon';
import TextElement from '@components/TextElement/TextElement';
import HeroSection from '@/app/containers/HeroSection/HeroSection';
import { useTranslations } from 'next-intl';
import IxianDltSection from '@/app/containers/IxianDltSection/IxianDltSection';
import HighlightsSection from '@/app/containers/HighlightsSection/HighlightsSection';

export default function Technology() {
  const t = useTranslations();

  return (
    <section className={classes.page}>
      <HeroSection
        className={classes.techHero}
        title={<TextElement type={'display-md'}>{t('lorem')}</TextElement>}
        subtitle={t('lorem')}
        ctaContent={
          <>
            <Button leadingIcon={<MyIcon name={'two_pager'} />}>
              {t('lorem')}
            </Button>
            <Button variant={'text'} leadingIcon={<MyIcon name={'github'} />}>
              {t('lorem')}
            </Button>
          </>
        }
        splinePath={'/assets/spline/chips.spline'}
      />
      <IxianDltSection />
      <HighlightsSection />
    </section>
  );
}
