import { links } from './links';
import medium from './blog/medium.json';

/**
 * Blog posts as plain data, rendered by sections/Blog; add a post to POSTS (any order, the index sorts by date).
 * Inline text in `p`, `li` and `quote` supports only **bold** and [links](https://…).
 * Republished posts set `canonical` to the original URL so search engines count one article.
 */

export type Block =
  | { t: 'p'; text: string }
  | { t: 'h2'; text: string }
  | { t: 'h3'; text: string }
  | { t: 'ul'; items: string[] }
  | { t: 'ol'; items: string[] }
  | { t: 'quote'; text: string }
  /** a large quote pulled out of the text */
  | { t: 'pull'; text: string }
  /** a short summary box at the top of a post */
  | { t: 'tldr'; title?: string; text: string }
  /** `remote`: the original's address, used until the local copy exists (scripts/fetch-blog-images.ps1) */
  | { t: 'img'; src: string; alt: string; caption?: string; wide?: boolean; w?: number; h?: number; remote?: string }
  /** two to four images in a row, e.g. phone screens */
  | { t: 'gallery'; images: { src: string; alt: string; w?: number; h?: number }[]; caption?: string }
  /** app screens as an upright, slightly isometric row; a click brings one to the front */
  | { t: 'phones'; images: { src: string; alt: string; label: string }[]; caption?: string }
  | { t: 'code'; lang?: string; code: string }
  | { t: 'hr' };

export type Post = {
  slug: string;
  title: string;
  /** one sentence under the title; also the meta description if `summary` is missing */
  subtitle: string;
  /** for cards and search results */
  summary?: string;
  /** ISO date, yyyy-mm-dd */
  date: string;
  /** set when the post is updated after publishing */
  updated?: string;
  readMin: number;
  /** a team or company, never a person's name */
  author: string;
  kind: 'Case study' | 'Update' | 'Guide' | 'Research' | 'News';
  tags: string[];
  /** `remote`: the original's address, used until the local copy exists */
  /** `trim`: crop a thin edge baked into the original's top (e.g. a white line), see Img */
  cover?: { src: string; alt: string; w: number; h: number; remote?: string; trim?: boolean };
  /** the original, when the post was published elsewhere first */
  canonical?: string;
  originally?: { label: string; href: string };
  /** shown above the body of older posts */
  archived?: boolean;
  /** the action at the end of the post */
  cta?: { title: string; body: string; primary: { label: string; href: string }; secondary?: { label: string; href: string } };
  body: Block[];
};

export const blog = {
  title: 'Blog.',
  lead: 'Case studies, updates and notes from the people building Ixian.',
  back: 'All posts',
  more: 'More from the blog',
  share: 'Share',
  copied: 'Link copied',
  copy: 'Copy link',
  archived: (y: string) => `From the archive, ${y}. Some details have changed since.`,
  all: 'All',
  latest: 'Latest',
};

