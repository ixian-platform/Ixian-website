/**
 * The token colours for code that can't read CSS variables: WebGL (three.js),
 * canvas 2D and GSAP colour tweens. Same values as tokens.css; the unit test
 * tests/unit/tokens.test.ts fails if the two drift apart. Everywhere CSS
 * applies (styles, SVG attributes), use var(--ix-…) instead.
 */
export const palette = {
  page: '#050907', // --ix-page
  text: '#f3f7f4', // --ix-text
  text2: '#a4a7a6', // --ix-text-2
  text3: '#7e817f', // --ix-text-3
  live: '#5cc96d', // --ix-live
  route: '#9db9ff', // --ix-route
  build: '#e3a64f', // --ix-build
} as const;

/** '#rrggbb' to [r, g, b], for pixel work (ImageData) and rgba() strings */
export const rgbOf = (hex: string): [number, number, number] => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16)) as [number, number, number];
