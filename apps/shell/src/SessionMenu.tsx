import { signIn, signOut, useSession } from '@paperwing/session';

// The shell owns sign-in and sign-out. In a real app this is the OAuth redirect and the
// token exchange; here it is one demo user. Remotes never call these.
const demoUser = { id: 'u_ada', name: 'Ada Okafor', plan: 'pro' as const };

export function SessionMenu() {
  const { user } = useSession();
  if (!user) return <button className="pw-btn pw-btn-primary" id="signin" onClick={() => signIn(demoUser, 'demo-token-' + Date.now())}>Sign in</button>;
  return (
    <span className="pw-session">
      <span className="pw-avatar">{user.name.split(' ').map((p) => p[0]).join('')}</span>
      <span>{user.name} <span className="pw-badge pw-badge-info">{user.plan}</span></span>
      <button className="pw-btn pw-btn-ghost" id="signout" onClick={signOut}>Sign out</button>
    </span>
  );
}
