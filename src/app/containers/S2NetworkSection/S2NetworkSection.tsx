import classes from '../IxianDltSection/IxianDltSection.module.scss';
import ContentWrapper from '@components/ContentWrapper/ContentWrapper';
import { useTranslations } from 'next-intl';
import SectionHeader from '@components/SectionHeader/SectionHeader';
import Chip from '@components/Chip/Chip';
import TextElement from '@components/TextElement/TextElement';
import InteractionCard from '@components/InteractionCard/InteractionCard';
import MyIcon from '@components/MyIcon/MyIcon';
import Button from '@components/Button/Button';
import { Section, startS2 } from '@utils/constants';
import classNames from 'classnames';

const S2NetworkSection = () => {
  const t = useTranslations('TechnologyPage.ixianS2');

  return (
    <ContentWrapper
      asWrapperSection
      sectionClass={classes.ixianDltSection}
      className={classNames(classes.ixianDltContainer, classes.noPaddingTop)}
      sectionId={Section.IXIAN_S2_NETWORK}
    >
      <SectionHeader
        chipContainer={<Chip content={t('chip')} variant={'outlined'} />}
        title={<TextElement type={'display-md'}>{t('title')}</TextElement>}
        subtitle={<TextElement type={'body-md'}>{t('subtitle')}</TextElement>}
        ctaContent={
          <Button
            href={startS2}
            isExternal
            leadingIcon={<MyIcon name={'EastRounded'} />}
          >
            {t('cta')}
          </Button>
        }
      />
      <div className={classes.infoItems}>
        <InteractionCard
          icon={<MyIcon name={'DeviceHubRounded'} rounded />}
          title={t('card1.title')}
          description={t('card1.subtitle')}
          fullWidth
        />
        <InteractionCard
          icon={<MyIcon name={'AutoModeRounded'} rounded />}
          title={t('card2.title')}
          description={t('card2.subtitle')}
          fullWidth
        />
        <InteractionCard
          icon={<MyIcon name={'AutoAwesomeMotionRounded'} rounded />}
          title={t('card3.title')}
          description={t('card3.subtitle')}
          fullWidth
        />
      </div>
    </ContentWrapper>
  );
};

export default S2NetworkSection;
