export function Stat({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="pw-stat">
      <div className="pw-stat-label">{label}</div>
      <div className="pw-stat-value">{value}</div>
      {hint && <div className="pw-stat-hint">{hint}</div>}
    </div>
  );
}
