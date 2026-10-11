import type { ReactNode } from 'react';
export function Table({ head, children }: { head: string[]; children: ReactNode }) {
  return (
    <div className="pw-table-wrap">
      <table className="pw-table">
        <thead><tr>{head.map((h) => <th key={h}>{h}</th>)}</tr></thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}
