// Copy for /technology. Technical statements follow docs.ixian.io and link to it.
import { links } from './links';
import { metrics, formatMetric } from './metrics';
import { hero as devHero } from './developers';

const devCode = devHero.code;

const d = links.docs;

export const meta = {
  title: 'Ixian Platform | DLT, S2 and post-quantum security',
  description: 'How Ixian works: a shared record (Ixian DLT) and a relay network (Ixian S2), run by independent operators, with hybrid post-quantum key exchange.',
};

export const hero = {
  title: ['Two open networks.', 'One platform.'] as [string, string],
  lead: 'Ixian S2 finds any address and relays its encrypted traffic. Ixian DLT keeps the shared record and settles payments. Independent operators run both, and all of it is open source.',
  actions: [
    { label: 'Read the architecture', href: d.architecture, kind: 'primary' as const },
    { label: 'Whitepaper (draft)', href: links.whitepaper, kind: 'secondary' as const },
  ],
  index: [
    { id: 'dlt', label: 'Ixian DLT' },
    { id: 's2', label: 'Ixian S2' },
    { id: 'security', label: 'Security' },
    { id: 'identity', label: 'Identity' },
    { id: 'ixi', label: 'IXI' },
    { id: 'build', label: 'Build' },
    { id: 'roadmap', label: 'Roadmap' },
  ],
  story: {
    // one view per scroll stage, one line each
    steps: ['One platform', 'Anything connects', 'Messages and money'],
    lines: [
      'Ixian DLT at the centre, Ixian S2 around it: two open networks, run as one platform.',
      'Three layers, one address. The DLT keeps the record, S2 carries the traffic, and every app, device or agent sits on a plane above, reaching both.',
      'A message crosses S2 from one endpoint to another (blue). A payment does too, and its transaction goes on to the DLT, where it settles (green, dashed).',
    ],
    viewLabel: 'View',
    legendLabel: 'On screen',
    callouts: {
      apps: ['Your app, device or agent', 'One address on both networks'] as [string, string],
      s2: ['Ixian S2', 'relay nodes online'] as [string, string],
      dlt: ['Ixian DLT', 'nodes online'] as [string, string],
    },
    legend: {
      s2: { name: 'Ixian S2', role: 'Relay nodes', unit: 'online' },
      dlt: { name: 'Ixian DLT', role: 'Nodes that keep the record', unit: 'online' },
      apps: { name: 'Endpoints', role: 'Apps, devices and agents. The dotted line is an endpoint’s connection to S2.' },
      block: 'block',
    },
    above: 'Any endpoint reaches any other through S2, and every payment settles on the DLT.',
    note: 'Node counts and blocks are live.',
  },
  still: {
    s2: { name: 'Ixian S2', role: 'Relay network' },
    dlt: { name: 'Ixian DLT', role: 'Shared record' },
    apps: { name: 'Your app, device or agent', role: 'One address on both' },
    note: 'The live counts are below.',
  },
  metrics: {
    note: { live: 'Node counts and the block are live.', reading: 'Reading the network…' },
    blockTime: { label: 'Target block time', value: '30 s', unit: 'Network parameters', href: d.parameters },
    tps: { label: 'DLT throughput', value: '2,340 TPS', unit: 'Soft limit', href: d.parameters },
  },
};

