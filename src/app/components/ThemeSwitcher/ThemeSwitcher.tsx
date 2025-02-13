'use client';

import classes from './ThemeSwitcher.module.scss';
import { useTheme } from '@/app/providers/ThemeProvider/ThemeProvider';
import { useEffect, useState } from 'react';
import MyIcon from '@components/MyIcon/MyIcon';

const ThemeSwitcher = () => {
  const { themeMode, setThemeMode } = useTheme();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const clickHandler = () => {
    document.body.classList.add('body-slide');
    setThemeMode(themeMode === 'light' ? 'dark' : 'light');
  };

  if (!isMounted) {
    return null;
  }

  return (
    <div className={classes.themeSwitcher} onClick={clickHandler}>
      <MyIcon
        color={'#F3F7F4'}
        name={
          themeMode === 'light' ? 'Brightness2Rounded' : 'Brightness5Rounded'
        }
        width={24}
        height={24}
      />
    </div>
  );
};

export default ThemeSwitcher;
