import classes from './IxianDltSection.module.scss';
import InteractionCard from '@components/InteractionCard/InteractionCard';
import MyIcon from '@components/MyIcon/MyIcon';
import SectionHeader from '@components/SectionHeader/SectionHeader';
import TextElement from '@components/TextElement/TextElement';
import { useTranslations } from 'next-intl';
import Chip from '@components/Chip/Chip';
import ContentWrapper from '@components/ContentWrapper/ContentWrapper';
import Button from '@components/Button/Button';
import { getServerTranslations } from '@utils/getServerTranslations';
import { Section, startDlt } from '@utils/constants';
import { SingleData } from '@components/CharacteristicsLayout/CharacteristicsLayout';
import classNames from 'classnames';

const st = await getServerTranslations();

const dltHighlightsData: SingleData[] = [
  {
    icon: 'AppRegistrationRounded',
    title: st('TechnologyPage.ixianDlt.highlights.data1.title'),
    description: st('TechnologyPage.ixianDlt.highlights.data1.subtitle'),
  },
  {
    icon: 'TrackChangesRounded',
    title: st('TechnologyPage.ixianDlt.highlights.data2.title'),
    description: st('TechnologyPage.ixianDlt.highlights.data2.subtitle'),
  },
  {
    icon: 'AnimationRounded',
    title: st('TechnologyPage.ixianDlt.highlights.data3.title'),
    description: st('TechnologyPage.ixianDlt.highlights.data3.subtitle'),
  },
];

const IxianDltSection = () => {
  const t = useTranslations('TechnologyPage.ixianDlt');

  return (
    <ContentWrapper
      asWrapperSection
      sectionClass={classes.ixianDltSection}
      className={classNames(classes.ixianDltContainer, classes.customDlt)}
      sectionId={Section.IXIAN_DLT}
    >
      <SectionHeader
        chipContainer={<Chip content={t('chip')} variant={'outlined'} />}
        title={<TextElement type={'heading-lg'}>{t('title')}</TextElement>}
        subtitle={<TextElement type={'body-md'}>{t('subtitle')}</TextElement>}
        ctaContent={
          <Button
            href={startDlt}
            isExternal
            leadingIcon={<MyIcon name={'EastRounded'} />}
          >
            {t('cta')}
          </Button>
        }
      />
      <div className={classes.dltHighlights}>
        {dltHighlightsData?.map((info, index) => (
          <div key={index} className={classes.singleInfo}>
            {info.isCustom ? (
              <MyIcon customName={info.icon} rounded />
            ) : (
              <MyIcon name={info.icon} rounded />
            )}
            <div className={classes.texts}>
              <TextElement type={'heading-xs'}>{info.title}</TextElement>
              <TextElement type={'body-sm'}>{info.description}</TextElement>
            </div>
          </div>
        ))}
      </div>
      <div className={classes.infoItems}>
        <InteractionCard
          icon={<MyIcon customName={'ixian_logo'} rounded />}
          title={t('card1.title')}
          description={t('card1.subtitle')}
          fullWidth
        />
        <InteractionCard
          icon={<MyIcon name={'MoveUpRounded'} rounded />}
          title={t('card2.title')}
          description={t('card2.subtitle')}
          fullWidth
        />
        <InteractionCard
          icon={<MyIcon name={'ZoomOutMapRounded'} rounded />}
          title={t('card3.title')}
          description={t('card3.subtitle')}
          fullWidth
        />
      </div>
      <div className={classes.divider} />
    </ContentWrapper>
  );
};

export default IxianDltSection;
