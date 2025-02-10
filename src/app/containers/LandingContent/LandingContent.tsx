import HeroSection from '@/app/containers/HeroSection/HeroSection';
import MetricsSection from '@/app/containers/MetricsSection/MetricsSection';
import { Fragment } from 'react';
import UseCases from '@/app/containers/UseCases/UseCases';
import GetInvolvedSection from '@/app/containers/GetInvolvedSection/GetInvolvedSection';
import EcosystemSection from '@/app/containers/EcosystemSection/EcosystemSection';
import TextElement from '@components/TextElement/TextElement';
import { useTranslations } from 'next-intl';
import Button from '@components/Button/Button';
import MyIcon from '@components/MyIcon/MyIcon';
import Partners from '@/app/containers/Partners/Partners';
import LandingFeaturesGrid from '@/app/containers/LandingFeaturesGrid/LandingFeaturesGrid';
import Chip from '@components/Chip/Chip';
import OpenSourceCard from '@components/OpenSourceCard/OpenSourceCard';

const LandingContent = () => {
  const t = useTranslations('LandingHero');

  return (
    <Fragment>
      <HeroSection
        chip={<Chip content={t('chip')} variant={'outlined'} />}
        title={<TextElement type={'display-lg'}>{t('title')}</TextElement>}
        subtitle={t('subtitle')}
        ctaContent={
          <>
            <Button leadingIcon={<MyIcon name={'EastRounded'} />}>
              {t('start')}
            </Button>
            <Button
              href={'https://www.google.com'}
              variant={'text'}
              leadingIcon={<MyIcon name={'EastRounded'} />}
            >
              {t('discover')}
            </Button>
          </>
        }
        splinePath={'/assets/spline/lines.spline'}
      />
      <OpenSourceCard />
      <LandingFeaturesGrid />
      <MetricsSection />
      <UseCases />
      <Partners />
      <EcosystemSection />
      <GetInvolvedSection />
    </Fragment>
  );
};

export default LandingContent;
