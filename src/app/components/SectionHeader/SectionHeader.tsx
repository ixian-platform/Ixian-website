import classes from './SectionHeader.module.scss';
import { ReactNode } from 'react';
import classNames from 'classnames';

export interface SectionHeaderProps {
  className?: string;
  ctaContent?: ReactNode;
  ctaClassName?: string;
  title?: ReactNode;
  subtitle?: ReactNode;
  chipContainer?: ReactNode;
  enableSlideUp?: boolean;
  fullWidth?: boolean;
  inverseText?: boolean;
  centerAll?: boolean;
}

const SectionHeader = ({
  chipContainer,
  className,
  title,
  subtitle,
  ctaContent,
  enableSlideUp,
  ctaClassName,
  fullWidth,
  inverseText,
  centerAll,
}: SectionHeaderProps) => {
  return (
    <section
      className={classNames(classes.sectionHeader, className, {
        [classes.slideUp]: enableSlideUp,
        [classes.fullWidth]: fullWidth,
        [classes.inverseText]: inverseText,
        [classes.centerAll]: centerAll,
      })}
    >
      {chipContainer}
      {title}
      {subtitle}
      {ctaContent && (
        <div className={classNames(classes.ctaSection, ctaClassName)}>
          {ctaContent}
        </div>
      )}
    </section>
  );
};

export default SectionHeader;
