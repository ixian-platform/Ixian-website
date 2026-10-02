import { Metadata } from 'next';
import { pageMeta, SITE_URL } from '@site/lib/seo';
import { links } from '@site/content/links';
import Hero from '@site/sections/Hero/Hero';
import Build from '@site/sections/Build/Build';
import HowItWorks from '@site/sections/HowItWorks/HowItWorks';
import Trust from '@site/sections/Trust/Trust';
import Spixi from '@site/sections/Spixi/Spixi';
import { spixiCaseStudy } from '@site/content/homeV3';
import Start from '@site/sections/Start/Start';
import Platform from '@site/sections/Platform/Platform';
import Labs from '@site/sections/Labs/Labs';
import BlogTeaser from '@site/sections/BlogTeaser/BlogTeaser';
import Chapters from '@site/components/Chapters';

const CHAPTERS = [
  { id: 'top', label: 'Ixian' },
  { id: 'how', label: 'How it works' },
  { id: 'trust', label: 'Trust' },
  { id: 'build', label: 'Build' },
  { id: 'spixi', label: 'Spixi' },
  { id: 'start', label: 'Start' },
  { id: 'platform', label: 'Platform' },
  { id: 'blog', label: 'Blog' },
];

export const metadata: Metadata = pageMeta({
  title: 'Ixian | Connect anything. Directly.',
  description: 'Digital trust for people, devices and AI agents. One address to prove who you are, be found, talk privately and get paid, with no servers to run.',
  path: '/',
  og: 'home',
});

/* schema.org structured data */
const LD = [
  {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Ixian',
    legalName: 'IXI Labs d.o.o.',
    url: SITE_URL,
    logo: `${SITE_URL}/apple-icon.png`,
    email: 'info@ixian.io',
    sameAs: [links.social.x, links.github.org, links.social.linkedin, links.social.medium, links.social.telegram, links.social.discord, links.social.reddit].filter(Boolean),
  },
  { '@context': 'https://schema.org', '@type': 'WebSite', name: 'Ixian', url: SITE_URL },
];

export default function Home() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(LD) }} />
      <Hero />
      <HowItWorks />
      <Trust />
      <Build />
      <Spixi caseStudy={spixiCaseStudy} />
      <Start />
      <Platform />
      <BlogTeaser />
      <Labs />
      <Chapters chapters={CHAPTERS} />
    </>
  );
}
