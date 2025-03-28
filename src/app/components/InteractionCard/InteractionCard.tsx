import classes from './InteractionCard.module.scss';
import { Fragment, ReactNode } from 'react';
import classNames from 'classnames';
import Link from 'next/link';

interface InteractionCardProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  className?: string;
  fullWidth?: boolean;
  enableHover?: boolean;
  disableScale?: boolean;
  bgImageVariant?: 'primary' | 'secondary';
  hoverImageType?: 'access' | 'dapps' | 'enterprise' | 'iot';
  additionalContent?: ReactNode;
  headerAdditionalContent?: ReactNode;
  onHoverHeader?: ReactNode;
  titleClassName?: string;
  href?: string;
  isExternal?: boolean;
}

const InteractionCard = ({
  icon,
  title,
  description,
  fullWidth,
  className,
  enableHover,
  disableScale,
  bgImageVariant = 'primary',
  additionalContent,
  onHoverHeader,
  headerAdditionalContent,
  hoverImageType,
  titleClassName,
  href,
  isExternal,
}: InteractionCardProps) => {
  const cardContent = (
    <Fragment>
      <div className={classes.content}>
        {headerAdditionalContent}
        {icon && <div className={classes.icon}>{icon}</div>}
        <h3 className={classNames(classes.title, titleClassName)}>{title}</h3>
        {description && <p className={classes.description}>{description}</p>}
      </div>
      {onHoverHeader && (
        <div className={classes.onHoverHeader}>{onHoverHeader}</div>
      )}
      {additionalContent}
    </Fragment>
  );

  return href ? (
    <Link
      href={href}
      target={isExternal ? '_blank' : undefined}
      passHref
      className={classNames(
        classes.interactionCard,
        className,
        classes[bgImageVariant],
        classes[hoverImageType || ''],
        {
          [classes.fullWidth]: fullWidth,
          [classes.enableHover]: enableHover,
          [classes.disableScale]: disableScale,
          [classes.enableHoverImage]: !!hoverImageType,
        }
      )}
    >
      {cardContent}
    </Link>
  ) : (
    <div
      className={classNames(
        classes.interactionCard,
        className,
        classes[bgImageVariant],
        classes[hoverImageType || ''],
        {
          [classes.fullWidth]: fullWidth,
          [classes.enableHover]: enableHover,
          [classes.disableScale]: disableScale,
          [classes.enableHoverImage]: !!hoverImageType,
        }
      )}
    >
      {cardContent}
    </div>
  );
};

export default InteractionCard;
