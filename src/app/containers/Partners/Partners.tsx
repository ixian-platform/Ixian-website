import React from 'react';
import ContentWrapper from '@components/ContentWrapper/ContentWrapper';
import classes from './Partners.module.scss';
import SectionHeader from '@components/SectionHeader/SectionHeader';
import TextElement from '@components/TextElement/TextElement';
import Button from '@components/Button/Button';
import MyIcon from '@components/MyIcon/MyIcon';
import { useTranslations } from 'next-intl';
import Chip from '@components/Chip/Chip';
import Image from 'next/image';
import benchmarked from '@assets/partners/benchmarked.svg';
import even from '@assets/partners/even.svg';
import ixilabs from '@assets/partners/ixilabs.svg';
import nodezro from '@assets/partners/nodezro.svg';
import robotina from '@assets/partners/robotina.svg';
import vivat from '@assets/partners/vivat.svg';
import Link from 'next/link';

const Partners = () => {
  const t = useTranslations('Partners');

  return (
    <ContentWrapper
      asWrapperSection
      className={classes.partners}
      sectionClass={classes.partnersSection}
    >
      <SectionHeader
        chipContainer={
          <Chip content={t('chip')} variant={'outlined'} isTextInversed />
        }
        className={classes.buildTogether}
      />
      <div className={classes.partnerImages}>
        <Link href={'https://ixilabs.com/'} target={'_blank'}>
          <Image src={ixilabs} alt={'ixilabs'} />
        </Link>
        <Link href={'https://robotina.com/'} target={'_blank'}>
          <Image src={robotina} alt={'robotina'} />
        </Link>
        <Image src={vivat} alt={'vivat'} />
        <Image src={benchmarked} alt={'benchmarked'} />
        <Image src={nodezro} alt={'nodezro'} />
        <Image src={even} alt={'even'} />
      </div>
      <SectionHeader
        className={classes.buildTogether}
        title={
          <TextElement type={'heading-lg'} as={'h1'}>
            {t('buildTogether')}
          </TextElement>
        }
        subtitle={
          <TextElement type={'body-md'} as={'h1'}>
            {t('buildSubtitle')}
          </TextElement>
        }
        ctaContent={
          <Button
            variant={'outlined-2'}
            leadingIcon={<MyIcon name={'EastRounded'} />}
          >
            {t('explorePartnerships')}
          </Button>
        }
        ctaClassName={classes.center}
      />
    </ContentWrapper>
  );
};

export default Partners;
