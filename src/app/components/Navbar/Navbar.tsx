'use client';

import classes from './Navbar.module.scss';
import Link from 'next/link';

import { ixidocs, Routes } from '@utils/constants';
import ContentWrapper from '@components/ContentWrapper/ContentWrapper';
import { useMediaQuery } from 'react-responsive';
import HamburgerMenu from '@components/HamburgerMenu/HamburgerMenu';
import classNames from 'classnames';
import ixianLogo from '@assets/ixian-logo.svg';
import Image from 'next/image';
import ThemeSwitcher from '@components/ThemeSwitcher/ThemeSwitcher';
import React from 'react';
import useDetectScroll from '@smakss/react-scroll-direction';

export const linksData = [
  {
    label: 'Home',
    href: Routes.INDEX,
  },
  {
    label: 'Technology',
    href: Routes.TECHNOLOGY,
  },
  {
    label: 'Build',
    href: Routes.BUILD,
  },
  {
    label: 'Documentation',
    href: ixidocs,
    isExternal: true,
  },
  {
    label: 'Get Involved',
    href: Routes.GET_INVOLVED,
  },
];

const Navbar = () => {
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });
  const { scrollDir } = useDetectScroll();

  const desktopMenu = (
    <>
      <Link href={Routes.INDEX}>
        <Image
          priority
          src={ixianLogo}
          alt={'ixian-logo'}
          width={100}
          height={32}
        />
      </Link>
      <div className={classes.links}>
        {linksData.map((link, index) => (
          <Link
            key={index}
            href={link.href}
            target={link.isExternal ? '_blank' : ''}
          >
            {link.label}
          </Link>
        ))}
        <ThemeSwitcher />
      </div>
    </>
  );

  const mobileMenu = (
    <>
      <Link href={Routes.INDEX}>
        <Image priority src={ixianLogo} alt={'ixian-logo'} />
      </Link>
      <HamburgerMenu />
    </>
  );

  return (
    <nav
      className={classNames(classes.navbar, {
        [classes.hidden]: scrollDir === 'down' || undefined,
      })}
    >
      <ContentWrapper
        className={classNames(classes.content, {
          [classes.contentMobile]: isMobile,
        })}
      >
        {isMobile ? mobileMenu : desktopMenu}
      </ContentWrapper>
    </nav>
  );
};

export default Navbar;
