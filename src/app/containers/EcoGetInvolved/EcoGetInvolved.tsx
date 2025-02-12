import React from 'react';
import ContentWrapper from '@components/ContentWrapper/ContentWrapper';
import topRetro from '@assets/top-retro.svg';
import Image from 'next/image';
import Chip from '@components/Chip/Chip';
import TextElement from '@components/TextElement/TextElement';
import { useTranslations } from 'next-intl';
import SectionHeader from '@components/SectionHeader/SectionHeader';
import classes from './EcoGetInvolved.module.scss';
import { socials } from '@utils/socialsUtil';
import InteractionCard from '@components/InteractionCard/InteractionCard';
import MyIcon from '@components/MyIcon/MyIcon';
import BigCard from '@components/BigCard/BigCard';
import Button from '@components/Button/Button';
import classNames from 'classnames';
import { spixiDownload } from '@utils/constants';

const EcoGetInvolved = () => {
  const t = useTranslations('EcoGetInvolvedPage.community');
  const heroT = useTranslations('EcoGetInvolvedPage.hero');
  const ecoT = useTranslations('Ecosystem');

  return (
    <ContentWrapper
      sectionClass={classes.ecoGetInvolvedSection}
      asWrapperSection
      className={classes.ecoGetInvolved}
    >
      <Image priority src={topRetro} alt={'top-retro'} className={'topRetro'} />
      <SectionHeader
        title={
          <TextElement type={'display-md'} as={'h1'}>
            {heroT('title')}
          </TextElement>
        }
        subtitle={
          <TextElement type={'body-lg'} as={'h1'}>
            {heroT('subtitle')}
          </TextElement>
        }
      />
      <div className={classes.communityCard}>
        <SectionHeader
          chipContainer={<Chip content={t('chip')} variant={'outlined'} />}
          title={
            <TextElement type={'heading-lg'} as={'h1'}>
              {t('title')}
            </TextElement>
          }
          subtitle={
            <TextElement type={'body-md'} as={'h1'}>
              {t('subtitle')}
            </TextElement>
          }
        />
        <div className={classes.socialCards}>
          {socials
            ?.filter((item) => !['github', 'spixi']?.includes(item.alt))
            ?.map((item) => (
              <InteractionCard
                href={item.href}
                isExternal
                className={classes.customCard}
                titleClassName={classes.title}
                key={item.label}
                icon={
                  <Image src={item.img} alt={item.alt} width={24} height={24} />
                }
                title={item.label}
              />
            ))}
        </div>
      </div>
      <div className={classes.bottomCards}>
        <BigCard
          iconContainer={<MyIcon name={'WalletRounded'} rounded />}
          bgImageVariant={'secondary'}
          className={classes.colSpan2}
          body={
            <SectionHeader
              chipContainer={
                <Chip content={t('spixiCard.chip')} variant={'outlined'} />
              }
              title={
                <TextElement type={'heading-md'} as={'h1'}>
                  {t('spixiCard.title')}
                </TextElement>
              }
              subtitle={
                <TextElement type={'body-md'} as={'h1'}>
                  {t('spixiCard.subtitle')}
                </TextElement>
              }
              ctaContent={
                <Button
                  href={spixiDownload}
                  isExternal
                  leadingIcon={<MyIcon name={'EastRounded'} />}
                >
                  {t('spixiCard.cta')}
                </Button>
              }
            />
          }
        />
        <InteractionCard
          className={classNames(classes.minHeight)}
          title={ecoT('ixiNames')}
          description={ecoT('namesDesc')}
          fullWidth
          icon={<MyIcon customName={'ixinames'} rounded />}
          headerAdditionalContent={
            <Chip
              content={ecoT('inProgress')}
              variant={'outlined'}
              className={classes.marginBot}
            />
          }
        />
        <InteractionCard
          className={classNames(
            classes.newFeaturesCardGradient,
            classes.minHeight
          )}
          icon={<MyIcon name={'ViewInArRounded'} rounded />}
          title={ecoT('building')}
          description={ecoT('stayUp')}
          fullWidth
        />
      </div>
    </ContentWrapper>
  );
};

export default EcoGetInvolved;
