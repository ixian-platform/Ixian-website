import classes from '@/app/page.module.scss';
import HeroSection from '@/app/containers/HeroSection/HeroSection';
import TextElement from '@components/TextElement/TextElement';
import Button from '@components/Button/Button';
import MyIcon from '@components/MyIcon/MyIcon';
import { useTranslations } from 'next-intl';
import WhyIxian from '@/app/containers/WhyIxian/WhyIxian';
import StartBuildingNow from '@/app/containers/StartBuildingNow/StartBuildingNow';
import { generateSEO } from '@utils/seo';
import { ixidocs } from '@utils/constants';
import Image from 'next/image';
import buildHeroImage from '@assets/other/build-hero.png';

export async function generateMetadata() {
  return generateSEO({
    title: 'Build on Ixian | Scalable, Secure & Cost-Effective Development',
    description:
      'Leverage Ixian’s scalable and secure DLT and overlay networks. Access documentation, API guides, and GitHub resources to start building today.',
    keywords: [
      'Build on Ixian',
      'decentralized development',
      'secure blockchain applications',
      'scalable blockchain',
      'trustless communication',
      'end-to-end security',
      'easy blockchain integration',
      'minimal infrastructure costs',
      'high-performance blockchain',
      'DePIN development',
      'Ixian platform',
      '$IXI incentives',
    ],
  });
}

export default function Build() {
  const t = useTranslations('BuildPage.hero');

  return (
    <section className={classes.page}>
      <HeroSection
        sectionClassName={classes.techHero}
        title={<TextElement type={'display-md'}>{t('title')}</TextElement>}
        subtitle={t('subtitle')}
        ctaContent={
          <Button
            href={ixidocs}
            isExternal
            leadingIcon={<MyIcon name={'EastRounded'} />}
          >
            {t('cta')}
          </Button>
        }
        leftContainer={
          <Image src={buildHeroImage} alt={'code'} priority width={600} />
        }
      />
      <WhyIxian />
      <StartBuildingNow
        title={t('readyToBuild')}
        subtitle={t('readyToBuildSubtitle')}
        cta={
          <Button
            variant={'outlined'}
            isInverse
            href={ixidocs}
            isExternal
            leadingIcon={<MyIcon name={'EastRounded'} />}
          >
            {t('getStarted')}
          </Button>
        }
      />
    </section>
  );
}
