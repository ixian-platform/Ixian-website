import React from 'react';
import ContentWrapper from '@components/ContentWrapper/ContentWrapper';
import classes from './PoweringIxian.module.scss';
import SectionHeader from '@components/SectionHeader/SectionHeader';
import TextElement from '@components/TextElement/TextElement';
import Chip from '@components/Chip/Chip';
import IxiMetrics from '@components/IxiMetrics/IxiMetrics';
import { Section } from '@utils/constants';
import InteractionCard from '@components/InteractionCard/InteractionCard';
import MyIcon from '@components/MyIcon/MyIcon';
import { useTranslations } from 'next-intl';
import ExchangesImages from '@components/ExchangesImages/ExchangesImages';

const PoweringIxian = () => {
  const t = useTranslations('EcoGetInvolvedPage.poweringIxian');

  return (
    <ContentWrapper
      asWrapperSection
      sectionClass={classes.poweringIxianSection}
      className={classes.poweringIxian}
    >
      <SectionHeader
        title={<TextElement type={'heading-lg'}>{t('title')}</TextElement>}
        subtitle={<TextElement type={'body-md'}>{t('subtitle')}</TextElement>}
        chipContainer={<Chip content={t('chip')} variant={'outlined'} />}
      />
      <IxiMetrics />
      <div className={classes.resourcesContainer} id={Section.RESOURCES}>
        <TextElement type={'heading-sm'}>{t('resources.label')}</TextElement>
        <TextElement type={'heading-lg'}>{t('resources.title')}</TextElement>
        <ExchangesImages forceTheme={'dark'} className={classes.customImages} />
        {['wallets', 'miners', 'miningPools'].map((res) => (
          <div className={classes.innerCards} key={res} id={Section.IXI_MINING}>
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
                className={classes.singleSmallCard}
                href={t(`resources.${res}.card1.href`)}
                isExternal
                titleClassName={classes.linkCardTitle}
                disableScale
                icon={<MyIcon name={'EastRounded'} rounded />}
                title={t(`resources.${res}.card1.title`)}
                description={t(`resources.${res}.card1.subtitle`)}
              />
              <InteractionCard
                className={classes.singleSmallCard}
                href={t(`resources.${res}.card2.href`)}
                isExternal
                titleClassName={classes.linkCardTitle}
                disableScale
                icon={<MyIcon name={'EastRounded'} rounded />}
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
