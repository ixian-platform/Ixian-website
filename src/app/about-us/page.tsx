import classes from '@/app/page.module.scss';
import TextElement from '@components/TextElement/TextElement';
import Button from '@components/Button/Button';
import MyIcon from '@components/MyIcon/MyIcon';
import { useTranslations } from 'next-intl';
import Founders from '@/app/containers/Founders/Founders';
import Partnership from '@/app/containers/Partnership/Partnership';
import { ixianLinkedIn } from '@utils/constants';
import SectionHeader from '@components/SectionHeader/SectionHeader';
import { generateSEO } from '@utils/seo';
import { Metadata } from 'next';

export const metadata: Metadata = generateSEO({
  title: 'About Ixian | Advancing Decentralized Infrastructure',
  description:
    'Ixian is building a decentralized future where devices communicate securely, without central intermediaries.',
});

export default function AboutUsPage() {
  const t = useTranslations('AboutUsPage.hero');

  return (
    <section className={classes.page}>
      <div className={classes.aboutUsHero}>
        <SectionHeader
          className={classes.aboutUsHeroSectionHeader}
          centerAll
          title={<TextElement type={'display-md'}>{t('title')}</TextElement>}
          subtitle={<TextElement type={'body-md'}>{t('subtitle')}</TextElement>}
          ctaContent={
            <Button
              href={ixianLinkedIn}
              isExternal
              leadingIcon={<MyIcon name={'EastRounded'} />}
            >
              {t('cta')}
            </Button>
          }
        />
      </div>
      <Founders />
      <Partnership />
    </section>
  );
}
