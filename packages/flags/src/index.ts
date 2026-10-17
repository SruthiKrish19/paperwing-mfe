// Feature flags: a runtime if-statement controlled from outside the deploy.
// No SDK, no account. The config is a JSON file the app polls. Swap `fetch` for a
// provider's SDK later; the rules and the hook stay the same.
export { bucket, evaluate } from './evaluate';
export type { Decision, FlagConfig, FlagRule } from './evaluate';
export { FlagsProvider, useFlag, useFlags } from './react';
