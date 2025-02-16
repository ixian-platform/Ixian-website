'use client';

import React, { useEffect, useState } from 'react';
import MyIcon from '@components/MyIcon/MyIcon';
import classNames from 'classnames';
import classes from './ScrollToTop.module.scss';

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.scrollY > 300);
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTopHandler = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div
      onClick={scrollToTopHandler}
      className={classNames(classes.scrollToTop, {
        [classes.visible]: isVisible,
      })}
    >
      <MyIcon name={'NorthRounded'} />
    </div>
  );
};

export default ScrollToTop;
