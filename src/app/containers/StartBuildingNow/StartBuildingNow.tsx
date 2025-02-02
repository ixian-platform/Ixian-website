import classes from './StartBuildingNow.module.scss';
import ContentWrapper from '@components/ContentWrapper/ContentWrapper';
import SectionHeader from '@components/SectionHeader/SectionHeader';
import TextElement from '@components/TextElement/TextElement';
import { useTranslations } from 'next-intl';
import Button from '@components/Button/Button';
import MyIcon from '@components/MyIcon/MyIcon';

const StartBuildingNow = () => {
  const t = useTranslations('TechnologyPage.startBuilding');

  return (
    <ContentWrapper
      asWrapperSection
      sectionClass={classes.startBuildingSection}
      className={classes.startBuildingContainer}
    >
      <SectionHeader
        className={classes.startBuildingCustomSectionHeader}
        title={<TextElement type={'display-md'}>{t('title')}</TextElement>}
        subtitle={<TextElement type={'body-md'}>{t('subtitle')}</TextElement>}
        ctaContent={
          <Button
            variant={'outlined-2'}
            leadingIcon={<MyIcon name={'ChangeCircleRounded'} />}
          >
            {t('cta')}
          </Button>
        }
      />
    </ContentWrapper>
  );
};

export default StartBuildingNow;
