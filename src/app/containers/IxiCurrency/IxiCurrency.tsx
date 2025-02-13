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
import { ixiEmissions, Routes, Section } from '@utils/constants';
import IxiMetrics from '@components/IxiMetrics/IxiMetrics';
import ExchangesImages from '@components/ExchangesImages/ExchangesImages';

const IxiCurrency = () => {
  const t = useTranslations('TechnologyPage.ixiCurrency');

  return (
    <ContentWrapper
      asWrapperSection
      className={classes.ixiCurrency}
      sectionClass={classes.ixiCurrencySection}
      sectionId={Section.IXI_TOKEN}
    >
      <div className={classes.innerCard}>
        <SectionHeader
          chipContainer={<Chip content={t('chip')} variant={'outlined'} />}
          title={<TextElement type={'display-md'}>{t('title')}</TextElement>}
          subtitle={<TextElement type={'body-md'}>{t('subtitle')}</TextElement>}
          ctaContent={
            <>
              <Button
                href={ixiEmissions}
                isExternal
                leadingIcon={<MyIcon name={'EastRounded'} />}
              >
                {t('cta1')}
              </Button>
              <Button
                href={`${Routes.GET_INVOLVED}#${Section.RESOURCES}`}
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
            className={classes.singleCard}
            icon={<MyIcon name={'ClearAllRounded'} rounded />}
            title={t('card1.title')}
            description={t('card1.subtitle')}
            fullWidth
          />
          <InteractionCard
            className={classes.singleCard}
            icon={<MyIcon name={'CycloneRounded'} rounded />}
            title={t('card2.title')}
            description={t('card2.subtitle')}
            fullWidth
          />
        </div>
        <div className={classes.exchangesContainer}>
          <TextElement type={'heading-md'}>{t('exchanges')}</TextElement>
          <TextElement type={'body-sm'}>{t('exchangesSubtitle')}</TextElement>
          <ExchangesImages />
        </div>
      </div>
    </ContentWrapper>
  );
};

export default IxiCurrency;
