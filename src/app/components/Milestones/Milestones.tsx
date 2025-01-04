'use client';

import classes from './Milestones.module.scss';
import TextElement from '@components/TextElement/TextElement';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import classNames from 'classnames';
import MyIcon from '@components/MyIcon/MyIcon';

interface Milestone {
  title: string;
  description: string;
}

interface MilestonesData {
  index: number;
  year: string;
  milestones: Milestone[];
}

const milestonesData: MilestonesData[] = [
  {
    index: 0,
    year: '2017',
    milestones: [
      {
        title: 'Developed and deployed Ixian Prototypes',
        description: 'Ixian DLT Prototype, Ixian S2 prototype and Spixi...',
      },
      {
        title: 'Did something else',
        description: 'something else...',
      },
    ],
  },
  {
    index: 1,
    year: '2018',
    milestones: [
      {
        title: 'Spixi app launch',
        description: 'We launched the Spixi app...',
      },
    ],
  },
];

const Milestones = () => {
  const t = useTranslations();
  const [selectedMilestone, setSelectedMilestone] = useState<MilestonesData>(
    milestonesData[0]
  );

  return (
    <section className={classes.milestones}>
      <TextElement type={'heading-sm'}>{t('lorem')}</TextElement>
      <div className={classes.years}>
        {milestonesData?.map((item) => (
          <TextElement
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
          <MyIcon name={'arrow_back_ios_new'} />
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
          <MyIcon name={'arrow_forward_ios'} />
        </div>
      </div>
    </section>
  );
};

export default Milestones;
