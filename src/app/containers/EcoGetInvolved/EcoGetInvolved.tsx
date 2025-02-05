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

const EcoGetInvolved = () => {
  const t = useTranslations('EcosystemPage.hero');

  return (
    <ContentWrapper
      sectionClass={classes.ecoGetInvolvedSection}
      asWrapperSection
      className={classes.ecoGetInvolved}
    >
      <Image
        priority
        src={topRetro}
        alt={'top-retro'}
        className={classes.topRetro}
      />
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
              className={classes.customCard}
              key={item.label}
              icon={
                <Image src={item.img} alt={item.alt} width={40} height={40} />
              }
              title={item.label}
              description={''}
            />
          ))}
      </div>
      <div className={classes.bottomCards}>
        <BigCard
          iconContainer={<MyIcon name={'WalletRounded'} rounded />}
          bgImageVariant={'secondary'}
          className={classes.colSpan2}
          body={
            <SectionHeader
              chipContainer={
                <Chip
                  content={t('decentralizedMessenger')}
                  variant={'outlined'}
                />
              }
              title={
                <TextElement type={'heading-md'} as={'h1'}>
                  {t('spixiChat')}
                </TextElement>
              }
              subtitle={
                <TextElement type={'body-md'} as={'h1'}>
                  {t('spixiDesc')}
                </TextElement>
              }
              ctaContent={
                <Button leadingIcon={<MyIcon customName={'spixi_logo'} />}>
                  download
                </Button>
              }
            />
          }
        />
        <InteractionCard
          title={t('ixiNames')}
          description={t('namesDesc')}
          fullWidth
          enableHover
          icon={<MyIcon customName={'ixinames'} rounded />}
          headerAdditionalContent={
            <Chip
              content={t('comingSoon')}
              variant={'outlined'}
              className={classes.marginBot}
            />
          }
        />
        <InteractionCard
          className={classes.newFeaturesCardGradient}
          icon={<MyIcon name={'AutoAwesomeRounded'} rounded />}
          title={t('building')}
          description={t('stayUp')}
          fullWidth
          enableHover
        />
      </div>
    </ContentWrapper>
  );
};

export default EcoGetInvolved;
