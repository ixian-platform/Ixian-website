/**
 * Content for /get-involved. Operator facts follow docs.ixian.io/docs/operators.
 * `#ixi-mining` is kept as an anchor because links.runNode and external links point to it.
 */
import { links } from './links';

const d = links.docs;

export const meta = {
  title: 'Ixian Ecosystem | Spixi, Mini Apps, QuIXI and nodes',
  description: 'What runs on Ixian: Spixi, Mini Apps, QuIXI, ixiscope and IXI Names. Run a DLT or S2 node with no stake, and help build the open-source project.',
};

export type NodeKind = {
  id: 'dlt' | 's2';
  name: string;
  role: string;
  earns: string;
  specs: { k: string; v: string }[];
  code: string[];
  guide: { label: string; href: string };
  release: { label: string; href: string };
  liveLabel: string;
};

export const runNode = {
  title: 'Run a node, earn IXI.',
  lead: 'The network is run by the people who use it. Anyone can operate a DLT or an S2 node on their own hardware; there is no stake to lock up.',
  note: '',
  liveNote: { live: 'Node counts are live.', reading: 'Reading the network…' },
  kinds: [
    {
      id: 'dlt',
      name: 'DLT node',
      role: 'Keeps the shared record. It checks transactions and signs blocks (the Ixiac consensus).',
      earns: 'It earns a share of block rewards and transaction fees in line with its proof of work, plus IXI Names fees paid out over time.',
      specs: [
        { k: 'Memory', v: '16 GB RAM or more' },
        { k: 'CPU', v: '8+ threads at 2 GHz or more' },
        { k: 'Disk', v: '1.5 TB or more, 2 TB recommended' },
        { k: 'Network', v: '50 Mbps symmetrical, 100 recommended' },
        { k: 'Port', v: 'TCP 10234, open to the internet' },
      ],
      code: [
        '$ git clone -b master https://github.com/ixian-platform/Ixian-Core.git',
        '$ git clone -b master https://github.com/ixian-platform/Ixian-DLT.git',
        '$ cd Ixian-DLT && sh rebuild.sh',
        '$ cd IxianDLT/bin/Release/net10.0/ && ./IxianDLT',
      ],
      guide: { label: 'DLT operator guide', href: d.operatorsDlt },
      release: { label: 'DLT releases', href: links.github.dltReleases },
      liveLabel: 'DLT nodes online',
    },
    {
      id: 's2',
      name: 'S2 node',
      role: 'Relays end-to-end encrypted traffic and keeps presence for the endpoints in its sectors.',
      earns: 'It earns a relay fee on the transactions it carries, and adds capacity for everyone.',
      specs: [
        { k: 'Memory', v: '4 GB RAM or more' },
        { k: 'CPU', v: '2 GHz or more' },
        { k: 'Disk', v: '20 GB or more' },
        { k: 'Network', v: '10 Mbps symmetrical, 100 recommended' },
        { k: 'Port', v: 'TCP 10235' },
      ],
      code: [
        '$ git clone -b master https://github.com/ixian-platform/Ixian-Core.git',
        '$ git clone -b master https://github.com/ixian-platform/Ixian-S2.git',
        '$ cd Ixian-S2 && sh rebuild.sh',
        '$ cd IxianS2/bin/Release/net10.0/ && ./IxianS2',
      ],
      guide: { label: 'S2 operator guide', href: d.operatorsS2 },
      release: { label: 'S2 releases', href: links.github.s2Releases },
      liveLabel: 'S2 nodes online',
    },
  ] as NodeKind[],
  labels: { role: 'What it does', earns: 'What it earns', specs: 'Recommended hardware (Debian guide)', start: 'Build and start (Linux)' },
  links: [
    { label: 'Operator docs', href: d.operators },
    { label: 'Economics', href: d.economics },
  ],
};

