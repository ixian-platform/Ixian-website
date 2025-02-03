import classes from '@/app/page.module.scss';
import HeroSection from '@/app/containers/HeroSection/HeroSection';
import TextElement from '@components/TextElement/TextElement';
import Button from '@components/Button/Button';
import MyIcon from '@components/MyIcon/MyIcon';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import code1 from '@assets/code1.svg';
import WhyIxian from '@/app/containers/WhyIxian/WhyIxian';
import Faq from '@/app/containers/Faq/Faq';
import StartBuildingNow from '@/app/containers/StartBuildingNow/StartBuildingNow';
import { generateSEO } from '@utils/seo';

export async function generateMetadata() {
  return generateSEO({
    title: 'Ixian Build',
    description: 'Build with Ixian',
    keywords: [],
    image: '/',
    path: '/',
  });
}

export default function Build() {
  const t = useTranslations('BuildPage.hero');

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
        leftContainer={<Image src={code1} alt={'code1'} />}
      />
      <WhyIxian />
      <Faq />
      <StartBuildingNow
        title={t('readyToBuild')}
        subtitle={t('readyToBuildSubtitle')}
        cta={
          <Button
            variant={'outlined-2'}
            leadingIcon={<MyIcon name={'EastRounded'} />}
          >
            {t('getStarted')}
          </Button>
        }
      />
    </section>
  );
}
