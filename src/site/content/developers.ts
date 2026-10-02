/** Copy for /build. Every command is copied from the linked docs.ixian.io page; keep them in sync. */
import { links } from './links';

const d = links.docs;

export const meta = {
  title: 'Build on Ixian | Quickstarts, guides and APIs',
  description: 'Give an app, device or AI agent its own address, with messaging and payments. Docker sandbox, Mini Apps, the QuIXI gateway and the C# SDK.',
};

export const hero = {
  title: ['Build on Ixian.', 'A private network in three steps.'] as [string, string],
  lead: 'Give your app, device or AI agent its own address. With it, your code proves who it is, talks, shares data and takes payments peer to peer, with no backend of your own to host. Start with the quickstart: your computer messages your phone in about two minutes. The sandbox is there when you want a private network.',
  actions: [
    { label: 'Developer docs', href: d.developers, kind: 'primary' as const },
    { label: 'GitHub', href: links.github.org, kind: 'secondary' as const },
  ],
  session: {
    title: 'A first session',
    note: 'Real commands. The line under each one says what it does; it is not captured output.',
    replay: 'Replay',
    copy: 'Copy commands',
    copied: 'Copied',
    parts: { machine: 'Your machine (Docker)', explorer: 'Explorer', address: 'Any address' },
    steps: [
      { cmd: 'git clone https://github.com/ixian-platform/Ixian-Sandbox.git', out: 'the sandbox: a private Ixian network in Docker', show: [] },
      { cmd: 'cd Ixian-Sandbox && ./sandbox up', out: 'two DLT nodes, ten S2 nodes and an explorer start on your machine', show: ['dlt', 's2', 'explorer'] },
      { cmd: 'curl http://localhost:8081/status', out: 'the first DLT node answers with its status as JSON', show: [] },
    ],
  },
  code: {
    file: 'Terminal',
    lang: 'Shell',
    lines: [
      '# Send a message to a contact through QuIXI',
      '$ curl -G http://localhost:8001/sendChatMessage \\',
      '    --data-urlencode "address=<address>" \\',
      '    --data-urlencode "message=Hello, Ixian!" \\',
      '    -d channel=0',
    ],
    source: { label: 'sendChatMessage reference', href: d.sendChatMessage },
    note: 'The recipient must have accepted you as a contact first. QuIXI’s API listens on port 8001 by default.',
  },
  index: [
    { id: 'paths', label: 'No backend' },
    { id: 'languages', label: 'Your language' },
    { id: 'quickstarts', label: 'Quickstarts' },
    { id: 'quixi', label: 'QuIXI' },
    { id: 'guides', label: 'Guides' },
    { id: 'resources', label: 'Resources' },
    { id: 'faq', label: 'FAQ' },
  ],
};

export type Quickstart = {
  id: string;
  name: string;
  time?: string;
  needs: string[];
  body: string;
  code: string[];
  href: string;
};

