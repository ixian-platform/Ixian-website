import classes from './EcosystemSection.module.scss';
import ContentWrapper from '@components/ContentWrapper/ContentWrapper';
import Chip from '@components/Chip/Chip';
import TextElement from '@components/TextElement/TextElement';
import Button from '@components/Button/Button';
import Icon from '@components/Icon/Icon';
import SectionHeader from '@components/SectionHeader/SectionHeader';
import { useTranslations } from 'next-intl';
import InteractionCard from '@components/InteractionCard/InteractionCard';
import BigCard from '@components/BigCard/BigCard';

const singleInfoData = [
  {
    icon: 'bolt',
    title: 'lorem',
    description: 'lorem',
  },
  {
    icon: 'bolt',
    title: 'lorem',
    description: 'lorem',
  },
  {
    icon: 'bolt',
    title: 'lorem',
    description: 'lorem',
  },
  {
    icon: 'bolt',
    title: 'lorem',
    description: 'lorem',
  },
  {
    icon: 'bolt',
    title: 'lorem',
    description: 'lorem',
  },
  {
    icon: 'bolt',
    title: 'lorem',
    description: 'lorem',
  },
];

const EcosystemSection = () => {
  const t = useTranslations();

  return (
    <ContentWrapper
      sectionClass={classes.ecosystemSection}
      wrapperSection
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
              leadingIcon={<Icon iconName={'arrow_right_alt'} />}
            >
              {t('lorem')}
            </Button>
            <Button variant={'text'} leadingIcon={<Icon iconName={'icon'} />}>
              {t('lorem')}
            </Button>
          </>
        }
      />
      <div className={classes.offerInfo}>
        {singleInfoData.map((info, index) => (
          <div key={index} className={classes.singleInfo}>
            <Icon iconName={info.icon} />
            <div>
              <TextElement type={'heading-xs'}>{t(info.title)}</TextElement>
              <TextElement type={'body-sm'}>{t(info.description)}</TextElement>
            </div>
          </div>
        ))}
      </div>
      <div className={classes.bottomCards}>
        <BigCard
          iconContainer={
            <>
              <Icon iconName={'bolt'} />
              <Icon iconName={'bolt'} />
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
                <Button
                  leadingIcon={<Icon iconName={'icon'} variant={'secondary'} />}
                >
                  {t('lorem')}
                </Button>
              }
            />
          }
        />
        <InteractionCard
          icon={<Icon iconName={'bolt'} />}
          title={t('lorem')}
          description={t('lorem')}
          fullWidth
          enableHover
        />
        <InteractionCard
          icon={<Icon iconName={'bolt'} />}
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
