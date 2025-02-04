# Ixian Website

## Overview
Ixian Website is a Next.js-based application built using Next.js v15+.

## Getting Started

### Installation
Ensure you have Node.js installed, then run:
```sh
  npm install
```

### Development
To start the development server:
```sh
  npm run dev
```

### Build
To build the project for production:
```sh
  npm run build
```

## Project Structure

### Pages
All pages can be found in the `src/app` folder.
- `src/app/page.tsx` is the index page.

### Components
Custom components are located under:
- `src/app/components`
- `src/components` (components from `shadcn/ui`, which may be replaced in the future to remove `framer-motion` and `tailwind`)

### Containers
Wrappers and main containers for pages are under:
- `src/app/containers`

### Providers
Context providers are located under:
- `src/app/providers`
    - Theme management can be found here.

### Styles
Design tokens, mixins, and typography are located under:
- `src/app/styles`

### Utilities
Different utility functions can be found under:
- `src/app/utils`

### Assets
Static assets used in the application are stored in:
- `public/assets`

### Translations
The app is translated using the `next-intl` package.
- Translation files can be found in the `messages` directory at the root.
- Edit `messages/en.json` for translations.

### Configuration
- **Next.js Configuration**: Edit `next.config.ts` for important app configurations. Currently, the output is set to `"export"` for GitHub Pages static build.
- **TypeScript Configuration**: Modify `tsconfig.json` for TypeScript settings.
- **Linting & Formatting**: The project uses ESLint and Prettier configurations.

## License
 - This project is licensed under the MIT License.
 - See the [LICENSE](https://github.com/vercel/next.js/blob/canary/license.md) file for more information.


