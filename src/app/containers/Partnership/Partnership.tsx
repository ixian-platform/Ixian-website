import React from 'react';
import ContentWrapper from '@components/ContentWrapper/ContentWrapper';
import classes from './Partnership.module.scss';
import SectionHeader from '@components/SectionHeader/SectionHeader';
import TextElement from '@components/TextElement/TextElement';
import { useTranslations } from 'next-intl';
import Chip from '@components/Chip/Chip';
import Button from '@components/Button/Button';
import MyIcon from '@components/MyIcon/MyIcon';

const Partnership = () => {
  const t = useTranslations('Partnership.hero');

  return (
    <ContentWrapper
      asWrapperSection
      className={classes.partnership}
      sectionClass={classes.partnershipSection}
    >
      <div className={classes.innerContent}>
        <SectionHeader
          chipContainer={<Chip content={'test'} variant={'outlined'} />}
          title={<TextElement type={'heading-lg'}>{t('title')}</TextElement>}
          subtitle={<TextElement type={'body-md'}>{t('title')}</TextElement>}
          ctaContent={
            <Button leadingIcon={<MyIcon name={'EastRounded'} />}>
              {t('cta')}
            </Button>
          }
        />
      </div>
    </ContentWrapper>
  );
};

export default Partnership;
