import classes from './TextElement.module.scss';
import {
  ComponentPropsWithoutRef,
  ElementType,
  PropsWithChildren,
} from 'react';
import classNames from 'classnames';

type TextAsTypes = 'span' | 'div' | 'p' | 'h1';
type TextTypes =
  | 'display-lg'
  | 'display-md'
  | 'heading-lg'
  | 'heading-md'
  | 'heading-sm'
  | 'heading-xs'
  | 'label-lg'
  | 'label-md'
  | 'label-sm'
  | 'label-xs'
  | 'body-lg'
  | 'body-md'
  | 'body-sm'
  | 'body-xs';

interface TextProps extends PropsWithChildren {
  className?: string;
  as?: TextAsTypes;
  type: TextTypes;
}

const TextElement = ({
  className,
  as = 'p',
  type,
  children,
  ...props
}: TextProps & ComponentPropsWithoutRef<TextAsTypes>) => {
  const Component = as as ElementType;
  const typeClass = type ? classes[type] : '';

  return (
    <Component
      className={classNames(classes.textElement, typeClass, className)}
      {...props}
    >
      {children}
    </Component>
  );
};

export default TextElement;
