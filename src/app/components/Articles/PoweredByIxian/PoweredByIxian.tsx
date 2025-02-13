'use client';

import React from 'react';
import Image from 'next/image';
import SectionHeader from '@components/SectionHeader/SectionHeader';
import Chip from '@components/Chip/Chip';
import TextElement from '@components/TextElement/TextElement';
import Button from '@components/Button/Button';
import MyIcon from '@components/MyIcon/MyIcon';
import classes from './PoweredByIxian.module.scss';
import useImages from '@utils/useImages';
import { useTranslations } from 'next-intl';

const PoweredByIxian = () => {
  const { spixiUc } = useImages();
  const t = useTranslations('LandingFeatures');

  return (
    <div className={classes.poweredByIxianArticleCard}>
      <div className={classes.left}>
        <Image src={spixiUc} alt={'spixi-image'} />
      </div>
      <div className={classes.right}>
        <SectionHeader
          className={classes.poweredSectionHeader}
          inverseText
          chipContainer={
            <Chip
              content={t('article1.chip')}
              variant={'outlined'}
              isTextInversed
              className={classes.poweredChip}
            />
          }
          title={
            <TextElement type={'heading-md'}>{t('article1.title')}</TextElement>
          }
          subtitle={
            <TextElement type={'body-md'}>{t('article1.subtitle')}</TextElement>
          }
          ctaContent={
            <Button
              href={'https://medium.com/ixian-io'}
              isExternal
              isInverse
              variant={'outlined'}
              leadingIcon={<MyIcon name={'EastRounded'} />}
            >
              {t('article1.cta')}
            </Button>
          }
        />
      </div>
    </div>
  );
};

export default PoweredByIxian;
