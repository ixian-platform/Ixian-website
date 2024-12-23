import classes from './HighlightsSection.module.scss';
import ContentWrapper from '@components/ContentWrapper/ContentWrapper';
import TextElement from '@components/TextElement/TextElement';
import Button from '@components/Button/Button';
import MyIcon from '@components/MyIcon/MyIcon';
import Chip from '@components/Chip/Chip';
import SectionHeader from '@components/SectionHeader/SectionHeader';
import { useTranslations } from 'next-intl';

const highlightsData = [
  {
    icon: 'ixian_logo',
    title: 'lorem',
    description: 'lorem',
  },
  {
    icon: 'avg_pace',
    title: 'lorem',
    description: 'lorem',
  },
  {
    icon: 'widgets',
    title: 'lorem',
    description: 'lorem',
  },
  {
    icon: 'all_match',
    title: 'lorem',
    description: 'lorem',
  },
  {
    icon: 'compare_arrows',
    title: 'lorem',
    description: 'lorem',
  },
  {
    icon: 'call_split',
    title: 'lorem',
    description: 'lorem',
  },
];

const HighlightsSection = () => {
  const t = useTranslations();

  return (
    <ContentWrapper
      asWrapperSection
      sectionClass={classes.highlightsSection}
      className={classes.highlightsContainer}
    >
      <div className={classes.wrapper}>
        <SectionHeader
          title={
            <TextElement type={'heading-md'} as={'h1'}>
              {t('lorem')}
            </TextElement>
          }
          subtitle={
            <TextElement type={'body-md'} as={'h1'}>
              {t('lorem')}
            </TextElement>
          }
          ctaContent={
            <Button
              variant={'outlined'}
              leadingIcon={<MyIcon name={'arrow_right_alt'} />}
            >
              {t('lorem')}
            </Button>
          }
          chipContainer={<Chip content={t('lorem')} variant={'outlined'} />}
        />
        <div className={classes.highlightsInfo}>
          {highlightsData.map((info, index) => (
            <div key={index} className={classes.singleInfo}>
              <MyIcon name={info.icon} rounded />
              <div>
                <TextElement type={'heading-xs'}>{t(info.title)}</TextElement>
                <TextElement type={'body-sm'}>
                  {t(info.description)}
                </TextElement>
              </div>
            </div>
          ))}
        </div>
      </div>
    </ContentWrapper>
  );
};

export default HighlightsSection;
