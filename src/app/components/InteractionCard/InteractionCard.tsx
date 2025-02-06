import classes from './InteractionCard.module.scss';
import { ReactNode } from 'react';
import classNames from 'classnames';
import Link from 'next/link';
import MyIcon from '@components/MyIcon/MyIcon';

interface InteractionCardProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  className?: string;
  fullWidth?: boolean;
  enableHover?: boolean;
  disableScale?: boolean;
  bgImageVariant?: 'primary' | 'secondary';
  enableHoverImage?: boolean;
  hoverImageType?: 'access' | 'dapps' | 'enterprise' | 'iot';
  additionalContent?: ReactNode;
  headerAdditionalContent?: ReactNode;
  linkHref?: string;
  titleClassName?: string;
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
  enableHoverImage,
  additionalContent,
  linkHref,
  headerAdditionalContent,
  hoverImageType,
  titleClassName,
}: InteractionCardProps) => {
  return (
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
          [classes.enableHoverImage]: enableHoverImage,
        }
      )}
    >
      <div className={classes.content}>
        {headerAdditionalContent}
        {icon && <div className={classes.icon}>{icon}</div>}
        <h3 className={classNames(classes.title, titleClassName)}>{title}</h3>
        {description && <p className={classes.description}>{description}</p>}
      </div>
      {linkHref && (
        <Link className={classes.arrowLink} href={linkHref}>
          <MyIcon name={'EastRounded'} rounded />
        </Link>
      )}
      {additionalContent}
    </div>
  );
};

export default InteractionCard;
