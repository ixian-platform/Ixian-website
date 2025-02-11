import classes from './WhyIxian.module.scss';
import ContentWrapper from '@components/ContentWrapper/ContentWrapper';
import TextElement from '@components/TextElement/TextElement';
import { useTranslations } from 'next-intl';
import SectionHeader from '@components/SectionHeader/SectionHeader';
import Chip from '@components/Chip/Chip';
import MyIcon from '@components/MyIcon/MyIcon';
import InteractionCard from '@components/InteractionCard/InteractionCard';
import { getServerTranslations } from '@utils/getServerTranslations';
import CharacteristicsLayout, {
  SingleData,
} from '@components/CharacteristicsLayout/CharacteristicsLayout';
import { ixianGitHub, ixidocs } from '@utils/constants';

const st = await getServerTranslations();

const singleInfoData: SingleData[] = [
  {
    icon: 'ixian_logo',
    isCustom: true,
    title: st('BuildPage.whyIxian.data1.title'),
    description: st('BuildPage.whyIxian.data1.subtitle'),
  },
  {
    icon: 'SecurityRounded',
    title: st('BuildPage.whyIxian.data2.title'),
    description: st('BuildPage.whyIxian.data2.subtitle'),
  },
  {
    icon: 'DynamicFeedRounded',
    title: st('BuildPage.whyIxian.data3.title'),
    description: st('BuildPage.whyIxian.data3.subtitle'),
  },
  {
    icon: 'MergeRounded',
    title: st('BuildPage.whyIxian.data4.title'),
    description: st('BuildPage.whyIxian.data4.subtitle'),
  },
  {
    icon: 'OnlinePredictionRounded',
    title: st('BuildPage.whyIxian.data5.title'),
    description: st('BuildPage.whyIxian.data5.subtitle'),
  },
  {
    icon: 'SettingsSuggestRounded',
    title: st('BuildPage.whyIxian.data6.title'),
    description: st('BuildPage.whyIxian.data6.subtitle'),
  },
];

const WhyIxian = () => {
  const t = useTranslations('BuildPage.whyIxian');

  return (
    <ContentWrapper
      asWrapperSection
      sectionClass={classes.whyIxianSection}
      className={classes.whyIxianWrapper}
    >
      <SectionHeader
        chipContainer={<Chip content={t('chip')} variant={'outlined'} />}
        title={<TextElement type={'heading-lg'}>{t('title')}</TextElement>}
      />
      <CharacteristicsLayout data={singleInfoData} />
      <section className={classes.keyResources}>
        <TextElement type={'heading-md'}>{t('keyResources.title')}</TextElement>
        <div className={classes.infoItems}>
          <InteractionCard
            href={ixidocs}
            isExternal
            fullWidth
            icon={<MyIcon name={'EastRounded'} rounded />}
            title={t('keyResources.card1.title')}
            description={t('keyResources.card1.subtitle')}
          />
          <InteractionCard
            href={ixidocs}
            isExternal
            fullWidth
            icon={<MyIcon name={'EastRounded'} rounded />}
            title={t('keyResources.card2.title')}
            description={t('keyResources.card2.subtitle')}
          />
          <InteractionCard
            href={ixidocs}
            isExternal
            fullWidth
            icon={<MyIcon name={'EastRounded'} rounded />}
            title={t('keyResources.card3.title')}
            description={t('keyResources.card3.subtitle')}
          />
          <InteractionCard
            href={ixianGitHub}
            isExternal
            fullWidth
            icon={<MyIcon name={'GitHub'} rounded />}
            title={t('keyResources.card4.title')}
            description={t('keyResources.card4.subtitle')}
          />
        </div>
      </section>
    </ContentWrapper>
  );
};

export default WhyIxian;
