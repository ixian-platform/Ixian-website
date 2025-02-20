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
import { generateSEO } from '@utils/seo';
import Chip from '@components/Chip/Chip';
import { ixianGitHub, Routes, whitepaperLink } from '@utils/constants';

export async function generateMetadata() {
  return generateSEO({
    title:
      'Ixian Technology | Next-Generation Blockchain and Overlay DePIN Network',
    description:
      'Explore Ixian’s innovative dual-layer infrastructure, combining high-performance blockchain with a distributed overlay network for secure, scalable applications.',
    keywords: [
      'Ixian technology',
      'decentralized network',
      'Layer-1 blockchain',
      'DePIN',
      'decentralized infrastructure',
      'scalable blockchain',
      'proof-of-collaborative-work',
      'IoT blockchain',
      'secure data streaming',
      'decentralized communication',
      'Ixian DLT',
      'Ixian S2',
      '$IXI cryptocurrency',
    ],
  });
}

export default function Technology() {
  const t = useTranslations('TechnologyPage');

  return (
    <section className={classes.page}>
      <HeroSection
        sectionClassName={classes.techHero}
        chip={<Chip content={t('hero.chip')} variant={'outlined'} />}
        title={<TextElement type={'display-md'}>{t('hero.title')}</TextElement>}
        subtitle={t('hero.subtitle')}
        ctaContent={
          <>
            <Button
              href={whitepaperLink}
              isExternal
              leadingIcon={<MyIcon name={'DescriptionRounded'} />}
            >
              {t('hero.cta1')}
            </Button>
            <Button
              href={ixianGitHub}
              isExternal
              variant={'text'}
              leadingIcon={<MyIcon name={'GitHub'} />}
            >
              {t('hero.cta2')}
            </Button>
          </>
        }
      />
      <IxianDltSection />
      <S2NetworkSection />
      <GitSection />
      <IxiCurrency />
      <StartBuildingNow
        title={t('startBuilding.title')}
        subtitle={t('startBuilding.subtitle')}
        cta={
          <Button
            isInverse
            href={Routes.BUILD}
            variant={'outlined'}
            leadingIcon={<MyIcon name={'EastRounded'} />}
          >
            {t('startBuilding.cta')}
          </Button>
        }
      />
    </section>
  );
}
