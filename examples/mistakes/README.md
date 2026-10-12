# Seven micro-frontend mistakes (video 5)

Companion files for the video. Each mistake is either reproduced in the Paperwing apps or shown as a before/after pair here.

| # | Mistake | Where |
|---|---------|-------|
| 1 | Splitting by component instead of by team or domain | diagram only |
| 2 | Sharing state through window globals | `02-globals-before.ts` → `02-globals-after.ts` (uses `packages/events`) |
| 3 | React not shared as a singleton | `03-shared-before.ts` → `03-shared-after.ts` |
| 4 | Global CSS that leaks between remotes | `apps/timesheets/src/leak.css`, enabled with `VITE_LEAK=1 npm run build -w apps/timesheets`; fix in `Timesheet.module.css` |
| 5 | No error boundary around remotes | `apps/shell/src/RemoteBoundary.tsx` |
| 6 | No contract between remotes | `06-contract.test.ts`, run with `node --test examples/mistakes/06-contract.test.ts` |
| 7 | Deploying everything in lockstep | diagram only; the real fix is `apps/shell/.env.production.example` (remotes are URLs, not build inputs) |