export const dlt = {
  title: 'Ixian DLT keeps the shared record.',
  lead: 'DLT nodes hold every balance, every transaction and the name registry. They agree on a new block about every 30 seconds, using a consensus called Ixiac (Proof of Collaborative Work).',
  railTitle: 'The latest blocks, live',
  rail: {
    frozen: 'Final',
    signing: 'Signing',
    next: 'Next',
    note: 'Block numbers are live. A block is final once it is five deep and its signer set is frozen.',
    reading: 'Reading the latest block…',
  },
  steps: [
    { title: 'Earn the right to sign', body: 'A node becomes eligible to sign by solving a SHA3-512 proof of work. A solution stays valid for 30 blocks, about 15 minutes.' },
    { title: 'Sign together', body: 'Many eligible nodes validate and sign each block. A block is accepted once it gathers at least 75% of the recent average number of signatures.' },
    { title: 'Freeze', body: 'When a block is five deep, about 2.5 minutes, its set of signers is frozen into the header of the block five later.' },
    { title: 'Share the reward', body: 'Signers share the block reward and the fees in proportion to their proof of work. Rewards can be spent after 960 blocks, about 8 hours.' },
  ],
  specs: [
    { k: 'Consensus', v: 'Ixiac, Proof of Collaborative Work' },
    { k: 'Block time', v: '30 s target' },
    { k: 'Finality', v: '5 blocks, about 2.5 min' },
    { k: 'Transactions per block', v: 'Up to 307,020' },
    { k: 'Throughput', v: '2,340 TPS, soft limit' },
    { k: 'Stake to run a node', v: 'None (0 IXI)' },
  ],
  links: [
    { label: 'Ixiac consensus', href: d.consensus },
    { label: 'System architecture', href: d.systemArchitecture },
    { label: 'Network parameters', href: d.parameters },
  ],
};

export const s2 = {
  title: 'Ixian S2 finds any address.',
  lead: 'S2 relay nodes keep track of who is online and help endpoints find each other. When two endpoints can’t connect directly, a relay carries their messages, files and streams, encrypted end to end.',
  diagramLabel: 'How one endpoint finds another (Starling)',
  steps: [
    {
      id: 'hash',
      title: 'Hash the address',
      body: 'The address is hashed with SHA3-512. The first 10 bytes name its sector, one of 2⁸⁰, so a lookup never needs a central index.',
    },
    {
      id: 'ask',
      title: 'Ask the sector’s relays',
      body: 'Each relay serves a few sector prefixes, so the question goes straight to the relays that track that sector.',
    },
    {
      id: 'verify',
      title: 'Verify the presence',
      body: 'The relays answer with the endpoint’s signed presence. The caller checks the signature and that it is fresh: a presence expires after 300 seconds.',
    },
    {
      id: 'connect',
      title: 'Connect',
      body: 'The two endpoints connect directly and encrypt end to end. If a firewall is in the way, a relay carries the traffic instead.',
    },
  ],
  lookup: {
    label: 'Find an address: paste any Ixian address',
    placeholder: 'An Ixian address, in Base58',
    example: { label: 'Example address', value: '1EXSqPpj49ZmKiWF8stsMsMXVnSfkee7EzTaBakwNn9sJdaWm', note: 'Its sector is computed in your browser.' },
    random: { label: 'Random address', note: 'Random bytes shaped like a v2 address. It belongs to nobody.' },
    invalid: 'That is not Base58. Ixian addresses use 1 to 9, A to Z and a to z, without 0, O, I and l.',
    digestLabel: 'SHA3-512 of the address, computed in your browser',
    sectorLabel: 'Sector',
    computed: 'Computed in your browser: SHA3-512 of the address bytes without the checksum.',
  },
  labels: { caller: 'Caller', callee: 'Endpoint', sector: 'Sector', relay: 'Relays for this sector', presence: 'Signed presence', direct: 'Direct', via: 'Via a relay' },
  note: 'The hash and the sector are real.',
  facts: [
    { k: 'Replaces', v: 'DNS, certificate authorities and central directories' },
    { k: 'Sectors', v: '2⁸⁰, found in one step' },
    { k: 'Presence expiry', v: '300 s without a refresh' },
    { k: 'Default port', v: 'TCP 10235' },
  ],
  links: [
    { label: 'Trustless client discovery', href: d.starling },
    { label: 'Network topology', href: d.networkTopology },
    { label: 'S2 operator guide', href: d.operatorsS2 },
  ],
};

