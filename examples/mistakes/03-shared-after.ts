// FIX: one React, loaded once, version-checked at runtime.
// This is the block every app in Paperwing uses (apps/*/vite.config.ts).

export const shared = {
  react:              { singleton: true, requiredVersion: '^18.3.0' },
  'react-dom':        { singleton: true, requiredVersion: '^18.3.0' },
  'react-router-dom': { singleton: true, requiredVersion: '^6.0.0' },
};
// singleton: true  -> the first loaded copy is reused by everyone
// requiredVersion  -> a remote built against React 19 fails loudly, with a message,
//                     instead of rendering with the wrong copy
