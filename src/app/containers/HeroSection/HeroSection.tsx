import classes from './HeroSection.module.scss';
import ContentWrapper from '@components/ContentWrapper/ContentWrapper';
import SectionHeader from '@components/SectionHeader/SectionHeader';
import TextElement from '@components/TextElement/TextElement';
import Spline from '@splinetool/react-spline/next';
import { ReactNode } from 'react';
import classNames from 'classnames';

interface HeroSectionProps {
  chip?: ReactNode;
  title: ReactNode;
  subtitle: string;
  ctaContent: ReactNode;
  splinePath?: string;
  className?: string;
}

const HeroSection = ({
  title,
  splinePath,
  ctaContent,
  subtitle,
  chip,
  className,
}: HeroSectionProps) => {
  return (
    <ContentWrapper
      asWrapperSection
      sectionClass={classes.wrapperSection}
      className={classNames(classes.heroSection, className)}
    >
      <SectionHeader
        enableSlideUp
        className={classes.customSectionHeader}
        chipContainer={chip}
        title={title}
        subtitle={<TextElement type={'body-md'}>{subtitle}</TextElement>}
        ctaContent={ctaContent}
      />
      {splinePath && (
        <Spline scene={splinePath} className={classes.chipsSpline} />
      )}
    </ContentWrapper>
  );
};

export default HeroSection;
