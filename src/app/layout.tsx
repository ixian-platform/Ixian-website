/* every page, the 404 included, gets the global styles in this order: reset, tokens, base */
import '@site/styles/reset.css';
import '@site/styles/tokens.css';
import '@site/styles/base.css';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import type { Metadata, Viewport } from 'next';
import { SITE_URL } from '@site/lib/seo';
import { palette } from '@site/styles/palette';

/* defaults every page inherits; each page sets its own title, description and OG image (lib/seo.ts) */
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: 'Ixian',
  title: 'Ixian',
  description: 'Digital trust for people, devices and AI agents.',
  authors: [{ name: 'Ixian' }],
  creator: 'Ixian',
  publisher: 'IXI Labs',
  formatDetection: { telephone: false, email: false, address: false },
};

export const viewport: Viewport = {
  themeColor: palette.page,
  colorScheme: 'dark',
};

/** Root layout: the document shell only; every page lives in (site). */
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
