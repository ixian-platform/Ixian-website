import classes from './HeroSection.module.scss';
import ContentWrapper from '@components/ContentWrapper/ContentWrapper';
import SectionHeader from '@components/SectionHeader/SectionHeader';
import TextElement from '@components/TextElement/TextElement';
import Spline from '@splinetool/react-spline/next';
import { ReactNode } from 'react';
import classNames from 'classnames';

type HeroSectionProps =
  | {
      chip?: ReactNode;
      title: ReactNode;
      subtitle: string;
      ctaContent: ReactNode;
      splinePath: string;
      leftContainer?: never;
      className?: string;
    }
  | {
      chip?: ReactNode;
      title: ReactNode;
      subtitle: string;
      ctaContent: ReactNode;
      splinePath?: never;
      leftContainer?: ReactNode;
      className?: string;
    };

const HeroSection = ({
  title,
  splinePath,
  ctaContent,
  subtitle,
  chip,
  leftContainer,
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
        subtitle={<TextElement type={'body-lg'}>{subtitle}</TextElement>}
        ctaContent={ctaContent}
      />
      {/*{splinePath && (*/}
      {/*  <Spline*/}
      {/*    scene={'https://prod.spline.design/zk-AJBS9ZXNtusF6/scene.splinecode'}*/}
      {/*    className={classes.chipsSpline}*/}
      {/*  />*/}
      {/*)}*/}
      {leftContainer}
    </ContentWrapper>
  );
};

export default HeroSection;
