import classes from './WhyIxian.module.scss';
import ContentWrapper from '@components/ContentWrapper/ContentWrapper';
import TextElement from '@components/TextElement/TextElement';
import { useTranslations } from 'next-intl';
import SectionHeader from '@components/SectionHeader/SectionHeader';
import Chip from '@components/Chip/Chip';
import MyIcon from '@components/MyIcon/MyIcon';
import InteractionCard from '@components/InteractionCard/InteractionCard';

const singleInfoData = [
  {
    icon: 'Home',
    title: 'lorem',
    description: 'lorem',
  },
  {
    icon: 'Home',
    title: 'lorem',
    description: 'lorem',
  },
  {
    icon: 'Home',
    title: 'lorem',
    description: 'lorem',
  },
  {
    icon: 'Home',
    title: 'lorem',
    description: 'lorem',
  },
  {
    icon: 'Home',
    title: 'lorem',
    description: 'lorem',
  },
  {
    icon: 'Home',
    title: 'lorem',
    description: 'lorem',
  },
];

const WhyIxian = () => {
  const t = useTranslations();

  return (
    <ContentWrapper
      asWrapperSection
      sectionClass={classes.whyIxianSection}
      className={classes.whyIxianWrapper}
    >
      <SectionHeader
        chipContainer={<Chip content={t('lorem')} variant={'primary'} />}
        title={<TextElement type={'heading-md'}>{t('lorem')}</TextElement>}
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
      <section className={classes.keyResources}>
        <TextElement type={'heading-sm'}>{t('lorem')}</TextElement>
        <div className={classes.infoItems}>
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
        </div>
      </section>
    </ContentWrapper>
  );
};

export default WhyIxian;
