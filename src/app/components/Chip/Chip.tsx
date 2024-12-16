import classes from './Chip.module.scss';
import classNames from 'classnames';
import TextElement from '@components/TextElement/TextElement';

interface ChipProps {
  content: string;
  variant?: 'primary' | 'outlined';
}

const Chip = ({ variant = 'primary', content }: ChipProps) => {
  return (
    <div className={classNames(classes.chip, classes[variant])}>
      <TextElement type={'label-md'} as={'span'}>
        {content}
      </TextElement>
    </div>
  );
};

export default Chip;
