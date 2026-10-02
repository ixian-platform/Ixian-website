/** Copy for /about-us. Describes the project, not the company: no personal names here. */
import { links } from './links';

export const meta = {
  title: 'About Ixian | Open source since 2018',
  description: 'Why Ixian exists, its history since 2016, who maintains it and how changes are made. An open-source project maintained by IXI Labs and contributors.',
};

export const hero = {
  eyebrow: 'About Ixian',
  title: 'Open source since 2018.',
  lead: 'Ixian lets people, devices and AI agents find and verify each other, talk privately and pay each other directly. No company sits in the middle. It is built in the open and run by the people who use it.',
  actions: [
    { label: 'Read the whitepaper', href: links.whitepaper, kind: 'secondary' as const },
  ],
  index: [
    { id: 'mission', label: 'Mission' },
    { id: 'history', label: 'History' },
    { id: 'maintainers', label: 'Maintainers' },
    { id: 'decisions', label: 'How changes are made' },
    { id: 'built-on-ixian', label: 'Built on Ixian' },
  ],
};

export const mission = {
  title: 'Mission.',
  statement: ['Connection should not need a landlord.', 'Every person, device and AI agent deserves an address it can prove is its own, a private line and a way to be paid. None of it should belong to one owner.'] as [string, string],
  points: [
    { title: 'Direct', body: 'Endpoints find each other and talk peer to peer. There is no server of your own in the middle, and relays can’t read what they carry.' },
    { title: 'Private by design', body: 'Addresses come from public keys, not accounts. Keys are agreed with a hybrid exchange that includes post-quantum ML-KEM-1024.' },
    { title: 'Run by its users', body: 'Anyone can run a DLT or S2 node on their own hardware. Operators earn IXI from block rewards and from the fees people pay.' },
  ],
};

export type Year = { year: string; items: { title: string; body: string }[] };

export const history = {
  title: 'History.',
  lead: 'From a search for a secure messenger in 2016 to a platform for people, devices and AI agents.',
  years: [
    {
      year: '2016',
      items: [
        { title: 'Idea and concept', body: 'The goal was a secure chat app with nobody in the middle, and no existing platform could carry it. So the search began for a base that could.' },
        { title: 'Research', body: 'Peer-to-peer systems, distributed ledgers, networking at scale and new kinds of consensus were all studied.' },
        { title: 'Planning', body: 'The first roadmap set out the key milestones, the technical challenges and the long-term goals.' },
      ],
    },
    {
      year: '2017',
      items: [
        { title: 'White paper and overview paper', body: 'The first versions of the Ixian white paper and overview paper described the technology and the approach to secure, scalable communication.' },
        { title: 'Prototype', body: 'A first working prototype tested decentralized networking, the security mechanisms and an early consensus model.' },
        { title: 'Project launch', body: 'Ixian was introduced to the community, developers and early adopters.' },
      ],
    },
    {
      year: '2018',
      items: [
        { title: 'Alpha and beta', body: 'The core components and an early SDK took shape. Ixian S2 and Spixi entered alpha while the DLT went through beta.' },
        { title: 'Beta testnet', body: 'The DLT and S2 beta testnet opened real-world testing of stability and performance.' },
        { title: 'DLT mainnet', body: 'The Ixian DLT mainnet went live, signing a new block about every 30 seconds.' },
      ],
    },
    {
      year: '2019',
      items: [
        { title: 'Spixi support on the DLT', body: 'The DLT gained the features Spixi needs to find contacts, send messages and handle payments.' },
        { title: 'Documentation and SDK', body: 'Early documentation and an improved SDK helped developers build on Ixian.' },
        { title: 'S2 and Spixi beta on mainnet', body: 'Ixian S2 and the Spixi beta went live on mainnet.' },
      ],
    },
    {
      year: '2020',
      items: [
        { title: 'DLT upgrades', body: 'Clients could now check transactions without a full copy of the chain. The DLT also learned to handle chain reorganizations, block bad peers and use a leaner network protocol.' },
        { title: 'Spixi improvements', body: 'Spixi gained voice calls, push notifications, tipping, bots for moderated group chats and many smaller touches.' },
        { title: 'Monitoring and research', body: 'Extensive testing of network performance and consensus, and research into scalability.' },
      ],
    },
    {
      year: '2021',
      items: [
        { title: 'Work on Ixiac Omega', body: 'Work began on Proof of Collaborative Work, where many nodes sign each block together. Storage and stability improved, and the IXI reward model changed after community feedback.' },
        { title: 'Platform upgrades', body: 'DLT, S2, Spixi and the SDK were upgraded together. New tools arrived too, including an offline wallet toolkit and a desktop miner.' },
        { title: 'Spixi security', body: 'Stronger encryption, biometric authentication and other security updates.' },
      ],
    },
    {
      year: '2022',
      items: [
        { title: 'Ixiac Omega on mainnet', body: 'Proof of Collaborative Work was tested, refined and launched on mainnet.' },
        { title: 'SHA-2 to SHA-3', body: 'Core hashing, including new address formats, moved from SHA-2 to SHA-3.' },
        { title: 'Spixi on .NET MAUI', body: 'Spixi began its move to .NET MAUI for cross-platform performance.' },
      ],
    },
    {
      year: '2023',
      items: [
        { title: 'Ixian Upgrade Proposals', body: 'IXIUP introduced upgrade proposals for IXI Names, UTXO upgrades, Merkle tree data structures, presence list scaling, dynamic fees and storage.' },
        { title: 'IXI Labs founded', body: 'IXI Labs was set up to build products and services on Ixian, and became the core maintainer.' },
        { title: 'A modern codebase', body: 'The codebase moved to .NET 6 for maintainability, performance and scale.' },
      ],
    },
    {
      year: '2024',
      items: [
        { title: 'Consensus improvements', body: 'Ixiac Omega was refined with two years of mainnet data. If no block arrives in 120 seconds, any node with valid proof of work can now make one.' },
        { title: 'The new Spixi', body: 'The rebuilt Spixi launched on .NET MAUI. It is faster, runs on more platforms and delivers notifications more reliably.' },
        { title: 'IXI Names live', body: 'Readable names for addresses went live on mainnet, registered and renewed on the network itself.' },
      ],
    },
    {
      year: '2025',
      items: [
        { title: 'S2 Starling', body: 'Relay sectors, lighter presence lists, better client discovery and relay rewards. S2 is now designed to scale to billions of devices.' },
        { title: 'Post-quantum key exchange', body: 'The Kyber Crystal release added a hybrid key exchange that combines RSA and ECDH with post-quantum ML-KEM-1024.' },
        { title: 'QuIXI and Spixi Mini Apps', body: 'QuIXI connected devices, AI agents and existing systems to the network over REST and MQTT, and Spixi gained Mini Apps.' },
      ],
    },
    {
      year: '2026',
      items: [
        { title: 'Direct P2P transaction delivery', body: 'Transactions now reach the clients they concern directly over S2, instead of being filtered out of DLT traffic (Q1).' },
        { title: 'Tagged transaction routing', body: 'S2 relays can now forward transactions only to clients that subscribe to a tag or channel (Q1).' },
      ],
    },
  ] as Year[],
  source: '',
  next: { label: 'What comes next: the roadmap', href: `${links.platform}#roadmap` },
};

