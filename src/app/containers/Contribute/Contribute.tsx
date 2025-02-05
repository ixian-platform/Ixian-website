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

const st = await getServerTranslations();

const singleInfoData: SingleData[] = [
  {
    icon: 'Home',
    title: st('BuildPage.whyIxian.data1.title'),
    description: st('BuildPage.whyIxian.data1.subtitle'),
  },
  {
    icon: 'Home',
    title: st('BuildPage.whyIxian.data2.title'),
    description: st('BuildPage.whyIxian.data2.subtitle'),
  },
  {
    icon: 'Home',
    title: st('BuildPage.whyIxian.data3.title'),
    description: st('BuildPage.whyIxian.data3.subtitle'),
  },
];

const Contribute = () => {
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
          <Chip isTextInversed content={'test'} variant={'outlined'} />
        }
        title={<TextElement type={'heading-lg'}>test</TextElement>}
        subtitle={<TextElement type={'body-md'}>test</TextElement>}
        ctaContent={
          <>
            <Button
              variant={'outlined'}
              leadingIcon={<MyIcon name={'GitHub'} />}
            >
              test
            </Button>
            <Button
              variant={'text'}
              leadingIcon={<MyIcon name={'EastRounded'} />}
            >
              test
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
