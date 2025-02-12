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

import classNames from 'classnames';
import topRetro from '@assets/top-retro.svg';
import Image from 'next/image';
import { ixianGitHub, Routes } from '@utils/constants';

const LandingFeaturesGrid = () => {
  const t = useTranslations('LandingFeatures');

  return (
    <ContentWrapper
      asWrapperSection
      sectionClass={classes.landingFeaturesSection}
      className={classes.landingFeatures}
    >
      <Image priority src={topRetro} alt={'top-retro'} className={'topRetro'} />
      <div
        className={classNames(
          classes.landingFeaturesGridSingleCard,
          classes.card1
        )}
      >
        <SectionHeader
          chipContainer={
            <Chip content={t('build.chip')} variant={'outlined'} />
          }
          title={
            <TextElement type={'display-md'}>{t('build.title')}</TextElement>
          }
          subtitle={
            <TextElement type={'body-md'}>{t('build.subtitle')}</TextElement>
          }
          ctaContent={
            <>
              <Button
                href={Routes.BUILD}
                leadingIcon={<MyIcon name={'EastRounded'} />}
              >
                {t('build.cta')}
              </Button>
              <Button
                href={ixianGitHub}
                isExternal
                variant={'text'}
                leadingIcon={<MyIcon name={'GitHub'} />}
              >
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
            icon={<MyIcon name={'DevicesRounded'} rounded />}
            title={t('build.cards.card3.title')}
            description={t('build.cards.card3.subtitle')}
            fullWidth
          />
        </div>
      </div>
      <div className={classes.poweredByIxianArticleCard}>
        <div className={classes.left} />
        <div className={classes.right}>
          <SectionHeader
            className={classes.poweredSectionHeader}
            inverseText
            chipContainer={
              <Chip
                content={t('article1.chip')}
                variant={'outlined'}
                isTextInversed
                className={classes.poweredChip}
              />
            }
            title={
              <TextElement type={'heading-md'}>
                {t('article1.title')}
              </TextElement>
            }
            subtitle={
              <TextElement type={'body-md'}>
                {t('article1.subtitle')}
              </TextElement>
            }
            ctaContent={
              <Button
                href={'https://medium.com/ixian-io'}
                isExternal
                isInverse
                variant={'outlined'}
                leadingIcon={<MyIcon name={'EastRounded'} />}
              >
                {t('article1.cta')}
              </Button>
            }
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
            <Button
              href={Routes.TECHNOLOGY}
              leadingIcon={<MyIcon name={'EastRounded'} />}
            >
              {t('efficiency.cta')}
            </Button>
          }
        />
        <div className={classes.cardsGrid}>
          <InteractionCard
            icon={<MyIcon name={'LinearScaleRounded'} rounded />}
            title={t('efficiency.cards.card1.title')}
            description={t('efficiency.cards.card1.subtitle')}
            fullWidth
          />
          <InteractionCard
            icon={<MyIcon name={'SwitchAccessShortcutAddRounded'} rounded />}
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
          classes.card3
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
            <Button
              href={Routes.TECHNOLOGY}
              leadingIcon={<MyIcon name={'EastRounded'} />}
            >
              {t('security.cta')}
            </Button>
          }
        />
        <div className={classes.cardsGrid}>
          <InteractionCard
            icon={<MyIcon name={'StartRounded'} rounded />}
            title={t('security.cards.card1.title')}
            description={t('security.cards.card1.subtitle')}
            fullWidth
          />
          <InteractionCard
            icon={<MyIcon name={'DeviceHubRounded'} rounded />}
            title={t('security.cards.card2.title')}
            description={t('security.cards.card2.subtitle')}
            fullWidth
          />
          <InteractionCard
            icon={<MyIcon name={'SyncLockRounded'} rounded />}
            title={t('security.cards.card3.title')}
            description={t('security.cards.card3.subtitle')}
            fullWidth
          />
        </div>
      </div>
    </ContentWrapper>
  );
};

export default LandingFeaturesGrid;
