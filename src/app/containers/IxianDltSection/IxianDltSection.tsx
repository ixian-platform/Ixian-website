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

const st = await getServerTranslations();

const dltHighlightsData = [
  {
    icon: 'WidgetsRounded',
    title: st('TechnologyPage.ixianDlt.highlights.data1.title'),
    description: st('TechnologyPage.ixianDlt.highlights.data1.subtitle'),
  },
  {
    icon: 'ViewInArRounded',
    title: st('TechnologyPage.ixianDlt.highlights.data2.title'),
    description: st('TechnologyPage.ixianDlt.highlights.data2.subtitle'),
  },
  {
    icon: 'CompareArrowsRounded',
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
      className={classes.ixianDltContainer}
    >
      <SectionHeader
        chipContainer={<Chip content={t('chip')} variant={'outlined'} />}
        title={<TextElement type={'display-md'}>{t('title')}</TextElement>}
        subtitle={<TextElement type={'body-md'}>{t('subtitle')}</TextElement>}
        ctaContent={
          <Button leadingIcon={<MyIcon name={'ArrowRightAltRounded'} />}>
            {t('cta')}
          </Button>
        }
      />
      <div className={classes.dltHighlights}>
        {dltHighlightsData?.map((info, index) => (
          <div key={index} className={classes.singleInfo}>
            <MyIcon name={info.icon} rounded />
            <div>
              <TextElement type={'heading-xs'}>{info.title}</TextElement>
              <TextElement type={'body-sm'}>{info.description}</TextElement>
            </div>
          </div>
        ))}
      </div>
      <div className={classes.infoItems}>
        <InteractionCard
          icon={<MyIcon name={'Home'} rounded />}
          title={t('card1.title')}
          description={t('card1.subtitle')}
          enableHover
          fullWidth
        />
        <InteractionCard
          icon={<MyIcon name={'Home'} rounded />}
          title={t('card2.title')}
          description={t('card2.subtitle')}
          enableHover
          fullWidth
        />
        <InteractionCard
          icon={<MyIcon name={'Home'} rounded />}
          title={t('card3.title')}
          description={t('card3.subtitle')}
          enableHover
          fullWidth
        />
      </div>
    </ContentWrapper>
  );
};

export default IxianDltSection;
