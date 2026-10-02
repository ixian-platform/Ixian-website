// A shareable preview of the static site: `npm run preview`
// Builds the site (unless --no-build), then serves out/ on http://localhost:3000
// (PORT to change it). The live readings come through this server
// (/nodeStatus.txt), so they work from any address, including a tunnel link.
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';

const PORT = Number(process.env.PORT) || 3000;
const OUT = path.resolve('out');
const UPSTREAM = process.env.NODE_STATUS_UPSTREAM || 'https://resources.ixian.io/nodeStatus.txt';

if (!process.argv.includes('--no-build')) {
  const r = spawnSync('npm', ['run', 'build'], {
    stdio: 'inherit',
    shell: true,
    env: { ...process.env, NEXT_PUBLIC_NODE_STATUS_URL: '/nodeStatus.txt' },
  });
  if (r.status !== 0) process.exit(r.status ?? 1);
}

const TYPES = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json',
  '.txt': 'text/plain; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.avif': 'image/avif', '.gif': 'image/gif', '.ico': 'image/x-icon',
  '.woff2': 'font/woff2', '.woff': 'font/woff', '.mp4': 'video/mp4', '.webm': 'video/webm', '.xml': 'application/xml',
  '.webmanifest': 'application/manifest+json', '.wasm': 'application/wasm',
};

let status = { at: 0, body: null };
async function nodeStatus() {
  if (status.body && Date.now() - status.at < 5000) return status.body;
  const r = await fetch(UPSTREAM, { cache: 'no-store' });
  if (!r.ok) throw new Error(String(r.status));
  status = { at: Date.now(), body: await r.text() };
  return status.body;
}

function file(urlPath) {
  const clean = decodeURIComponent(urlPath.split('?')[0]);
  const p = path.normalize(path.join(OUT, clean));
  if (!p.startsWith(OUT)) return null;
  for (const c of [p, `${p}.html`, path.join(p, 'index.html')]) {
    try {
      if (fs.statSync(c).isFile()) return c;
    } catch {
      /* next candidate */
    }
  }
  return null;
}

http
  .createServer(async (req, res) => {
    if (req.url.startsWith('/nodeStatus.txt')) {
      try {
        const body = await nodeStatus();
        res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store' });
        res.end(body);
      } catch {
        res.writeHead(502).end();
      }
      return;
    }
    const f = file(req.url);
    const target = f ?? path.join(OUT, '404.html');
    res.writeHead(f ? 200 : 404, { 'Content-Type': TYPES[path.extname(target)] ?? 'application/octet-stream' });
    fs.createReadStream(target).pipe(res);
  })
  .listen(PORT, () => console.log(`\n  Preview: http://localhost:${PORT}\n  Share it: cloudflared tunnel --url http://localhost:${PORT}\n`));
