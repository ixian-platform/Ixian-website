'use client';

import classes from './HamburgerMenu.module.scss';
import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { Link } from 'next-view-transitions';
import { linksData } from '@components/Navbar/Navbar';
import ThemeSwitcher from '@components/ThemeSwitcher/ThemeSwitcher';
import { useClickAway } from '@uidotdev/usehooks';

const HamburgerMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [shouldHide, setShouldHide] = useState(false);

  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  const ref: any = useClickAway(() => {
    if (isOpen) {
      setShouldHide(false);
      setIsOpen(false);
    }
  });

  const toggleMenu = () => {
    setShouldHide(false);
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setShouldHide(true);
      }, 600);
    }
  }, [isOpen]);

  return (
    <section className={classes.hamburgerMenu} ref={ref}>
      <button className={classes.hamburgerIcon} onClick={toggleMenu}>
        <span className={classNames({ [classes.open]: isOpen })}></span>
        <span className={classNames({ [classes.open]: isOpen })}></span>
        <span className={classNames({ [classes.open]: isOpen })}></span>
      </button>
      {!isOpen && shouldHide ? null : (
        <div
          className={classNames(classes.menu, {
            [classes.open]: isOpen,
            [classes.hidden]: !isOpen && shouldHide,
          })}
        >
          {linksData.map((link, index) => (
            <Link key={index} href={link.href} onClick={toggleMenu}>
              {link.label}
            </Link>
          ))}
          <ThemeSwitcher toggleMenu={toggleMenu} />
        </div>
      )}
    </section>
  );
};

export default HamburgerMenu;
