'use client';

import { useMemo } from 'react';
import { useTheme } from '@/app/providers/ThemeProvider/ThemeProvider';
import Image from 'next/image';
import classes from './MyIcon.module.scss';

interface MyIconProps {
  name: string;
  width?: number;
  height?: number;
  rounded?: boolean;
}

const MyIcon = ({ name, width = 24, height = 24, rounded }: MyIconProps) => {
  const { themeMode } = useTheme();

  const iconPath = useMemo(() => {
    return `/assets/icons/${themeMode === 'dark' ? 'dark' : 'light'}/${name}.svg`;
  }, [name, themeMode]);

  if (rounded) {
    return (
      <div className={classes.rounded}>
        <Image
          src={iconPath}
          alt={name || 'icon'}
          width={width}
          height={height}
          priority
        />
      </div>
    );
  }

  return (
    <Image
      src={iconPath}
      alt={name || 'icon'}
      width={width}
      height={height}
      priority
    />
  );
};

export default MyIcon;
