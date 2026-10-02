// Generates the 1200 x 630 Open Graph images.
// Run from the repo root:  node scripts/og/og.mjs
// Needs Playwright's Chromium (PLAYWRIGHT_BROWSERS_PATH or executablePath below).
// Writes public/og/<page>.jpg and public/og/blog/<slug>.jpg.
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const font = (f) => 'data:font/woff2;base64,' + fs.readFileSync(path.join(root, 'node_modules/geist/dist/fonts', f)).toString('base64');
const logoSrc = fs.readFileSync(path.join(root, 'src/site/components/Logo.tsx'), 'utf8');
const MARK_D = logoSrc.match(/MARK_D =\s*'([^']+)'/)[1];
const paths = [...logoSrc.matchAll(/<path (?:fillRule="evenodd" clipRule="evenodd" )?d="([^"]+)"/g)].map((m) => m[1]);
const [dot, ...word] = paths;
const logo = (h) => `<svg viewBox="0 0 101 32" height="${h}"><path d="${MARK_D}" fill="#5cc96d"/><path d="${dot}" fill="#5cc96d"/><g fill="#f3f7f4">${word.map((d) => `<path fill-rule="evenodd" d="${d}"/>`).join('')}</g></svg>`;
const LOGO = logo(30);

/* palettes: [rgb, x%, y%, size%, alpha] blobs, screen-blended on the base */
const T = {
  green: [['92,201,109', 88, 92, 62, 0.34], ['236,184,112', 64, 118, 58, 0.22], ['84,150,104', 104, 40, 44, 0.2]],
  route: [['157,185,255', 86, 96, 64, 0.34], ['92,201,109', 104, 30, 40, 0.16], ['120,110,190', 58, 120, 52, 0.18]],
  amber: [['236,184,112', 86, 100, 64, 0.34], ['214,156,86', 60, 118, 52, 0.22], ['206,140,120', 106, 34, 42, 0.16]],
  warm: [['236,184,112', 80, 108, 66, 0.3], ['206,140,120', 102, 60, 48, 0.2], ['150,96,110', 58, 122, 50, 0.18]],
  plum: [['206,140,120', 86, 100, 60, 0.28], ['150,96,110', 104, 44, 50, 0.24], ['236,184,112', 60, 120, 52, 0.18]],
  mixed: [['236,184,112', 90, 104, 58, 0.26], ['157,185,255', 104, 30, 46, 0.2], ['92,201,109', 62, 124, 48, 0.14]],
  home: [['92,201,109', 18, 10, 70, 0.26], ['157,185,255', 70, 100, 80, 0.34], ['60,120,140', 30, 80, 70, 0.26]],
  quiet: [['243,247,244', 90, 100, 60, 0.07], ['92,201,109', 104, 40, 40, 0.06]],
};

const PAGES = [
  // the homepage (and any link to the bare domain): the logo alone
  { file: 'home', logoOnly: true, tone: 'home' },
  { file: 'technology', eyebrow: 'Platform', title: 'Two open networks. One platform.', sub: 'Ixian DLT, Ixian S2 and post-quantum key exchange.', tone: 'route' },
  { file: 'build', eyebrow: 'Developers', title: 'Build on Ixian.', sub: 'Addresses, messaging and payments, with no backend of your own.', tone: 'amber' },
  { file: 'quickstart', eyebrow: 'Quickstart', title: 'Message your phone in two minutes.', sub: 'Run QuIXI, pair it with Spixi, send an encrypted message.', tone: 'amber' },
  { file: 'get-involved', eyebrow: 'Ecosystem', title: 'Use it. Build on it. Run it.', sub: 'Spixi, Mini Apps, QuIXI, ixiscope and the nodes that run it all.', tone: 'green' },
  { file: 'about-us', eyebrow: 'About', title: 'Open source since 2018.', sub: 'Maintained in the open by IXI Labs and contributors.', tone: 'warm' },
  { file: 'blog', eyebrow: 'Blog', title: 'From the Ixian blog.', sub: 'Case studies, updates and notes from the people building Ixian.', tone: 'plum' },
  { file: 'legal', eyebrow: 'Legal', title: 'Privacy, terms and cookies.', sub: 'No cookies, no tracking.', tone: 'quiet' },
];

