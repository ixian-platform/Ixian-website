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

const st = await getServerTranslations();

const singleInfoData: SingleData[] = [
  {
    icon: 'ViewInArRounded',
    title: st('Ecosystem.robustBlockchain'),
    description: st('Ecosystem.robustDesc'),
  },
  {
    icon: 'HomeRepairServiceRounded',
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
    icon: 'PeopleRounded',
    title: st('Ecosystem.communitySupport'),
    description: st('Ecosystem.communitySupportDesc'),
  },
  {
    icon: 'CompareArrowsRounded',
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
        ctaContent={
          <>
            <Button
              variant={'primary'}
              leadingIcon={<MyIcon name={'EastRounded'} />}
            >
              {t('exploreEco')}
            </Button>
            <Button
              variant={'text'}
              leadingIcon={<MyIcon customName={'ixian_logo'} />}
            >
              {t('whatIsIxi')}
            </Button>
          </>
        }
      />
      <div className={classes.bottomCards}>
        <BigCard
          iconContainer={
            <>
              <MyIcon customName={'spixi_logo'} rounded />
              <MyIcon name={'WalletRounded'} rounded />
            </>
          }
          bgImageVariant={'secondary'}
          className={classes.rowSpan2}
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
                <Button
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
            <Chip content={t('comingSoon')} variant={'outlined'} />
          }
        />
        <InteractionCard
          className={classNames(
            classes.newFeaturesCardGradient,
            classes.minHeight
          )}
          icon={<MyIcon name={'AutoAwesomeRounded'} rounded />}
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
