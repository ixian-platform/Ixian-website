// Illustrative example content for sections/Spixi/Stage.tsx; never presented as live.
type Note = { title: string; detail: string };
export type HistoryItem =
  | { day: string }
  | { out: string; time: string }
  | { call: 'missed' | 'voice'; title: string; time: string; action: string; detail?: string };

export const stage = {
  chat: {
    name: 'friend',
    addr: '1Fr2Kc6Sa…Hn5tB1ve',
    status: 'reachable',
    history: [
      { day: 'Thursday' },
      { out: 'Call you after work?', time: '17:40' },
      { call: 'missed', title: 'No answer', time: '17:44', action: 'Call back' },
      { call: 'voice', title: 'Voice call', detail: '12 min 04 s', time: '18:31', action: 'Call again' },
      { day: 'Today' },
    ] as HistoryItem[],
    lines: [
      { text: 'Dinner at 8 tonight?', time: '18:52' },
      { text: 'Yes! I’ll book the table.', time: '18:53' },
      { text: 'Perfect. Found a little place down by the old harbour, the one with the blue door', time: '18:55' },
      { text: 'Got it, thanks!', time: '18:58' },
    ],
    file: { name: 'menu-harbour.pdf', detail: '312 KB · PDF', time: '18:55' },
    payment: { title: 'Payment sent', detail: '12 IXI · half the deposit', time: '18:57' },
    notes: [
      { title: 'No phone number', detail: 'just an address, made on the phone' },
      { title: 'End to end encrypted', detail: 'hybrid key exchange with post-quantum ML-KEM' },
      { title: 'Calls, files and payments', detail: 'in the same thread, to the same address' },
    ] as Note[],
  },
  agents: {
    name: 'research agent',
    addr: '1EXSqPpj49…n9sJdaWm',
    request: 'Summarise these 40 papers and send the report to my team.',
    answer: 'On it. I’ll read all 40 papers, pull out the main findings and draft a two-page summary for your team. This job costs 2 IXI.',
    price: '2 IXI',
    done: 'Done. The report is in your team’s chat.',
    count: 40, // the progress bar on the first task
    tasks: ['Read 40 papers', 'Extract the findings', 'Draft a two-page summary', 'Request payment', 'Deliver the report'],
    notes: [{ title: 'The agent has its own address', detail: 'it signs what it sends and gets paid to it' }] as Note[],
  },
  miniapp: {
    name: 'Solar park · inverter 7',
    addr: '1Gv7Rt3Lw…Kd8pQe2x',
    status: 'reachable',
    app: 'Grid control',
    readings: [
      { label: 'Output', before: '1.82 MW', after: '1.46 MW' },
      { label: 'Battery', before: '72 %' },
    ],
    control: 'Export limit',
    state: { idle: 'Readings straight from the inverter', tap: 'Tap 80% to lower the export limit', wait: 'Sending to the inverter…', done: 'Applied by the inverter' },
    command: 'set export_limit 80%',
    signed: 'from your address',
    reply: 'Done. Export limit is now 80%.',
    notes: [
      { title: 'The inverter owns its address', detail: 'no cloud account behind it' },
      { title: 'Straight to the device', detail: 'no vendor cloud in between' },
      { title: 'Signed by you, checked by it', detail: 'only your address can change the limit' },
    ] as Note[],
    code: 'SpixiAppSdk.sendNetworkData(cmd)',
  },
};

/** The same stage with the Ecosystem page's example stories. */
export const ecoStage: typeof stage & { miniapp: typeof stage.miniapp & { seg: [string, string]; tile: string } } = {
  chat: {
    name: 'studio',
    addr: '1Mn4Qe8Ta…Vw2cR7yx',
    status: 'reachable',
    history: [
      { day: 'Monday' },
      { out: 'Can’t wait to see the logo routes.', time: '10:12' },
      { call: 'voice', title: 'Voice call', detail: '24 min 10 s', time: '11:05', action: 'Call again' },
      { day: 'Today' },
    ] as HistoryItem[],
    lines: [
      { text: 'Route B is final. Sending the files now.', time: '09:41' },
      { text: 'Great, send the invoice with them.', time: '09:43' },
      { text: 'Here you go. The invoice is in the zip.', time: '09:46' },
      { text: 'Received, thank you!', time: '09:49' },
    ],
    file: { name: 'logo-route-b.zip', detail: '18 MB · ZIP', time: '09:46' },
    payment: { title: 'Invoice paid', detail: '350 IXI · invoice 0142', time: '09:48' },
    notes: [
      { title: 'Files, straight across', detail: 'no upload to anyone’s cloud' },
      { title: 'End to end encrypted', detail: 'hybrid key exchange with post-quantum ML-KEM' },
      { title: 'Paid in the thread', detail: 'to the address that sent the files' },
    ],
  },
  agents: {
    name: 'travel agent',
    addr: '1Tr9Jd3Wv…Ps6mK4nb',
    request: 'Find me a train to Vienna on Friday morning and book a window seat.',
    answer: 'On it. I’ll compare the Friday morning trains, pick the fastest one with a window seat and book it. This job costs 1 IXI.',
    price: '1 IXI',
    done: 'Booked. Your ticket is in this chat.',
    count: 12,
    tasks: ['Compare Friday trains', 'Pick the fastest', 'Book a window seat', 'Request payment', 'Send the ticket'],
    notes: [{ title: 'The agent has its own address', detail: 'it signs what it sends and gets paid to it' }],
  },
  miniapp: {
    name: 'Lab · cold room 3',
    addr: '1Cr3Hs5Nq…Lb9tW2ke',
    status: 'reachable',
    app: 'Cold room',
    tile: 'Cold room',
    readings: [
      { label: 'Temperature', before: '6.2 °C', after: '4.0 °C' },
      { label: 'Door', before: 'closed' },
    ],
    control: 'Target',
    seg: ['6 °C', '4 °C'],
    state: { idle: 'Readings straight from the room', tap: 'Tap 4 °C to lower the target', wait: 'Sending to the room…', done: 'Applied by the room' },
    command: 'set target 4 °C',
    signed: 'from your address',
    reply: 'Done. Target is now 4 °C.',
    notes: [
      { title: 'The room has its own address', detail: 'its keys stay in the room' },
      { title: 'Straight to the device', detail: 'no vendor cloud in between' },
      { title: 'Signed by you, checked by it', detail: 'only your address can change it' },
    ],
    code: 'SpixiAppSdk.sendNetworkData(cmd)',
  },
};