export const POSTS: Post[] = [
  {
    slug: 'spixi-infrastructure-costs',
    title: 'How Spixi minimized infrastructure costs with decentralized technology',
    subtitle: 'A private chat app and wallet runs with near-zero infrastructure costs, because it runs on the Ixian network instead of its own servers.',
    summary: 'Spixi has run for years, for thousands of users, without the servers most messaging apps pay for. Here is how Ixian makes that possible.',
    date: '2025-02-13',
    updated: '2026-09-27',
    readMin: 3,
    author: 'Ixian',
    kind: 'Case study',
    tags: ['Spixi', 'S2', 'Infrastructure'],
    cover: { src: '/site/blog/medium/D3lsIqC7s0UB-TwdAH69SQ.jpeg', remote: 'https://cdn-images-1.medium.com/max/1600/1*D3lsIqC7s0UB-TwdAH69SQ.jpeg', alt: 'Spixi Private Chat and Wallet', w: 937, h: 527 },
    canonical: links.caseStudy,
    originally: { label: 'Medium', href: links.caseStudy },
    cta: {
      title: 'Build the same way.',
      body: 'Spixi runs on the same open network and SDKs you can use today. No servers to rent, no accounts to manage.',
      primary: { label: 'Start building', href: links.quickstart },
      secondary: { label: 'Get Spixi', href: links.spixiDownload },
    },
    body: [
      {
        t: 'tldr',
        title: 'TL;DR',
        text: 'Most messaging apps rely on costly centralized servers, forcing companies to either charge users, show ads, or sell user data just to cover expenses. Spixi, a private chat app and wallet, avoids these costs drastically by leveraging Ixian’s decentralized technology. Operating without centralized infrastructure, Spixi has run for years with thousands of users and minimal infrastructure costs, proving that a decentralized model is not only possible but more efficient.',
      },
      {
        t: 'phones',
        images: [
          { src: '/site/spixi/chats.webp', label: 'Chats', alt: 'Spixi on a phone: the chat list, with a new contact request from an address waiting for Accept or Decline.' },
          { src: '/site/spixi/apps.webp', label: 'Mini Apps', alt: 'Spixi on a phone: installed Mini Apps, such as a game, an IoT control room and an agent hub.' },
          { src: '/site/spixi/wallet.webp', label: 'Wallet', alt: 'Spixi on a phone: the IXI wallet with a balance, Send, Receive and Scan, and recent payments.' },
        ],
        caption: 'Spixi: chats, Mini Apps and the IXI wallet, with no server of its own behind them. Tap a screen to bring it forward.',
      },
      { t: 'h2', text: 'Article highlights' },
      {
        t: 'ul',
        items: [
          '**Minimal infrastructure costs:** no need for cloud servers or data centers.',
          '**Fully private and secure:** end-to-end encryption with no central authority.',
          '**Scalability without costs:** the network grows naturally as users join.',
          '**No monetization required:** no ads, subscriptions or data collection.',
          '**Proven reliability:** running for years with near-zero costs.',
          '**Decentralization as a solution:** a sustainable, cost-efficient future for messaging apps.',
        ],
      },
      { t: 'h2', text: 'The costly reality of centralized chat apps' },
      {
        t: 'p',
        text: 'Every popular messaging app depends on extensive server infrastructure to process messages, calls, file transfers and encryption. This infrastructure is expensive to maintain, especially as the user base grows. Companies running these services must recover costs, often through advertising, paid plans or selling user data. Even privacy-focused messaging apps require external funding to stay operational.',
      },
      {
        t: 'p',
        text: 'Cloud storage, server maintenance and security compliance make scalability a financial burden. Centralization creates expenses that generally dictate business decisions, often at the cost of the user.',
      },
      { t: 'h2', text: 'How Spixi drastically reduced infrastructure costs' },
      {
        t: 'p',
        text: 'Spixi is a private chat app and cryptocurrency wallet that provides secure messaging, VoIP calls and file sharing without relying on traditional servers. Instead, it runs on the Ixian Decentralized Platform, which keeps its infrastructure costs near zero.',
      },
      {
        t: 'p',
        text: 'Unlike centralized apps that route communications through company-owned servers, Spixi leverages the [Ixian S2](/technology#s2) overlay network, a peer-to-peer system where users communicate through decentralized data relay nodes. Ixian’s [DLT](/technology#dlt) (distributed ledger technology) secures transactions and metadata without centralized storage, while end-to-end encryption ensures privacy without compliance-heavy security layers.',
      },
      {
        t: 'pull',
        text: 'In Spixi, privacy and security come from the design, not from a promise.',
      },
      {
        t: 'p',
        text: 'The operation of the Ixian Platform is fully transparent, and users can see exactly how their data is handled. In contrast, centralized apps, even if they claim to be open source, operate on private servers where it’s impossible to verify what happens behind the scenes. In Spixi, privacy and security come from the design, not from a promise and not from a central authority, with end-to-end encryption protecting all communication without the need for complex security compliance frameworks.',
      },
      {
        t: 'p',
        text: 'Because Spixi operates without cloud infrastructure, its operational costs are drastically lower. The app is free to use, and its decentralized nature allows it to scale effortlessly as more users join.',
      },
      { t: 'h2', text: 'Proven cost efficiency' },
      {
        t: 'p',
        text: 'Spixi has been running successfully for years, serving thousands of users without requiring a substantial budget for infrastructure. Unlike other platforms that struggle with growing operational costs, Spixi’s decentralized design lets it expand without its expenses growing with it.',
      },
      {
        t: 'p',
        text: 'This model challenges the assumption that messaging apps must rely on costly infrastructure. It demonstrates that secure, scalable and private communication can exist without monetization trade-offs or external funding.',
      },
      { t: 'h2', text: 'The future of messaging is decentralized' },
      {
        t: 'p',
        text: 'Spixi proves that decentralization isn’t just an alternative. It’s a smarter, more sustainable way to build many types of apps, including messaging. Without infrastructure costs, developers can focus on improving the user experience rather than finding ways to fund server expenses.',
      },
      {
        t: 'p',
        text: 'The future is cost-effective, private and scalable. Shift the paradigm and decentralize with Ixian. Spixi is leading the way.',
      },
    ],
  },
];

