/** Copy for the 404 page. */
import { links } from './links';

export const notFound = {
  title: ['Nobody’s home', 'at this address.'] as [string, string],
  lead: 'We hashed this path into its sector, the way S2 finds an address. No page answers here. The link may be old, or a letter slipped on the way.',
  actions: [
    { label: 'Back to the homepage', href: '/', kind: 'primary' as const },
    { label: 'Developers', href: links.developers, kind: 'secondary' as const },
  ],
  rows: { path: 'Path', hash: 'SHA3-512', sector: 'Sector', presence: 'Presence', guess: 'Nearby' },
  notes: {
    sector: 'One of 2⁸⁰, worked out in your browser.',
    none: 'None found',
    presence: 'Error 404. Nothing has signed in at this path.',
  },
  didYouMean: 'Did you mean',
  /** real pages, with the words people tend to type for them */
  routes: [
    { href: '/', label: 'the homepage', names: ['home', 'index'] },
    { href: links.platform, label: 'Platform', names: ['technology', 'platform', 'tech', 'dlt', 's2'] },
    { href: links.developers, label: 'Developers', names: ['build', 'developers', 'developer', 'dev', 'docs'] },
    { href: links.quickstart, label: 'Quickstart', names: ['quickstart', 'start', 'getting-started'] },
    { href: links.ecosystem, label: 'Ecosystem', names: ['get-involved', 'ecosystem', 'community', 'spixi'] },
    { href: links.about, label: 'About', names: ['about-us', 'about', 'team', 'history'] },
    { href: links.blog, label: 'Blog', names: ['blog', 'news', 'posts'] },
    { href: links.privacy, label: 'Privacy policy', names: ['privacy-policy', 'privacy'] },
    { href: links.terms, label: 'Terms of use', names: ['terms-of-use', 'terms'] },
    { href: links.cookies, label: 'Cookie policy', names: ['cookie-policy', 'cookies'] },
  ],
};
