'use client';

import React, { Fragment, useEffect, useState } from 'react';
import NumberTicker from '@/components/ui/number-ticker';
import { metricsData } from '@utils/metricsUtil';
import TextElement from '@components/TextElement/TextElement';
import TypingAnimation from '@/components/ui/typing-animation';
import { useTranslations } from 'next-intl';
import classes from './IxianPlatformMetrics.module.scss';
import { getNodeStatusData, NodeStatus } from '@utils/api';

const IxianPlatformMetrics = () => {
  const [nodeStatusData, setNodeStatusData] = useState<NodeStatus | null>(null);
  const t = useTranslations('Metrics');

  useEffect(() => {
    const fetchNodeStatusData = async () => {
      try {
        const data = await getNodeStatusData();
        setNodeStatusData(data);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e);
      }
    };

    fetchNodeStatusData();
  }, []);

  return (
    <Fragment>
      <div className={classes.metricsContainer}>
        <div className={classes.insideSingle}>
          <NumberTicker
            value={nodeStatusData?.M || 0}
            className={classes.number}
          />
          <TextElement type={'body-sm'}>{t('activeIxianDltNodes')}</TextElement>
        </div>
        <div className={classes.insideSingle}>
          <TextElement type={'heading-lg'}>
            <NumberTicker
              value={metricsData.targetBlockTime}
              className={classes.number}
            />
            s
          </TextElement>
          <TextElement type={'body-sm'}>{t('targetBlockTime')}</TextElement>
        </div>
        <div className={classes.insideSingle}>
          <TextElement type={'heading-lg'}>
            <NumberTicker
              value={metricsData.dataTransfers}
              className={classes.number}
            />
            M+*
          </TextElement>
          <TextElement type={'body-sm'}>{t('dataTransfers')}</TextElement>
        </div>
        <div className={classes.insideSingle}>
          <TextElement type={'heading-lg'}>
            <NumberTicker
              value={metricsData.onChainTransactions}
              className={classes.number}
            />
            M +
          </TextElement>
          <TextElement type={'body-sm'}>{t('onChainTransactions')}</TextElement>
        </div>
        <div className={classes.insideSingle}>
          <NumberTicker
            value={metricsData.peakTps}
            className={classes.number}
          />
          <TextElement type={'body-sm'}>{t('peakTps')}</TextElement>
        </div>
        <div className={classes.insideSingle}>
          <TextElement type={'heading-lg'} as={'div'}>
            <TypingAnimation
              text={metricsData.transactionFees}
              className={classes.number}
            />
          </TextElement>
          <TextElement type={'body-sm'}> {t('transactionFees')}</TextElement>
        </div>
      </div>
      <TextElement className={classes.note} type={'body-sm'}>
        {t('note')}
      </TextElement>
    </Fragment>
  );
};

export default IxianPlatformMetrics;