export const security = {
  title: 'Post-quantum key exchange, in production.',
  lead: 'Every new contact starts with a hybrid key exchange that combines RSA-4096, ECDH and the post-quantum ML-KEM-1024, so an attacker has to break all three. Each message is then sealed twice, with two independent ciphers.',
  exchange: {
    title: 'Key exchange',
    keys: [
      { name: 'RSA-4096', note: 'Classical' },
      { name: 'ECDH secp521r1', note: 'Classical' },
      { name: 'ML-KEM-1024', note: 'Post-quantum, FIPS 203' },
    ],
    derive: 'HKDF-SHA3',
    secret: 'Shared secret',
  },
  layers: [
    { name: 'ChaCha20-Poly1305', note: 'Outer layer' },
    { name: 'AES-256-GCM', note: 'Inner layer' },
    { name: 'Your message', note: '' },
  ],
  specs: [
    { k: 'Key exchange', v: 'RSA-4096 + ECDH secp521r1 + ML-KEM-1024' },
    { k: 'Encryption', v: 'AES-256-GCM inside ChaCha20-Poly1305' },
    { k: 'Key derivation', v: 'HKDF-SHA3' },
    { k: 'Hashing', v: 'SHA-3 (SHA-512 for legacy parts)' },
    { k: 'Signatures', v: 'RSA-4096' },
  ],
  note: 'The post-quantum part is the key exchange. Signatures are RSA-4096 today; FN-DSA (Falcon, FIPS 206) is on the roadmap backlog.',
  links: [
    { label: 'Cryptographic primitives', href: d.crypto },
    { label: 'Post-quantum security guide', href: d.howto.pq },
  ],
};

export const identity = {
  title: 'Your address is your identity.',
  lead: 'An Ixian address comes from a public key. Whoever holds the key can prove the address is theirs, and anyone can check it without asking a third party. The same address is how people, devices and AI agents are found, reached and paid.',
  anatomy: {
    title: 'A v2 address',
    parts: [
      { name: 'Version', size: '1 byte', v: '0x02' },
      { name: 'Payload', size: '44 bytes', v: 'A double SHA3-512 hash of the RSA-4096 public key, truncated' },
      { name: 'Checksum', size: '3 bytes', v: 'Catches typing mistakes' },
    ],
    encoding: 'Written in Base58',
  },
  names: {
    title: 'IXI Names',
    status: 'Available',
    body: 'Readable names for addresses, registered on the DLT. Ownership is time-limited and renewable, names can have one level of subnames, and records can point to wallets and endpoints.',
    fee: 'Registration is priced by months and capacity. The fees go into a reward pool that is paid out to block signers over time.',
    link: { label: 'IXI Names architecture', href: d.names },
  },
  links: [
    { label: 'Addresses', href: d.addresses },
    { label: 'Cryptographic primitives', href: d.crypto },
  ],
};

export const ixi = {
  title: 'IXI pays the people who run the network.',
  lead: 'IXI is the platform’s native currency. Fees and new IXI from each block go to the operators of the nodes, so the network pays for its own upkeep.',
  flow: {
    sources: [
      { id: 'block', name: 'Each new block', note: 'New IXI' },
      { id: 'tx', name: 'Transaction fees', note: 'Paid in IXI' },
      { id: 'names', name: 'IXI Names fees', note: 'Via a reward pool' },
    ],
    sinks: [
      { id: 'dlt', name: 'DLT signers', note: 'Split by proof of work' },
      { id: 's2', name: 'S2 relays', note: 'A relay fee per transaction they relay' },
    ],
    note: 'Signers share new IXI and DLT fees. Relays earn a separate relay fee.',
  },
  metrics: [
    { label: 'Transaction price', value: '0.005 IXI', unit: 'per kB, network parameters', href: d.parameters },
    { label: 'Reward maturity', value: '960 blocks', unit: 'about 8 hours, economics', href: d.economics },
    { label: 'Stake to run a DLT node', value: '0 IXI', unit: 'network parameters', href: d.parameters },
  ],
  note: '',
  links: [
    { label: 'Economics', href: d.economics },
    { label: 'IXI emission', href: d.emission },
    { label: 'Emissions on ixiscope', href: links.emissions },
  ],
};

export type RoadmapItem = { title: string; parts: string[]; when?: string; body: string };

