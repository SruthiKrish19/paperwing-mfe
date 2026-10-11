import { Route, Routes } from 'react-router-dom';
import { InvoiceList } from './pages/InvoiceList';

// Exposed over Module Federation as "invoices/App". Mounted by the shell under /invoices/*,
// so routes here are relative. Standalone mode (main.tsx) wraps it in its own router.
export default function App() {
  return (
    <Routes>
      <Route index element={<InvoiceList />} />
      <Route path="*" element={<InvoiceList />} />
    </Routes>
  );
}
