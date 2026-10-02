/** Site-wide navigation and footer copy. URLs come from links.ts only. */
import { links } from './links';

export type NavLink = { label: string; href: string; external?: boolean; note?: string; icon?: string };
/** the card on the right of a menu: a live panel ('live') or a pointer to one place */
export type NavFeature = { eyebrow: string; title: string; body: string; href: string; cta: string; live?: boolean; external?: boolean };
export type NavItem = NavLink & { children?: NavLink[]; feature?: NavFeature; footer?: NavLink };

export const nav: { items: NavItem[]; cta: NavLink } = {
  items: [
    {
      label: 'Platform',
      href: links.platform,
      children: [
        { label: 'Ixian DLT', href: `${links.platform}#dlt`, note: 'The shared record of balances and payments', icon: 'node' },
        { label: 'Ixian S2', href: `${links.platform}#s2`, note: 'Finds any address and carries the traffic', icon: 'send' },
        { label: 'Security', href: `${links.platform}#security`, note: 'Hybrid post-quantum key exchange', icon: 'lock' },
        { label: 'Identity', href: `${links.platform}#identity`, note: 'One address, made from your own key', icon: 'key' },
        { label: 'IXI', href: `${links.platform}#ixi`, note: 'Fees and rewards for node operators', icon: 'wallet' },
        { label: 'Roadmap', href: `${links.platform}#roadmap`, note: 'What shipped and what comes next', icon: 'dashboard' },
      ],
      feature: { eyebrow: 'Network, live', title: 'The network right now', body: 'Nodes online and the latest block, read from the network.', href: links.explorer, cta: 'Open ixiscope', live: true, external: true },
      footer: { label: 'Platform overview', href: links.platform },
    },
    {
      label: 'Developers',
      href: links.developers,
      children: [
        { label: 'Quickstart', href: links.quickstart, note: 'Message your phone in about two minutes', icon: 'bolt' },
        { label: 'Quickstarts', href: `${links.developers}#quickstarts`, note: 'Sandbox, Mini App, QuIXI, client app, payments', icon: 'terminal' },
        { label: 'QuIXI gateway', href: `${links.developers}#quixi`, note: 'REST, MQTT or RabbitMQ from any language', icon: 'app' },
        { label: 'Guides', href: `${links.developers}#guides`, note: 'Longer walkthroughs, start to finish', icon: 'agent' },
        { label: 'API reference', href: links.docs.reference, note: 'Every call, in the docs', icon: 'copy', external: true },
        { label: 'GitHub', href: links.github.org, note: 'All the code, open source', icon: 'node', external: true },
      ],
      feature: { eyebrow: 'Start here', title: 'Message your phone in two minutes', body: 'Run QuIXI on your computer, pair it with Spixi and send an encrypted message.', href: links.quickstart, cta: 'Start the Quickstart' },
      footer: { label: 'All of Developers', href: links.developers },
    },
    {
      label: 'Ecosystem',
      href: links.ecosystem,
      children: [
        { label: 'Spixi', href: `${links.ecosystem}#spixi`, note: 'Messenger and wallet, in daily use since 2019', icon: 'phone' },
        { label: 'Products', href: `${links.ecosystem}#products`, note: 'Mini Apps, QuIXI, ixiscope, IXI Names', icon: 'app' },
        { label: 'Run a node', href: links.runNode, note: 'Earn IXI with a DLT or S2 node, no stake', icon: 'node' },
        { label: 'Take part', href: `${links.ecosystem}#take-part`, note: 'Code, docs, Mini Apps and proposals', icon: 'person' },
      ],
      feature: { eyebrow: 'Spixi', title: 'Try Ixian in your pocket', body: 'Chat, call and pay with an address instead of a phone number. iOS, Android, Windows and macOS.', href: links.spixiDownload, cta: 'Get Spixi', external: true },
      footer: { label: 'All of Ecosystem', href: links.ecosystem },
    },
    { label: 'Docs', href: links.docs.home, external: true },
    { label: 'About', href: links.about },
  ],
  cta: { label: 'Start building', href: links.quickstart },
};

export const footer = {
  tagline: 'Connect anything. Directly.',
  maintained: 'Open source, maintained by IXI Labs and contributors.',
  status: {
    live: 'Network live',
    reading: 'Reading the network…',
    s2: 'S2 nodes',
    dlt: 'DLT nodes',
    block: 'Latest block',
  },
  columns: [
    {
      title: 'Platform',
      links: [
        { label: 'Overview', href: links.platform },
        { label: 'Ixian DLT', href: `${links.platform}#dlt` },
        { label: 'Ixian S2', href: `${links.platform}#s2` },
        { label: 'Security', href: `${links.platform}#security` },
        { label: 'IXI', href: `${links.platform}#ixi` },
        { label: 'Roadmap', href: `${links.platform}#roadmap` },
      ],
    },
    {
      title: 'Developers',
      links: [
        { label: 'Overview', href: links.developers },
        { label: 'Quickstart', href: links.quickstart },
        { label: 'More quickstarts', href: links.docs.quickstart.index },
        { label: 'How-to guides', href: links.docs.howto.index },
        { label: 'API reference', href: links.docs.reference },
        { label: 'Docs', href: links.docs.home },
        { label: 'GitHub', href: links.github.org },
      ],
    },
    {
      title: 'Ecosystem',
      links: [
        { label: 'Overview', href: links.ecosystem },
        { label: 'Spixi', href: links.spixi },
        { label: 'Run a node', href: links.runNode },
        { label: 'ixiscope explorer', href: links.explorer },
        { label: 'Whitepaper', href: links.whitepaper },
      ],
    },
    {
      title: 'About',
      links: [
        { label: 'About the project', href: links.about },
        { label: 'Blog', href: links.blog },
        { label: 'IXI Labs', href: links.ixiLabs },
      ],
    },
    {
      title: 'Community',
      links: [
        { label: 'Discord', href: links.social.discord },
        { label: 'Telegram', href: links.social.telegram },
        { label: 'X', href: links.social.x },
        { label: 'LinkedIn', href: links.social.linkedin },
        { label: 'Medium', href: links.social.medium },
        { label: 'Reddit', href: links.social.reddit },
      ],
    },
  ],
  legal: [
    { label: 'Privacy policy', href: links.privacy },
    { label: 'Terms of use', href: links.terms },
    { label: 'Cookie policy', href: links.cookies },
  ],
};
