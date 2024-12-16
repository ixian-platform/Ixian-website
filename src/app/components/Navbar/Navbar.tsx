'use client';

import classes from './Navbar.module.scss';
import Link from 'next/link';

import { Routes } from '@utils/constants';
import ContentWrapper from '@components/ContentWrapper/ContentWrapper';
import { useMediaQuery } from 'react-responsive';
import HamburgerMenu from '@components/HamburgerMenu/HamburgerMenu';
import classNames from 'classnames';
import ixianLogo from '@assets/ixian-logo.svg';
import Image from 'next/image';
import ThemeSwitcher from '@components/ThemeSwitcher/ThemeSwitcher';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import React from 'react';
import { cn } from '@/lib/utils';
import { technologySubmenu } from '@utils/menuUtils';

const Navbar = () => {
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });

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
        <MyNavigationMenu />
        <ThemeSwitcher />
      </div>
    </>
  );

  const mobileMenu = (
    <>
      <Link href={Routes.INDEX}>
        {/*<Image priority src={spixiLabsLogo} alt={'spixi-labs-logo'} />*/}
      </Link>
      <HamburgerMenu />
    </>
  );

  return (
    <nav className={classes.navbar}>
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

export const MyNavigationMenu = () => {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <Link href="/" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              Home
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger className={classes.navTrigger}>
            Technology
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="gap-3 p-4 md:w-[100px] lg:w-[200px]">
              {technologySubmenu.map((item) => (
                <ListItem
                  key={item.title}
                  title={item.title}
                  href={item.href}
                />
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href="/" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              Developer Hub
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href="/" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              Get Involved
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export const ListItem = React.forwardRef<
  React.ElementRef<'a'>,
  React.ComponentPropsWithoutRef<'a'>
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = 'ListItem';
