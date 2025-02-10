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
} as const;

export type Sections = (typeof Section)[keyof typeof Section];

export const ixidocs = 'https://docs.ixian.io/';
export const ixianGitHub = 'https://github.com/ProjectIxian';
export const xeggexIxi = 'https://xeggex.com/market/IXI_USDT';
export const nonkycIxi = 'https://nonkyc.io/market/IXI_USDT';
export const coingeckoIxi = 'https://www.coingecko.com/en/coins/ixicash';