/* Posts imported from the Ixian Medium publication's RSS feed; each keeps its original date and a canonical link. */
type Imported = { title: string; link: string; date: string; cats: string[]; words: number; blocks: Block[] };

/** covers that replace the post's first image */
const COVERS: Record<string, Post['cover']> = {
  'shifting-towards-the-next': { src: '/site/blog/covers/shifting-towards-the-next.jpg', alt: 'Spixi: chats, Mini Apps and the wallet', w: 1600, h: 900 },
  'a-decade-of-building': { src: '/site/blog/covers/a-decade-of-building.jpg', alt: 'A network of light across the globe', w: 1600, h: 900 },
  'ixi-day-2025': { src: '/site/blog/covers/ixi-day-2025.jpg', alt: 'The new ixian.io, ixiscope and Spixi Mini Apps', w: 1600, h: 900 },
  'evolving-horizons-2024': { src: '/site/blog/covers/evolving-horizons-2024.jpg', alt: 'An observatory under the Milky Way', w: 1600, h: 900 },
  'progress-report-omega-ixi-labs': { src: '/site/blog/covers/progress-report-omega-ixi-labs.jpg', alt: 'A server rack, cabled and lit', w: 1600, h: 900 },
  'the-year-of-omega': { src: '/site/blog/covers/the-year-of-omega.jpg', alt: 'A chain of blocks, one lit green', w: 1600, h: 900 },
  'progress-report-2021': { src: '/site/blog/covers/progress-report-2021.jpg', alt: 'An oscilloscope: noise settling into a clean wave', w: 1600, h: 900 },
  'the-ixian-evolution': { src: '/site/blog/covers/the-ixian-evolution.jpg', alt: 'A river branching into a delta', w: 1600, h: 900 },
};

const META: Record<string, { slug: string; kind: Post['kind']; title?: string; subtitle: string; summary: string; tags: string[] }> = {
  'f091aeb3fa6a': { slug: 'a-decade-of-building', kind: 'Update', subtitle: 'April 2026 marked a decade since the first draft of Ixian was written. Here’s what we’ve built, what we’ve shipped, and where we’re going.', summary: 'Ten years, 100 million transactions and no central server. What we learned, what shipped, and the three bets for year eleven.', tags: ['Post-quantum', 'QuIXI', 'AI agents', 'Ixian'] },
  '6578da103a84': { slug: 'ixi-day-2025', kind: 'Update', subtitle: 'Ixian has never been about hype or shortcuts. It’s about building with intent, steadily, patiently, and with a clear purpose.', summary: 'A year of quiet work: new websites, ixiscope, a steadier DLT, S2 payment relaying and Mini Apps nearly ready.', tags: ['IXI Day', 'ixiscope', 'Mini Apps', 'S2'] },
  '67bd85d72628': { slug: 'shifting-towards-the-next', kind: 'Update', subtitle: 'Eight years since the journey began: refining Omega, IXI Names arriving, and a big Spixi update on the way.', summary: 'Eight years in: 10,000 users, 90 million transactions, a message over the Iridium satellite network, and IXI Names.', tags: ['IXI Day', 'IXI Names', 'Spixi'] },
  '359aa8bafd18': { slug: 'evolving-horizons-2024', kind: 'Update', subtitle: 'Our vision and the milestones we hope will shape the Ixian Platform in the first half of 2024.', summary: 'Registered names, Presence List scaling, Spixi Custom Apps, a rewritten whitepaper and the Ixian SDK.', tags: ['Roadmap', 'IXI Names', 'Spixi'] },
  'b390be99c32b': { slug: 'progress-report-omega-ixi-labs', kind: 'Update', subtitle: 'Omega shipped, the network is steadier than ever, and IXI Labs is born.', summary: 'The Ixiac Omega release, a steadier network, the founding of IXI Labs and a naming service in the works.', tags: ['Omega', 'IXI Labs', 'Spixi'] },
  'ae212a6dc97f': { slug: 'the-year-of-omega', kind: 'Update', subtitle: 'Six years of Ixian, over 900 nodes, and the public test of Ixiac Omega.', summary: 'Six years in: over 900 nodes, a new mining pool, wrapped IXI, and the public test of the Ixiac Omega consensus.', tags: ['Omega', 'Consensus', 'Nodes'] },
  'c1adead55470': { slug: 'progress-report-2021', kind: 'Update', title: 'Ixian Progress Report 2021', subtitle: 'Network stalls found and fixed, Ixiac Omega nearly complete, and what Ixian DLT v0.8.2 brings.', summary: 'How three maintenance releases steadied the network, why Omega slipped, and what v0.8.2 adds for exchanges.', tags: ['Omega', 'DLT', 'Stability'] },
  '8d433c6538e2': { slug: 'the-ixian-evolution', kind: 'Update', subtitle: 'The end of the first roadmap, and the road to the Ixian Omega Protocol and 10,000 transactions per second.', summary: 'A new emission model, block v8, and the plan to lift the cap from 666 to 10,000 transactions per second, on chain.', tags: ['Roadmap', 'Omega', 'Spixi'] },
};

