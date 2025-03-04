'use client';

import { ReactNode, useContext, useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import ThemeContext from '@/app/providers/contexts/ThemeContext';

export type ThemeMode = 'light' | 'dark';

const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [mounted, setMounted] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [themeMode, setThemeMode] = useState<ThemeMode>(
    (Cookies.get('themeMode') as ThemeMode) || 'dark'
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress >= 100) {
          clearInterval(interval);
          setMounted(true);
          return 100;
        }
        return oldProgress + 20;
      });
    }, 200);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const savedTheme = Cookies.get('themeMode') as ThemeMode;
    if (savedTheme) {
      setThemeMode(savedTheme);
    }
  }, []);

  useEffect(() => {
    const htmlElement = document.documentElement;

    if (themeMode === 'dark') {
      Cookies.set('themeMode', 'dark');
      htmlElement.classList.add('dark');
      htmlElement.classList.remove('light');
    } else {
      Cookies.set('themeMode', 'light');
      htmlElement.classList.add('light');
      htmlElement.classList.remove('dark');
    }
  }, [themeMode]);

  if (!mounted) {
    return (
      <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-green-500 transition-all duration-300 ease-in-out"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    );
  }

  return (
    <ThemeContext.Provider value={{ themeMode, setThemeMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
