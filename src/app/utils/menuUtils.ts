import {ixidocs, ixiscope, Routes, Section, whitepaperLink} from '@utils/constants';

export interface IMenu {
  title: string;
  href: string;
  isExternal?: boolean;
}

export const learnMenu: IMenu[] = [
  {
    title: 'Technology',
    href: Routes.TECHNOLOGY,
  },
  {
    title: 'Ixian DLT',
    href: `${Routes.TECHNOLOGY}#${Section.IXIAN_DLT}`,
  },
  {
    title: 'Ixian S2 Network',
    href: `${Routes.TECHNOLOGY}#${Section.IXIAN_S2_NETWORK}`,
  },
  {
    title: 'IXI Cryptocurrency',
    href: `${Routes.TECHNOLOGY}#${Section.IXI_TOKEN}`,
  },
  {
    title: 'IXI Mining',
    href: `${Routes.GET_INVOLVED}#${Section.IXI_MINING}`,
  },
];

export const resourcesMenu: IMenu[] = [
  {
    title: 'Docs',
    href: ixidocs,
    isExternal: true,
  },
  {
    title: 'Whitepaper',
    href: whitepaperLink,
    isExternal: true,
  },
  {
    title: 'Downloads',
    href: `${Routes.GET_INVOLVED}#${Section.RESOURCES}`,
  },
  {
    title: 'ixiscope',
    href: ixiscope,
    isExternal: true,
  },
];

export const getInvolvedMenu: IMenu[] = [
  {
    title: 'Developers Hub',
    href: Routes.BUILD,
  },
  {
    title: 'Become a Partner',
    href: `${Routes.ABOUT_US}#${Section.PARTNERSHIPS}`,
  },
  {
    title: 'Join Community',
    href: Routes.GET_INVOLVED,
  },
  {
    title: 'About Us',
    href: Routes.ABOUT_US,
  },
];
