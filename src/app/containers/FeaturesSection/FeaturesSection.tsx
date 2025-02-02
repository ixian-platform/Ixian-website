import classes from './FeaturesSection.module.scss';
import ContentWrapper from '@components/ContentWrapper/ContentWrapper';
import Chip from '@components/Chip/Chip';
import TextElement from '@components/TextElement/TextElement';
import Button from '@components/Button/Button';
import InteractionCard from '@components/InteractionCard/InteractionCard';
import Image from 'next/image';
import topRetro from '@assets/top-retro.svg';
import { useTranslations } from 'next-intl';
import SectionHeader from '@components/SectionHeader/SectionHeader';
import illustration from '@assets/illustration.svg';
import BigCard from '@components/BigCard/BigCard';
import MyIcon from '@components/MyIcon/MyIcon';

const FeaturesSection = () => {
  const t = useTranslations();

  return (
    <ContentWrapper
      sectionClass={classes.featuresSection}
      asWrapperSection
      className={classes.featuresWrapper}
    >
      <Image
        priority
        src={topRetro}
        alt={'top-retro'}
        className={classes.topRetro}
      />
      <div className={classes.content}>
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
                leadingIcon={<MyIcon name={'Home'} />}
              >
                {t('lorem')}
              </Button>
              <Button variant={'text'} leadingIcon={<MyIcon name={'Home'} />}>
                {t('lorem')}
              </Button>
            </>
          }
        />
        <div className={classes.featCards}>
          <InteractionCard
            icon={<MyIcon name={'Home'} rounded />}
            title={t('lorem')}
            description={t('lorem')}
            className={classes.colSpan2}
            fullWidth
            bgImageVariant={'secondary'}
            disableScale
          />
          <InteractionCard
            icon={<MyIcon name={'Home'} rounded />}
            title={t('lorem')}
            description={t('lorem')}
            enableHover
          />
          <InteractionCard
            icon={<MyIcon name={'Home'} rounded />}
            title={t('lorem')}
            description={t('lorem')}
            enableHover
          />
          <InteractionCard
            icon={<MyIcon name={'Home'} rounded />}
            title={t('lorem')}
            description={t('lorem')}
            enableHover
          />
          <InteractionCard
            icon={<MyIcon name={'Home'} rounded />}
            title={t('lorem')}
            description={t('lorem')}
            enableHover
          />
          <BigCard
            body={
              <SectionHeader
                title={
                  <TextElement type={'heading-md'} as={'h1'}>
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
                    <Button leadingIcon={<MyIcon name={'Home'} />}>
                      {t('lorem')}
                    </Button>
                    <Button
                      leadingIcon={<MyIcon name={'Home'} />}
                      variant={'text'}
                    >
                      {t('lorem')}
                    </Button>
                  </>
                }
                chipContainer={
                  <Chip content={t('lorem')} variant={'outlined'} />
                }
              />
            }
            absoluteImage={
              <Image
                src={illustration}
                alt={'illustration'}
                className={classes.illustration}
              />
            }
            className={classes.bigCardCustom}
          />
          <InteractionCard
            icon={<MyIcon name={'Home'} rounded />}
            title={t('lorem')}
            description={t('lorem')}
            enableHover
          />
          <InteractionCard
            icon={<MyIcon name={'Home'} rounded />}
            title={t('lorem')}
            description={t('lorem')}
            enableHover
          />
        </div>
      </div>
    </ContentWrapper>
  );
};

export default FeaturesSection;
