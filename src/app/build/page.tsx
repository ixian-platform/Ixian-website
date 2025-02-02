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

export default function Build() {
  const t = useTranslations();

  return (
    <section className={classes.page}>
      <HeroSection
        className={classes.techHero}
        title={<TextElement type={'display-md'}>{t('lorem')}</TextElement>}
        subtitle={t('lorem')}
        ctaContent={
          <>
            <Button leadingIcon={<MyIcon name={'Home'} />}>{t('lorem')}</Button>
            <Button variant={'text'} leadingIcon={<MyIcon name={'Home'} />}>
              {t('lorem')}
            </Button>
          </>
        }
        leftContainer={<Image src={code1} alt={'code1'} />}
      />
      <WhyIxian />
      <Faq />
    </section>
  );
}
