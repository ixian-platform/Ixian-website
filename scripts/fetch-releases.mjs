// Fetches the latest DLT and S2 release tags at build time (no third-party request from
// visitors, no per-visitor rate limit). On failure the last value is kept.
import fs from 'node:fs';
const warn = (msg) => console.warn((process.env.GITHUB_ACTIONS ? '::warning::' : '') + msg);
const OUT = new URL('../src/site/content/generated/releases.json', import.meta.url);
const REPOS = { dlt: 'Ixian-DLT', s2: 'Ixian-S2' };
let prev = {};
try { prev = JSON.parse(fs.readFileSync(OUT, 'utf8')); } catch {}
const out = { ...prev };
const headers = { accept: 'application/vnd.github+json', 'user-agent': 'ixian.io build' };
if (process.env.GITHUB_TOKEN) headers.authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
for (const [id, repo] of Object.entries(REPOS)) {
  try {
    const ctl = new AbortController();
    const t = setTimeout(() => ctl.abort(), 15000);
    const res = await fetch(`https://api.github.com/repos/ixian-platform/${repo}/releases/latest`, { headers, signal: ctl.signal });
    clearTimeout(t);
    if (!res.ok) throw new Error('GitHub answered ' + res.status);
    const d = await res.json();
    if (!d.tag_name) throw new Error('no tag');
    out[id] = { tag: d.tag_name, url: d.html_url, date: (d.published_at || '').slice(0, 10) };
    console.log(`${repo}: ${d.tag_name}`);
  } catch (e) {
    warn(`fetch-releases: kept the last ${repo} value (${e.message})`);
  }
}
fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
