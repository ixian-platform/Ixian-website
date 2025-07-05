'use client';

import classes from './ThemeSwitcher.module.scss';
import { useTheme } from '@/app/providers/ThemeProvider/ThemeProvider';
import { useEffect, useState } from 'react';
import MyIcon from '@components/MyIcon/MyIcon';

interface ThemeSwitcherProps {
  toggleMenu?: () => void;
}

const ThemeSwitcher = ({ toggleMenu }: ThemeSwitcherProps) => {
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
    toggleMenu?.();
  };

  if (!isMounted) {
    return null;
  }

  return (
    <div className={classes.themeSwitcher} onClick={clickHandler}>
      <MyIcon
        color={'#F3F7F4'}
        name={themeMode === 'light' ? 'Brightness2Rounded' : 'LightModeRounded'}
        width={24}
        height={24}
      />
    </div>
  );
};

export default ThemeSwitcher;
