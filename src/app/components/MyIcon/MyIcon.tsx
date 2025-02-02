'use client';

import classes from './MyIcon.module.scss';
import * as MuiIcons from '@mui/icons-material';
import { useEffect, useMemo, useState } from 'react';
import { useTheme } from '@/app/providers/ThemeProvider/ThemeProvider';
import Image from 'next/image';
import { SvgIconComponent } from '@mui/icons-material';

interface MyIconBaseProps {
  width?: number;
  height?: number;
  rounded?: boolean;
  color?: string;
}

type MyIconProps =
  | ({ name: string; customName?: never } & MyIconBaseProps) // If `name` is defined, `customName` cannot exist
  | ({ customName: string; name?: never } & MyIconBaseProps);

const MyIcon = ({
  name,
  width = 24,
  height = 24,
  rounded,
  color = 'var(--colors-icon-01)',
  customName,
}: MyIconProps) => {
  const [isClient, setIsClient] = useState(false);
  const { themeMode } = useTheme();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const iconPath = useMemo(() => {
    return `/assets/icons/${themeMode === 'dark' ? 'dark' : 'light'}/${customName}.svg`;
  }, [customName, themeMode]);

  if (iconPath && customName) {
    return rounded ? (
      <div className={classes.rounded}>
        <Image
          src={iconPath}
          alt={customName || 'icon'}
          width={width}
          height={height}
          priority
        />
      </div>
    ) : (
      <Image
        src={iconPath}
        alt={customName || 'icon'}
        width={width}
        height={height}
        priority
      />
    );
  }

  const IconComponent: SvgIconComponent =
    MuiIcons[name as keyof typeof MuiIcons];

  if (!customName && name && !IconComponent) {
    // eslint-disable-next-line no-console
    console.error(`Icon "${name}" does not exist in Material UI icons.`);
    return null;
  }

  if (rounded) {
    return (
      <div className={classes.rounded}>
        <IconComponent
          sx={{
            width: width,
            height: height,
            color,
          }}
        />
      </div>
    );
  }

  if (!isClient) {
    return null; // or a placeholder
  }

  return (
    <IconComponent
      sx={{
        width: width,
        height: height,
        color,
      }}
    />
  );
};

export default MyIcon;
