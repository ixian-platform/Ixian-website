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

const st = await getServerTranslations();

const singleInfoData = [
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
    icon: 'WidgetsRounded',
    title: st('Ecosystem.overlayNetwork'),
    description: st('Ecosystem.overlayDesc'),
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
              leadingIcon={<MyIcon name={'ArrowRightAltRounded'} />}
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
              className={classes.bigCardBody}
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
                <Button leadingIcon={<MyIcon name={'Home'} />}>
                  {t('visitSpixiWebsite')}
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
          headerAdditionalContent={
            <Chip content={t('comingSoon')} variant={'outlined'} />
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
      <div className={classes.offerInfo}>
        {singleInfoData.map((info, index) => (
          <div key={index} className={classes.singleInfo}>
            <MyIcon name={info.icon} rounded />
            <div>
              <TextElement type={'heading-xs'}>{info.title}</TextElement>
              <TextElement type={'body-sm'}>{info.description}</TextElement>
            </div>
          </div>
        ))}
      </div>
    </ContentWrapper>
  );
};

export default EcosystemSection;
