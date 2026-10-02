/** Privacy Policy. Also covers the ixiscope explorer (explorer.ixian.io), which links here. */
import type { LegalDoc } from './types';
import { links } from '../links';

const doc: LegalDoc = {
  title: 'Privacy Policy',
  updated: 'Last updated: 1 October 2026',
  sections: [
    {
      n: 1,
      heading: 'Who we are',
      blocks: [
        { p: ['This policy explains how IXI Labs d.o.o. ("IXI Labs", "we", "us") handles personal data when you visit www.ixian.io (the "Website"). IXI Labs d.o.o. is the controller for that data.'] },
        { p: ['Postal address: IXI Labs d.o.o., Zaloška cesta 160C, 1260 Ljubljana-Polje, Slovenia. Email: ', { b: 'info@ixian.io' }, '.'] },
        { p: ['This policy also covers the ixiscope block explorer at explorer.ixian.io ("ixiscope"). The Ixian network, the Spixi app and other software have their own documentation. Transactions on the Ixian DLT are public by design and are not controlled by us.'] },
      ],
    },
    {
      n: 2,
      heading: 'The short version',
      blocks: [
        {
          ul: [
            ['No accounts, no sign-up forms, no newsletter.'],
            ['No analytics, no advertising, no tracking cookies and no profiling.'],
            ['We never sell or rent personal data.'],
            ['Keys and addresses made in the in-browser demos stay in your browser and are never sent to us.'],
          ],
        },
      ],
    },
    {
      n: 3,
      heading: 'What is processed, and why',
      blocks: [
        { p: [{ b: 'Delivering the Website.' }, ' The Website is hosted on GitHub Pages. When your browser requests a page, GitHub processes technical data such as your IP address, browser and device type, the page requested and the time. It does this to deliver the page and keep the service secure. Legal basis: our legitimate interest in running a secure website (Art. 6(1)(f) GDPR). GitHub’s own privacy statement applies to this processing.'] },
        { p: [{ b: 'Live network numbers.' }, ' Every page asks resources.ixian.io for a small status file when it opens, then every 10 seconds while the page is visible, to show live node counts and the latest block. That server receives your IP address and browser details, like any web request, and may keep them in short-lived server logs for security. No identifier is added to the request. Legal basis: legitimate interest (Art. 6(1)(f) GDPR).'] },
        { p: [{ b: 'Images from Medium.' }, ' Some blog posts were first published on Medium. Where an image is not yet hosted on the Website, it can be loaded from Medium’s servers, which then receive your IP address and browser details. We only load these images after you allow external content (see our ', { a: 'Cookie Policy', href: links.cookies }, '). Legal basis: your consent (Art. 6(1)(a) GDPR), which you can withdraw at any time in Privacy settings.'] },
        { p: [{ b: 'In-browser demos.' }, ' Some pages let you make an Ixian address, sign a message or seal a message with post-quantum encryption. All of this runs in your browser; the keys, messages and results are not sent to us or anyone else.'] },
        { p: [{ b: 'Your browser’s storage.' }, ' The Website keeps two things in your browser’s local storage: your privacy choice, and your Quickstart settings (your operating system, the addresses you enter and a random API key), so a reload doesn’t lose them. Neither is sent to us. Details are in the Cookie Policy.'] },
        { p: [{ b: 'The ixiscope explorer.' }, ' ixiscope shows public data from the Ixian network: blocks, transactions, addresses and nodes. Your browser asks explorer.ixian.io for that data, so that server receives your IP address, browser details and what you looked up, like any web request, and may keep them in short-lived server logs for security. ixiscope sets no cookies, runs no analytics and makes no requests to third parties. It keeps three things in your browser’s local storage: your light or dark theme, your recent searches, and that you have seen its privacy notice. None of them is sent to us. Legal basis: legitimate interest (Art. 6(1)(f) GDPR).'] },
        { p: [{ b: 'Emails.' }, ' If you write to us, we use your email address and what you send to reply. Legal basis: our legitimate interest in answering you, or steps before a contract if you ask about working with us (Art. 6(1)(b) and (f) GDPR). We keep this correspondence for as long as needed to deal with it, and no longer than two years after the last message unless the law requires otherwise.'] },
      ],
    },
    {
      n: 4,
      heading: 'Who receives data',
      blocks: [
        { p: ['Only these providers, each for the purpose described above: GitHub (hosting the Website), Hetzner Online GmbH in Germany (hosting our server at resources.ixian.io) and, if you allow external content, Medium (images). We may also disclose data where the law requires it, for example to a court or authority.'] },
      ],
    },
    {
      n: 5,
      heading: 'Transfers outside the EEA',
      blocks: [
        { p: ['GitHub and Medium are based in the United States. Where they process personal data outside the European Economic Area, the transfer relies on the EU-US Data Privacy Framework where the provider is certified, or on the European Commission’s Standard Contractual Clauses.'] },
      ],
    },
    {
      n: 6,
      heading: 'How long data is kept',
      blocks: [
        { p: ['Hosting and server logs are kept only as long as the provider needs them for delivery and security. Emails are kept as described in section 3. What is stored in your browser stays there until you clear it; your privacy choice is asked again after twelve months.'] },
      ],
    },
    {
      n: 7,
      heading: 'Your rights',
      blocks: [
        { p: ['Under the GDPR you have the right to:'] },
        {
          ul: [
            [{ b: 'Access' }, ' the personal data we hold about you.'],
            [{ b: 'Rectification' }, ' of data that is inaccurate or incomplete.'],
            [{ b: 'Erasure' }, ' of your data in the cases the law provides.'],
            [{ b: 'Restriction' }, ' of processing in certain cases.'],
            [{ b: 'Object' }, ' to processing based on our legitimate interests.'],
            [{ b: 'Withdraw consent' }, ' at any time, without affecting processing that happened before. For external content, use Privacy settings in the footer.'],
            [{ b: 'Data portability' }, ' where processing is based on consent or a contract.'],
          ],
        },
        { p: ['To use any of these rights, write to ', { b: 'info@ixian.io' }, '. We answer within one month. You can also complain to a data protection authority; in Slovenia that is the ', { a: 'Information Commissioner of the Republic of Slovenia', href: 'https://www.ip-rs.si/en/' }, '.'] },
      ],
    },
    {
      n: 8,
      heading: 'Security',
      blocks: [
        { p: ['The Website is served over HTTPS only, collects no passwords and runs no user accounts. We take reasonable technical and organisational measures to protect the little data involved, but no system can be guaranteed to be completely secure.'] },
      ],
    },
    {
      n: 9,
      heading: 'Links to other sites',
      blocks: [
        { p: ['The Website links to other sites and services, such as GitHub, Discord, Telegram, X, LinkedIn, Medium, Reddit, the Ixian documentation, the ixiscope explorer and spixi.io. Their own privacy policies apply once you follow a link.'] },
      ],
    },
    {
      n: 10,
      heading: 'Children',
      blocks: [{ p: ['The Website is not directed at children under 16, and we do not knowingly collect their personal data.'] }],
    },
    {
      n: 11,
      heading: 'Changes to this policy',
      blocks: [{ p: ['If the way the Website handles data changes, we will update this policy and the date at the top. If a change needs your consent, we will ask for it.'] }],
    },
    {
      n: 12,
      heading: 'Contact',
      blocks: [
        { p: ['Questions about this policy or your data: ', { b: 'info@ixian.io' }, '.'] },
        { p: ['This policy is governed by the law of the Republic of Slovenia, and disputes are decided by the competent courts in Slovenia. This does not affect your right to complain to a data protection authority.'] },
      ],
    },
  ],
};

export default doc;
