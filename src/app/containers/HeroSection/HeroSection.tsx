import classes from './HeroSection.module.scss';
import ContentWrapper from '@components/ContentWrapper/ContentWrapper';
import SectionHeader from '@components/SectionHeader/SectionHeader';
import TextElement from '@components/TextElement/TextElement';
import { ReactNode } from 'react';
import classNames from 'classnames';

interface HeroSectionProps {
  chip?: ReactNode;
  title: ReactNode;
  subtitle: string;
  ctaContent?: ReactNode;
  leftContainer?: ReactNode;
  className?: string;
  sectionClassName?: string;
}

const HeroSection = ({
  title,
  ctaContent,
  subtitle,
  chip,
  leftContainer,
  className,
  sectionClassName,
}: HeroSectionProps) => {
  return (
    <ContentWrapper
      asWrapperSection
      sectionClass={classNames(classes.wrapperSection, sectionClassName)}
      className={classNames(classes.heroSection, className)}
    >
      <SectionHeader
        enableSlideUp
        className={classes.customSectionHeader}
        chipContainer={chip}
        title={title}
        subtitle={<TextElement type={'body-lg'}>{subtitle}</TextElement>}
        ctaContent={ctaContent}
      />
      {leftContainer}
    </ContentWrapper>
  );
};

export default HeroSection;
