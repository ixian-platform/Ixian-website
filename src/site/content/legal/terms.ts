import type { LegalDoc } from './types';
import { links } from '../links';

const doc: LegalDoc = {
  title: 'Terms of Use',
  updated: 'Last updated: 1 October 2026',
  sections: [
    {
      n: 1,
      heading: 'About these terms',
      blocks: [
        { p: ['These terms apply to www.ixian.io (the "Website"), operated by IXI Labs d.o.o. ("IXI Labs", "we", "us"). By using the Website you agree to them. If you don’t agree, please don’t use the Website.'] },
        { p: ['Contact: IXI Labs d.o.o., Zaloška cesta 160C, 1260 Ljubljana-Polje, Slovenia, ', { b: 'info@ixian.io' }, '.'] },
        { p: ['How we handle personal data is described in our ', { a: 'Privacy Policy', href: links.privacy }, ' and ', { a: 'Cookie Policy', href: links.cookies }, '.'] },
      ],
    },
    {
      n: 2,
      heading: 'Using the Website',
      blocks: [
        { p: ['You may use the Website for any lawful purpose. Please don’t:'] },
        {
          ul: [
            ['use it for anything unlawful, harmful or fraudulent;'],
            ['disrupt it, try to gain unauthorised access, or put an unreasonable load on it (for example with aggressive automated scraping);'],
            ['present the Website’s content as your own, or use it to impersonate IXI Labs or Ixian.'],
          ],
        },
        { p: ['We may restrict access for anyone who breaks these terms or puts the Website or its visitors at risk.'] },
      ],
    },
    {
      n: 3,
      heading: 'Information, live data and demos',
      blocks: [
        { p: ['The Website explains the Ixian technology and shows live readings from the Ixian network, such as node counts and the latest block. This information is provided for general information only. Live readings can be delayed, incomplete or unavailable.'] },
        { p: ['Some pages let you make an Ixian address, sign or encrypt a message in your browser. These are demonstrations. Keys made in them are not stored by us and cannot be recovered; don’t use them to hold IXI or anything of value.'] },
        { p: ['Nothing on the Website is financial, investment, legal or tax advice, or an offer to buy or sell IXI or any other asset.'] },
      ],
    },
    {
      n: 4,
      heading: 'Software, code samples and open-source licences',
      blocks: [
        { p: ['Ixian’s software, including Ixian-Core, the DLT and S2 nodes, QuIXI, the SDKs, the Mini Apps SDK and Spixi, is open source under the MIT licence. The licence text is in each repository on ', { a: 'GitHub', href: links.github.org }, ' and takes precedence over these terms for that software. Community Mini Apps and other third-party projects carry their authors’ own licences.'] },
        { p: ['Software and samples are provided as they are. Test with the sandbox before using real funds, and run nodes at your own risk.'] },
      ],
    },
    {
      n: 5,
      heading: 'Content and trademarks',
      blocks: [
        { p: ['The Website’s text, design and graphics belong to IXI Labs or its licensors and are not covered by the MIT licence. You may quote and share them with a link back to the source.'] },
        { p: ['Ixian, Ixian DLT, Ixian S2 and Spixi are registered trademarks. Their names and logos are not covered by the MIT licence either; please don’t use them in a way that suggests we endorse you without our written permission.'] },
        { p: ['Blog posts carry their original publication date. Older posts describe the project as it was then.'] },
      ],
    },
    {
      n: 6,
      heading: 'Other websites',
      blocks: [{ p: ['The Website links to sites and services we don’t run, such as GitHub, Discord, Telegram, X, LinkedIn, Medium and Reddit. We are not responsible for their content or practices, and their own terms apply.'] }],
    },
    {
      n: 7,
      heading: 'Liability',
      blocks: [
        { p: ['We work to keep the Website accurate and available but make no promise that it always will be. To the extent the law allows, we are not liable for losses arising from use of the Website, its information, demos or code samples, or from being unable to use it.'] },
        { p: ['Nothing in these terms limits liability that cannot be limited by law, such as for intent or gross negligence, or affects the mandatory rights you have as a consumer.'] },
      ],
    },
    {
      n: 8,
      heading: 'Governing law',
      blocks: [{ p: ['These terms are governed by the law of the Republic of Slovenia. Disputes are decided by the competent courts in Slovenia. If you are a consumer, you also keep the protection of the mandatory law of the country where you live. We would always rather settle a disagreement by talking first.'] }],
    },
    {
      n: 9,
      heading: 'Changes',
      blocks: [{ p: ['We may update these terms. The date at the top shows the latest version, and changes apply from that date.'] }],
    },
    {
      n: 10,
      heading: 'Contact',
      blocks: [{ p: ['Questions about these terms: ', { b: 'info@ixian.io' }, '.'] }],
    },
  ],
};

export default doc;
