import React from 'react';
import TextElement from '@components/TextElement/TextElement';
import NumberTicker from '@/components/ui/number-ticker';
import TypingAnimation from '@/components/ui/typing-animation';
import classes from './IxiMetrics.module.scss';
import { useTranslations } from 'next-intl';
import { metricsData } from '@utils/metricsUtil';

const IxiMetrics = () => {
  const t = useTranslations('TechnologyPage.ixiCurrency');

  return (
    <div className={classes.currencyMetrics}>
      <div className={classes.mainMetrics}>
        <div className={classes.insideSingle}>
          <TextElement type={'heading-md'}>
            <NumberTicker
              value={metricsData.maxSupply}
              className={classes.number}
            />{' '}
            BN
          </TextElement>
          <TextElement type={'body-md'}>{t('metrics.supply')}</TextElement>
        </div>
        <div className={classes.insideSingle}>
          <TextElement type={'heading-md'}>
            <NumberTicker
              value={metricsData.peakTps}
              className={classes.number}
            />
          </TextElement>
          <TextElement type={'body-md'}>{t('metrics.peakTps')}</TextElement>
        </div>
        <div className={classes.insideSingle}>
          <TextElement type={'heading-md'}>
            <NumberTicker
              value={metricsData.targetBlockTime}
              className={classes.number}
            />
            s
          </TextElement>
          <TextElement type={'body-md'}>
            {t('metrics.targetBlockTime')}
          </TextElement>
        </div>
        <div className={classes.insideSingle}>
          <TextElement type={'heading-lg'} as={'div'}>
            <TypingAnimation
              text={metricsData.transactionFees}
              className={classes.number}
            />
          </TextElement>
          <TextElement type={'body-sm'}>
            {t('metrics.transactionFees')}
          </TextElement>
        </div>
      </div>
    </div>
  );
};

export default IxiMetrics;
