// Homepage copy. Numbers come only from metrics.ts; "How it works" copy is in content/how.ts.
import { links } from './links';

export const hero = {
  headline: ['Connect anything.', 'Directly.'],
  /** alternative headlines; the first is the current one */
  alternatives: [
    ['Connect anything.', 'Directly.'],
    ['One address.', 'Anything can connect.'],
    ['People, devices and AI agents,', 'talking directly.'],
    ['The network where anything', 'can talk and pay directly.'],
  ],
  sub: 'Give any person, device or AI agent one address. With it, they can prove who they are, be found, talk privately and get paid. No accounts, no servers to run, nobody in the middle.',
  // lands on the How it works frame, where the round trip runs in the browser
  primary: { label: 'See it live', href: '#live' },
  note: 'Example traffic. The block and node numbers are live.',
};

export const build = {
  title: 'What you can build.',
  lead: 'Four things that used to need a backend.',
  tiles: [
    {
      id: 'agents',
      title: 'AI agents with their own address',
      body: 'Give an agent an address instead of an API account. It talks to people privately, delivers work and asks to be paid. You approve every payment.',
      guide: { label: 'Build an AI chatbot on Ixian', href: links.docs.howto.aiChatbot },
      note: 'Agents inside Spixi are a design preview until they ship.',
    },
    {
      id: 'devices',
      title: 'Devices without a cloud',
      body: 'Sensors report and machines take commands directly, encrypted end to end, without a vendor cloud or your own broker in the middle. Connect them over MQTT or REST.',
      guide: { label: 'IoT without the cloud', href: links.docs.howto.iot },
    },
    {
      id: 'miniapps',
      title: 'Mini Apps with no backend',
      body: 'Write a multi-user app in HTML and JavaScript and share it in a chat. The app state travels between the people using it, so there is no app store to publish to and no backend of your own to host.',
      guide: { label: 'Mini App quickstart', href: links.docs.quickstart.miniApp },
    },
    {
      id: 'paid',
      title: 'Services that charge per request',
      body: 'Give an API or an AI model its own address and wallet. It answers each request once the payment has settled. No payment processor, no API keys.',
      guide: { label: 'Payment gateway quickstart', href: links.docs.quickstart.paymentGateway },
    },
  ],
  cta: { label: 'For developers', href: links.developers }, // the Start section has the Quickstart button
  more: { label: 'All guides', href: links.docs.howto.index },
};

export const spixi = {
  eyebrow: 'Spixi',
  title: 'In daily use since 2019.',
  body: 'A messenger and wallet built on Ixian. Chat, call, send files and money, and open Mini Apps with friends, from shared games to controls for your smart home. Sign up with nothing: no phone number, no email.',
  screens: ['Chat', 'Agents', 'Mini Apps'],
  agentsNote: 'Agents inside Spixi are a design preview.',
  primary: { label: 'Get Spixi', href: links.spixiDownload },
  /** as listed on spixi.io (no Linux build) */
  platforms: ['iOS', 'Android', 'Windows', 'macOS'],
  numbersNote: '',
};

export const spixiCaseStudy = { label: 'Read the case study', href: `${links.blog}/spixi-infrastructure-costs` };

export const start = {
  title: 'Start in minutes.',
  lead: 'Make an address in seconds. Message your phone from your computer in about two minutes. Build something real in under an hour.',
  steps: [
    // code: 'try' runs in the browser (Start/TryAddress.tsx)
    { time: '10 s', title: 'Try it', body: 'Make a real Ixian address right here. Your browser creates the keys (RSA-4096) and works out the address. Nothing leaves this page.', code: 'try', link: { label: 'Or talk to people in Spixi', href: links.spixiDownload } },
    { time: '2 min', title: 'Message your phone', body: 'Run QuIXI on your computer, pair it with Spixi and send your phone an encrypted message. No account, no server of your own.', code: 'dotnet run --project QuIXI', link: { label: 'QuIXI bridge docs', href: links.docs.quickstart.quixi } },
    { time: 'Under an hour', title: 'Build it', body: 'Put an AI agent behind an address, switch a device from your phone, build a Mini App, or run a private test network in Docker.', code: 'GET /sendChatMessage', link: { label: 'All quickstarts', href: links.docs.quickstart.index } },
  ],
  cta: { label: 'Start the Quickstart', href: links.quickstart, note: 'About two minutes, plus the first sync.' },
  tools: 'QuIXI (REST, MQTT, RabbitMQ) · Ixian-Core SDK (C#/.NET) · Mini Apps SDK (HTML/JS) · open source on GitHub',
  /** each name links to its docs or repository */
  toolLinks: [
    { label: 'QuIXI', note: 'REST, MQTT, RabbitMQ', href: links.docs.quixi },
    { label: 'Ixian-Core SDK', note: 'C#/.NET', href: links.github.core },
    { label: 'Mini Apps SDK', note: 'HTML/JS', href: links.github.miniApps },
    { label: 'open source on GitHub', href: links.github.org },
  ] as { label: string; note?: string; href: string }[],
};

