# Paperwing, as micro-frontends

Paperwing is a small invoicing and time-tracking app for freelancers, built in public on a YouTube channel. This repository is its frontend split into micro-frontends: a thin **shell** and two **remotes**, Invoices and Time, composed at runtime with Module Federation.

Three apps, three deployments, one product. Each remote also runs standalone.

```
apps/
  shell/        :3000  navigation, layout, routing, error isolation. Loads the remotes at runtime.
  invoices/     :3001  invoice list and status filters. Exposes ./App. Listens for time:logged.
  timesheets/   :3002  weekly timesheet. Exposes ./App. Emits time:logged.
packages/
  ui/           shared components and styles (build-time package, versioned)
  events/       typed event bus with replay (build-time package; the contract between remotes)
```

## Run it

```
npm install
npm run dev        # shell on :3000, invoices on :3001, time on :3002
```

Open http://localhost:3000. Click Time, log two hours, click Invoices: the "Unbilled hours" counter includes them. Open http://localhost:3002 to see the Time remote running on its own.

To watch Module Federation load code across the network with clean request names, use the production build:

```
npm run build
npm run preview    # same ports, built bundles, remoteEntry.js visible in the Network tab
```

To show failure isolation, run the three apps in separate terminal panes (`npm run preview:shell`, `npm run preview:invoices`, `npm run preview:time`), stop the Time one with Ctrl+C, reload the shell and click Time: the Time section shows a fallback, the rest of the app keeps working.

## How it fits together

- **Shell declares remotes by URL** in `apps/shell/vite.config.ts`. In development they point at the remotes' dev servers. In production set `VITE_INVOICES_URL` and `VITE_TIMESHEETS_URL` to the deployed `remoteEntry.js` files (see `apps/shell/.env.example`).
- **Routes are lazy imports.** `apps/shell/src/routes/InvoicesRoute.tsx` does `lazy(() => import('invoices/App'))`. To React it is an ordinary lazy component.
- **One error boundary per remote.** `apps/shell/src/RemoteBoundary.tsx` turns a failed remote into one broken section instead of a blank page.
- **Shared singletons.** React, React DOM and React Router are declared `singleton` in every federation config, so the browser loads one copy.
- **Events, not imports.** `packages/events` is a typed wrapper over window events. Time emits `time:logged`; Invoices subscribes with `replay: true` so it catches up if it mounts later. Neither remote imports the other. The event name and payload type are the only contract.

## Three channels for sharing, and when to use each

| Channel | Use for | Example here |
|---|---|---|
| Build-time packages | Code every team consumes and upgrades on its own schedule | `packages/ui`, `packages/events` |
| Runtime shared singletons | Frameworks that must exist once per page | React, React DOM, React Router |
| Runtime events | Cross-domain state changes | `time:logged` |

Never share a store across remotes. The moment two teams share one store, you have a monolith with extra steps.

## Deploy

Each app builds to its own `dist/` and deploys as its own static site. Deploy the remotes first, then set the shell's `VITE_*_URL` variables to their `remoteEntry.js` URLs and build the shell. Remotes need CORS enabled for the shell's origin.

## License

MIT
