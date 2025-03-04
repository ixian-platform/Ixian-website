import './globals.scss';
import ThemeProvider from '@/app/providers/ThemeProvider/ThemeProvider';
import Navbar from '@components/Navbar/Navbar';
import Footer from '@components/Footer/Footer';
import Cookies from 'js-cookie';
import { getLocale, getMessages } from 'next-intl/server';
import { NextIntlClientProvider } from 'next-intl';
import { Inter, Space_Grotesk } from 'next/font/google';
import CookiesBanner from '@components/CookiesBanner/CookiesBanner';
import ScrollToTop from '@components/ScrollToTop/ScrollToTop';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      className={Cookies.get('themeMode') || 'dark'}
      suppressHydrationWarning={true}
    >
      <body
        className={`${spaceGrotesk.className} ${inter.className} bodyLayout`}
      >
        <ThemeProvider>
          <NextIntlClientProvider messages={messages}>
            <Navbar />
            {children}
            <Footer />
            <ScrollToTop />
            <CookiesBanner />
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
