# ixian.io

The Ixian website. Next.js 15 (App Router), exported as a static site and deployed to GitHub Pages.

## Run

```sh
npm ci
npm run dev        # http://localhost:3000
```

`npm run preview` builds the site and serves `out/` on port 3000, with the live network figures proxied, so it behaves like production.

## Build and deploy

```sh
npm run build      # static site in out/
```

`prebuild` fetches the on-chain transaction total and the latest app releases first. Pushing to `master` runs `.github/workflows/deploy.yml`, which builds and publishes to GitHub Pages; the workflow also rebuilds every 10 days to refresh the figures.

## Checks

```sh
npm run check      # typecheck, lint, unit tests, build, end-to-end tests
```

End-to-end tests use Playwright (`npm run test:e2e`).

## Layout

- `src/app/` routes and the root layout
- `src/site/sections/` page sections
- `src/site/components/` shared components (nav, footer, page parts)
- `src/site/content/` all copy and figures, kept out of the components
- `src/site/styles/` design tokens (`tokens.css`) and base styles; `palette.ts` mirrors the token colours for canvas and WebGL
- `src/site/three/` the WebGL hero
- `public/` static files
- `scripts/` build-time fetches, the preview server and the social image generator
- `tests/` unit and end-to-end tests

## License

MIT