/** alt text for the kept images, which had none */
const ALT: Record<string, string> = {
  wPTOqt4ZPAwW4hfAkkJdAw: 'Ten years by the numbers: over 102 million on-chain transactions, peak throughput, ten years uninterrupted, zero central servers.',
  'JMa21-b3SXr1AJaxsBflog': 'Post-quantum since 2025: the key exchange combines ML-KEM-1024 with classical RSA and ECDH.',
  UXXSPw9T22EvWPsSN4gEKg: 'QuIXI connects devices, services and AI agents directly over the Ixian network.',
  MfCJbIlCHMUpG5liHi49Ig: 'The IXI Names registration portal.',
  'Chki7eJhzedL-qnhMTi74w': 'Spixi v0.7 on a phone.',
};

const imageId = (src: string) => src.split('/').pop()!.replace(/^1\*/, '').replace(/\.[a-z]+$/, '');
const imageExt = (src: string) => (src.match(/\.([a-z]+)$/)?.[1] ?? 'png');

// slugs whose cover has a white line along the top, cropped where shown
const TRIM_TOP = new Set<string>([]);

// Medium post ids left off the blog
const DROPPED = new Set(['7eb6afd5acb7', 'c1adead55470']);

const IMPORTED: Post[] = (medium as Imported[]).filter((m) => !DROPPED.has(m.link.split('-').pop()!)).map((m) => {
  const id = m.link.split('-').pop()!;
  const meta = META[id];
  // the first image becomes the cover, so it is removed from the body
  const firstImg = m.blocks.find((b) => b.t === 'img') as Extract<Block, { t: 'img' }> | undefined;
  const local = (src: string) => `/site/blog/medium/${imageId(src)}.${imageExt(src)}`;
  const body = m.blocks
    // a leading heading that repeats the title, and the image that became the cover
    .filter((b, i) => !(i === 0 && b.t === 'h2' && b.text === m.title))
    .filter((b) => b !== firstImg)
    // an opening line the subtitle already says
    .filter((b, i, all) => !(b.t === 'p' && all.slice(0, i).every((o) => o.t !== 'p') && b.text.replace(/\*\*/g, '') === meta.subtitle))
    .map((b): Block => {
      if (b.t !== 'img') return b;
      return { ...b, alt: b.alt || ALT[imageId(b.src)] || '', src: local(b.src), remote: b.src };
    });
  const year = Number(m.date.slice(0, 4));
  return {
    slug: meta.slug,
    title: meta.title ?? m.title,
    subtitle: meta.subtitle,
    summary: meta.summary,
    date: m.date,
    readMin: Math.max(1, Math.round(m.words / 230)),
    author: 'Ixian',
    kind: meta.kind,
    tags: meta.tags,
    cover: COVERS[meta.slug] ?? (firstImg ? { src: local(firstImg.src), remote: firstImg.src.replace(/\/max\/\d+\//, '/max/1600/'), alt: firstImg.alt || '', w: 1600, h: 900, trim: TRIM_TOP.has(meta.slug) || undefined } : undefined),
    canonical: m.link,
    originally: { label: 'Medium', href: m.link },
    archived: year <= 2024,
    body,
  };
});

POSTS.push(...IMPORTED);

export const postsByDate = () => [...POSTS].sort((a, b) => b.date.localeCompare(a.date));
export const postBySlug = (slug: string) => POSTS.find((p) => p.slug === slug);

export function fmtDate(iso: string) {
  const [y, m, d] = iso.split('-').map(Number);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[m - 1]} ${d}, ${y}`;
}
