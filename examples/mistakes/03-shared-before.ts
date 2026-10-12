// MISTAKE 3: React is not declared as a shared singleton.
// Each remote bundles and runs its own React. Hooks from one copy inside a tree
// rendered by another copy fail with "Invalid hook call".

export const sharedBefore = {
  // nothing shared: three remotes, three Reacts, three copies of context
};

export const sharedAlmost = {
  // shared, but not a singleton: two versions on the page can still both load
  react: { requiredVersion: '^18.3.0' },
  'react-dom': { requiredVersion: '^18.3.0' },
};
