export type Row = { id: string; number: string; client: string; totalCents: number; taxCents: number; status: 'draft' | 'sent' | 'paid' | 'overdue' };
const clients = ['Northwind Studio', 'Harbor & Vale', 'Pinecone Press', 'Juniper Labs', 'Oakline Co', 'Meridian Audio'];
const statuses: Row['status'][] = ['draft', 'sent', 'paid', 'overdue'];
// Deterministic pseudo-random rows so before/after render identical data.
export function makeRows(n: number): Row[] {
  let seed = 42; const rnd = () => (seed = (seed * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff;
  return Array.from({ length: n }, (_, i) => {
    const total = Math.round(20000 + rnd() * 480000);
    return { id: `inv_${i}`, number: `PW-${String(1000 + i).padStart(4, '0')}`, client: clients[Math.floor(rnd() * clients.length)], totalCents: total, taxCents: Math.round(total * 0.18), status: statuses[Math.floor(rnd() * 4)] };
  });
}