export const roadmap = {
  title: 'Roadmap.',
  lead: 'What has shipped and what comes next. Completed items carry their quarter; research and backlog items have no dates yet.',
  columns: [
    {
      id: 'done',
      label: 'Completed',
      items: [
        { title: 'Direct P2P transaction delivery', parts: ['DLT', 'S2', 'Clients'], when: 'Q1 2026', body: 'Sender and recipient negotiate directly before a transaction goes to the DLT.' },
        { title: 'Tagged transaction routing', parts: ['S2'], when: 'Q1 2026', body: 'Clients can subscribe to transactions by tag, and relays pass on only those.' },
        { title: 'Argon2 mining deprecated', parts: ['DLT'], when: 'Q2 2026', body: 'Argon2 mining rewards are phased out. Only block signers earn proof-of-work rewards now.' },
      ] as RoadmapItem[],
    },
    {
      id: 'research',
      label: 'Researching',
      items: [
        { title: 'Merkle / Merklix state commitment', parts: ['DLT'], body: 'Tree structures for cryptographic state commitments and proofs.' },
        { title: 'Decentralized mining pools', parts: ['DLT', 'S2'], body: 'DLT and S2 nodes act as small mining pools that share rewards in proportion to work.' },
        { title: 'UTXO model transition', parts: ['DLT'], body: 'A move to UTXO for better parallel processing.' },
        { title: 'Transaction script language', parts: ['DLT'], body: 'Basic scripting for conditional spending.' },
        { title: 'Temporary offline message storage', parts: ['S2'], body: 'Time-limited queues on relays for clients that are offline.' },
      ] as RoadmapItem[],
    },
    {
      id: 'backlog',
      label: 'Backlog',
      items: [
        { title: 'FN-DSA / Falcon signatures', parts: ['DLT'], body: 'Post-quantum signatures as an alternative to RSA.' },
        { title: 'QUIC transport layer', parts: ['DLT'], body: 'QUIC as an alternative transport.' },
        { title: 'Dynamic fee market', parts: ['DLT'], body: 'Fees that adapt to congestion.' },
        { title: 'Protocol stabilization v1.0', parts: ['DLT'], body: 'Frozen core structures and versioning.' },
        { title: 'RPC API v2', parts: ['DLT'], body: 'A redesign with cleaner REST semantics.' },
        { title: 'Hello protocol v7', parts: ['DLT'], body: 'A node handshake with stronger authentication.' },
        { title: 'Master and History node separation', parts: ['DLT'], body: 'A clear split between the two node roles.' },
        { title: 'Distributed DLT node', parts: ['DLT'], body: 'A DLT node that runs as a cluster of services.' },
        { title: 'Local discovery and mesh networking', parts: ['Clients'], body: 'mDNS or Bonjour discovery and peers that relay for each other.' },
        { title: 'Bluetooth, BLE and Wi-Fi Direct', parts: ['Clients'], body: 'More transports for clients.' },
        { title: 'TCP and HTTP proxy bridges', parts: ['QuIXI'], body: 'Connect legacy TCP apps, browsers and web servers.' },
      ] as RoadmapItem[],
    },
  ],
  history: { label: 'The history since 2016', href: links.about + '#history' },
  links: [{ label: 'Full roadmap', href: d.roadmap }],
};

export const next = {
  title: 'Where next',
  items: [
    { label: 'Developers', href: links.developers, body: 'Quickstarts, guides and the APIs to build your first app, device or agent.' },
    { label: 'Run a node', href: links.runNode, body: 'Operate a DLT or S2 node, and earn IXI for the work.' },
    { label: 'Architecture docs', href: d.architecture, body: 'The full technical detail: data structures, protocols and parameters.' },
  ],
};

export const chapters = [
  { id: 'top', label: 'Platform' },
  { id: 'dlt', label: 'DLT' },
  { id: 's2', label: 'S2' },
  { id: 'security', label: 'Security' },
  { id: 'identity', label: 'Identity' },
  { id: 'ixi', label: 'IXI' },
  { id: 'build', label: 'Build' },
  { id: 'roadmap', label: 'Roadmap' },
];

// Statements below restate ones above (or in metrics.ts and developers.ts); keep them in sync.

export const numbers = {
  label: 'The network, in two numbers',
  big: [
    { id: 'tx', value: formatMetric(metrics.onChainTx), unit: '', label: 'transactions on the DLT' },
    { id: 'tps', value: formatMetric(metrics.peakTps), unit: 'TPS', label: 'peak throughput recorded' },
  ],
  note: '',
};

