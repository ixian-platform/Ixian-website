'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Spline from '@splinetool/react-spline';
import classes from './ParticlesSpline.module.scss';
import { useTheme } from '@/app/providers/ThemeProvider/ThemeProvider';
import { isLowPerformance } from '@utils/performanceUtil';
import classNames from 'classnames';

const darkModeParticlesScene =
  'https://prod.spline.design/T3FkgGinMWJHtzsl/scene.splinecode';
const lightModeParticlesScene =
  'https://prod.spline.design/TC6d9s8K58CKuIvR/scene.splinecode';

const ParticlesSpline = () => {
  const { themeMode } = useTheme();
  const [isLoading, setIsLoading] = useState(true);
  const [isWebGLSupported, setIsWebGLSupported] = useState(false);

  useEffect(() => {
    setIsWebGLSupported(!isLowPerformance());
  }, []);

  const splineScene = useMemo(() => {
    return themeMode === 'light'
      ? lightModeParticlesScene
      : darkModeParticlesScene;
  }, [themeMode]);

  return isWebGLSupported ? (
    <Spline
      onLoad={() => {
        setIsLoading(false);
      }}
      scene={splineScene}
      className={classNames(classes.particlesSpline, {
        [classes.isLoading]: isLoading,
      })}
    />
  ) : null;
};

export default ParticlesSpline;
