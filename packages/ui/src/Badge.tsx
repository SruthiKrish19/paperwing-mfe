export type Tone = 'neutral' | 'info' | 'success' | 'warning' | 'danger';
export function Badge({ tone = 'neutral', children }: { tone?: Tone; children: string }) {
  return <span className={`pw-badge pw-badge-${tone}`}>{children}</span>;
}
