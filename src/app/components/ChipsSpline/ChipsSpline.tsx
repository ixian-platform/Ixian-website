'use client';

import React from 'react';
import Spline from '@splinetool/react-spline';
import classes from './ChipsSpline.module.scss';

const ChipsSpline = () => {
  return (
    <Spline
      scene={'/assets/spline/chips.spline'}
      className={classes.chipsSpline}
    />
  );
};

export default ChipsSpline;
