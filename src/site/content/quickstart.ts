/**
 * Copy for /quickstart. Commands, config keys and error strings follow the QuIXI and Ixian-Core
 * source (qxc-0.9.4a); where the docs differ, the source wins. The API uses HTTP Basic auth from
 * `addApiUser` and is pinned to 127.0.0.1 with `apiBind`. Expected output is taken from the code's
 * strings, not a captured run. Only .NET and curl are required: no Python or jq.
 * YOUR_ADDRESS and YOUR_API_KEY are filled in the browser and never sent anywhere.
 */
import { links } from './links';

export type OS = 'unix' | 'windows';
/** a command; `lead` is one line above it, `out` its own "You should see" */
export type Cmd = { file?: string; lang?: string; lines: string[] | Record<OS, string[]>; lead?: string; out?: Out };
export type Out = { note?: string; lines: string[] };

export const meta = {
  title: 'Quickstart | Ixian',
  description: 'Message your phone from your computer over Ixian in about two minutes: run QuIXI, pair it with Spixi, send and receive, encrypted end to end.',
};

const API = 'http://127.0.0.1:8001';
const AUTH = '-fsS -u quickstart:YOUR_API_KEY';
const CURL: Record<OS, string> = { unix: 'curl', windows: 'curl.exe' };

export const hero = {
  eyebrow: 'Quickstart',
  total: 'A few minutes + first sync',
  /** two lines, set explicitly so the title breaks cleanly */
  title: ['Message your phone', 'from your computer.'] as [string, string],
  outcome: 'In two minutes of your time, plus a few while QuIXI syncs, your computer will send your phone an encrypted message over Ixian.',
  needs: ['.NET 10 SDK and Git', 'macOS, Linux, a Raspberry Pi or Windows', 'Spixi on your phone'],
  spixi: { label: 'Get Spixi', href: links.spixiDownload },
  network: 'Runs on mainnet, the network Spixi uses. Messages are free, so an empty wallet is fine.',
};

export const setup = {
  os: [
    { id: 'unix' as OS, label: 'macOS · Linux · Pi' },
    { id: 'windows' as OS, label: 'Windows' },
  ],
  address: {
    label: 'Your Spixi address',
    placeholder: 'Paste it here to fill every command',
    help: 'In Spixi, open the Address tab and tap Copy.',
    what: { label: 'What’s an address?', href: '/#how' },
    invalid: 'That doesn’t look like an Ixian address yet.',
  },
  quixi: {
    label: 'Your QuIXI address',
    placeholder: 'After step 2, paste it here',
    help: 'Step 2 prints it. The contact request comes from it.',
  },
  key: {
    label: 'API key',
    help: 'Made in this browser and never sent anywhere.',
    renew: 'New key',
  },
};

export type Step = {
  id: string;
  time: string;
  title: string;
  lead: string;
  cmds: Cmd[];
  out?: Out;
  /** a wait the next step depends on, stated plainly */
  gate?: { title: string; body: string };
  after?: string;
  /** the likely failure, right where it happens */
  fail?: string;
  visual?: 'pair' | 'arrive';
};

