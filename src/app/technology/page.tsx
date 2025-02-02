import classes from '@/app/page.module.scss';
import Button from '@components/Button/Button';
import MyIcon from '@components/MyIcon/MyIcon';
import TextElement from '@components/TextElement/TextElement';
import HeroSection from '@/app/containers/HeroSection/HeroSection';
import { useTranslations } from 'next-intl';
import IxianDltSection from '@/app/containers/IxianDltSection/IxianDltSection';
import GitSection from '@/app/containers/GitSection/GitSection';
import StartBuildingNow from '@/app/containers/StartBuildingNow/StartBuildingNow';
import S2NetworkSection from '@/app/containers/S2NetworkSection/S2NetworkSection';
import IxiCurrency from '@/app/containers/IxiCurrency/IxiCurrency';

export default function Technology() {
  const t = useTranslations('TechnologyPage');

  return (
    <section className={classes.page}>
      <HeroSection
        className={classes.techHero}
        title={<TextElement type={'display-lg'}>{t('hero.title')}</TextElement>}
        subtitle={t('hero.subtitle')}
        ctaContent={
          <>
            <Button leadingIcon={<MyIcon name={'DescriptionRounded'} />}>
              {t('hero.cta1')}
            </Button>
            <Button variant={'text'} leadingIcon={<MyIcon name={'GitHub'} />}>
              {t('hero.cta2')}
            </Button>
          </>
        }
      />
      <IxianDltSection />
      <S2NetworkSection />
      <GitSection />
      <IxiCurrency />
      <StartBuildingNow />
    </section>
  );
}