export const network = {
  title: 'Run by the people who use it.',
  lead: 'Ixian runs on nodes operated by the people who use it. The chain, the code and the conversation are all public.',
  nodes: [
    // signers share block rewards, transaction fees (by PoW difficulty) and IXI Names fees;
    // S2 operators get a relay fee per relayed transaction
    { name: 'DLT node', body: 'Keeps the shared record and signs blocks. Earns block rewards, transaction fees and name fees.', href: links.docs.operatorsDlt },
    { name: 'S2 node', body: 'Relays encrypted traffic and helps endpoints find each other. Earns a relay fee on the transactions it carries.', href: links.docs.operatorsS2 },
  ],
  cta: { label: 'Run a node', href: links.docs.operators },
  community: [
    { label: 'Block explorer', href: links.explorer },
    { label: 'GitHub', href: links.github.org },
    { label: 'Discord', href: links.social.discord },
    { label: 'Telegram', href: links.social.telegram },
    { label: 'X', href: links.social.x },
  ],
  names: 'IXI Names gives addresses readable names.',
};

export const labs = {
  text: 'Need integration, support or a custom build?',
  sub: 'IXI Labs, the core maintainer, helps businesses build on Ixian.',
  cta: { label: 'Talk to IXI Labs', href: links.ixiLabs },
};

/**
 * Optional 4:3 still images for the build tiles; an image here wins over the drawn visual.
 * e.g. { src: '/site/build/people.webp', alt: '...' }
 */
export const buildMedia: Record<string, { src: string; alt: string } | null> = {
  agents: null,
  devices: null,
  miniapps: null,
  paid: null,
};

export const platform = {
  title: 'One platform,\nrun by the people\nwho use it.', // explicit breaks (pre-line); text-wrap: balance split it badly
  lead: 'Ixian is two open networks working as one. A relay network moves the data and a shared record settles it. Independent operators run both, and the chain, the code and the conversation are all public.',
  layers: [
    {
      id: 'apps',
      title: 'Your app, device or agent',
      body: 'Anything that connects gets one address. It talks through S2 and settles on the DLT, with no server of your own in between.',
      links: [
        { label: 'Architecture overview', href: links.docs.architecture },
        { label: 'System architecture', href: links.docs.systemArchitecture },
      ],
    },
    {
      id: 's2',
      title: 'Ixian S2, the relay network',
      body: 'S2 nodes find endpoints by address and pass messages, files and streams along, encrypted end to end. A relay only ever sees ciphertext.',
      links: [
        { label: 'Network topology', href: links.docs.networkTopology },
        { label: 'How endpoints are found', href: links.docs.starling },
      ],
    },
    {
      id: 'dlt',
      title: 'Ixian DLT, the shared record',
      body: 'DLT nodes keep the shared record of balances and payments, and sign a new block about every 30 seconds.',
      links: [
        { label: 'Consensus', href: links.docs.consensus },
        { label: 'Economics', href: links.docs.economics },
      ],
    },
    {
      id: 'run',
      title: 'Run a node',
      // keep in sync with network.nodes
      body: 'Anyone can run a DLT or an S2 node. DLT nodes earn block rewards and fees; S2 nodes earn a relay fee on the transactions they carry and add capacity.',
      links: [
        { label: 'DLT operator guide', href: links.docs.operatorsDlt },
        { label: 'S2 operator guide', href: links.docs.operatorsS2 },
      ],
    },
  ],
  cta: { label: 'Run a node', href: links.docs.operators },
  community: network.community,
  names: network.names,
  liveNote: 'Bright points are nodes online now, one per node.',
};