export const eco = {
  hero: {
    title: ['Ecosystem.', 'Use it. Build on it. Run it.'] as [string, string],
    lead: 'Everything here is open source, and the network under it is run by the people who use it.',
    actions: [
      { label: 'Get Spixi', href: links.spixiDownload, kind: 'primary' as const },
      { label: 'Run a node', href: '#ixi-mining', kind: 'secondary' as const },
    ],
  },
  map: {
    label: 'The Ixian ecosystem',
    core: 'Ixian',
    live: 'nodes online',
    rings: { use: 'USE', build: 'BUILD', run: 'RUN' },
    items: [
      { id: 'spixi', ring: 'use', name: 'Spixi', line: 'Messenger and wallet, in daily use since 2019.', href: '#spixi' },
      { id: 'ixiscope', ring: 'use', name: 'ixiscope', line: 'Every block and transaction, in public.', href: '#products' },
      { id: 'names', ring: 'use', name: 'IXI Names', line: 'Readable names for addresses.', href: '#products' },
      { id: 'miniapps', ring: 'build', name: 'Mini Apps', line: 'Apps that run inside Spixi chats.', href: '#products' },
      { id: 'quixi', ring: 'build', name: 'QuIXI', line: 'Connect any device, agent or system over REST, MQTT or RabbitMQ.', href: '#products' },
      { id: 'bot', ring: 'build', name: 'Spixi Bot', line: 'Channels anyone can host, for people, agents and devices. Coming soon.', href: '#products' },
      { id: 'dlt', ring: 'run', name: 'DLT node', line: 'Keeps the record, signs blocks, earns IXI.', href: '#ixi-mining' },
      { id: 's2', ring: 'run', name: 'S2 node', line: 'Relays encrypted traffic, earns relay fees.', href: '#ixi-mining' },
    ],
    hint: 'Point at anything on the map.',
  },
  spixi: {
    eyebrow: 'Spixi',
    title: 'The messenger that runs on Ixian.',
    facts: ['In daily use since 2019', 'No phone number. No email.', 'Your wallet, in the chat'],
    scenes: [
      { name: 'Chat', line: 'Messages, calls, files and IXI, end to end encrypted.' },
      { name: 'Agents', line: 'An agent that works for you, inside the conversation.', note: 'Design preview' },
      { name: 'Mini Apps', line: 'Shared apps that run inside the chat, peer to peer.' },
    ],
    platforms: 'iOS · Android · Windows · macOS',
    cta: { label: 'Get Spixi', href: links.spixiDownload },
    source: { label: 'Source code', href: links.github.spixi },
    note: 'The conversations shown are examples.',
  },
  products: {
    title: 'More on Ixian.',
    lead: 'Tools for builders, readable names for everyone, a public view of the network, and one on its way.',
    items: [
      { id: 'miniapps', name: 'Spixi Mini Apps', kind: 'Build', body: 'Multi-user apps in HTML and JavaScript that run inside Spixi and share state peer to peer, for games, shared tools or controlling a device.', status: 'Available', links: [{ label: 'Quickstart', href: links.docs.quickstart.miniApp }, { label: 'Examples', href: links.github.miniAppsExamples }] },
      { id: 'quixi', name: 'QuIXI', kind: 'Build', body: 'Connects devices, AI agents and existing systems to Ixian over REST, MQTT or RabbitMQ, so they can message and pay from an Ixian address.', status: 'Available', links: [{ label: 'Quickstart', href: links.quickstart }, { label: 'Releases', href: links.github.quixiReleases }] },
      { id: 'ixiscope', name: 'ixiscope', kind: 'Use', body: 'Blocks, transactions, addresses and emissions, in public.', status: 'Live', links: [{ label: 'Open ixiscope', href: links.explorer }] },
      { id: 'names', name: 'IXI Names', kind: 'Use', body: 'Readable names registered on the DLT, with subnames and records that point to wallets and endpoints.', status: 'Available', links: [{ label: 'How it works', href: links.docs.names }] },
      { id: 'bot', name: 'Spixi Bot', kind: 'Build', body: 'Community channels in Spixi that anyone can host. Owners and admins are set by IXI address, and moderation is built in. A bridge lets AI agents and devices join a channel, post and act, and channels can charge a few IXI to post or join.', status: 'Coming soon', links: [{ label: 'Source code', href: links.github.spixiBot }] },
    ],
  },
  nodes: {
    title: 'Your own hardware, no stake.',
    lead: 'Anyone can run a DLT or an S2 node on their own hardware and earn IXI for the work.',
    note: 'Every DLT node includes a wallet at localhost:8081.',
    live: 'online now',
    does: 'Does',
    earns: 'Earns',
    hardware: 'Minimum',
    start: 'Build and start on Linux',
    copy: 'Copy',
    copied: 'Copied',
  },
  part: {
    title: 'Take part.',
    lead: 'Code, docs, apps and good questions all move Ixian forward, and all of it happens in the open.',
    ways: [
      { n: '01', name: 'Write code', body: 'Pick an issue in Core, DLT, S2, QuIXI or Spixi.', href: links.github.org, cta: 'GitHub' },
      { n: '02', name: 'Improve the docs', body: 'Fix, clarify or add a guide.', href: links.github.docs, cta: 'Ixian-Docs' },
      { n: '03', name: 'Build a Mini App', body: 'Make something people can open together in a Spixi chat.', href: links.github.miniApps, cta: 'Mini Apps SDK' },
      { n: '04', name: 'Shape the protocol', body: 'Ideas for the protocol are discussed in the open, on Discord and GitHub.', href: links.social.discord, cta: 'Discord' },
    ],
    talk: 'Talk to us',
    channels: [
      { name: 'Discord', note: 'Builders and operators', href: links.social.discord },
      { name: 'Telegram', note: 'Community', href: links.social.telegram },
      { name: 'X', note: 'News', href: links.social.x },
      { name: 'GitHub', note: 'Code', href: links.github.org },
      { name: 'Medium', note: 'Long reads', href: links.social.medium },
      { name: 'LinkedIn', note: 'Project news', href: links.social.linkedin },
      { name: 'Reddit', note: 'Discussion', href: links.social.reddit },
    ],
  },
  next: [
    { label: 'Build on it', href: links.developers, body: 'Quickstarts, guides and the APIs.', tone: 'build', glyph: 'build' },
    { label: 'See how it works', href: links.platform, body: 'The DLT, S2 and the security model.', tone: 's2', glyph: 'docs' },
    { label: 'Meet the project', href: links.about, body: 'The mission, and the history since 2016.', tone: 'dlt', glyph: 'node' },
  ],
  index: [
    { id: 'spixi', label: 'Spixi' },
    { id: 'products', label: 'Products' },
    { id: 'ixi-mining', label: 'Run a node' },
    { id: 'take-part', label: 'Take part' },
  ],
  chapters: [
    { id: 'top', label: 'Ecosystem' },
    { id: 'spixi', label: 'Spixi' },
    { id: 'products', label: 'Products' },
    { id: 'ixi-mining', label: 'Run a node' },
    { id: 'take-part', label: 'Take part' },
  ],
};

