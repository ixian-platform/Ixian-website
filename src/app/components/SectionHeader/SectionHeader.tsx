import classes from './SectionHeader.module.scss';
import { ReactNode } from 'react';
import classNames from 'classnames';

export interface SectionHeaderProps {
  className?: string;
  ctaContent?: ReactNode;
  title: ReactNode;
  subtitle?: ReactNode;
  chipContainer?: ReactNode;
  enableSlideUp?: boolean;
}

const SectionHeader = ({
  chipContainer,
  className,
  title,
  subtitle,
  ctaContent,
  enableSlideUp,
}: SectionHeaderProps) => {
  return (
    <section
      className={classNames(classes.sectionHeader, className, {
        [classes.slideUp]: enableSlideUp,
      })}
    >
      {chipContainer}
      {title}
      {subtitle}
      <div className={classes.ctaSection}>{ctaContent}</div>
    </section>
  );
};

export default SectionHeader;
