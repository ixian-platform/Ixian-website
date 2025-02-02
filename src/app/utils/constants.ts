export const Routes = {
  INDEX: '/',
  TECHNOLOGY: '/technology',
  BUILD: '/build',
  PP: '/privacy-policy',
} as const;

export type Route = (typeof Routes)[keyof typeof Routes];

export const Section = {
  GET_INVOLVED: 'get-involved',
} as const;

export type Sections = (typeof Section)[keyof typeof Section];

export const ixianGitHub = 'https://github.com/ProjectIxian';
