import classes from './ContentWrapper.module.scss';
import { PropsWithChildren } from 'react';
import classNames from 'classnames';

interface ContentWrapperProps extends PropsWithChildren {
  className?: string;
  asWrapperSection?: boolean;
  sectionClass?: string;
  sectionId?: string;
}

const ContentWrapper = ({
  className,
  asWrapperSection,
  sectionClass,
  sectionId,
  children,
}: ContentWrapperProps) => {
  if (asWrapperSection) {
    return (
      <section
        className={classNames(classes.sectionWrapper, sectionClass)}
        id={sectionId}
      >
        <div className={classNames(classes.contentWrapper, className)}>
          {children}
        </div>
      </section>
    );
  }

  return (
    <div className={classNames(classes.contentWrapper, className)}>
      {children}
    </div>
  );
};

export default ContentWrapper;
