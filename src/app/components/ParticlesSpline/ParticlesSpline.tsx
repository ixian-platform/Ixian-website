'use client';

import React, { useMemo } from 'react';
import Spline from '@splinetool/react-spline';
import classes from './ParticlesSpline.module.scss';
import { useTheme } from '@/app/providers/ThemeProvider/ThemeProvider';

const darkModeParticlesScene =
  'https://prod.spline.design/T3FkgGinMWJHtzsl/scene.splinecode';
const lightModeParticlesScene =
  'https://prod.spline.design/TC6d9s8K58CKuIvR/scene.splinecode';

const ParticlesSpline = () => {
  const { themeMode } = useTheme();

  const splineScene = useMemo(() => {
    return themeMode === 'light'
      ? lightModeParticlesScene
      : darkModeParticlesScene;
  }, [themeMode]);

  return <Spline scene={splineScene} className={classes.particlesSpline} />;
};

export default ParticlesSpline;
