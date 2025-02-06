import React from 'react';
import ContentWrapper from '@components/ContentWrapper/ContentWrapper';
import SectionHeader from '@components/SectionHeader/SectionHeader';
import classes from './IxiCurrency.module.scss';
import Chip from '@components/Chip/Chip';
import TextElement from '@components/TextElement/TextElement';
import Button from '@components/Button/Button';
import { useTranslations } from 'next-intl';
import MyIcon from '@components/MyIcon/MyIcon';
import InteractionCard from '@components/InteractionCard/InteractionCard';
import Link from 'next/link';
import coingecko from '@assets/coingecko.svg';
import nonkyc from '@assets/nonkyc.svg';
import xeggex from '@assets/xeggex.svg';
import Image from 'next/image';
import { coingeckoIxi, nonkycIxi, xeggexIxi } from '@utils/constants';
import IxiMetrics from '@components/IxiMetrics/IxiMetrics';

const IxiCurrency = () => {
  const t = useTranslations('TechnologyPage.ixiCurrency');

  return (
    <ContentWrapper
      asWrapperSection
      className={classes.ixiCurrency}
      sectionClass={classes.ixiCurrencySection}
    >
      <div className={classes.innerCard}>
        <SectionHeader
          chipContainer={<Chip content={t('chip')} variant={'outlined'} />}
          title={<TextElement type={'display-md'}>{t('title')}</TextElement>}
          subtitle={<TextElement type={'body-md'}>{t('subtitle')}</TextElement>}
          ctaContent={
            <>
              <Button leadingIcon={<MyIcon name={'EastRounded'} />}>
                {t('cta1')}
              </Button>
              <Button
                variant={'text'}
                leadingIcon={<MyIcon name={'DescriptionRounded'} />}
              >
                {t('cta2')}
              </Button>
            </>
          }
        />
        <IxiMetrics />
        <div className={classes.infoCardsContainer}>
          <InteractionCard
            icon={<MyIcon name={'MultipleStopRounded'} rounded />}
            title={t('card1.title')}
            description={t('card1.subtitle')}
            enableHover
            fullWidth
          />
          <InteractionCard
            icon={<MyIcon name={'GrainRounded'} rounded />}
            title={t('card1.title')}
            description={t('card1.subtitle')}
            enableHover
            fullWidth
          />
        </div>
        <div className={classes.exchangesContainer}>
          <TextElement type={'heading-md'}>{t('exchanges')}</TextElement>
          <TextElement type={'body-sm'}>{t('exchangesSubtitle')}</TextElement>
          <div className={classes.images}>
            <Link href={coingeckoIxi} target={'_blank'}>
              <Image src={coingecko} alt={'coingecko'} />
            </Link>
            <Link href={xeggexIxi} target={'_blank'}>
              <Image src={xeggex} alt={'xeggex'} />
            </Link>
            <Link href={nonkycIxi} target={'_blank'}>
              <Image src={nonkyc} alt={'nonkyc'} />
            </Link>
          </div>
        </div>
      </div>
    </ContentWrapper>
  );
};

export default IxiCurrency;
