export const Routes = {
  INDEX: '/',
  PP: '/privacy-policy',
} as const;

export type Route = (typeof Routes)[keyof typeof Routes];