// blog posts: read slugs and titles from the built content (a small, forgiving parse)
const blogSrc = fs.readFileSync(path.join(root, 'src/site/content/blog.ts'), 'utf8');
const medium = JSON.parse(fs.readFileSync(path.join(root, 'src/site/content/blog/medium.json'), 'utf8'));
const meta = [...blogSrc.matchAll(/'([0-9a-f]{12})': \{ slug: '([^']+)', kind: '([^']+)'(?:, title: '([^']+)')?/g)].map((m) => ({ id: m[1], slug: m[2], kind: m[3], title: m[4] }));
const posts = [{ slug: 'spixi-infrastructure-costs', kind: 'Case study', title: 'How Spixi minimized infrastructure costs with decentralized technology', date: '2025-02-13' }];
const dropped = new Set([...(blogSrc.match(/const DROPPED = new Set\(\[([^\]]*)\]/)?.[1] ?? '').matchAll(/'([0-9a-f]{12})'/g)].map((x) => x[1]));
for (const m of meta) {
  if (dropped.has(m.id)) continue;
  const post = medium.find((p) => (p.link || '').includes(m.id));
  if (post) posts.push({ slug: m.slug, kind: m.kind, title: m.title ?? post.title, date: post.date });
}
const year = (d) => new Date(d).getUTCFullYear();

const html = ({ eyebrow = '', title = '', sub, tone, logoOnly, cover }) => `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face { font-family: G; src: url(${font('geist-sans/Geist-SemiBold.woff2')}); font-weight: 600; }
@font-face { font-family: G; src: url(${font('geist-sans/Geist-Regular.woff2')}); font-weight: 400; }
@font-face { font-family: M; src: url(${font('geist-mono/GeistMono-Regular.woff2')}); }
* { margin: 0; box-sizing: border-box; }
html, body { width: 1200px; height: 630px; background: #050907; overflow: hidden; }
.glow { position: absolute; inset: 0; mix-blend-mode: screen; }
.grain { position: absolute; inset: 0; opacity: 0.24; mix-blend-mode: overlay; }
.rings { position: absolute; right: -70px; top: 30px; width: 620px; height: 620px; }
.cross { position: absolute; width: 13px; height: 13px; }
.cross::before, .cross::after { content: ''; position: absolute; background: rgba(243,247,244,0.28); }
.cross::before { left: 6px; top: 0; width: 1px; height: 13px; } .cross::after { top: 6px; left: 0; height: 1px; width: 13px; }
.frame { position: absolute; left: 36px; right: 36px; top: 36px; bottom: 36px; box-shadow: inset 0 0 0 1px rgba(243,247,244,0.07); }
.content { position: absolute; left: 76px; right: 76px; top: 72px; bottom: 70px; display: flex; flex-direction: column; align-items: flex-start; }
.eyebrow { margin-top: auto; font: 15px/1 M; letter-spacing: 0.16em; text-transform: uppercase; color: rgba(243,247,244,0.55); }
h1 { margin-top: 22px; max-width: 900px; font: 600 ${title.length > 48 ? 56 : 72}px/1.03 G; letter-spacing: -0.035em; color: #f3f7f4; text-wrap: balance; }
.cover { position: absolute; inset: 0; background-size: cover; background-position: center; }
.scrim { position: absolute; inset: 0; background: linear-gradient(90deg, rgba(5,9,7,0.92) 0%, rgba(5,9,7,0.78) 42%, rgba(5,9,7,0.2) 78%, rgba(5,9,7,0.05) 100%), linear-gradient(0deg, rgba(5,9,7,0.7) 0%, transparent 55%); }
p { margin-top: 22px; max-width: 780px; font: 400 25px/1.4 G; color: rgba(243,247,244,0.62); }
</style></head><body>
${cover ? `<div class="cover" style="background-image:url(${cover})"></div><div class="scrim"></div>` : ''}
<div class="glow" style="${cover ? 'display:none;' : ''}background:${T[tone].map(([c, x, y, s, a]) => `radial-gradient(${s}% ${s * 1.3}% at ${x}% ${y}%, rgba(${c},${Math.min(1, a * 1.45)}), rgba(${c},${a * 0.5}) 45%, transparent 72%)`).join(',')}"></div>
${logoOnly || cover ? '' : `<svg class="rings" viewBox="3 1 26 30" fill="none"><circle cx="14.2" cy="20" r="8.7" stroke="rgba(243,247,244,0.09)" stroke-width="0.06"/><circle cx="17.9" cy="12" r="8.7" stroke="rgba(243,247,244,0.09)" stroke-width="0.06"/><circle cx="14.2" cy="20" r="10" stroke="rgba(243,247,244,0.05)" stroke-width="0.04"/><circle cx="17.9" cy="12" r="10" stroke="rgba(243,247,244,0.05)" stroke-width="0.04"/></svg>`}
<svg class="grain" width="1200" height="630"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/></filter><rect width="100%" height="100%" filter="url(#n)"/></svg>
<div class="frame"></div>
<i class="cross" style="left:30px;top:30px"></i><i class="cross" style="right:30px;top:30px"></i><i class="cross" style="left:30px;bottom:30px"></i><i class="cross" style="right:30px;bottom:30px"></i>
${logoOnly ? `<div style="position:absolute;inset:0;display:grid;place-items:center">${logo(150)}</div>` : `<div class="content">${LOGO}<span class="eyebrow">${eyebrow}</span><h1>${title}</h1>${sub ? `<p>${sub}</p>` : ''}</div>`}
</body></html>`;

const b = await chromium.launch(process.env.CHROMIUM ? { executablePath: process.env.CHROMIUM } : {});
const pg = await b.newPage({ viewport: { width: 1200, height: 630 } });
const shoot = async (spec, out) => {
  await pg.setContent(html(spec));
  await pg.evaluate(() => document.fonts.ready);
  await pg.screenshot({ path: out, type: 'jpeg', quality: 88 });
};
for (const p of PAGES) await shoot(p, path.join(root, 'public/og', `${p.file}.jpg`));
// posts with a banner (public/site/blog/covers/<slug>.jpg) put it behind the title
const coverOf = (slug) => {
  const f = path.join(root, 'public/site/blog/covers', `${slug}.jpg`);
  return fs.existsSync(f) ? 'data:image/jpeg;base64,' + fs.readFileSync(f).toString('base64') : undefined;
};
for (const p of posts) await shoot({ eyebrow: `Blog · ${p.kind} · ${year(p.date)}`, title: p.title, sub: '', tone: p.kind === 'Case study' ? 'mixed' : 'plum', cover: coverOf(p.slug) }, path.join(root, 'public/og/blog', `${p.slug}.jpg`));
await b.close();
console.log(`wrote ${PAGES.length} page images and ${posts.length} post images`);
