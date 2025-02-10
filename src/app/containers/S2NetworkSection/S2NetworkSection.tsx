import classes from '../IxianDltSection/IxianDltSection.module.scss';
import ContentWrapper from '@components/ContentWrapper/ContentWrapper';
import { useTranslations } from 'next-intl';
import SectionHeader from '@components/SectionHeader/SectionHeader';
import Chip from '@components/Chip/Chip';
import TextElement from '@components/TextElement/TextElement';
import InteractionCard from '@components/InteractionCard/InteractionCard';
import MyIcon from '@components/MyIcon/MyIcon';
import Button from '@components/Button/Button';

const S2NetworkSection = () => {
  const t = useTranslations('TechnologyPage.ixianS2');

  return (
    <ContentWrapper
      asWrapperSection
      sectionClass={classes.ixianDltSection}
      className={classes.ixianDltContainer}
    >
      <SectionHeader
        chipContainer={<Chip content={t('chip')} variant={'outlined'} />}
        title={<TextElement type={'display-md'}>{t('title')}</TextElement>}
        subtitle={<TextElement type={'body-md'}>{t('subtitle')}</TextElement>}
        ctaContent={
          <Button leadingIcon={<MyIcon name={'EastRounded'} />}>
            {t('cta')}
          </Button>
        }
      />
      <div className={classes.infoItems}>
        <InteractionCard
          icon={<MyIcon name={'GraphicEqRounded'} rounded />}
          title={t('card1.title')}
          description={t('card1.subtitle')}
          fullWidth
        />
        <InteractionCard
          icon={<MyIcon customName={'s2_mark'} rounded />}
          title={t('card2.title')}
          description={t('card2.subtitle')}
          fullWidth
        />
        <InteractionCard
          icon={<MyIcon name={'ShieldRounded'} rounded />}
          title={t('card3.title')}
          description={t('card3.subtitle')}
          fullWidth
        />
      </div>
    </ContentWrapper>
  );
};

export default S2NetworkSection;
