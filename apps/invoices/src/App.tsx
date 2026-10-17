import { Route, Routes } from 'react-router-dom';
import { FlagsProvider } from '@paperwing/flags';
import { useSession } from '@paperwing/session';
import { InvoiceList } from './pages/InvoiceList';

// Flags are evaluated per user. The user comes from the session the shell owns; ?user= stays as a
// demo override for the feature-flags video.
const override = new URLSearchParams(window.location.search).get('user');

// Exposed over Module Federation as "invoices/App". Mounted by the shell under /invoices/*,
// so routes here are relative. Standalone mode (main.tsx) wraps it in its own router.
export default function App() {
  const { user } = useSession();
  const userId = override ?? user?.id ?? 'anonymous';
  return (
    <FlagsProvider url="/flags.json" userId={userId} pollMs={2000}>
      <Routes>
        <Route index element={<InvoiceList />} />
        <Route path="*" element={<InvoiceList />} />
      </Routes>
    </FlagsProvider>
  );
}
