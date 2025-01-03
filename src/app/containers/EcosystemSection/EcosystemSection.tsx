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

const singleInfoData = [
  {
    icon: 'ixian_logo',
    title: 'lorem',
    description: 'lorem',
  },
  {
    icon: 'avg_pace',
    title: 'lorem',
    description: 'lorem',
  },
  {
    icon: 'widgets',
    title: 'lorem',
    description: 'lorem',
  },
  {
    icon: 'all_match',
    title: 'lorem',
    description: 'lorem',
  },
  {
    icon: 'compare_arrows',
    title: 'lorem',
    description: 'lorem',
  },
  {
    icon: 'call_split',
    title: 'lorem',
    description: 'lorem',
  },
];

const EcosystemSection = () => {
  const t = useTranslations();

  return (
    <ContentWrapper
      sectionClass={classes.ecosystemSection}
      asWrapperSection
      className={classes.ecosystemWrapper}
    >
      <SectionHeader
        chipContainer={<Chip content={t('lorem')} variant={'outlined'} />}
        title={
          <TextElement type={'heading-lg'} as={'h1'}>
            {t('lorem')}
          </TextElement>
        }
        subtitle={
          <TextElement type={'body-md'} as={'h1'}>
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
      <div className={classes.bottomCards}>
        <BigCard
          iconContainer={
            <>
              <MyIcon name={'spixi_logo'} rounded />
              <MyIcon name={'wallet'} rounded />
            </>
          }
          bgImageVariant={'secondary'}
          className={classes.rowSpan2}
          body={
            <SectionHeader
              className={classes.bigCardBody}
              chipContainer={<Chip content={t('lorem')} variant={'outlined'} />}
              title={
                <TextElement type={'heading-lg'} as={'h1'}>
                  {t('lorem')}
                </TextElement>
              }
              subtitle={
                <TextElement type={'body-md'} as={'h1'}>
                  {t('lorem')}
                </TextElement>
              }
              ctaContent={
                <Button leadingIcon={<MyIcon name={'spixi_logo'} />}>
                  {t('lorem')}
                </Button>
              }
            />
          }
        />
        <InteractionCard
          icon={<MyIcon name={'ixinames'} rounded />}
          title={t('lorem')}
          description={t('lorem')}
          fullWidth
          enableHover
        />
        <InteractionCard
          icon={<MyIcon name={'ar_stickers'} rounded />}
          title={t('lorem')}
          description={t('lorem')}
          fullWidth
          enableHover
        />
      </div>
    </ContentWrapper>
  );
};

export default EcosystemSection;
