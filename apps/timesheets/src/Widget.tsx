import { useState } from 'react';
import { Button, Stat } from '@paperwing/ui';

// Exposed over Module Federation as "timesheets/Widget": the Reports team's unbilled-hours card,
// rendered inside the shell with the shell's React and the shared UI package.
export default function Widget({ initialHours = 11.5 }: { initialHours?: number }) {
  const [hours, setHours] = useState(initialHours);
  return (
    <div style={{ display: 'grid', gap: 12, width: 300 }}>
      <Stat label="Unbilled hours" value={`${hours}h`} hint="rendered by the Reports team · one React" />
      <Button onClick={() => setHours((h) => Math.round((h + 1) * 10) / 10)}>Log 1h</Button>
    </div>
  );
}
