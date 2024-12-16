import HeroSection from '@/app/containers/HeroSection/HeroSection';
import MetricsSection from '@/app/containers/WhyIxianSection/MetricsSection';
import { Fragment } from 'react';
import FeaturesSection from '@/app/containers/FeaturesSection/FeaturesSection';
import UseCases from '@/app/containers/UseCases/UseCases';
import GetInvolvedSection from '@/app/containers/GetInvolvedSection/GetInvolvedSection';
import EcosystemSection from '@/app/containers/EcosystemSection/EcosystemSection';

const LandingContent = () => {
  return (
    <Fragment>
      <HeroSection />
      <FeaturesSection />
      <EcosystemSection />
      <MetricsSection />
      <UseCases />
      <GetInvolvedSection />
    </Fragment>
  );
};

export default LandingContent;
