import { notFound } from '../content/notFound';

/** edit distance, for "Did you mean" */
function distance(a: string, b: string) {
  const d = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    let prev = d[0];
    d[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const tmp = d[j];
      d[j] = Math.min(d[j] + 1, d[j - 1] + 1, prev + (a[i - 1] === b[j - 1] ? 0 : 1));
      prev = tmp;
    }
  }
  return d[b.length];
}

/** the closest real page to a mistyped path, or null when nothing is close */
export function closest(path: string): { href: string; label: string } | null {
  const slug = path.toLowerCase().replace(/\/+$/, '').split('/').filter(Boolean)[0] ?? '';
  if (!slug) return null;
  let best: { href: string; label: string; d: number } | null = null;
  for (const r of notFound.routes) {
    for (const name of r.names) {
      const dd = distance(slug, name);
      if (!best || dd < best.d) best = { href: r.href, label: r.label, d: dd };
    }
  }
  return best && best.d <= Math.max(2, Math.floor(slug.length / 3)) ? { href: best.href, label: best.label } : null;
}
