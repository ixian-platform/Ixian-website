// Fetches the on-chain transaction total at build time: the explorer has no CORS headers
// or JSON endpoint, so the browser can't read it live. On failure the last value is kept.
import fs from 'node:fs';
// in GitHub Actions a warning shows on the run, so a kept value is never silent
const warn = (msg) => console.warn((process.env.GITHUB_ACTIONS ? '::warning::' : '') + msg);
const OUT = new URL('../src/site/content/generated/chain.json', import.meta.url);
try {
  const ctl = new AbortController();
  const t = setTimeout(() => ctl.abort(), 15000);
  const res = await fetch('https://explorer.ixian.io/', { signal: ctl.signal });
  if (!res.ok) throw new Error('explorer answered ' + res.status);
  const html = await res.text();
  clearTimeout(t);
  const m = html.match(/>\s*([\d,]{6,})\s*<\/p>\s*<p[^>]*>\s*On-chain Transactions/i);
  if (!m) throw new Error('total not found in the page');
  const onChainTx = Number(m[1].replace(/,/g, ''));
  // peak TPS, when the explorer's homepage shows one; otherwise keep the last value
  const last = (() => { try { return JSON.parse(fs.readFileSync(OUT, 'utf8')); } catch { return {}; } })();
  const pm = html.match(/>\s*([\d,]{3,}(?:\.\d+)?)\s*<\/p>\s*<p[^>]*>\s*(?:Peak|Record|Max(?:imum)?)[^<]{0,20}TPS/i);
  const peakTps = pm ? Math.floor(Number(pm[1].replace(/,/g, ''))) : last.peakTps;
  fs.writeFileSync(OUT, JSON.stringify({ onChainTx, peakTps, at: new Date().toISOString() }, null, 2) + '\n');
  console.log('on-chain transactions:', onChainTx, pm ? '· peak TPS: ' + peakTps : '· peak TPS kept');
  if (!pm) warn('fetch-tx-total: the explorer shows no peak TPS; kept ' + peakTps);
} catch (e) {
  warn('fetch-tx-total: kept the last value (' + e.message + ')');
}