/** Where to keep and get IXI. An item without `href` shows as coming soon. */
export const holdIxi = {
  title: 'Hold IXI.',
  lead: 'IXI pays for transactions and rewards the people who run nodes. Here is where to keep it and where to get it.',
  items: [
    { label: 'Spixi', kind: 'Wallet', body: 'The easiest way to hold IXI: a wallet and messenger on iOS, Android, Windows and macOS.', href: links.spixiDownload, cta: 'Get Spixi' },
    { label: 'QuIXI', kind: 'Wallet', body: 'A lightweight wallet for managing IXI from your computer, and the gateway your apps can call.', href: links.github.quixi, cta: 'Get QuIXI' },
    { label: 'A DLT node', kind: 'Wallet', body: 'Every DLT node includes a wallet, at localhost:8081 on the machine that runs it.', href: links.docs.operatorsDlt, cta: 'Run a node' },
    { label: 'NonKYC', kind: 'Get IXI', body: 'IXI trades against USDT on the NonKYC exchange.', href: links.exchangeNonkyc, cta: 'Trade IXI' },
    { label: 'Faucet', kind: 'Get IXI', body: 'A little IXI to try things with, free.', href: '', cta: 'Coming soon' },
  ] as { label: string; kind: string; body: string; href: string; cta: string }[],
};
