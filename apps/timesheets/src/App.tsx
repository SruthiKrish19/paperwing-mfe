import { Route, Routes } from 'react-router-dom';
import { Timesheet } from './pages/Timesheet';

// Video 5, mistake 4: opt-in reproduction of a global CSS leak. Never on in a real build.
if (import.meta.env.VITE_LEAK === '1') import('./leak.css');

// Exposed over Module Federation as "timesheets/App". Mounted by the shell under /time/*.
export default function App() {
  return (
    <Routes>
      <Route index element={<Timesheet />} />
      <Route path="*" element={<Timesheet />} />
    </Routes>
  );
}