export const quickstarts = {
  title: 'Quickstarts.',
  lead: 'Try things in the sandbox first. It is a private network on your own machine, so nothing you do touches mainnet.',
  timeLabel: 'Time',
  needsLabel: 'You need',
  noTime: 'Varies',
  open: 'Open the quickstart',
  items: [
    {
      id: 'sandbox',
      name: 'Docker sandbox',
      time: '3 to 5 minutes the first time, about 30 seconds after that',
      needs: ['Docker Engine 20.10+', 'Docker Compose v2+', '4 GB RAM, 10 GB disk'],
      body: 'A private network on your machine: two DLT nodes, ten S2 nodes and an explorer.',
      code: ['$ git clone https://github.com/ixian-platform/Ixian-Sandbox.git', '$ cd Ixian-Sandbox', '$ ./sandbox up', '$ curl http://localhost:8081/status'],
      href: d.quickstart.sandbox,
    },
    {
      id: 'miniapp',
      name: 'Spixi Mini App',
      needs: ['HTML, CSS and JavaScript', 'Python 3 to serve it locally', 'Spixi to try it'],
      body: 'Create the app folder and its manifest, add the Mini Apps SDK, then serve it locally and pack it.',
      code: [
        '$ mkdir myapp && cd myapp',
        '$ touch appinfo.spixi',
        '$ mkdir -p app/js app/css app/img',
        '$ curl -o app/js/spixi-app-sdk.js https://raw.githubusercontent.com/ixian-platform/Spixi-Mini-Apps/master/mini-apps-sdk/spixi-app-sdk.js',
      ],
      href: d.quickstart.miniApp,
    },
    {
      id: 'quixi',
      name: 'QuIXI bridge',
      needs: ['.NET 10 SDK', 'Mosquitto or RabbitMQ (optional)', 'Testnet or mainnet access'],
      body: 'Build and start the gateway, then call it over REST or subscribe to its MQTT topics.',
      code: ['$ git clone https://github.com/ixian-platform/Ixian-Core.git', '$ git clone https://github.com/ixian-platform/QuIXI.git', '$ cd QuIXI', '$ dotnet build --configuration Release', '$ cd QuIXI/bin/Release/net10.0 && ./QuIXI', '$ curl http://localhost:8001/status'],
      href: d.quickstart.quixi,
    },
    {
      id: 'client',
      name: 'Client app',
      needs: ['.NET 10 SDK', 'Visual Studio or VS Code with C#', 'Basic C# and async'],
      body: 'A console client on the Ixian-Core SDK: keys, addresses, presence and transactions.',
      code: ['$ dotnet new console -n MyIxianClient', '$ git clone https://github.com/ixian-platform/Ixian-Core.git'],
      href: d.quickstart.client,
    },
    {
      id: 'payments',
      name: 'Payment gateway',
      needs: ['.NET 10 SDK', 'Mosquitto (MQTT)', 'Testnet or mainnet access'],
      body: 'Receive and send IXI on QuIXI. Extended addresses tag each order, and a payment is credited only once it is final.',
      code: ['$ git clone https://github.com/ixian-platform/Ixian-Core.git', '$ git clone https://github.com/ixian-platform/QuIXI.git', '$ cd QuIXI', '$ dotnet build --configuration Release'],
      href: d.quickstart.paymentGateway,
    },
  ] as Quickstart[],
};

export const guides = {
  title: 'Guides.',
  lead: 'Longer walkthroughs for the things people build most, each from zero to a working project.',
  items: [
    { name: 'Serverless peer-to-peer web apps', body: 'Real-time, multi-user apps in HTML, CSS and JavaScript, with no backend of your own.', href: d.howto.p2pApps },
    { name: 'A decentralized AI chatbot', body: 'Connect a local model (LM Studio or Ollama) to the network through QuIXI and MQTT, so there are no model API bills or rate limits.', href: d.howto.aiChatbot },
    { name: 'IoT without cloud providers', body: 'A peer-to-peer LED controller on a Raspberry Pi running QuIXI, with no vendor cloud in between.', href: d.howto.iot },
    { name: 'Post-quantum security today', body: 'The hybrid key exchange and the two encryption layers, with C# examples.', href: d.howto.pq },
    { name: 'Local development with Docker', body: 'Integration tests, multi-node setups and CI with the sandbox.', href: d.howto.localDocker },
  ],
  all: { label: 'All guides', href: d.howto.index },
};

export const quixi = {
  title: 'QuIXI connects your stack.',
  lead: 'QuIXI is a lightweight gateway node. It puts the Ixian network behind a REST API and message queues, so an existing service, a device or an AI agent can join in any language.',
  diagram: {
    left: ['REST', 'MQTT', 'RabbitMQ'],
    leftLabel: 'Your systems',
    mid: 'QuIXI',
    midNote: 'Port 8001 (API) · 1883 (MQTT)',
    right: 'Ixian network',
    rightNote: 'Addresses, messages, payments',
  },
  tabs: [
    {
      id: 'rest',
      label: 'REST',
      file: 'Terminal',
      lang: 'Shell',
      lines: ['# Who am I, and what have I received?', '$ curl -u quickstart:YOUR_API_KEY http://127.0.0.1:8001/mywallet', '$ curl -u quickstart:YOUR_API_KEY "http://127.0.0.1:8001/getLastMessages?address=<address>&count=3"'],
      source: { label: 'QuIXI RPC reference', href: d.quixiRpc },
    },
    {
      id: 'mqtt',
      label: 'MQTT',
      file: 'Terminal',
      lang: 'Shell',
      lines: ['# Every chat message and payment arrives as a topic', '$ mosquitto_sub -t "Chat/#" -t "Transaction/#" -v'],
      source: { label: 'QuIXI message queues', href: d.quixiMq },
    },
    {
      id: 'config',
      label: 'Config',
      file: 'ixian.cfg',
      lang: 'Config',
      lines: ['; Use MQTT (or set mqDriver = rabbitmq)', 'mqDriver = mqtt', 'mqHost = localhost', 'mqPort = 1883'],
      source: { label: 'QuIXI configuration', href: `${d.quixi}/config` },
    },
  ],
  topicsLabel: 'Topics include',
  topics: ['Chat', 'Transaction', 'TransactionStatusUpdate', 'SentFunds', 'RequestFunds', 'FileData', 'AppData'],
  links: [
    { label: 'QuIXI reference', href: d.quixi },
    { label: 'Examples on GitHub', href: links.github.quixiExamples },
  ],
};

