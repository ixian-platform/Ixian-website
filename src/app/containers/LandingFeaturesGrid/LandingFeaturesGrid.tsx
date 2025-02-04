import React from 'react';
import ContentWrapper from '@components/ContentWrapper/ContentWrapper';
import classes from './LandingFeaturesGrid.module.scss';
import SectionHeader from '@components/SectionHeader/SectionHeader';
import Chip from '@components/Chip/Chip';
import TextElement from '@components/TextElement/TextElement';
import Button from '@components/Button/Button';
import MyIcon from '@components/MyIcon/MyIcon';
import InteractionCard from '@components/InteractionCard/InteractionCard';
import { useTranslations } from 'next-intl';
import BorderWrapper from '@components/BorderWrapper/BorderWrapper';
import Link from 'next/link';
import { ixianGitHub } from '@utils/constants';
import classNames from 'classnames';

const LandingFeaturesGrid = () => {
  const t = useTranslations('LandingFeatures');

  return (
    <ContentWrapper
      asWrapperSection
      sectionClass={classes.landingFeaturesSection}
      className={classes.landingFeatures}
    >
      <div
        className={classNames(
          classes.landingFeaturesGridSingleCard,
          classes.card1
        )}
      >
        <SectionHeader
          chipContainer={
            <Chip content={t('efficiency.chip')} variant={'outlined'} />
          }
          title={
            <TextElement type={'display-md'}>
              {t('efficiency.title')}
            </TextElement>
          }
          subtitle={
            <TextElement type={'body-md'}>
              {t('efficiency.subtitle')}
            </TextElement>
          }
          ctaContent={
            <Button leadingIcon={<MyIcon name={'EastRounded'} />}>
              {t('efficiency.cta')}
            </Button>
          }
        />
        <div className={classes.cardsGrid}>
          <InteractionCard
            icon={<MyIcon customName={'ixian_logo'} rounded />}
            title={t('efficiency.cards.card1.title')}
            description={t('efficiency.cards.card1.subtitle')}
            fullWidth
          />
          <InteractionCard
            icon={<MyIcon name={'CompareArrowsRounded'} rounded />}
            title={t('efficiency.cards.card2.title')}
            description={t('efficiency.cards.card2.subtitle')}
            fullWidth
          />
          <InteractionCard
            icon={<MyIcon name={'BoltRounded'} rounded />}
            title={t('efficiency.cards.card3.title')}
            description={t('efficiency.cards.card3.subtitle')}
            fullWidth
          />
        </div>
      </div>
      <div
        className={classNames(
          classes.landingFeaturesGridSingleCard,
          classes.card2
        )}
      >
        <SectionHeader
          chipContainer={
            <Chip content={t('security.chip')} variant={'outlined'} />
          }
          title={
            <TextElement type={'display-md'}>{t('security.title')}</TextElement>
          }
          subtitle={
            <TextElement type={'body-md'}>{t('security.subtitle')}</TextElement>
          }
          ctaContent={
            <Button leadingIcon={<MyIcon name={'EastRounded'} />}>
              {t('security.cta')}
            </Button>
          }
        />
        <div className={classes.cardsGrid}>
          <InteractionCard
            icon={<MyIcon name={'PlayForWorkRounded'} rounded />}
            title={t('security.cards.card1.title')}
            description={t('security.cards.card1.subtitle')}
            fullWidth
          />
          <InteractionCard
            icon={<MyIcon name={'GraphicEqRounded'} rounded />}
            title={t('security.cards.card2.title')}
            description={t('security.cards.card2.subtitle')}
            fullWidth
          />
          <InteractionCard
            icon={<MyIcon name={'ShieldRounded'} rounded />}
            title={t('security.cards.card3.title')}
            description={t('security.cards.card3.subtitle')}
            fullWidth
          />
        </div>
      </div>
      <div
        className={classNames(
          classes.landingFeaturesGridSingleCard,
          classes.card3
        )}
      >
        <SectionHeader
          chipContainer={
            <Chip
              content={t('build.chip')}
              variant={'outlined'}
              isTextInversed
            />
          }
          title={
            <TextElement type={'display-md'}>{t('build.title')}</TextElement>
          }
          subtitle={
            <TextElement type={'body-md'}>{t('build.subtitle')}</TextElement>
          }
          ctaContent={
            <>
              <Button leadingIcon={<MyIcon name={'EastRounded'} />}>
                {t('build.cta')}
              </Button>
              <Button variant={'text'} leadingIcon={<MyIcon name={'GitHub'} />}>
                {t('build.cta2')}
              </Button>
            </>
          }
        />
        <div className={classes.cardsGrid}>
          <InteractionCard
            icon={<MyIcon customName={'s2_mark'} rounded />}
            title={t('build.cards.card1.title')}
            description={t('build.cards.card1.subtitle')}
            fullWidth
          />
          <InteractionCard
            icon={<MyIcon name={'GraphicEqRounded'} rounded />}
            title={t('build.cards.card2.title')}
            description={t('build.cards.card2.subtitle')}
            fullWidth
          />
          <InteractionCard
            icon={<MyIcon name={'VerticalSplitRounded'} rounded />}
            title={t('build.cards.card3.title')}
            description={t('build.cards.card3.subtitle')}
            fullWidth
          />
        </div>
      </div>
      <BorderWrapper
        radius={'32px'}
        borderWidth={'1px'}
        color={
          'linear-gradient(90deg, #6EE17F 7.11%, #A546E4 42.57%, #4D7DF6 83.67%)'
        }
      >
        <div className={classes.openSourceCard}>
          <div className={classes.leftSide}>
            <MyIcon name={'GitHub'} width={64} height={64} />
            <div className={classes.text}>
              <TextElement type={'heading-sm'}>
                {t('openSourceCard.title')}
              </TextElement>
              <TextElement type={'body-sm'}>
                {t('openSourceCard.subtitle')}
              </TextElement>
            </div>
          </div>
          <Link passHref href={ixianGitHub} target={'_blank'}>
            <Button
              variant={'outlined'}
              leadingIcon={<MyIcon name={'EastRounded'} />}
            >
              {t('openSourceCard.cta')}
            </Button>
          </Link>
        </div>
      </BorderWrapper>
    </ContentWrapper>
  );
};

export default LandingFeaturesGrid;
