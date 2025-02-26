import type { MetadataRoute } from 'next';

export const dynamic = 'force-static';

export default function manifest(): MetadataRoute.Manifest {
  const siteUrl = process.env.SITE_URL || 'https://www.ixian.io';

  return {
    name: 'Ixian',
    short_name: 'Ixian',
    description:
      'Ixian is an open-source decentralized data streaming platform designed for seamless, secure, and scalable connectivity. Reduce costs, enhance security, and effortlessly integrate with IoT, smart cities, and real-time applications.',
    start_url: `${siteUrl}` || '/',
    display: 'standalone',
    background_color: '#fff',
    theme_color: '#fff',
    icons: [
      {
        src: `${siteUrl}/web-app-manifest-192x192.png`,
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: `${siteUrl}/web-app-manifest-512x512.png`,
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  };
}
