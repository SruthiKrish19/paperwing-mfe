export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue';
export type Invoice = { id: string; number: string; clientId: string; clientName: string; issued: string; due: string; totalCents: number; status: InvoiceStatus };

export const clients = [
  { id: 'c1', name: 'Northwind Studio' },
  { id: 'c2', name: 'Harbor & Vale' },
  { id: 'c3', name: 'Pinecone Press' },
];

export const invoices: Invoice[] = [
  { id: 'i1', number: 'PW-0042', clientId: 'c1', clientName: 'Northwind Studio', issued: '2026-09-02', due: '2026-09-16', totalCents: 184000, status: 'paid' },
  { id: 'i2', number: 'PW-0043', clientId: 'c2', clientName: 'Harbor & Vale', issued: '2026-09-09', due: '2026-09-23', totalCents: 262500, status: 'overdue' },
  { id: 'i3', number: 'PW-0044', clientId: 'c3', clientName: 'Pinecone Press', issued: '2026-09-18', due: '2026-10-02', totalCents: 97500, status: 'paid' },
  { id: 'i4', number: 'PW-0045', clientId: 'c1', clientName: 'Northwind Studio', issued: '2026-09-30', due: '2026-10-14', totalCents: 310000, status: 'sent' },
  { id: 'i5', number: 'PW-0046', clientId: 'c2', clientName: 'Harbor & Vale', issued: '2026-10-07', due: '2026-10-21', totalCents: 148000, status: 'sent' },
  { id: 'i6', number: 'PW-0047', clientId: 'c3', clientName: 'Pinecone Press', issued: '2026-10-10', due: '2026-10-24', totalCents: 56000, status: 'draft' },
];

// Hours logged this week that are not on any invoice yet. The Time remote adds to this at runtime.
export const unbilledHoursAtStart = 11.5;
