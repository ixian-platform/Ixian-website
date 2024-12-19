'use client';

import classes from './ThemeSwitcher.module.scss';
import { useTheme } from '@/app/providers/ThemeProvider/ThemeProvider';
import { useEffect, useState } from 'react';
import moonIcon from '@assets/icons/dark/night_sight_auto.svg';
import Image from 'next/image';

const ThemeSwitcher = () => {
  const { themeMode, setThemeMode } = useTheme();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const clickHandler = () => {
    document.body.classList.add('body-slide');
    setTimeout(() => {
      setThemeMode(themeMode === 'light' ? 'dark' : 'light');
    }, 500);
    setTimeout(() => {
      document.body.classList.remove('body-slide');
    }, 1000);
  };

  if (!isMounted) {
    return null;
  }

  return (
    <div className={classes.themeSwitcher} onClick={clickHandler}>
      <Image src={moonIcon} width={24} height={24} priority alt={'moon-icon'} />
    </div>
  );
};

export default ThemeSwitcher;
