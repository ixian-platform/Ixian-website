import React from 'react';
import ContentWrapper from '@components/ContentWrapper/ContentWrapper';
import classes from './PoweringIxian.module.scss';
import SectionHeader from '@components/SectionHeader/SectionHeader';
import TextElement from '@components/TextElement/TextElement';
import Chip from '@components/Chip/Chip';
import IxiMetrics from '@components/IxiMetrics/IxiMetrics';
import Link from 'next/link';
import { coingeckoIxi, nonkycIxi, Section, xeggexIxi } from '@utils/constants';
import Image from 'next/image';
import coingecko from '@assets/coingecko.svg';
import xeggex from '@assets/xeggex.svg';
import nonkyc from '@assets/nonkyc.svg';
import InteractionCard from '@components/InteractionCard/InteractionCard';
import MyIcon from '@components/MyIcon/MyIcon';
import { useTranslations } from 'next-intl';

const PoweringIxian = () => {
  const t = useTranslations('EcoGetInvolvedPage.poweringIxian');

  return (
    <ContentWrapper
      asWrapperSection
      sectionClass={classes.poweringIxianSection}
      className={classes.poweringIxian}
      sectionId={Section.RESOURCES}
    >
      <SectionHeader
        title={<TextElement type={'heading-lg'}>{t('title')}</TextElement>}
        subtitle={<TextElement type={'body-md'}>{t('subtitle')}</TextElement>}
        chipContainer={<Chip content={t('chip')} variant={'outlined'} />}
      />
      <IxiMetrics />
      <div className={classes.resourcesContainer}>
        <TextElement type={'heading-sm'}>{t('resources.label')}</TextElement>
        <TextElement type={'heading-lg'}>{t('resources.title')}</TextElement>
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
        {['wallets', 'miners', 'miningPools'].map((res) => (
          <div className={classes.innerCards} key={res}>
            <div className={classes.text}>
              <TextElement type={'heading-md'}>
                {t(`resources.${res}.title`)}
              </TextElement>
              <TextElement type={'body-md'}>
                {t(`resources.${res}.subtitle`)}
              </TextElement>
            </div>
            <div className={classes.linkCards}>
              <InteractionCard
                titleClassName={classes.linkCardTitle}
                disableScale
                icon={
                  <Link href={'/'} passHref>
                    <MyIcon name={'EastRounded'} rounded />
                  </Link>
                }
                title={t(`resources.${res}.card1.title`)}
                description={t(`resources.${res}.card1.subtitle`)}
              />
              <InteractionCard
                titleClassName={classes.linkCardTitle}
                disableScale
                icon={
                  <Link href={'/'} passHref>
                    <MyIcon name={'EastRounded'} rounded />
                  </Link>
                }
                title={t(`resources.${res}.card2.title`)}
                description={t(`resources.${res}.card2.subtitle`)}
              />
            </div>
          </div>
        ))}
      </div>
    </ContentWrapper>
  );
};

export default PoweringIxian;
