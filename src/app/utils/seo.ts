import { Metadata } from 'next';

type SEOConfig = {
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  path?: string;
};

export const defaultSEO = {
  title:
    'Open-Source Decentralized Data Streaming | Scalable & Secure Connectivity',
  description:
    'Ixian is an open-source decentralized data streaming platform designed for seamless, secure, and scalable connectivity. Reduce costs, enhance security, and effortlessly integrate with IoT, smart cities, and real-time applications.',
  keywords: [
    'Ixian',
    'decentralized data streaming',
    'open-source blockchain',
    'scalable network',
    'secure communication',
    'IoT integration',
    'smart cities blockchain',
    'real-time data streaming',
    'proof-of-collaborative-work',
    'blockchain scalability',
    'cost-efficient blockchain solutions',
    'Web3 infrastructure',
    'Spixi',
    'Ixi Labs',
    'IXI Names',
  ],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://www.ixian.io',
    siteName: 'Ixian',
    images: [
      {
        url: '/ixian-og.jpg',
        width: 1200,
        height: 630,
        alt: 'ixian-og',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    creator: '@ixian_io',
    images: [{
      url: '/ixian-og.jpg',
      alt: 'ixian-og',
    }],
  },
};

export const generateSEO = (config: SEOConfig): Metadata => {
  const siteUrl = process.env.SITE_URL || 'https://www.ixian.io';

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
      images: defaultSEO.openGraph.images.map((image) => ({
        ...image,
        url: `${siteUrl}${image.url}`,
      })),
    },
    twitter: {
      ...defaultSEO.twitter,
      title: config.title,
      description: config.description,
      images: defaultSEO.openGraph.images.map((image) => ({
        ...image,
        url: `${siteUrl}${image.url}`,
      })),
    },
  };
};
