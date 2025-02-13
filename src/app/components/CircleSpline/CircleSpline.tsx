'use client';

import React from 'react';
import Spline from '@splinetool/react-spline';
import classes from './CircleSpline.module.scss';

const CircleSpline = () => {
  return (
    <Spline
      scene={'/assets/spline/circle.spline'}
      className={classes.circleSpline}
    />
  );
};

export default CircleSpline;
