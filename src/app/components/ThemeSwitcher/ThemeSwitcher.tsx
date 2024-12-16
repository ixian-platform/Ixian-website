'use client';

import classes from './ThemeSwitcher.module.scss';
import { useTheme } from '@/app/providers/ThemeProvider/ThemeProvider';
import { useEffect, useState } from 'react';
import Icon from '@components/Icon/Icon';

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
      <Icon iconName={'night_sight_auto'} variant={'secondary'} />
    </div>
  );
};

export default ThemeSwitcher;
