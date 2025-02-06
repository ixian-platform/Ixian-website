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

const st = await getServerTranslations();

const singleInfoData: SingleData[] = [
  {
    icon: 'Home',
    title: st('EcoGetInvolvedPage.contribute.data1.title'),
    description: st('EcoGetInvolvedPage.contribute.data1.subtitle'),
  },
  {
    icon: 'Home',
    title: st('EcoGetInvolvedPage.contribute.data2.title'),
    description: st('EcoGetInvolvedPage.contribute.data2.subtitle'),
  },
  {
    icon: 'Home',
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
              variant={'outlined'}
              leadingIcon={<MyIcon name={'GitHub'} />}
            >
              {t('cta1')}
            </Button>
            <Button
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
      />
    </ContentWrapper>
  );
};

export default Contribute;