export const dltStrip = {
  steps: [dlt.steps[0], dlt.steps[3]],
  label: 'The latest blocks, live',
  groups: { final: 'Final', signing: 'Signing', next: 'Next' },
  legend: {
    signing: 'Signing: many eligible nodes validate and sign each block. It is accepted once it gathers at least 75% of the recent average number of signatures.',
    final: 'Final: five deep, about 2.5 minutes, with its signer set frozen into the header of the block five later.',
    next: 'Next: the block the network is working on now.',
  },
  detail: {
    height: 'Height',
    status: 'Status',
    depth: 'Depth',
    tx: 'Transactions',
    sigs: 'Signatures',
    open: 'Open this block on the explorer',
    notInFeed: 'On the explorer',
    notInFeedNote: 'The network’s public status file carries the height only; transaction and signature counts for each block are on the explorer.',
    fromFeed: 'From the block feed',
  },
  status: {
    final: 'Final',
    signing: 'Signing',
    next: 'Next',
    toFinal: (n: number) => `Final in ${n} more block${n === 1 ? '' : 's'}, about ${n * 30} s at the 30 s target`,
    frozen: 'Signer set frozen',
    assembling: 'Not yet a block',
  },
  explorerBlock: (h: number) => `${links.explorer}?p=block&id=${h}`,
  rules: [
    { k: 'To sign', v: 'A SHA3-512 proof of work, valid for 30 blocks, about 15 min' },
    { k: 'Rewards', v: 'Shared by proof of work; spendable after 960 blocks, about 8 h' },
  ],
  note: 'Block numbers are live, read from the network every 10 seconds. Status and depth follow from the height.',
  reading: 'Reading the latest block…',
  hint: 'Select a block to see what is known about it.',
};

export const s2Map = {
  generate: {
    label: 'Generate an address',
    busy: 'Making a key pair…',
    note: 'A real Ixian address from an RSA-4096 key pair made in this tab. The private key stays here and is gone when you close the tab.',
    failed: 'Could not make a key pair in this browser. Try the example instead.',
  },
  hashedIn: 'Hashed in this browser in',
  relays: {
    live: 'S2 nodes online, live',
    serving: 'Relays for this sector',
    reading: 'Reading the relay count…',
    drawn: 'The hash, the sector and the relay count are real.',
  },
  readouts: [
    { k: 'Sectors', v: '2⁸⁰, found in one step' },
    { k: 'Presence', v: 'expires after 300 s' },
    { k: 'Default port', v: 'TCP 10235' },
    { k: 'Replaces', v: 'DNS, certificate authorities and central directories' },
  ],
  trace: 'The request, step by step',
};

export const seal = {
  label: 'Type a message',
  placeholder: 'Anything you like',
  initial: 'Only the other end can read this.',
  exchange: 'Hybrid key exchange',
  legs: ['RSA-4096', 'ECDH secp521r1', 'ML-KEM-1024'],
  legNotes: ['Classical', 'Classical', 'Post-quantum, FIPS 203'],
  hkdf: 'HKDF-SHA3',
  hkdfNote: 'One shared secret from all three, split into two keys',
  inner: 'AES-256-GCM',
  innerNote: 'Inner layer',
  outer: 'ChaCha20-Poly1305',
  outerNote: 'Outer layer',
  message: 'Your message',
  wire: 'What travels on the wire', // direct or via a relay, this is all anyone in between sees
  opened: 'Opened at the other end',
  measured: 'Sealed, measured in this browser',
  keygen: 'key generation, once',
  every: 'this message, sealed and opened',
  run: 'Seal again',
  preparing: 'Making keys…',
  foot: 'This demo runs in your browser with the same algorithms Ixian uses, but it isn’t Ixian’s exact handshake. Nothing leaves the page.',
  failed: 'This browser could not run the exchange. The layers are described above.',
};

