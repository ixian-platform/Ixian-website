import classes from './HeroSection.module.scss';
import ContentWrapper from '@components/ContentWrapper/ContentWrapper';
import Button from '@components/Button/Button';
import { useTranslations } from 'next-intl';
import SectionHeader from '@components/SectionHeader/SectionHeader';
import TextElement from '@components/TextElement/TextElement';
import Icon from '@components/Icon/Icon';
import Spline from '@splinetool/react-spline/next';

const HeroSection = () => {
  const t = useTranslations();

  return (
    <ContentWrapper
      wrapperSection
      sectionClass={classes.wrapperSection}
      className={classes.heroSection}
    >
      <SectionHeader
        enableSlideUp
        className={classes.customSectionHeader}
        chipContainer={
          <TextElement type={'label-lg'}>{t('lorem')}</TextElement>
        }
        title={<TextElement type={'display-lg'}>{t('lorem')}</TextElement>}
        subtitle={<TextElement type={'body-md'}>{t('lorem')}</TextElement>}
        ctaContent={
          <>
            <Button
              leadingIcon={
                <Icon iconName={'arrow_right_alt'} variant={'secondary'} />
              }
            >
              {t('lorem')}
            </Button>
            <Button variant={'text'} leadingIcon={<Icon iconName={'bolt'} />}>
              {t('lorem')}
            </Button>
          </>
        }
      />
      <Spline
        scene="/assets/spline/chips.spline"
        className={classes.chipsSpline}
      />
    </ContentWrapper>
  );
};

export default HeroSection;