export const steps: Step[] = [
  {
    id: 'run',
    time: '1 min, then sync',
    title: 'Run QuIXI',
    lead: 'Clone, write a two-line config, then build and run QuIXI in one command. The API answers on this computer only.',
    cmds: [
      {
        lines: {
          unix: [
            '$ git clone https://github.com/ixian-platform/Ixian-Core.git',
            '$ git clone https://github.com/ixian-platform/QuIXI.git',
            '$ cd QuIXI',
            `$ printf 'apiBind = ${API}/\\naddApiUser = quickstart:YOUR_API_KEY\\n' > ixian.cfg`,
            '$ dotnet run --project QuIXI -c Release',
          ],
          windows: [
            '> git clone https://github.com/ixian-platform/Ixian-Core.git',
            '> git clone https://github.com/ixian-platform/QuIXI.git',
            '> cd QuIXI',
            `> "apiBind = ${API}/", "addApiUser = quickstart:YOUR_API_KEY" | Set-Content ixian.cfg`,
            '> dotnet run --project QuIXI -c Release',
          ],
        },
      },
    ],
    out: {
      note: 'When asked, choose a wallet password of at least 10 characters and type it again. Then the status screen appears while QuIXI syncs. Shortened here.',
      lines: [
        'QuIXI qxc-0.9.4a (xcore-0.9.8k)',
        '',
        '!! Always remember to keep a backup of your ixian.wal file and your password.',
        'Enter a password for your new wallet: **********',
        'Type it again to confirm: **********',
        '',
        '                                     qxc-0.9.4a BETA',
        ' http://127.0.0.1:8001/',
        '──────────────────────────────────────────────────────',
        ' Thank you for running QuIXI.',
        '──────────────────────────────────────────────────────',
        ' Status:               synchronizing 95.33%',
        '                       target block …',
        '',
        ' Connections (I/O):    -/3',
      ],
    },
    gate: {
      title: 'Wait for a peer',
      body: 'Before step 2, wait until Connections shows at least one peer. Status may still read synchronizing; that is fine, steps 2 to 4 work while it syncs.',
    },
    after: 'Leave it running. Open a second terminal in the same folder for the next steps.',
  },
  {
    id: 'pair',
    time: '30 s',
    title: 'Pair with Spixi',
    lead: 'Note your node’s address, send your phone a contact request, then accept it in Spixi.',
    cmds: [
      {
        lead: 'First, your node’s own address:',
        lines: {
          unix: [`$ ${CURL.unix} ${AUTH} ${API}/mywallet`],
          windows: [`> ${CURL.windows} ${AUTH} ${API}/mywallet`],
        },
        out: {
          note: 'The long string is your node’s address and the number is its balance. Paste the address in the bar above, since the contact request comes from it.',
          lines: ['{"result":{"4hLm…your node’s address…c7Rq_3":"0.00000000"},"error":null,"id":null}'],
        },
      },
      {
        lead: 'Then the contact request:',
        lines: {
          unix: [`$ ${CURL.unix} ${AUTH} --get --data-urlencode "address=YOUR_ADDRESS" ${API}/addContact`],
          windows: [`> ${CURL.windows} ${AUTH} --get --data-urlencode "address=YOUR_ADDRESS" ${API}/addContact`],
        },
      },
    ],
    out: {
      note: 'The contact comes back as JSON. These fields matter.',
      lines: ['"state": 0,        // request sent; 2 once you accept', '"online": true,    // QuIXI found your phone; false while it looks', '"error": null'],
    },
    after: 'Now check your phone: a contact request from QuIXI appears in Spixi. Accept it. Your phone is the real check; the JSON only says the node took the request.',
    fail: 'If your phone shows nothing, see Pairing in Troubleshooting.',
    visual: 'pair',
  },
  {
    id: 'send',
    time: '20 s',
    title: 'Send a message',
    lead: 'From your computer to your phone.',
    cmds: [
      {
        lines: {
          unix: [`$ ${CURL.unix} ${AUTH} --get --data-urlencode "address=YOUR_ADDRESS" --data-urlencode "message=Hello from my computer" --data-urlencode "channel=0" ${API}/sendChatMessage`],
          windows: [`> ${CURL.windows} ${AUTH} --get --data-urlencode "address=YOUR_ADDRESS" --data-urlencode "message=Hello from my computer" --data-urlencode "channel=0" ${API}/sendChatMessage`],
        },
      },
    ],
    out: { note: 'The message comes back as JSON. The keys worth reading:', lines: ['"message": "Hello from my computer",', '"localSender": true,', '"error": null'] },
    after: 'It arrives in the chat with QuIXI on your phone.',
    visual: 'arrive',
  },
  {
    id: 'receive',
    time: '30 s',
    title: 'Receive a message',
    lead: 'Reply to QuIXI from your phone, then read it back.',
    cmds: [
      {
        lines: {
          unix: [`$ ${CURL.unix} ${AUTH} --get --data-urlencode "address=YOUR_ADDRESS" --data-urlencode "count=5" --data-urlencode "channel=0" ${API}/getLastMessages`],
          windows: [`> ${CURL.windows} ${AUTH} --get --data-urlencode "address=YOUR_ADDRESS" --data-urlencode "count=5" --data-urlencode "channel=0" ${API}/getLastMessages`],
        },
      },
    ],
    out: {
      note: 'The last five messages with your phone, as JSON. Your reply is the entry with localSender false:',
      lines: ['"message": "Hello back from my phone",', '"localSender": false,     // false: it came from your phone', '"error": null'],
    },
    after: 'You read by address, so you only see your conversation with that address. Keep that habit: anyone can message this node, so act only on addresses you trust.',
  },
];

/** optional, below the path: the same call in a loop, in the shell they already have */
export const live = {
  title: 'Want it live?',
  lead: 'The latest message every two seconds, in the shell you already have. Nothing to install, and Ctrl-C stops it.',
  cmd: {
    lines: {
      unix: [`$ while true; do ${CURL.unix} ${AUTH} --get --data-urlencode "address=YOUR_ADDRESS" --data-urlencode "count=1" --data-urlencode "channel=0" ${API}/getLastMessages; echo; sleep 2; done`],
      windows: [`> while ($true) { ${CURL.windows} ${AUTH} --get --data-urlencode "address=YOUR_ADDRESS" --data-urlencode "count=1" --data-urlencode "channel=0" ${API}/getLastMessages; ""; Start-Sleep 2 }`],
    },
  } as Cmd,
};

