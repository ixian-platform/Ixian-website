'use client';

import classes from './Milestones.module.scss';
import TextElement from '@components/TextElement/TextElement';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import classNames from 'classnames';
import MyIcon from '@components/MyIcon/MyIcon';
import { MilestonesData, milestonesData } from '@utils/milestonesUtils';

const Milestones = () => {
  const t = useTranslations('TechnologyPage.milestones');
  const [selectedMilestone, setSelectedMilestone] = useState<MilestonesData>(
    milestonesData[0]
  );

  return (
    <section className={classes.milestones}>
      <TextElement type={'heading-sm'}>{t('title')}</TextElement>
      <div className={classes.years}>
        {milestonesData?.map((item) => (
          <TextElement
            style={{ cursor: 'pointer' }}
            onClick={() => setSelectedMilestone(item)}
            key={item.index}
            type={
              selectedMilestone?.year === item.year ? 'label-lg' : 'body-lg'
            }
            className={classNames({
              [classes.yearSelected]: selectedMilestone?.year === item.year,
            })}
          >
            {item.year}
          </TextElement>
        ))}
      </div>
      <div className={classes.selectedContent}>
        {selectedMilestone?.milestones.map((milestone) => (
          <div key={milestone.title} className={classes.milestone}>
            <TextElement type={'label-lg'}>{milestone.title}</TextElement>
            <TextElement type={'body-md'}>{milestone.description}</TextElement>
          </div>
        ))}
      </div>
      <div className={classes.switcher}>
        <div
          onClick={() =>
            setSelectedMilestone(milestonesData[selectedMilestone?.index - 1])
          }
          className={classNames(classes.singleSwitch, {
            [classes.disabled]: selectedMilestone === milestonesData[0],
          })}
        >
          <MyIcon name={'ArrowBackIosRounded'} />
        </div>
        <div
          onClick={() =>
            setSelectedMilestone(milestonesData[selectedMilestone?.index + 1])
          }
          className={classNames(classes.singleSwitch, {
            [classes.disabled]:
              selectedMilestone === milestonesData[milestonesData.length - 1],
          })}
        >
          <MyIcon name={'ArrowForwardIosRounded'} />
        </div>
      </div>
    </section>
  );
};

export default Milestones;
