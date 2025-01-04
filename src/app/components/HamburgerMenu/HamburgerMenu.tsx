'use client';

import classes from './HamburgerMenu.module.scss';
import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import Link from 'next/link';
import { linksData } from '@components/Navbar/Navbar';
import ThemeSwitcher from '@components/ThemeSwitcher/ThemeSwitcher';

const HamburgerMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [shouldHide, setShouldHide] = useState(false);

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
    <section className={classes.hamburgerMenu}>
      <button className={classes.hamburgerIcon} onClick={toggleMenu}>
        <span className={classNames({ [classes.open]: isOpen })}></span>
        <span className={classNames({ [classes.open]: isOpen })}></span>
        <span className={classNames({ [classes.open]: isOpen })}></span>
      </button>
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
        <ThemeSwitcher />
      </div>
    </section>
  );
};

export default HamburgerMenu;
