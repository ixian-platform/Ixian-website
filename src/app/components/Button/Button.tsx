import React, { ButtonHTMLAttributes, ReactNode } from 'react';
import classNames from 'classnames';
import classes from './Button.module.scss';
import Link from 'next/link';

type ButtonVariant = 'primary' | 'outlined' | 'text' | 'outlined-2';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: ButtonVariant;
  className?: string;
  trailingIcon?: ReactNode;
  leadingIcon?: ReactNode;
  href?: string;
  isExternal?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  className,
  trailingIcon,
  leadingIcon,
  href,
  isExternal,
  ...props
}) => {
  const button = (
    <button
      className={classNames(classes.button, classes[variant], className)}
      {...props}
    >
      {leadingIcon}
      {children}
      {trailingIcon}
    </button>
  );

  if (href) {
    return (
      <Link href={href} passHref target={isExternal ? '_blank' : undefined}>
        {button}
      </Link>
    );
  }

  return button;
};

export default Button;
