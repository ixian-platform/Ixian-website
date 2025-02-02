import classes from './HighlightsSection.module.scss';
import TextElement from '@components/TextElement/TextElement';
import MyIcon from '@components/MyIcon/MyIcon';
import Chip from '@components/Chip/Chip';
import SectionHeader from '@components/SectionHeader/SectionHeader';
import { ReactNode } from 'react';
import classNames from 'classnames';

interface HighlightsSectionProps {
  highlightsData: {
    icon: string;
    title: string;
    description: string;
  }[];
  chipName: string;
  title: string;
  subtitle: string;
  ctaContent: ReactNode;
  highlightsClassName?: string;
}

const HighlightsSection = ({
  highlightsData,
  chipName,
  title,
  subtitle,
  ctaContent,
  highlightsClassName,
}: HighlightsSectionProps) => {
  return (
    <section className={classes.wrapper}>
      <SectionHeader
        title={
          <TextElement type={'heading-md'} as={'h1'}>
            {title}
          </TextElement>
        }
        subtitle={
          <TextElement type={'body-md'} as={'h1'}>
            {subtitle}
          </TextElement>
        }
        ctaContent={ctaContent}
        chipContainer={<Chip content={chipName} variant={'outlined'} />}
      />
      <div className={classNames(classes.highlightsInfo, highlightsClassName)}>
        {highlightsData?.map((info, index) => (
          <div key={index} className={classes.singleInfo}>
            <MyIcon name={info.icon} rounded />
            <div>
              <TextElement type={'heading-xs'}>{info.title}</TextElement>
              <TextElement type={'body-sm'}>{info.description}</TextElement>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HighlightsSection;