export const maintainers = {
  title: 'Maintained in the open.',
  lead: 'Ixian is maintained by IXI Labs and open-source contributors, in public.',
  items: [
    { title: 'IXI Labs', body: 'Founded in 2023, IXI Labs looks after the core software, from the DLT and S2 to QuIXI and Spixi.', link: { label: 'ixilabs.com', href: links.ixiLabs } },
    { title: 'Contributors', body: 'Developers, writers and testers who improve the code and the docs, build Mini Apps and report issues.', link: { label: 'GitHub', href: links.github.org } },
    { title: 'Operators', body: 'The people who run DLT and S2 nodes. They keep the network up, and a change only takes hold when they upgrade.', link: { label: 'Run a node', href: links.runNode } },
  ],
};

export const decisions = {
  title: 'How changes are made.',
  lead: 'Changes to the protocol are proposed, built and tested in public before they reach mainnet.',
  steps: [
    { title: 'Propose', body: 'A change starts as an Ixian Upgrade Proposal (IXIUP) and is discussed with the community.' },
    { title: 'Build in the open', body: 'The work happens in public repositories on GitHub, where anyone can review it.' },
    { title: 'Test', body: 'Changes run on the public testnet before they reach mainnet.' },
    { title: 'Ship', body: 'Upgrades ship as versioned releases. Node operators install them, and a change to the chain switches on at a set block version.' },
  ],
  links: [
    { label: 'GitHub', href: links.github.org },
    { label: 'Roadmap', href: links.docs.roadmap },
    { label: 'Discord', href: links.social.discord },
  ],
};

export const builtOn = {
  title: 'Built on Ixian.',
  lead: 'Projects that run on the network today.',
  items: [
    { name: 'Spixi', body: 'Messenger and wallet, in daily use since 2019.', href: links.spixi },
    { name: 'Spixi Mini Apps', body: 'Multi-user apps that run inside Spixi chats.', href: links.github.miniAppsExamples },
    { name: 'QuIXI', body: 'The gateway that connects devices, AI agents and the systems you already run.', href: links.github.quixi },
    { name: 'ixiscope', body: 'The public block explorer.', href: links.explorer },
  ],
  cta: { label: 'Building on Ixian? Tell the community on Discord', href: links.social.discord },
};

export const labs = {
  text: 'Want to partner or build with Ixian?',
  sub: 'IXI Labs, the core maintainer, helps businesses with integration, support and custom builds.',
  cta: { label: 'Talk to IXI Labs', href: links.ixiLabs },
};

export const chapters = [
  { id: 'top', label: 'About' },
  { id: 'mission', label: 'Mission' },
  { id: 'history', label: 'History' },
  { id: 'maintainers', label: 'Maintainers' },
  { id: 'decisions', label: 'Changes' },
  { id: 'built-on-ixian', label: 'Built on Ixian' },
];
