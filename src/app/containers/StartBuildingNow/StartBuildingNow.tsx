import classes from './StartBuildingNow.module.scss';
import ContentWrapper from '@components/ContentWrapper/ContentWrapper';
import SectionHeader from '@components/SectionHeader/SectionHeader';
import TextElement from '@components/TextElement/TextElement';
import { ReactNode } from 'react';

interface StartBuildingNowProps {
  title: string;
  subtitle: string;
  cta: ReactNode;
}

const StartBuildingNow = ({ title, subtitle, cta }: StartBuildingNowProps) => {
  return (
    <ContentWrapper
      asWrapperSection
      sectionClass={classes.startBuildingSection}
      className={classes.startBuildingContainer}
    >
      <SectionHeader
        className={classes.startBuildingCustomSectionHeader}
        title={<TextElement type={'display-md'}>{title}</TextElement>}
        subtitle={<TextElement type={'body-md'}>{subtitle}</TextElement>}
        ctaContent={cta}
      />
    </ContentWrapper>
  );
};

export default StartBuildingNow;
