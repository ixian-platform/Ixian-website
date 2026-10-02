import chain from './generated/chain.json';
/**
 * Network numbers shown on the site: ONE source of truth.
 *
 * - `live`  values are fetched in the browser; `fallback` is shown until the
 *   fetch resolves, or if it fails.
 * - Static values MUST carry `asOf` (shown next to the number) and `source`.
 * - Set `value: null` to hide a metric until an official figure exists.
 */
export type Metric = {
  id: string;
  label: string;
  value: number | null;
  /** Formatting: compact (102M), plain (186) or a literal suffix */
  format?: 'compact' | 'plain';
  prefix?: string;
  suffix?: string;
  asOf?: string;
  source?: string;
  live?: boolean;
  /** what counts as one, in a sentence you can defend; a metric without one is not shown where it needs it */
  definition?: string;
};

/* The public status file. `npm run preview` builds with NEXT_PUBLIC_NODE_STATUS_URL=/nodeStatus.txt
   and serves that path itself, so a shared preview link reads live data from any address. */
export const NODE_STATUS_URL = process.env.NEXT_PUBLIC_NODE_STATUS_URL || 'https://resources.ixian.io/nodeStatus.txt';

export const metrics = {
  dltNodes: {
    id: 'dltNodes',
    label: 'DLT nodes online',
    // no fallback: show "…" until nodeStatus.txt answers rather than a stale number
    value: null,
    format: 'plain',
    live: true,
    source: NODE_STATUS_URL,
  },
  onChainTx: {
    id: 'onChainTx',
    label: 'On-chain transactions',
    // fetched at build time (scripts/fetch-tx-total.mjs), rounded down to millions ("105M+")
    value: Math.floor(chain.onChainTx / 1_000_000) * 1_000_000,
    format: 'compact',
    suffix: '+',
    source: 'ixiscope (explorer.ixian.io) homepage, "On-chain Transactions", fetched at build time',
  },
  dataTransfers: {
    id: 'dataTransfers',
    label: 'Messages and files delivered',
    value: 500_000_000,
    format: 'compact',
    suffix: '+',
    asOf: '2026',
    source: 'Ixian network figures',
    definition: 'Messages and files delivered end to end over the Ixian network, as counted by the network.',
  },
  peakTps: {
    id: 'peakTps',
    label: 'Peak throughput',
    value: (chain as { peakTps?: number }).peakTps ?? 2347,
    format: 'plain',
    asOf: '2026',
    source: 'The explorer\u2019s record, read at build time',
    // the docs list 2,340 TPS as the DLT's soft limit
  },
  txFee: {
    id: 'txFee',
    label: 'Fee per transaction',
    value: null, // shown as text below; kept here for the source
    source: 'Ixian network figures',
  },
  spixiUsers: {
    id: 'spixiUsers',
    label: 'Spixi users',
    value: null, // hidden until an official number is confirmed
    format: 'compact',
    suffix: '+',
  },
  blockTime: {
    id: 'blockTime',
    label: 'Target block time',
    value: 30,
    format: 'plain',
    suffix: ' s',
    source: 'docs.ixian.io network parameters',
  },
  openSourceSince: {
    id: 'openSourceSince',
    label: 'Open source since',
    value: 2018,
    format: 'plain',
  },
} satisfies Record<string, Metric>;

export function formatMetric(m: Metric, v: number | null = m.value): string {
  if (v == null) return '…';
  const n =
    m.format === 'compact'
      ? new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 }).format(v)
      : m.id === 'openSourceSince'
        ? String(v)
        : new Intl.NumberFormat('en').format(v);
  return `${m.prefix ?? ''}${n}${m.suffix ?? ''}`;
}
