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
import robotina from '@assets/partners/robotina.svg';
import vivat from '@assets/partners/vivat.svg';
import Link from 'next/link';
import {
  benchmarkedLink,
  evenLink,
  ixiLabs,
  robotinaLink,
  Routes,
  vivatLink,
} from '@utils/constants';

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
          <Image src={benchmarked} alt={'benchmarked'} />
        </Link>
        {/*<Image src={nodezro} alt={'nodezro'} />*/}
        <Link href={evenLink} target={'_blank'}>
          <Image src={even} alt={'even'} />
        </Link>
      </div>
      <SectionHeader
        className={classes.buildTogether}
        inverseText
        title={
          <TextElement type={'heading-lg'} as={'h1'}>
            {t.rich('buildTogether', {
              break: () => <br />,
            })}
          </TextElement>
        }
        subtitle={
          <TextElement type={'body-md'} as={'h1'}>
            {t('buildSubtitle')}
          </TextElement>
        }
        ctaContent={
          <Button
            href={Routes.ABOUT_US}
            variant={'outlined-2'}
            leadingIcon={<MyIcon name={'EastRounded'} />}
          >
            {t('explorePartnerships')}
          </Button>
        }
      />
    </ContentWrapper>
  );
};

export default Partners;
