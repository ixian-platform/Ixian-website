import React from 'react';
import ContentWrapper from '@components/ContentWrapper/ContentWrapper';
import classes from './PoweringIxian.module.scss';
import SectionHeader from '@components/SectionHeader/SectionHeader';
import TextElement from '@components/TextElement/TextElement';
import Chip from '@components/Chip/Chip';
import IxiMetrics from '@components/IxiMetrics/IxiMetrics';
import Link from 'next/link';
import { coingeckoIxi, nonkycIxi, xeggexIxi } from '@utils/constants';
import Image from 'next/image';
import coingecko from '@assets/coingecko.svg';
import xeggex from '@assets/xeggex.svg';
import nonkyc from '@assets/nonkyc.svg';
import InteractionCard from '@components/InteractionCard/InteractionCard';
import MyIcon from '@components/MyIcon/MyIcon';

const PoweringIxian = () => {
  return (
    <ContentWrapper
      asWrapperSection
      sectionClass={classes.poweringIxianSection}
      className={classes.poweringIxian}
    >
      <SectionHeader
        title={<TextElement type={'heading-lg'}>test</TextElement>}
        subtitle={<TextElement type={'body-md'}>test</TextElement>}
        chipContainer={<Chip content={'test'} variant={'outlined'} />}
      />
      <IxiMetrics />
      <div className={classes.resourcesContainer}>
        <TextElement type={'heading-sm'}>Resources</TextElement>
        <TextElement type={'heading-lg'}>Resources</TextElement>
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
        <div className={classes.innerCards}>
          <div className={classes.text}>
            <TextElement type={'heading-md'}>Resources</TextElement>
            <TextElement type={'body-md'}>Resources</TextElement>
          </div>
          <div className={classes.linkCards}>
            <InteractionCard
              disableScale
              icon={
                <Link href={'/'} passHref>
                  <MyIcon name={'EastRounded'} rounded />
                </Link>
              }
              title={'test'}
              description={'test'}
            />
            <InteractionCard
              disableScale
              icon={
                <Link href={'/'} passHref>
                  <MyIcon name={'EastRounded'} rounded />
                </Link>
              }
              title={'test'}
              description={'test'}
            />
          </div>
        </div>
        <div className={classes.innerCards}>
          <div className={classes.text}>
            <TextElement type={'heading-md'}>Resources</TextElement>
            <TextElement type={'body-md'}>Resources</TextElement>
          </div>
          <div className={classes.linkCards}>
            <InteractionCard
              disableScale
              icon={
                <Link href={'/'} passHref>
                  <MyIcon name={'EastRounded'} rounded />
                </Link>
              }
              title={'test'}
              description={'test'}
            />
            <InteractionCard
              disableScale
              icon={
                <Link href={'/'} passHref>
                  <MyIcon name={'EastRounded'} rounded />
                </Link>
              }
              title={'test'}
              description={'test'}
            />
          </div>
        </div>
        <div className={classes.innerCards}>
          <div className={classes.text}>
            <TextElement type={'heading-md'}>Resources</TextElement>
            <TextElement type={'body-md'}>Resources</TextElement>
          </div>
          <div className={classes.linkCards}>
            <InteractionCard
              disableScale
              icon={
                <Link href={'/'} passHref>
                  <MyIcon name={'EastRounded'} rounded />
                </Link>
              }
              title={'test'}
              description={'test'}
            />
            <InteractionCard
              disableScale
              icon={
                <Link href={'/'} passHref>
                  <MyIcon name={'EastRounded'} rounded />
                </Link>
              }
              title={'test'}
              description={'test'}
            />
          </div>
        </div>
      </div>
    </ContentWrapper>
  );
};

export default PoweringIxian;
