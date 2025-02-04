import classes from './Chip.module.scss';
import classNames from 'classnames';
import TextElement from '@components/TextElement/TextElement';

interface ChipProps {
  content: string;
  variant?: 'primary' | 'outlined';
  className?: string;
  isTextInversed?: boolean;
}

const Chip = ({
  variant = 'primary',
  content,
  className,
  isTextInversed,
}: ChipProps) => {
  return (
    <div
      className={classNames(
        classes.chip,
        classes[variant],
        {
          [classes.textInverse]: isTextInversed,
        },
        className
      )}
    >
      <TextElement type={'label-md'} as={'span'}>
        {content}
      </TextElement>
    </div>
  );
};

export default Chip;
