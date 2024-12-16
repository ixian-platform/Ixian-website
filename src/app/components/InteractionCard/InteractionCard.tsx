import classes from './InteractionCard.module.scss';
import { ReactNode } from 'react';
import classNames from 'classnames';

interface InteractionCardProps {
  icon?: ReactNode;
  title: string;
  description: string;
  className?: string;
  fullWidth?: boolean;
  enableHover?: boolean;
  disableScale?: boolean;
  bgImageVariant?: 'primary' | 'secondary';
  enableHoverImage?: boolean;
  additionalContent?: ReactNode;
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
}: InteractionCardProps) => {
  return (
    <div
      className={classNames(
        classes.interactionCard,
        className,
        classes[bgImageVariant],
        {
          [classes.fullWidth]: fullWidth,
          [classes.enableHover]: enableHover,
          [classes.disableScale]: disableScale,
          [classes.enableHoverImage]: enableHoverImage,
        }
      )}
    >
      <div className={classes.content}>
        {icon && <div className={classes.icon}>{icon}</div>}
        <h3 className={classes.title}>{title}</h3>
        <p className={classes.description}>{description}</p>
      </div>
      {additionalContent}
    </div>
  );
};

export default InteractionCard;
