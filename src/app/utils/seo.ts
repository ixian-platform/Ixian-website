import { Metadata } from 'next';

type SEOConfig = {
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  path?: string;
};

const defaultSEO: Metadata = {
  title: 'Ixian',
  description: 'xian - Distributed technology for the people',
  keywords: [
    'ixian',
    'network',
    'blockchain',
    'dlt',
    'distributed',
    'technology',
  ],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://www.ixian.io/',
    siteName: 'Ixian',
    images: [
      {
        url: '/default-og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Default OG Image',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    creator: '@ixian_io',
    images: ['/default-twitter-image.jpg'],
  },
};

export const generateSEO = (config: SEOConfig): Metadata => {
  const siteUrl = process.env.SITE_URL || 'https://www.ixian.io/';

  return {
    ...defaultSEO,
    title: config.title || defaultSEO.title,
    description: config.description || defaultSEO.description,
    keywords: [...(defaultSEO.keywords || []), ...(config.keywords || [])],
    metadataBase: new URL(siteUrl),
    openGraph: {
      ...defaultSEO.openGraph,
      title: config.title,
      description: config.description,
      url: `${siteUrl}${config.path || ''}`,
      images: config.image
        ? [{ url: config.image }]
        : defaultSEO.openGraph?.images,
    },
    twitter: {
      ...defaultSEO.twitter,
      title: config.title,
      description: config.description,
      images: config.image
        ? [{ url: config.image }]
        : defaultSEO.twitter?.images,
    },
  };
};