export const decompose = {
  statement: ['Your address', 'is your identity.'] as [string, string],
  label: 'Paste an address',
  placeholder: 'An Ixian address, in Base58',
  example: { label: 'Example address', value: '1EXSqPpj49ZmKiWF8stsMsMXVnSfkee7EzTaBakwNn9sJdaWm' },
  generate: s2Map.generate,
  typo: 'Make a typo',
  parts: { version: 'Version', payload: 'Payload', checksum: 'Checksum' },
  sizes: (n: number) => `${n} byte${n === 1 ? '' : 's'}`,
  payloadOf: {
    0: 'Double SHA-512 of the public key, truncated (v0)',
    1: 'Double SHA-512 of the RSA-4096 public key, truncated',
    2: 'Double SHA3-512 of the RSA-4096 public key, truncated',
  } as Record<number, string>,
  expected: 'Expected',
  given: 'In the address',
  valid: 'Checksum matches',
  invalid: 'Checksum does not match: a character is wrong',
  rule: 'First 3 bytes of a double hash over version and payload',
  errors: {
    empty: 'Paste or generate an address.',
    char: (c: string) => `“${c}” is not Base58. Ixian addresses leave out 0, O, I and l because they look alike.`,
    version: (v: number) => `This decodes to version ${v}. Ixian addresses are versions 0, 1 and 2.`,
    length: (v: number, want: number, got: number) => `A version ${v} address is ${want} bytes; this one decodes to ${got}. A character is missing or extra.`,
  },
  note: 'Decoded and checked in this browser. Nothing is sent anywhere.',
};

export const build = {
  title: 'Start from this page.',
  lead: 'Make a real Ixian address right here, then run QuIXI and send your first message from your own machine.',
  here: {
    tab: 'Runs in this browser',
    file: 'address.js',
    code: [
      "const keys = await crypto.subtle.generateKey({ name: 'RSASSA-PKCS1-v1_5', modulusLength: 4096, … });",
      'const address = await ixianAddress(keys.publicKey); // version 1, checksum included',
    ],
    run: 'Make my address',
    running: 'Making an RSA-4096 key pair…',
    again: 'Make another',
    fields: { address: 'Your address', signed: 'Signed and verified', yes: 'Yes, with the key behind it', no: 'The check failed' },
    doneNote: (s: string) => `Key pair made in ${s} s in this tab. The private key stays in this tab.`,
    failed: 'This browser couldn’t make the key pair. Try another browser.',
    idle: 'Press the button. Nothing is sent anywhere.',
  },
  machine: {
    tab: 'Runs on your machine',
    file: devCode.file,
    code: devCode.lines,
    note: `Not run here. ${devCode.note}`,
    source: devCode.source,
  },
  links: [
    { label: 'Quickstart: your first message', href: links.quickstart },
    { label: 'Developers', href: links.developers },
  ],
};

/** Copy for BlockChain.tsx; restates the rules above. */
export const dltChain = {
  label: 'Ixian DLT, live',
  now: 'Latest block',
  nodes: 'nodes online',
  zones: { final: 'FINAL', signing: 'SIGNING', next: 'NEXT' },
  say: {
    final: (n: string, m: string) => `Block ${n} is final. Its signer set is frozen into the header of block ${m}.`,
    signing: (n: string, d: number, m: string) =>
      `Block ${n} is being signed, ${d} of 5 deep. It becomes final when block ${m} freezes its signer set, in about ${(5 - d) * 30} s at the 30 s target.`,
    next: (n: string) => `Block ${n} is the one the network is working on now.`,
  },
  arcs: 'Each arc joins a block to the one five after it, whose header seals the list of who signed it. Heights are live.',
  seen: (s: number) => `Latest block · seen ${s} s ago`,
  explorer: 'On the explorer',
  reading: 'Reading the latest block…',
};

/* Sources (docs.ixian.io): trustless client discovery, network topology, system architecture.
   The relay fee restates the IXI section. */
