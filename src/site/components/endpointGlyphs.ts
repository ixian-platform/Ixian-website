/** Endpoint glyphs for the network drawings: 24 grid, 1.4 stroke to match Icon.tsx, one path each. */
export const GLYPH: Record<string, string> = {
  // an agent: a face with an antenna
  agent: 'M12 3.5v2.5M8 6h8a3 3 0 0 1 3 3v5.5a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3V9a3 3 0 0 1 3-3zM9.5 11.5v1M14.5 11.5v1M10 15h4M3 10.5v3M21 10.5v3',
  // a sensor: a point that radiates
  sensor: 'M12 13.2a1.2 1.2 0 1 0 0-2.4 1.2 1.2 0 0 0 0 2.4zM8.8 8.8a4.5 4.5 0 0 0 0 6.4M15.2 8.8a4.5 4.5 0 0 1 0 6.4M6 6a8.5 8.5 0 0 0 0 12M18 6a8.5 8.5 0 0 1 0 12',
  // Spixi: a phone with a message
  spixi: 'M8 3h8a1.5 1.5 0 0 1 1.5 1.5v15A1.5 1.5 0 0 1 16 21H8a1.5 1.5 0 0 1-1.5-1.5v-15A1.5 1.5 0 0 1 8 3zM9.5 8h5v3.5h-3L9.5 13zM11 18h2',
  // a service: two stacked units
  service: 'M4.5 4.5h15v6h-15zM4.5 13.5h15v6h-15zM7.5 7.5h.01M7.5 16.5h.01M11 7.5h5.5M11 16.5h5.5',
  // a device: a chip
  device: 'M7.5 7.5h9v9h-9zM10.5 10.5h3v3h-3zM10 4.5v3M14 4.5v3M10 16.5v3M14 16.5v3M4.5 10h3M4.5 14h3M16.5 10h3M16.5 14h3',
  // a robot arm
  robot: 'M5 20h8M9 20v-3M6.5 17h5l-1-3h-3zM9 14l-2-5.5M7 8.5l6.5-3M13.5 5.5l3.5 2.5M17 8l1.5 2.5M17 8l2.5-1',
  // a drone
  drone: 'M10 10.5h4v3h-4zM10 10.5L7 7.5M14 10.5l3-3M10 13.5l-3 3M14 13.5l3 3M4 7.5h6M14 7.5h6M4 16.5h6M14 16.5h6',
  // a car
  car: 'M5 15.5V12l2-4.5h10l2 4.5v3.5M4 15.5h16v2.5H4zM7.5 18v1.5M16.5 18v1.5M5.5 12h13',
  // a charging point
  charger: 'M7 3.5h8v17H7zM15 8.5h2a1.5 1.5 0 0 1 1.5 1.5v5.5a1.5 1.5 0 0 0 3 0V11M11.5 7.5l-2 4h3l-2 4',
  // a camera
  camera: 'M4 8h11v8H4zM15 10.5l5-2.5v8l-5-2.5M7 11h.01',
  // a home hub
  home: 'M4 11l8-6.5 8 6.5M6.5 9.5V19h11V9.5M10 19v-5h4v5',
  // IXI: a coin
  coin: 'M12 20.5a8.5 8.5 0 1 0 0-17 8.5 8.5 0 0 0 0 17zM9.5 8.5h5M9.5 15.5h5M12 8.5v7',
  // an app grid
  app: 'M4.5 4.5h6v6h-6zM13.5 4.5h6v6h-6zM4.5 13.5h6v6h-6zM13.5 13.5h6v6h-6z',
  // a lock
  lock: 'M6 11h12v9H6zM8.5 11V8a3.5 3.5 0 0 1 7 0v3',
  // a parcel locker
  locker: 'M5 4h14v16H5zM12 4v16M5 10h7M5 15h7M12 12h7M9.5 7h.01M15.5 8h.01',
  // a barrier gate: a post and its arm
  gate: 'M5 20V9h3v11M8 11.5h12M11 11.5l1.5 2M14.5 11.5l1.5 2M18 11.5l1.5 2M4 20h5',
  // an alarm: a bell with sound
  alarm: 'M7 16.5V11a5 5 0 0 1 10 0v5.5l1.5 1.5h-13zM10.5 20.5h3M4 7.5l-1.5-1M20 7.5l1.5-1M3.5 11.5H2M22 11.5h-1.5',
  // a light: a street lamp
  light: 'M8.5 20.5h7M12 20.5V7.5a3 3 0 0 1 3-3h1.5M14.5 7h6l-1.5-2.5h-3zM17.5 9.5v1.5M15 9.5l-.8 1.2M20 9.5l.8 1.2',
};