export const resources = {
  title: 'Resources.',
  lead: 'Everything else you will reach for, straight to the right page.',
  items: [
    { name: 'Architecture', body: 'How the DLT, S2 and clients fit together.', href: d.architecture },
    { name: 'API reference', body: 'The shared RPC calls, plus the DLT, S2 and QuIXI endpoints.', href: d.reference },
    { name: 'Run a node', body: 'Operator guides for DLT and S2 nodes.', href: d.operators },
    { name: 'GitHub', body: 'Every repository: core, DLT, S2, QuIXI, Spixi and more.', href: links.github.org },
    { name: 'Glossary', body: 'Every Ixian term, from Ixiac to Starling.', href: d.glossary },
    { name: 'Whitepaper', body: 'The platform design in one document (draft v0.9.9).', href: links.whitepaper },
  ],
};

export const faq = {
  title: 'Questions.',
  items: [
    { q: 'How do I start?', a: 'Follow the quickstart: your computer messages your phone in about two minutes. Then pick a path, a Spixi Mini App, QuIXI or a client app on the SDK, and use the sandbox to test privately.' },
    { q: 'Which languages can I use?', a: 'C# on .NET directly, through Ixian-Core. Any language through QuIXI’s REST API or message queues. JavaScript for Mini Apps.' },
    { q: 'How do I test without real IXI?', a: 'Use the sandbox, a private regtest network on your machine, or the testnet: set networkType = testnet and connect to seedtest1.ixian.io:11234.' },
    { q: 'How does my code know who sent a message?', a: 'Every message arrives from an address, and only the holder of that address’s key can sign as it. So your code decides by address and acts only on the addresses it trusts, as the quickstart does.' },
    { q: 'Where do I get IXI?', a: 'On the NonKYC exchange (IXI/USDT), or by running a DLT node, which earns signing rewards. A faucet with a little free IXI for trying things out is coming soon.' },
    { q: 'Do I need to run a node?', a: 'Not a DLT or S2 node. Clients, Mini Apps and QuIXI connect to the public network. Run a DLT or S2 node to earn IXI or to run infrastructure of your own.' },
    { q: 'Is it quantum-safe?', a: 'The key exchange is hybrid post-quantum today: ML-KEM-1024 together with RSA-4096 and ECDH. Signatures are still RSA-4096. Post-quantum signatures (FN-DSA, Falcon) are in the roadmap backlog.' },
    { q: 'What does “no backend” mean here?', a: 'You don’t run a server of your own for identity, discovery, messaging or payments. The network does that work.' },
  ],
  help: { label: 'Ask on Discord', href: links.social.discord },
  issues: { label: 'Report an issue on GitHub', href: `${links.github.quixi}/issues` },
};

export const chapters = [
  { id: 'top', label: 'Developers' },
  { id: 'paths', label: 'No backend' },
  { id: 'languages', label: 'Languages' },
  { id: 'quickstarts', label: 'Quickstarts' },
  { id: 'quixi', label: 'QuIXI' },
  { id: 'guides', label: 'Guides' },
  { id: 'resources', label: 'Resources' },
  { id: 'faq', label: 'FAQ' },
];

/* Snippets below match the quickstarts (content/quickstart.ts and the docs); keep them in sync. */

export const heroV2 = {
  actions: [
    { label: 'Start the quickstart', href: links.quickstart, kind: 'primary' as const },
    { label: 'Developer docs', href: d.developers, kind: 'secondary' as const },
  ],
};

