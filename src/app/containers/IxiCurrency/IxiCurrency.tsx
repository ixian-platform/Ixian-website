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
import NumberTicker from '@/components/ui/number-ticker';
import TypingAnimation from '@/components/ui/typing-animation';

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
              <Button leadingIcon={<MyIcon name={'ArrowRightAltRounded'} />}>
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
        <div className={classes.currencyMetrics}>
          <div className={classes.mainMetrics}>
            <div className={classes.insideSingle}>
              <TextElement type={'heading-md'}>
                <NumberTicker value={21} className={classes.number} /> BN
              </TextElement>
              <TextElement type={'body-md'}>{t('metrics.supply')}</TextElement>
            </div>
            <div className={classes.insideSingle}>
              <TextElement type={'heading-md'}>
                <NumberTicker value={379} className={classes.number} />
              </TextElement>
              <TextElement type={'body-md'}>{t('metrics.peakTps')}</TextElement>
            </div>
            <div className={classes.insideSingle}>
              <TextElement type={'heading-md'}>
                <NumberTicker value={30} className={classes.number} />s
              </TextElement>
              <TextElement type={'body-md'}>
                {t('metrics.targetBlockTime')}
              </TextElement>
            </div>
            <div className={classes.insideSingle}>
              <TextElement type={'heading-lg'} as={'div'}>
                <TypingAnimation
                  text={'<$0.00001*'}
                  className={classes.number}
                />
              </TextElement>
              <TextElement type={'body-sm'}>
                {t('metrics.transactionFees')}
              </TextElement>
            </div>
          </div>
          <TextElement className={classes.note} type={'body-sm'}>
            {t('metrics.note')}
          </TextElement>
        </div>
        <div className={classes.infoCardsContainer}>
          <InteractionCard
            icon={<MyIcon name={'Home'} rounded />}
            title={t('card1.title')}
            description={t('card1.subtitle')}
            enableHover
            fullWidth
          />
          <InteractionCard
            icon={<MyIcon name={'Home'} rounded />}
            title={t('card1.title')}
            description={t('card1.subtitle')}
            enableHover
            fullWidth
          />
        </div>
        <div>
          <p>exchanges</p>
        </div>
      </div>
    </ContentWrapper>
  );
};

export default IxiCurrency;
