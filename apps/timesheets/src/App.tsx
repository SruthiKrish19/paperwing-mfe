import { Route, Routes } from 'react-router-dom';
import { Timesheet } from './pages/Timesheet';

// Exposed over Module Federation as "timesheets/App". Mounted by the shell under /time/*.
export default function App() {
  return (
    <Routes>
      <Route index element={<Timesheet />} />
      <Route path="*" element={<Timesheet />} />
    </Routes>
  );
}
