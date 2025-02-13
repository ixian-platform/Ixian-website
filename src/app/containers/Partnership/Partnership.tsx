'use client';

import React from 'react';
import ContentWrapper from '@components/ContentWrapper/ContentWrapper';
import classes from './Partnership.module.scss';
import SectionHeader from '@components/SectionHeader/SectionHeader';
import TextElement from '@components/TextElement/TextElement';
import { useTranslations } from 'next-intl';
import Chip from '@components/Chip/Chip';
import Button from '@components/Button/Button';
import MyIcon from '@components/MyIcon/MyIcon';
import {
  benchmarkedLink,
  evenLink,
  ixiLabs,
  ixiLabsEmail,
  robotinaLink,
  Section,
  vivatLink,
} from '@utils/constants';
import Link from 'next/link';
import Image from 'next/image';
import useImages from '@utils/useImages';

const Partnership = () => {
  const t = useTranslations('AboutUsPage.partnerships');
  const { ixilabs, benchmark, vivat, even, robotina } = useImages();

  return (
    <ContentWrapper
      asWrapperSection
      className={classes.partnership}
      sectionClass={classes.partnershipSection}
      sectionId={Section.PARTNERSHIPS}
    >
      <div className={classes.innerContent}>
        <SectionHeader
          centerAll
          chipContainer={<Chip content={t('chip')} variant={'outlined'} />}
          title={<TextElement type={'heading-lg'}>{t('title')}</TextElement>}
          subtitle={<TextElement type={'body-md'}>{t('subtitle')}</TextElement>}
          ctaContent={
            <Button
              href={`mailto:${ixiLabsEmail}`}
              leadingIcon={<MyIcon name={'EastRounded'} />}
            >
              {t('cta')}
            </Button>
          }
        />
        <div className={classes.partnerImages}>
          <Link href={ixiLabs} target={'_blank'}>
            <Image src={ixilabs} alt={'ixilabs'} />
          </Link>
          <Link href={robotinaLink} target={'_blank'}>
            <Image src={robotina} alt={'robotina'} />
          </Link>
          <Link href={vivatLink} target={'_blank'}>
            <Image src={vivat} alt={'vivat'} />
          </Link>
          <Link href={benchmarkedLink} target={'_blank'}>
            <Image src={benchmark} alt={'benchmarked'} />
          </Link>
          <Link href={evenLink} target={'_blank'}>
            <Image src={even} alt={'even'} />
          </Link>
        </div>
      </div>
    </ContentWrapper>
  );
};

export default Partnership;
