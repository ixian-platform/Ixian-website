export const Routes = {
  INDEX: '/',
  TECHNOLOGY: '/technology',
  BUILD: '/build',
  GET_INVOLVED: '/get-involved',
  PP: '/privacy-policy',
  ABOUT_US: '/about-us',
} as const;

export type Route = (typeof Routes)[keyof typeof Routes];

export const Section = {
  GET_INVOLVED: 'get-involved',
  IXIAN_DLT: 'ixian-dlt',
  IXIAN_S2_NETWORK: 'ixian-s2-network',
  IXI_TOKEN: 'ixi-token',
  IXI_MINING: 'ixi-mining',
  RESOURCES: 'resources',
  PARTNERSHIPS: 'partnerships',
} as const;

export type Sections = (typeof Section)[keyof typeof Section];

export const ixiLabsEmail = 'info@ixian.io';
export const ixidocs = 'https://docs.ixian.io/';
export const ixianGitHub = 'https://github.com/ProjectIxian';
export const xeggexIxi = 'https://xeggex.com/market/IXI_USDT';
export const nonkycIxi = 'https://nonkyc.io/market/IXI_USDT';
export const coingeckoIxi = 'https://www.coingecko.com/en/coins/ixicash';
export const ixiscope = 'https://explorer.ixian.io/';
export const spixiWebsite = 'https://spixi.io/';
export const startDlt = 'https://github.com/ProjectIxian/Ixian-DLT/releases/';
export const startS2 = 'https://github.com/ProjectIxian/Ixian-S2/releases/';
export const ixiEmissions = 'https://explorer.ixian.io/?p=emissions';
export const spixiDownload = 'https://www.spixi.io/download';
export const ixianLinkedIn = 'https://www.linkedin.com/company/ixian-platform';
export const ixiLabs = 'www.ixilabs.com';
export const robotinaLink = 'https://www.robotina.si';
export const vivatLink = 'https://www.vivatgroup.net/';
export const benchmarkedLink = 'https://benchmarked.co/';
export const evenLink = 'https://even.si/';
