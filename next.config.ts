import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig: import('next').NextConfig = {
  reactStrictMode: true,
  output: 'export',
  images: {
    unoptimized: true,
    loader: 'imgix',
    path: 'ixian-website.imgix.net',
  },
  basePath: '',
  assetPrefix: '',
};

export default withNextIntl(nextConfig);
