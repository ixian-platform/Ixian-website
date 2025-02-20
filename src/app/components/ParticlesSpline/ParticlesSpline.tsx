'use client';

import React from 'react';
import Spline from '@splinetool/react-spline';
import classes from './ParticlesSpline.module.scss';

const ParticlesSpline = () => {
  return (
    <Spline
      scene={'https://prod.spline.design/T3FkgGinMWJHtzsl/scene.splinecode'}
      className={classes.particlesSpline}
    />
  );
};

export default ParticlesSpline;
