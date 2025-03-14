import React from 'react';
import MyIcon from '@components/MyIcon/MyIcon';
import TextElement from '@components/TextElement/TextElement';
import classes from './CharacteristicsLayout.module.scss';
import classNames from 'classnames';

export interface SingleData {
  icon: string;
  title: string;
  description: string;
  isCustom?: boolean;
}

interface CharacteristicsLayoutProps {
  data: SingleData[];
  className?: string;
  singleInfoClassName?: string;
  isInverse?: boolean;
}

const CharacteristicsLayout = ({
  data,
  className,
  singleInfoClassName,
  isInverse,
}: CharacteristicsLayoutProps) => {
  return (
    <div
      className={classNames(classes.infoContainer, className, {
        [classes.inverse]: isInverse,
      })}
    >
      {data?.map((info, index) => (
        <div
          key={index}
          className={classNames(classes.singleInfo, singleInfoClassName)}
        >
          {info?.isCustom ? (
            <MyIcon customName={info.icon} rounded />
          ) : (
            <MyIcon name={info.icon} rounded />
          )}
          <div className={classes.textContainer}>
            <TextElement type={'heading-xs'}>{info.title}</TextElement>
            <TextElement type={'body-sm'}>{info.description}</TextElement>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CharacteristicsLayout;
