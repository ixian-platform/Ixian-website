import ContentWrapper from '@components/ContentWrapper/ContentWrapper';
import classes from './MetricsSection.module.scss';
import Chip from '@components/Chip/Chip';
import TextElement from '@components/TextElement/TextElement';
import NumberTicker from '@/components/ui/number-ticker';
import TypingAnimation from '@/components/ui/typing-animation';
import Button from '@components/Button/Button';
import SectionHeader from '@components/SectionHeader/SectionHeader';
import { useTranslations } from 'next-intl';
import MyIcon from '@components/MyIcon/MyIcon';
import { Routes, whitepaperLink} from '@utils/constants';

const MetricsSection = () => {
  const t = useTranslations('Metrics');

  return (
    <ContentWrapper
      asWrapperSection
      className={classes.metrics}
      sectionClass={classes.metricsSection}
    >
      <SectionHeader
        chipContainer={<Chip content={t('chip')} variant={'outlined'} />}
        title={
          <TextElement type={'heading-lg'} as={'h1'}>
            {t('title')}
          </TextElement>
        }
        subtitle={
          <TextElement type={'body-lg'} as={'h1'}>
            {t('subtitle')}
          </TextElement>
        }
        ctaContent={
          <>
            <Button
              href={Routes.TECHNOLOGY}
              variant={'primary'}
              leadingIcon={<MyIcon name={'EastRounded'} />}
            >
              {t('howDoesItWork')}
            </Button>
            <Button
              href={whitepaperLink}
              isExternal
              variant={'text'}
              leadingIcon={<MyIcon name={'ArticleRounded'} />}
            >
              {t('readWhitepaper')}
            </Button>
          </>
        }
      />
      <div className={classes.metricsContainer}>
        <div className={classes.insideSingle}>
          <NumberTicker value={189} className={classes.number} />
          <TextElement type={'body-sm'}>{t('activeIxianDltNodes')}</TextElement>
        </div>
        <div className={classes.insideSingle}>
          <TextElement type={'heading-lg'}>
            <NumberTicker value={30} className={classes.number} />s
          </TextElement>
          <TextElement type={'body-sm'}>{t('targetBlockTime')}</TextElement>
        </div>
        <div className={classes.insideSingle}>
          <TextElement type={'heading-lg'}>
            <NumberTicker value={100} className={classes.number} /> M+*
          </TextElement>
          <TextElement type={'body-sm'}>{t('dataTransfers')}</TextElement>
        </div>
        <div className={classes.insideSingle}>
          <TextElement type={'heading-lg'}>
            <NumberTicker value={92} className={classes.number} />M +
          </TextElement>
          <TextElement type={'body-sm'}>{t('onChainTransactions')}</TextElement>
        </div>
        <div className={classes.insideSingle}>
          <NumberTicker value={379} className={classes.number} />
          <TextElement type={'body-sm'}>{t('peakTps')}</TextElement>
        </div>
        <div className={classes.insideSingle}>
          <TextElement type={'heading-lg'} as={'div'}>
            <TypingAnimation text={'<$0.000001'} className={classes.number} />
          </TextElement>
          <TextElement type={'body-sm'}> {t('transactionFees')}</TextElement>
        </div>
      </div>
      <TextElement className={classes.note} type={'body-sm'}>
        {t('note')}
      </TextElement>
    </ContentWrapper>
  );
};

export default MetricsSection;
