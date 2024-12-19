'use client';

import classes from './HamburgerMenu.module.scss';
import { useState } from 'react';
import classNames from 'classnames';
import Link from 'next/link';
import { linksData } from '@components/Navbar/Navbar';

const HamburgerMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <section className={classes.hamburgerMenu}>
      <button className={classes.hamburgerIcon} onClick={toggleMenu}>
        <span className={classNames({ [classes.open]: isOpen })}></span>
        <span className={classNames({ [classes.open]: isOpen })}></span>
        <span className={classNames({ [classes.open]: isOpen })}></span>
      </button>
      <div className={classNames(classes.menu, { [classes.open]: isOpen })}>
        {linksData.map((link, index) => (
          <Link key={index} href={link.href} onClick={toggleMenu}>
            {link.label}
          </Link>
        ))}
      </div>
    </section>
  );
};

export default HamburgerMenu;
