import React from 'react';
import TextElement from '@components/TextElement/TextElement';
import NumberTicker from '@/components/ui/number-ticker';
import TypingAnimation from '@/components/ui/typing-animation';
import classes from './IxiMetrics.module.scss';
import { useTranslations } from 'next-intl';

const IxiMetrics = () => {
  const t = useTranslations('TechnologyPage.ixiCurrency');

  return (
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
            <TypingAnimation text={'<$0.00001'} className={classes.number} />
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
