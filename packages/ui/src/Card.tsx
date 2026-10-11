import type { ReactNode } from 'react';
export function Card({ title, actions, children }: { title?: string; actions?: ReactNode; children: ReactNode }) {
  return (
    <section className="pw-card">
      {(title || actions) && (
        <header className="pw-card-head">
          {title && <h2>{title}</h2>}
          {actions && <div className="pw-card-actions">{actions}</div>}
        </header>
      )}
      {children}
    </section>
  );
}
