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

const MetricsSection = () => {
  const t = useTranslations();

  return (
    <ContentWrapper
      asWrapperSection
      className={classes.contentWrapper}
      sectionClass={classes.metricsSection}
    >
      <div className={classes.mainCard}>
        <SectionHeader
          chipContainer={<Chip content={t('lorem')} />}
          title={
            <TextElement type={'heading-lg'} as={'h1'}>
              {t('lorem')}
            </TextElement>
          }
          subtitle={
            <TextElement type={'body-lg'} as={'h1'}>
              {t('lorem')}
            </TextElement>
          }
          ctaContent={
            <>
              <Button
                variant={'outlined'}
                leadingIcon={<MyIcon name={'arrow_right_alt'} />}
              >
                {t('lorem')}
              </Button>
              <Button
                variant={'text'}
                leadingIcon={<MyIcon name={'ixian_logo'} />}
              >
                {t('lorem')}
              </Button>
            </>
          }
        />
        <div className={classes.metricsContainer}>
          <div className={classes.insideSingle}>
            <NumberTicker value={18023} className={classes.number} />
            <TextElement type={'body-sm'}>{t('lorem')}</TextElement>
          </div>
          <div className={classes.insideSingle}>
            <TextElement type={'heading-lg'}>
              <NumberTicker value={100} className={classes.number} /> M+*
            </TextElement>
            <TextElement type={'body-sm'}>{t('lorem')}</TextElement>
          </div>
          <div className={classes.insideSingle}>
            <NumberTicker value={379} className={classes.number} />
            <TextElement type={'body-sm'}>{t('lorem')}</TextElement>
          </div>
          <div className={classes.insideSingle}>
            <TextElement type={'heading-lg'} as={'div'}>
              <TypingAnimation text={'Over 1 T'} className={classes.number} />
            </TextElement>
            <TextElement type={'body-sm'}>{t('lorem')}</TextElement>
          </div>
          <div className={classes.insideSingle}>
            <TextElement type={'heading-lg'} as={'div'}>
              <TypingAnimation text={'0.000005 *'} className={classes.number} />
            </TextElement>
            <TextElement type={'body-sm'}>{t('lorem')}</TextElement>
          </div>
          <div className={classes.insideSingle}>
            <TextElement type={'heading-lg'} as={'div'}>
              <TypingAnimation
                text={'<$0.000001*'}
                className={classes.number}
              />
            </TextElement>
            <TextElement type={'body-sm'}> {t('lorem')}</TextElement>
          </div>
        </div>
        <TextElement className={classes.note} type={'body-sm'}>
          {t('lorem')}
        </TextElement>
      </div>
    </ContentWrapper>
  );
};

export default MetricsSection;
