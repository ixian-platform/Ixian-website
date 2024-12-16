import classes from './BorderWrapper.module.scss';
import { PropsWithChildren } from 'react';

interface BorderWrapperProps extends PropsWithChildren {
  radius: string;
  borderWidth: string;
  color: string;
}

const BorderWrapper = ({
  radius,
  borderWidth,
  color,
  children,
}: BorderWrapperProps) => {
  const style = {
    '--border-radius': radius,
    '--border-width': borderWidth,
    '--border-color': color,
  } as React.CSSProperties;

  return (
    <div className={classes.box} style={style}>
      {children}
    </div>
  );
};

export default BorderWrapper;