export const notBuilt = {
  title: 'The backend you don’t write.',
  lead: 'The parts of an app that usually need servers of your own are already on the network, run by independent operators.',
  rows: [
    { cross: 'Accounts and login servers', with: 'An address your code proves with its key, checked by the other side', where: 'Identity', href: `${links.platform}#identity` },
    { cross: 'A directory to look people up', with: 'S2 finds any address directly, without a search', where: 'S2', href: `${links.platform}#s2` },
    { cross: 'A relay server for NAT', with: 'S2 relays carry the traffic when a direct connection fails', where: 'S2', href: `${links.platform}#s2` },
    { cross: 'Key servers and certificates', with: 'A hybrid post-quantum exchange per contact', where: 'Security', href: `${links.platform}#security` },
    { cross: 'A payment processor', with: 'IXI, paid to the same address', where: 'DLT', href: `${links.platform}#dlt` },
  ],
};

const Q = 'http://127.0.0.1:8001/sendChatMessage';
export const langs = {
  title: 'Your language, one network.',
  lead: 'Pick what you write. Every path gets the same address, messaging and payments.',
  label: 'I write',
  items: [
    {
      id: 'spixi',
      name: 'JavaScript, in Spixi',
      path: 'Spixi Mini Apps',
      file: 'app.js',
      code: [
        '// every person in the session gets this',
        'SpixiAppSdk.sendNetworkData(JSON.stringify(state));',
        '',
        'SpixiAppSdk.onNetworkData = function(senderAddress, data) {',
        '    applyMove(JSON.parse(data));',
        '};',
      ],
      note: 'The two calls every Mini App uses.',
      link: { label: 'Mini App quickstart', href: d.quickstart.miniApp },
    },
    {
      id: 'python',
      name: 'Python',
      path: 'QuIXI, over REST',
      file: 'send.py',
      code: [
        'import requests',
        '',
        `requests.get("${Q}",`,
        '    auth=("quickstart", API_KEY),',
        '    params={"address": ADDRESS, "message": "Hello", "channel": 0})',
      ],
      note: 'Any HTTP client works: the endpoint and its parameters are QuIXI’s.',
      link: { label: 'sendChatMessage reference', href: d.sendChatMessage },
    },
    {
      id: 'node',
      name: 'Node.js',
      path: 'QuIXI, over REST',
      file: 'send.mjs',
      code: [
        'const q = new URLSearchParams({ address, message: "Hello", channel: "0" });',
        '',
        `await fetch("${Q}?" + q, {`,
        '  headers: { Authorization: "Basic " + btoa("quickstart:" + API_KEY) },',
        '});',
      ],
      note: 'Any HTTP client works: the endpoint and its parameters are QuIXI’s.',
      link: { label: 'sendChatMessage reference', href: d.sendChatMessage },
    },
    {
      id: 'mqtt',
      name: 'Anything with MQTT',
      path: 'QuIXI, over message queues',
      file: 'Terminal',
      code: ['# every chat message and payment arrives as a topic', '$ mosquitto_sub -t "Chat/#" -t "Transaction/#" -v'],
      note: 'Subscribe once and every message arrives as it lands.',
      link: { label: 'QuIXI message queues', href: d.quixiMq },
    },
    {
      id: 'curl',
      name: 'curl',
      path: 'QuIXI, over REST',
      file: 'Terminal',
      code: [
        '$ curl -fsS -u quickstart:YOUR_API_KEY --get \\',
        '    --data-urlencode "address=YOUR_ADDRESS" \\',
        '    --data-urlencode "message=Hello" \\',
        `    --data-urlencode "channel=0" ${Q}`,
      ],
      note: 'The quickstart’s step 3, as is.',
      link: { label: 'Quickstart', href: links.quickstart },
    },
    {
      id: 'csharp',
      name: 'C#',
      path: 'Ixian-Core SDK',
      file: 'Terminal · Program.cs',
      code: ['$ dotnet new console -n MyIxianClient', '$ git clone https://github.com/ixian-platform/Ixian-Core.git', '', '// your wallet, and with it your address', 'walletStorage.generateWallet(password);'],
      note: 'From the client app quickstart.',
      link: { label: 'Client app quickstart', href: d.quickstart.client },
    },
  ],
};

export const guidesV2 = {
  glyphs: ['p2p', 'ai', 'iot', 'pq', 'docker'] as const,
};

export const quixiLive = {
  flow: {
    in: 'Your code calls QuIXI',
    out: 'QuIXI sends it to the Ixian network, end to end encrypted',
    back: 'What arrives comes back as a topic',
  },
  note: 'A sketch of a request going out and a topic coming back. The ports, topics and config are the real ones.',
};
