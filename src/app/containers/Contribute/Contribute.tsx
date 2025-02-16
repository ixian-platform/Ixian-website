import React from 'react';
import ContentWrapper from '@components/ContentWrapper/ContentWrapper';
import classes from './Contribute.module.scss';
import SectionHeader from '@components/SectionHeader/SectionHeader';
import CharacteristicsLayout, {
  SingleData,
} from '@components/CharacteristicsLayout/CharacteristicsLayout';
import { getServerTranslations } from '@utils/getServerTranslations';
import TextElement from '@components/TextElement/TextElement';
import Chip from '@components/Chip/Chip';
import Button from '@components/Button/Button';
import MyIcon from '@components/MyIcon/MyIcon';
import { useTranslations } from 'next-intl';
import { ixianGitHub, Routes, Section } from '@utils/constants';

const st = await getServerTranslations();

const singleInfoData: SingleData[] = [
  {
    icon: 'SchoolRounded',
    title: st('EcoGetInvolvedPage.contribute.data1.title'),
    description: st('EcoGetInvolvedPage.contribute.data1.subtitle'),
  },
  {
    icon: 'CodeRounded',
    title: st('EcoGetInvolvedPage.contribute.data2.title'),
    description: st('EcoGetInvolvedPage.contribute.data2.subtitle'),
  },
  {
    icon: 'CampaignRounded',
    title: st('EcoGetInvolvedPage.contribute.data3.title'),
    description: st('EcoGetInvolvedPage.contribute.data3.subtitle'),
  },
];

const Contribute = () => {
  const t = useTranslations('EcoGetInvolvedPage.contribute');

  return (
    <ContentWrapper
      asWrapperSection
      className={classes.contribute}
      sectionClass={classes.contributeSection}
    >
      <SectionHeader
        className={classes.header}
        inverseText
        chipContainer={
          <Chip isTextInversed content={t('chip')} variant={'outlined'} />
        }
        title={<TextElement type={'heading-lg'}>{t('title')}</TextElement>}
        subtitle={<TextElement type={'body-md'}>{t('subtitle')}</TextElement>}
        ctaContent={
          <>
            <Button
              isInverse
              href={ixianGitHub}
              isExternal
              variant={'outlined'}
              leadingIcon={<MyIcon name={'GitHub'} />}
            >
              {t('cta1')}
            </Button>
            <Button
              isInverse
              href={`${Routes.ABOUT_US}#${Section.PARTNERSHIPS}`}
              variant={'text'}
              leadingIcon={<MyIcon name={'EastRounded'} />}
            >
              {t('cta2')}
            </Button>
          </>
        }
      />
      <CharacteristicsLayout
        data={singleInfoData}
        className={classes.info}
        singleInfoClassName={classes.singleInfo}
        isInverse
      />
    </ContentWrapper>
  );
};

export default Contribute;
