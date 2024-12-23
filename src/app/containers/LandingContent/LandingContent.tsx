import HeroSection from '@/app/containers/HeroSection/HeroSection';
import MetricsSection from '@/app/containers/MetricsSection/MetricsSection';
import { Fragment } from 'react';
import FeaturesSection from '@/app/containers/FeaturesSection/FeaturesSection';
import UseCases from '@/app/containers/UseCases/UseCases';
import GetInvolvedSection from '@/app/containers/GetInvolvedSection/GetInvolvedSection';
import EcosystemSection from '@/app/containers/EcosystemSection/EcosystemSection';
import TextElement from '@components/TextElement/TextElement';
import { useTranslations } from 'next-intl';
import Button from '@components/Button/Button';
import MyIcon from '@components/MyIcon/MyIcon';

const LandingContent = () => {
  const t = useTranslations();

  return (
    <Fragment>
      <HeroSection
        title={<TextElement type={'display-lg'}>{t('lorem')}</TextElement>}
        subtitle={t('lorem')}
        ctaContent={
          <>
            <Button leadingIcon={<MyIcon name={'arrow_right_alt'} />}>
              {t('lorem')}
            </Button>
            <Button variant={'text'} leadingIcon={<MyIcon name={'charger'} />}>
              {t('lorem')}
            </Button>
          </>
        }
        splinePath={'/assets/spline/chips.spline'}
        chip={<TextElement type={'label-lg'}>{t('lorem')}</TextElement>}
      />
      <FeaturesSection />
      <EcosystemSection />
      <MetricsSection />
      <UseCases />
      <GetInvolvedSection />
    </Fragment>
  );
};

export default LandingContent;
