import { links } from '@site/content/links';

/** Technical terms follow docs.ixian.io; keep them in sync with the Platform page. */
export const HOW_INTRO = {
  title: 'How it works',
  lead: 'Everything on Ixian starts with an address that belongs to you. That one address lets you prove who you are, be found, talk privately and get paid.',
};

export const HOW_STEPS = [
  {
    tab: 'Identity',
    /** the slim line for the phone rail */
    short: 'Each endpoint makes its own keys. Its address comes from them, so nobody issues it and nobody can take it away.',
    term: 'Self-sovereign identity',
    means: '',
    body: 'Every endpoint (an AI agent, a device, a phone or a service) makes its own key pair. Its address comes from the public key, so nobody hands it out and nobody can take it back.',
    facts: ['Key pair made on the device', 'Address derived from the public key', 'No sign-up, no registry'],
    more: { label: 'Addresses', href: links.docs.addresses },
  },
  {
    tab: 'Proof',
    /** the slim line for the phone rail */
    short: 'It signs with the key behind its address. The other side checks that by itself, with no login server.',
    term: 'Digital trust',
    means: 'Each side can check who the other is by itself. No password to leak, no login server to breach.',
    body: 'An endpoint proves who it is by signing with the key behind its address. The other side checks the signature against the address itself, with no login provider in between.',
    facts: ['Signed with the key behind the address', 'Checked by the other endpoint', 'No account provider'],
    more: { label: 'Cryptographic primitives', href: links.docs.crypto },
  },
  {
    tab: 'Find',
    /** the slim line for the phone rail */
    short: 'Relays find an address wherever it is right now. No fixed IP, no DNS, no ports to open.',
    term: 'Discovery',
    means: 'Your agent, device or app stays reachable when it changes networks, with no ports to open.',
    body: 'Every address maps to a sector of the S2 network. Ask the relays that serve that sector, and they tell you where the endpoint is right now, signed by the endpoint itself. No fixed IP, no DNS.',
    facts: ['Found by address', 'No fixed IP, no DNS', 'Signed presence, expires after 300 s'],
    more: { label: 'Discovery without DNS', href: links.docs.starling },
  },
  {
    tab: 'Talk',
    /** the slim line for the phone rail */
    short: 'The two ends agree post-quantum keys, then talk directly, encrypted end to end.',
    term: 'Private communication',
    means: 'No relay operator, ISP or Ixian node can read your traffic.',
    body: 'The two ends agree keys using a hybrid exchange that includes post-quantum ML-KEM-1024. Every message is then sealed twice, with two independent ciphers (AES-256-GCM and ChaCha20-Poly1305). Then they talk directly.',
    facts: ['End to end encrypted', 'Post-quantum key exchange', 'Direct, peer to peer'],
    more: { label: 'Post-quantum encryption', href: links.docs.howto.pq },
  },
  {
    tab: 'Pay',
    /** the slim line for the phone rail */
    short: 'The address is also a wallet. A payment is included in the next block on the Ixian DLT.',
    term: 'Value transfer',
    means: 'Payments go from address to address, with no payment processor or bank account in between.',
    body: 'The same address is a wallet. A signed transaction goes through a relay to the Ixian DLT and is included in the next block, usually within 30 seconds.',
    facts: ['The address is also the wallet', 'In the next block', 'Fees of a fraction of a cent'],
    more: { label: 'IXI and fees', href: links.docs.economics },
  },
];

/** endpoint kinds flashed during the identity step: [glyph, "an AI agent"] */
export const ANY_ENDPOINT: [string, string][] = [
  ['agent', 'an AI agent'],
  ['sensor', 'an IoT sensor'],
  ['spixi', 'a phone'],
  ['service', 'a service'],
  ['robot', 'a robot'],
  ['car', 'a car'],
  ['drone', 'a drone'],
];

/** example addresses of the two endpoints in the drawing */
export const EXAMPLE_ADDRESSES: [string, string] = ['1Pm4Hc8Vx…eR2kTq6b', '1EXSqPpj49…n9sJdaWm'];

export type UseCase = {
  id: string;
  label: string;
  /** one line under the title in the use-case grid */
  sub: string;
  /** the guide the grid cell opens */
  docs: { label: string; href: string };
  /** glyphs (keys of GLYPH) and names of the two endpoints in the drawing */
  glyph: [string, string];
  names: [string, string];
  /** what B receives in the value step */
  amount: string;
};

/** Pairs the drawing can play, also rendered as the grid of docs links. */
export const USE_CASES: UseCase[] = [
  {
    id: 'agents',
    label: 'AI agents',
    sub: 'Agents with their own address, paid per task',
    docs: { label: 'Build an AI chatbot on Ixian', href: links.docs.howto.aiChatbot },
    glyph: ['spixi', 'agent'],
    names: ['phone', 'AI agent'],
    amount: '2 IXI',
  },
  {
    id: 'devices',
    label: 'IoT and devices',
    sub: 'Commands from anywhere, no cloud broker',
    docs: { label: 'IoT without the cloud', href: links.docs.howto.iot },
    glyph: ['service', 'device'],
    names: ['dashboard', 'Raspberry Pi'],
    amount: '0.01 IXI',
  },
  {
    id: 'messaging',
    label: 'Messaging',
    sub: 'End to end encrypted, address to address',
    docs: { label: 'sendChatMessage reference', href: links.docs.sendChatMessage },
    glyph: ['spixi', 'spixi'],
    names: ['Spixi user', 'friend'],
    amount: '5 IXI',
  },
  {
    id: 'payments',
    label: 'Payments',
    sub: 'Person to machine, machine to machine',
    docs: { label: 'Payment gateway quickstart', href: links.docs.quickstart.paymentGateway },
    glyph: ['agent', 'service'],
    names: ['agent', 'service'],
    amount: '0.5 IXI',
  },
  {
    id: 'miniapps',
    label: 'Mini Apps',
    sub: 'Web apps inside a chat, with no backend',
    docs: { label: 'Spixi Mini App quickstart', href: links.docs.quickstart.miniApp },
    glyph: ['spixi', 'spixi'],
    names: ['player 1', 'player 2'],
    amount: '1 IXI',
  },
  {
    id: 'private',
    label: 'Post-quantum privacy',
    sub: 'A hybrid key exchange on every session',
    docs: { label: 'Implementing post-quantum security', href: links.docs.howto.pq },
    glyph: ['device', 'service'],
    names: ['device', 'service'],
    amount: '0.1 IXI',
  },
];

/** `step` indexes HOW_STEPS: hovering a noun lights that step. */
export const REPLACES = {
  lead: 'One protocol instead of',
  items: [
    { noun: 'an auth provider', step: 1 },
    { noun: 'a device registry', step: 2 },
    { noun: 'a message broker', step: 3 },
    { noun: 'a payment processor', step: 4 },
  ],
};
