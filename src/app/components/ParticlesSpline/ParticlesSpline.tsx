'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useTheme } from '@/app/providers/ThemeProvider/ThemeProvider';
import { isLowPerformance } from '@utils/performanceUtil';
import classNames from 'classnames';
import classes from './ParticlesSpline.module.scss';

const darkModeParticlesScene =
  'https://prod.spline.design/T3FkgGinMWJHtzsl/scene.splinecode';
const lightModeParticlesScene =
  'https://prod.spline.design/TC6d9s8K58CKuIvR/scene.splinecode';

type SplineProps = {
  scene: string;
  onLoad?: () => void;
  className?: string;
};

function supportsWebGL2(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return !!canvas.getContext('webgl2');
  } catch {
    return false;
  }
}

export default function ParticlesSpline() {
  const { themeMode } = useTheme();
  const [Spline, setSpline] = useState<React.ComponentType<SplineProps> | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const splineScene = useMemo(
    () => (themeMode === 'light' ? lightModeParticlesScene : darkModeParticlesScene),
    [themeMode]
  );

  useEffect(() => {
    if (!isLowPerformance() && supportsWebGL2()) {
      import('@splinetool/react-spline').then((mod) => {
        setSpline(() => mod.default);
      });
    }
  }, []);

  if (!Spline) return null;

  return (
    <Spline
      scene={splineScene}
      onLoad={() => setIsLoading(false)}
      className={classNames(classes.particlesSpline, {
        [classes.isLoading]: isLoading,
      })}
    />
  );
}
