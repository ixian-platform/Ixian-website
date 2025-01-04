import classes from '../IxianDltSection/IxianDltSection.module.scss';
import ContentWrapper from '@components/ContentWrapper/ContentWrapper';
import { useTranslations } from 'next-intl';
import SectionHeader from '@components/SectionHeader/SectionHeader';
import Chip from '@components/Chip/Chip';
import TextElement from '@components/TextElement/TextElement';
import InteractionCard from '@components/InteractionCard/InteractionCard';
import MyIcon from '@components/MyIcon/MyIcon';
import NumberTicker from '@/components/ui/number-ticker';
import HighlightsSection from '@/app/containers/HighlightsSection/HighlightsSection';
import Button from '@components/Button/Button';

const s2HighlightsData = [
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
];

const S2NetworkSection = () => {
  const t = useTranslations();

  return (
    <ContentWrapper
      asWrapperSection
      sectionClass={classes.ixianDltSection}
      className={classes.ixianDltContainer}
    >
      <SectionHeader
        chipContainer={<Chip content={t('lorem')} variant={'primary'} />}
        title={<TextElement type={'heading-md'}>{t('lorem')}</TextElement>}
        subtitle={<TextElement type={'body-md'}>{t('lorem')}</TextElement>}
      />
      <div className={classes.infoItems}>
        <InteractionCard
          icon={<MyIcon name={'edit_audio'} rounded />}
          title={t('lorem')}
          description={t('lorem')}
          enableHover
        />
        <InteractionCard
          icon={<MyIcon name={'edit_audio'} rounded />}
          title={t('lorem')}
          description={t('lorem')}
          enableHover
        />
        <InteractionCard
          icon={<MyIcon name={'edit_audio'} rounded />}
          title={t('lorem')}
          description={t('lorem')}
          enableHover
        />
        <InteractionCard
          icon={<MyIcon name={'edit_audio'} rounded />}
          title={t('lorem')}
          description={t('lorem')}
          enableHover
        />
      </div>
      <div className={classes.dltMetrics}>
        <div className={classes.insideSingle}>
          <TextElement type={'heading-md'}>
            <NumberTicker value={0.005} className={classes.number} /> kwh
          </TextElement>
          <TextElement type={'body-md'}>{t('lorem')}</TextElement>
        </div>
        <div className={classes.insideSingle}>
          <TextElement type={'heading-md'}>
            <NumberTicker value={379} className={classes.number} />
          </TextElement>
          <TextElement type={'body-md'}>{t('lorem')}</TextElement>
        </div>
        <div className={classes.insideSingle}>
          <TextElement type={'heading-md'}>
            <NumberTicker value={0.002} className={classes.number} />*
          </TextElement>
          <TextElement type={'body-md'}>{t('lorem')}</TextElement>
        </div>
        <div className={classes.insideSingle}>
          <TextElement type={'heading-md'}>
            <NumberTicker value={233} className={classes.number} />
          </TextElement>
          <TextElement type={'body-md'}>{t('lorem')}</TextElement>
        </div>
      </div>
      <TextElement className={classes.note} type={'body-sm'}>
        {t('lorem')}
      </TextElement>
      <HighlightsSection
        highlightsClassName={classes.s2Highlights}
        highlightsData={s2HighlightsData}
        chipName={t('lorem')}
        title={t('lorem')}
        subtitle={t('lorem')}
        ctaContent={
          <Button
            variant={'outlined'}
            leadingIcon={<MyIcon name={'arrow_right_alt'} />}
          >
            {t('lorem')}
          </Button>
        }
      />
    </ContentWrapper>
  );
};

export default S2NetworkSection;
