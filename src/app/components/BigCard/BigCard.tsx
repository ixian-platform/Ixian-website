import classes from './BigCard.module.scss';

import { ReactNode } from 'react';
import classNames from 'classnames';

interface BigCardProps {
  bgImageVariant?: 'primary' | 'secondary' | 'tertiary';
  absoluteImage?: ReactNode;
  className?: string;
  iconContainer?: ReactNode;
  body: ReactNode;
}

const BigCard = ({
  className,
  iconContainer,
  bgImageVariant = 'primary',
  absoluteImage,
  body,
}: BigCardProps) => {
  return (
    <div
      className={classNames(
        classes.bigCard,
        className,
        classes[bgImageVariant]
      )}
    >
      {absoluteImage}
      <div className={classes.icons}>{iconContainer}</div>
      {body}
    </div>
  );
};

export default BigCard;
