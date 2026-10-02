/** Cookie Policy. Keep the storage table in sync with src/site/components/Consent.tsx and the Quickstart. */
import type { LegalDoc } from './types';
import { links } from '../links';

const doc: LegalDoc = {
  title: 'Cookie Policy',
  updated: 'Last updated: 1 October 2026',
  sections: [
    {
      n: 1,
      heading: 'In short',
      blocks: [
        { p: ['The Website sets no cookies and uses no analytics, advertising or tracking. It stores two small things in your browser, both for features you use, and it loads images from Medium only if you allow it.'] },
        { p: ['The same holds for the ixiscope block explorer at explorer.ixian.io: no cookies, no tracking and no third-party requests. What it keeps in your browser is listed below; the rest is in our ', { a: 'Privacy Policy', href: links.privacy }, '.'] },
      ],
    },
    {
      n: 2,
      heading: 'What is stored in your browser',
      blocks: [
        { p: ['These entries live in your browser’s local storage. They are never sent to us or to anyone else.'] },
        {
          ul: [
            [{ b: 'ix-consent' }, ': your choice about external content, with the date you made it. Strictly necessary to remember that choice. Kept for twelve months, then you are asked again.'],
            [{ b: 'ix-qs-…' }, ': your Quickstart settings: your operating system, the addresses you enter, and a random API key made for the commands, so a reload doesn’t lose them. The key is saved when you open the Quickstart; the rest when you change it. Kept until you clear it.'],
          ],
        },
        { p: ['On ixiscope (explorer.ixian.io):'] },
        {
          ul: [
            [{ b: 'ixs-theme' }, ': your light or dark theme, if you chose one. Kept until you clear it.'],
            [{ b: 'ixiscope.recent' }, ': your last few searches, so you can open them again. Clear them in Privacy settings in ixiscope’s footer.'],
            [{ b: 'ixs-notice' }, ': that you have seen the privacy notice, with the date. Kept for twelve months, then the notice shows again.'],
          ],
        },
      ],
    },
    {
      n: 3,
      heading: 'External content',
      blocks: [
        { p: ['Some blog posts were first published on Medium. Until their images are hosted on the Website, they can be loaded from Medium’s servers (cdn-images-1.medium.com). Loading them sends your IP address and browser details to Medium, which is why we ask first. If you don’t allow external content, those images stay hidden and you can load them one post at a time.'] },
        { p: ['Medium’s own privacy and cookie policies apply to those requests.'] },
      ],
    },
    {
      n: 4,
      heading: 'Your choices',
      blocks: [
        { p: ['Open ', { b: 'Privacy settings' }, ' in the footer of any page to allow or block external content at any time. Blocking takes effect straight away.'] },
        { p: ['You can also clear the Website’s storage in your browser settings. The Website will still work; it will ask for your choice again and forget your Quickstart progress.'] },
      ],
    },
    {
      n: 5,
      heading: 'Other requests your browser makes',
      blocks: [
        { p: ['Every page fetches a small status file from resources.ixian.io, and the Website itself is delivered by GitHub Pages. Neither sets cookies. How that data is handled is described in our ', { a: 'Privacy Policy', href: links.privacy }, '.'] },
      ],
    },
    {
      n: 6,
      heading: 'Changes',
      blocks: [{ p: ['If we ever add a cookie or a tool that needs your consent, we will update this policy first and ask you before it runs.'] }],
    },
    {
      n: 7,
      heading: 'Contact',
      blocks: [{ p: ['Questions: ', { b: 'info@ixian.io' }, '.'] }],
    },
  ],
};

export default doc;
