import { Route, Routes } from 'react-router-dom';
import { FlagsProvider } from '@paperwing/flags';
import { InvoiceList } from './pages/InvoiceList';

// Who is signed in. The shell would normally provide this; ?user= lets the demo switch people.
const userId = new URLSearchParams(window.location.search).get('user') ?? 'you';

// Exposed over Module Federation as "invoices/App". Mounted by the shell under /invoices/*,
// so routes here are relative. Standalone mode (main.tsx) wraps it in its own router.
export default function App() {
  return (
    <FlagsProvider url="/flags.json" userId={userId} pollMs={2000}>
      <Routes>
        <Route index element={<InvoiceList />} />
        <Route path="*" element={<InvoiceList />} />
      </Routes>
    </FlagsProvider>
  );
}
