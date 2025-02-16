import classes from './EcosystemSection.module.scss';
import ContentWrapper from '@components/ContentWrapper/ContentWrapper';
import Chip from '@components/Chip/Chip';
import TextElement from '@components/TextElement/TextElement';
import Button from '@components/Button/Button';
import SectionHeader from '@components/SectionHeader/SectionHeader';
import { useTranslations } from 'next-intl';
import InteractionCard from '@components/InteractionCard/InteractionCard';
import BigCard from '@components/BigCard/BigCard';
import MyIcon from '@components/MyIcon/MyIcon';
import { getServerTranslations } from '@utils/getServerTranslations';
import topRetro from '@assets/top-retro.svg';
import Image from 'next/image';
import CharacteristicsLayout, {
  SingleData,
} from '@components/CharacteristicsLayout/CharacteristicsLayout';
import classNames from 'classnames';
import { Routes, Section, spixiWebsite } from '@utils/constants';

const st = await getServerTranslations();

const singleInfoData: SingleData[] = [
  {
    icon: 'WidgetsRounded',
    title: st('Ecosystem.robustBlockchain'),
    description: st('Ecosystem.robustDesc'),
  },
  {
    icon: 'ApiRounded',
    title: st('Ecosystem.devTools'),
    description: st('Ecosystem.devToolsDesc'),
  },
  {
    icon: 's2_mark',
    title: st('Ecosystem.overlayNetwork'),
    description: st('Ecosystem.overlayDesc'),
    isCustom: true,
  },
  {
    icon: 'LocalLibraryRounded',
    title: st('Ecosystem.communitySupport'),
    description: st('Ecosystem.communitySupportDesc'),
  },
  {
    icon: 'ixian_logo',
    isCustom: true,
    title: st('Ecosystem.IxiCrypto'),
    description: st('Ecosystem.IxiCryptoDesc'),
  },
];

const EcosystemSection = () => {
  const t = useTranslations('Ecosystem');

  return (
    <ContentWrapper
      sectionClass={classes.ecosystemSection}
      asWrapperSection
      className={classes.ecosystemWrapper}
    >
      <Image priority src={topRetro} alt={'top-retro'} className={'topRetro'} />
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
        ctaContent={
          <>
            <Button
              href={Routes.GET_INVOLVED}
              variant={'primary'}
              leadingIcon={<MyIcon name={'EastRounded'} />}
            >
              {t('exploreEco')}
            </Button>
            <Button
              href={`${Routes.TECHNOLOGY}#${Section.IXI_TOKEN}`}
              variant={'text'}
              leadingIcon={<MyIcon name={'EastRounded'} />}
            >
              {t('whatIsIxi')}
            </Button>
          </>
        }
      />
      <div className={classes.bottomCards}>
        <BigCard
          iconContainer={<MyIcon name={'WalletRounded'} rounded />}
          bgImageVariant={'secondary'}
          className={classes.rowSpan2}
          body={
            <SectionHeader
              className={classes.ecoBigCardSectionHeader}
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
                <Button
                  href={spixiWebsite}
                  isExternal
                  variant={'outlined'}
                  leadingIcon={<MyIcon name={'EastRounded'} />}
                >
                  {t('visitSpixiWebsite')}
                </Button>
              }
            />
          }
        />
        <InteractionCard
          className={classes.minHeight}
          title={t('ixiNames')}
          description={t('namesDesc')}
          fullWidth
          headerAdditionalContent={
            <Chip content={t('inProgress')} variant={'outlined'} />
          }
        />
        <InteractionCard
          className={classNames(
            classes.newFeaturesCardGradient,
            classes.minHeight
          )}
          icon={<MyIcon name={'ViewInArRounded'} rounded />}
          title={t('building')}
          description={t('stayUp')}
          fullWidth
        />
      </div>
      <CharacteristicsLayout data={singleInfoData} />
    </ContentWrapper>
  );
};

export default EcosystemSection;
