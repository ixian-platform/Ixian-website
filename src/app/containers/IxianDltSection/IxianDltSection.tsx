import classes from './IxianDltSection.module.scss';
import InteractionCard from '@components/InteractionCard/InteractionCard';
import MyIcon from '@components/MyIcon/MyIcon';
import SectionHeader from '@components/SectionHeader/SectionHeader';
import TextElement from '@components/TextElement/TextElement';
import { useTranslations } from 'next-intl';
import Chip from '@components/Chip/Chip';
import ContentWrapper from '@components/ContentWrapper/ContentWrapper';
import NumberTicker from '@/components/ui/number-ticker';
import TypingAnimation from '@/components/ui/typing-animation';

const IxianDltSection = () => {
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
    </ContentWrapper>
  );
};

export default IxianDltSection;
