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
import { Routes } from '@utils/constants';
import ParticlesSpline from '@components/ParticlesSpline/ParticlesSpline';

const LandingContent = () => {
  const t = useTranslations('LandingHero');

  return (
    <Fragment>
      <HeroSection
        className={'landingHeroContainer'}
        isCentered
        chip={<Chip content={t('chip')} variant={'outlined'} />}
        title={<TextElement type={'display-lg'}>{t('title')}</TextElement>}
        subtitle={t('subtitle')}
        ctaContent={
          <>
            <Button
              href={Routes.BUILD}
              leadingIcon={<MyIcon name={'EastRounded'} />}
            >
              {t('start')}
            </Button>
            <Button
              href={Routes.TECHNOLOGY}
              variant={'text'}
              leadingIcon={<MyIcon name={'EastRounded'} />}
            >
              {t('discover')}
            </Button>
          </>
        }
        leftContainer={<ParticlesSpline />}
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
