export type Entry = { id: string; date: string; clientId: string; hours: number; note: string };
export const clients = [
  { id: 'c1', name: 'Northwind Studio' },
  { id: 'c2', name: 'Harbor & Vale' },
  { id: 'c3', name: 'Pinecone Press' },
];
export const week = ['2026-10-05', '2026-10-06', '2026-10-07', '2026-10-08', '2026-10-09', '2026-10-10', '2026-10-11'];
export const entries: Entry[] = [
  { id: 'e1', date: '2026-10-05', clientId: 'c1', hours: 3, note: 'Homepage redesign' },
  { id: 'e2', date: '2026-10-06', clientId: 'c2', hours: 2.5, note: 'Brand guidelines review' },
  { id: 'e3', date: '2026-10-07', clientId: 'c1', hours: 4, note: 'Component library' },
  { id: 'e4', date: '2026-10-08', clientId: 'c3', hours: 2, note: 'Newsletter template' },
];