/** the terminator on the rail after step 4 */
export const doneLine = 'Done. Your computer and your phone are talking, end to end encrypted.';

export const next = {
  title: 'It works. Now what?',
  items: [
    { title: 'Connect an AI agent', body: 'Put a local model behind this address, so people can talk to it from Spixi.', href: links.docs.howto.aiChatbot, label: 'AI chatbot guide' },
    { title: 'Connect a device', body: 'Run the same bridge on a Raspberry Pi and switch an LED from your phone.', href: links.docs.howto.iot, label: 'IoT guide' },
    { title: 'Build a Mini App', body: 'A multi-user app in HTML and JavaScript that runs inside a Spixi chat.', href: links.docs.quickstart.miniApp, label: 'Mini App quickstart' },
  ],
};

export const happened = {
  title: 'What just happened.',
  lines: [
    'Your computer made its own address and wallet, without an account or a sign-up.',
    'It found your phone by its address and sent the message end to end encrypted. Any relay on the way sees only ciphertext.',
    'No server of yours sat in between, and the API answered on this computer only.',
  ],
  link: { label: 'How it works', href: '/#how' },
};

export type Trouble = { when: string; error: string; fix: string };
/** in the order they happen; each error string exactly as it prints */
export const trouble: Trouble[] = [
  {
    when: 'Building',
    error: 'error NETSDK1045: The current .NET SDK does not support targeting .NET 10.0.',
    fix: 'Install the .NET 10 SDK. `dotnet --version` should start with 10.',
  },
  {
    when: 'Starting',
    error: 'Unhandled exception. System.Exception: Cannot initialize API server! The error was: …',
    fix: 'Something else uses port 8001. The reason after "The error was" depends on your system. Stop the other program, or change 8001 in ixian.cfg and in the commands.',
  },
  {
    when: 'Connecting',
    error: "Your node isn't connectable from the internet.",
    fix: 'QuIXI shows this until it connects out to a peer. Behind a home router that is normal: other nodes don’t need to reach yours. If it stays for minutes, check that outgoing connections are allowed.',
  },
  {
    when: 'Any command',
    error: 'curl: (22) The requested URL returned error: 401',
    fix: 'The key in the command doesn’t match ixian.cfg. Use the commands from this browser, or write ixian.cfg again and restart QuIXI.',
  },
  {
    when: 'Pairing',
    error: 'No contact request on the phone',
    fix: 'The node had no peer yet when you ran step 2. Wait until Connections shows at least one peer (synchronizing is fine): QuIXI sends the request again on its own. Running step 2 again fails while the contact exists. To start over, run it with `removeContact` in place of `addContact`, then step 2.',
  },
  {
    when: 'Sending',
    error: 'curl: (22) The requested URL returned error: 500',
    fix: 'Most often the contact isn’t there yet. Run step 2 with the same address, and accept the request in Spixi. Sending works once it is accepted. The API answers every error with code 500; to read the message, run the command without `-f`.',
  },
  {
    when: 'Anywhere',
    error: 'Status: connecting',
    fix: 'QuIXI has no peer yet. Wait a minute. If it stays, allow outgoing connections, including port 10234.',
  },
];

export const help = {
  title: 'Still stuck?',
  items: [
    { label: 'Ask on Discord', href: links.social.discord },
    { label: 'Open a GitHub issue', href: 'https://github.com/ixian-platform/QuIXI/issues' },
  ],
};

export const leave = {
  title: 'Stop and remove it',
  stop: 'Press Esc or Ctrl-C in the QuIXI terminal, or:',
  stopCmd: {
    lines: {
      unix: [`$ ${CURL.unix} ${AUTH} ${API}/shutdown`],
      windows: [`> ${CURL.windows} ${AUTH} ${API}/shutdown`],
    },
  } as Cmd,
  remove: 'Then delete both folders. That deletes the wallet in QuIXI/data too. Apart from .NET’s package cache, nothing else was installed.',
  removeCmd: {
    lines: {
      unix: ['$ cd .. && rm -rf QuIXI Ixian-Core'],
      windows: ['> cd ..; Remove-Item -Recurse -Force QuIXI, Ixian-Core'],
    },
  } as Cmd,
  spixi: 'In Spixi, remove the QuIXI contact if you like.',
};

/** Optional real captures; null shows the drawn version. e.g. { src: '/site/quickstart/pair.webp', alt: '…' } */
export const media: Record<'capture' | 'pair' | 'arrive', { src: string; alt: string; video?: boolean } | null> = {
  capture: null,
  pair: null,
  arrive: null,
};