// Claims here must match platform.layers and network.nodes.
export const platformLayers = {
  layers: [
    // `line`: the short text for the phone rail
    { id: 'dlt', short: 'Ixian DLT', role: 'The shared record', line: 'Keeps the shared record. A payment is included in the next block, usually within 30 seconds.' },
    { id: 's2', short: 'Ixian S2', role: 'The relay network', line: 'Relays encrypted traffic and finds any address, wherever it is right now.' },
    {
      id: 'apps',
      short: 'Connect anything',
      role: 'Agents, devices, apps, services',
      line: 'Whatever you build gets one address. It talks over S2 and settles on the DLT.',
      title: 'Anything that connects',
      body: 'An AI agent, a sensor, a Mini App or a paid API. Whatever you build gets one address. It talks through S2 and settles on the DLT, with no server of your own in between.',
    },
    { id: 'run', short: 'Run a node', role: 'Join the platform', line: 'Run a DLT or S2 node on your own hardware and earn fees for the work it does.' },
  ],
  /** the run-a-node diagram's two callouts (lines from network.nodes) */
  callouts: {
    s2: { label: 'Your S2 node', body: 'Relays encrypted traffic. Earns a relay fee on what it carries.' },
    dlt: { label: 'Your DLT node', body: 'Keeps the shared record and signs blocks. Earns rewards and fees.' },
  },
  explore: { label: 'Explore the platform', href: links.platform },
  /** claims follow the system-architecture and network-topology docs */
  scale: {
    title: 'Each network grows on its own.',
    lead: 'Messages and streams stay on S2, and only finished transactions reach the ledger.',
    points: [
      { k: 'More relays', v: 'Each new S2 node takes its share of sectors on its own and adds capacity.' },
      { k: 'More endpoints', v: 'The DLT holds only balances, and sectors spread client presence across relays.' },
    ],
    link: { label: 'Network topology', href: links.docs.networkTopology },
  },
};

// Digital trust: the receiver checks a signature against the sender's address itself.
export const trust = {
  title: 'Know who’s talking. Every time.',
  lead: 'Know who’s on the other end without asking anyone. The check is built into every address, so there’s no login provider to trust, no account to take over and no one who can switch you off.',
  label: 'Who needs it',
  real: 'The real one',
  fake: 'A lookalike',
  trusts: 'Trusts',
  signed: 'Signed by',
  replay: 'Play again',
  example: 'Example',
  /** the address the receiver knows, and a lookalike two characters off (a different key) */
  addr: { real: '1Pm4Hc8Vx…eR2kTq6b', fake: '1Pm4Hc8Vy…eR2kTg6b' },
  cases: [
    {
      id: 'agents',
      tab: 'AI agents',
      /** the short line for the phone rail */
      short: 'An agent acts only on requests it can prove came from the right sender.',
      why: 'An agent should act only on requests it can prove came from the right sender. It checks every message against the sender’s address itself, with no login provider in between.',
      from: { glyph: 'agent', name: 'Your agent' },
      to: { glyph: 'service', name: 'A paid service' },
      msg: 'Run 3 GPU hours',
      fakeMsg: 'Run 300 GPU hours',
      ok: 'Matches. Runs the job.',
      no: 'No match. Dropped.',
    },
    {
      id: 'devices',
      tab: 'Devices',
      /** the short line for the phone rail */
      short: 'The lock knows its owner by address and drops every other command.',
      why: 'The lock only obeys its owner’s address. A spoofed command is dropped before it does anything, and there’s no cloud account for anyone to hijack.',
      from: { glyph: 'spixi', name: 'Your phone' },
      to: { glyph: 'lock', name: 'Front door lock' },
      msg: 'Open the door',
      fakeMsg: 'Open the door',
      ok: 'Matches. The door opens.',
      no: 'No match. Stays locked.',
    },
    {
      id: 'people',
      tab: 'People',
      /** the short line for the phone rail */
      short: 'In Spixi a contact is an address, so nobody else can message you as them.',
      why: 'In Spixi a contact is an address, not a phone number or a username. There is no number to port and no account to take over, so nobody else can message you as them.',
      from: { glyph: 'spixi', name: 'Your contact' },
      to: { glyph: 'spixi', name: 'You, in Spixi' },
      msg: 'Lunch at one?',
      fakeMsg: 'New number, send 200 IXI',
      ok: 'Matches. Shown as your contact.',
      no: 'No match. Never shown as them.',
    },
  ],
  note: '',
  links: [
    { label: 'Addresses', href: links.docs.addresses },
    { label: 'Cryptographic primitives', href: links.docs.crypto },
  ],
};