export const s2Trace = {
  big: { value: '2⁸⁰', label: 'sectors, about 1.2 septillion', body: 'Every address maps to one of them, so finding an endpoint is a direct lookup, not a search.' },
  rows: {
    address: 'Address',
    hash: 'SHA3-512',
    sector: 'Sector',
    ask: 'Ask the sector',
    relays: 'Relays',
    presence: 'Presence',
    connect: 'Connect',
  },
  notes: {
    hash: 'in this browser',
    sector: 'first 10 bytes of the hash',
    relays: (n: number, of: number) => `${n} of ${of} online serve it`,
    presence: 'signed by the endpoint · fresh for 300 s',
    connect: 'direct, end to end · via a relay behind a firewall',
  },
  caption: 'The hash and the sector are computed in your browser, and the relay count is live.',
  replay: 'Run the lookup again',
};

export const s2Features = {
  label: 'What S2 does',
  items: [
    { id: 'find', title: 'Found by address', body: 'Every address maps to one of 2⁸⁰ sectors. The caller’s S2 node looks up which relays serve that sector, and those relays answer. No DNS and no central directory.', tag: 'SHA3-512 · 10-byte sector', href: links.docs.starling },
    { id: 'seven', title: 'Kept fresh', body: 'Each endpoint’s signed presence is held by the relays of its sector, renewed about every 100 s and dropped after 300 s without it.', tag: '100 s · 300 s', href: links.docs.starling },
    { id: 'direct', title: 'Direct when it can', body: 'Once found, two endpoints connect directly. Behind a firewall or NAT, a relay carries the traffic instead.', tag: 'P2P · relay fallback', href: links.docs.networkTopology },
    { id: 'blind', title: 'Relays see ciphertext', body: 'Everything is encrypted end to end. A relay routes what it cannot read.', tag: 'end to end', href: links.docs.crypto },
    { id: 'grow', title: 'Grows by adding relays', body: 'A new relay announces itself and joins the sector tree automatically, at a spot set by a hash of its address. It serves the sectors nearest to it.', tag: 'horizontal · hash-placed', href: links.docs.systemArchitecture },
    { id: 'paid', title: 'Paid to relay', body: 'Relays earn a fee in IXI for each transaction they pass on to the DLT.', tag: 'IXI · per transaction', href: links.docs.economics },
  ],
  port: 'Default port TCP 10235',
};

/** Figures restate the specs above (docs: consensus, network parameters). */
export const dltFeatures = {
  label: 'What the DLT does',
  items: [
    {
      id: 'sign',
      title: 'Signed by many, staked by none',
      body: 'A node earns the right to sign by solving a SHA3-512 proof of work, which stays valid for 30 blocks (about 15 minutes). A block needs at least 75% of the usual number of signatures.',
      tag: 'Proof of work · 75% · 0 IXI stake',
      href: links.docs.consensus,
    },
    {
      id: 'final',
      title: 'Locked in after five blocks',
      body: 'Five blocks later, about 2.5 minutes, the list of who signed a block is sealed into a later block’s header. From then on, that list can’t be rewritten.',
      tag: '5 blocks · about 2.5 min',
      href: links.docs.consensus,
    },
    {
      id: 'volume',
      title: 'Room for volume',
      body: 'A block every 30 seconds, with a soft limit of about 2,340 transactions a second. Fees are 0.005 IXI per kB.',
      tag: '30 s blocks · 2,340 TPS soft limit',
      href: links.docs.parameters,
    },
  ],
  specs: { label: 'All network parameters', href: links.docs.parameters },
};

/* Sources (docs.ixian.io): cryptographic primitives, post-quantum security guide,
   addresses, economics. */

export const locks = {
  label: 'Three locks on every new contact',
  threatTitle: 'Harvest now, decrypt later.',
  threat: 'Traffic recorded today could be opened later, once quantum computers are strong enough. Flip the switch to see what survives.',
  toggle: { off: 'Today’s computers', on: 'A quantum computer' },
  items: [
    { id: 'rsa', name: 'RSA-4096', math: 'Integer factorisation', breaks: 'Shor’s algorithm breaks it' },
    { id: 'ecdh', name: 'ECDH secp521r1', math: 'Elliptic-curve discrete log', breaks: 'Shor’s algorithm breaks it' },
    { id: 'kem', name: 'ML-KEM-1024', math: 'Module lattices · FIPS 203 · NIST Level 5', breaks: 'No known quantum attack' },
  ],
  holds: 'Holds',
  broken: 'Broken',
  verdict: {
    safe: 'The shared secret holds as long as one of the three stands.',
    classical: 'A classical-only exchange (RSA and ECDH alone) would already be open.',
  },
  note: '',
};

