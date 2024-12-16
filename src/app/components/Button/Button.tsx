import React, { ButtonHTMLAttributes, ReactNode } from 'react';
import classNames from 'classnames';
import classes from './Button.module.scss';

type ButtonVariant = 'primary' | 'outlined' | 'text' | 'outlined-2';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: ButtonVariant;
  className?: string;
  trailingIcon?: ReactNode;
  leadingIcon?: ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  className,
  trailingIcon,
  leadingIcon,
  ...props
}) => {
  return (
    <button
      className={classNames(classes.button, classes[variant], className)}
      {...props}
    >
      {leadingIcon}
      {children}
      {trailingIcon}
    </button>
  );
};

export default Button;
