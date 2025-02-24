import ContentWrapper from '@components/ContentWrapper/ContentWrapper';
import classes from './MetricsSection.module.scss';
import Chip from '@components/Chip/Chip';
import TextElement from '@components/TextElement/TextElement';
import Button from '@components/Button/Button';
import SectionHeader from '@components/SectionHeader/SectionHeader';
import { useTranslations } from 'next-intl';
import MyIcon from '@components/MyIcon/MyIcon';
import { Routes, whitepaperLink } from '@utils/constants';
import IxianPlatformMetrics from '@components/IxianPlatformMetrics/IxianPlatformMetrics';

const MetricsSection = () => {
  const t = useTranslations('Metrics');

  return (
    <ContentWrapper
      asWrapperSection
      className={classes.metrics}
      sectionClass={classes.metricsSection}
    >
      <SectionHeader
        chipContainer={<Chip content={t('chip')} variant={'outlined'} />}
        title={
          <TextElement type={'heading-lg'} as={'h1'}>
            {t('title')}
          </TextElement>
        }
        subtitle={
          <TextElement type={'body-lg'} as={'h1'}>
            {t('subtitle')}
          </TextElement>
        }
        ctaContent={
          <>
            <Button
              href={Routes.TECHNOLOGY}
              variant={'primary'}
              leadingIcon={<MyIcon name={'EastRounded'} />}
            >
              {t('howDoesItWork')}
            </Button>
            <Button
              href={whitepaperLink}
              isExternal
              variant={'text'}
              leadingIcon={<MyIcon name={'ArticleRounded'} />}
            >
              {t('readWhitepaper')}
            </Button>
          </>
        }
      />
      <IxianPlatformMetrics />
    </ContentWrapper>
  );
};

export default MetricsSection;