export const identityV2 = {
  shape: 'Every address has its own shape',
  shapeNote: 'Each bar is one byte of the address, drawn in this browser: the version, the payload, then the checksum that catches a typo.',
  uses: {
    label: 'One address, three jobs',
    items: [
      { id: 'found', name: 'Found', body: 'S2 hashes it to a sector and finds it.', href: '#s2', tone: 's2' },
      { id: 'reached', name: 'Reached', body: 'Its key opens the post-quantum exchange.', href: '#security', tone: 's2' },
      { id: 'paid', name: 'Paid', body: 'The DLT holds its balance.', href: '#dlt', tone: 'dlt' },
    ],
  },
  points: [
    { id: 'derived', title: 'No account to create', body: 'You make it yourself, from your own key. Nothing to sign up for and no password to leak.', href: links.docs.addresses },
    { id: 'proof', title: 'Proof, with nobody vouching', body: 'An endpoint signs with the key behind its address, and the other side checks the signature against that address itself. That is digital trust, with nobody in the middle.', href: links.docs.crypto },
    { id: 'many', title: 'One key, many addresses', body: 'Hand out a fresh address for every use, all from one key.', href: links.docs.addresses },
  ],
  many: { title: 'One key, many addresses', body: 'From one public key, nonce-based derivation makes a virtually unlimited number of addresses, so an endpoint can hand out a fresh one for each use.', href: links.docs.addresses },
};

export const ixiLive = {
  pulse: 'New IXI, live',
  since: (n: number) => (n === 0 ? 'Waiting for the next block' : `${n} block${n === 1 ? '' : 's'} since you opened this page, each paying its signers`),
  maturity: (h: string, m: string) => `Rewards from block ${h} can be spent from block ${m}, 960 blocks later, about 8 hours.`,
  reading: 'Reading the latest block…',
  note: 'The block height is live; the rest follows from it and the docs.',
};

export const buildV2 = {
  eyebrow: 'From this page to your first message',
  stops: [
    { id: 'here', where: 'Here', title: 'Make an address', body: 'An RSA-4096 key pair and the address that comes from it, made in this tab.' },
    {
      id: 'run',
      where: 'Your machine',
      title: 'Run QuIXI',
      body: 'The bridge that gives any language an Ixian address, over REST or MQTT.',
      code: ['$ git clone https://github.com/ixian-platform/Ixian-Core.git', '$ git clone https://github.com/ixian-platform/QuIXI.git', '$ cd QuIXI', '$ dotnet build --configuration Release', '$ cd QuIXI/bin/Release/net10.0 && ./QuIXI'],
    },
    { id: 'send', where: 'Your machine', title: 'Send a message', body: 'To a contact who has accepted you, end to end encrypted, through S2.' },
  ],
  copy: 'Copy',
  copied: 'Copied',
};

export const roadmapV2 = {
  now: 'Now',
  layers: [
    { id: 'DLT', label: 'DLT', tone: 'dlt' },
    { id: 'S2', label: 'S2', tone: 's2' },
    { id: 'Clients', label: 'Clients', tone: 'plain' },
    { id: 'QuIXI', label: 'QuIXI', tone: 'build' },
  ],
  all: 'All layers',
  shipped: 'Shipped',
  research: 'Researching',
  backlog: 'Backlog',
  hint: 'Filter by layer',
  read: 'Select any item to read what it is.',
};

export const nextV2 = {
  items: [
    { label: 'Build on it', href: links.developers, body: 'Quickstarts, guides and the APIs for your first app, device or agent.', tone: 'build', glyph: 'build' },
    { label: 'Run a node', href: links.runNode, body: 'Operate a DLT or S2 node, and earn IXI for the work.', tone: 'dlt', glyph: 'node' },
    { label: 'Read the architecture', href: links.docs.architecture, body: 'Data structures, protocols and parameters, in full.', tone: 's2', glyph: 'docs' },
  ],
};
