import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { TenantProvider } from './contexts/TenantContext';
import TenantLayout from './layouts/TenantLayout';
import ContentPlayer from './pages/ContentPlayer';
import AdminPanel from './pages/AdminPanel';
import Dashboard from './pages/Dashboard';
import Trails from './pages/Trails';
import Knowledge from './pages/Knowledge';
import Settings from './pages/Settings';

export default function App() {
  return (
    <TenantProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<TenantLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="player" element={<ContentPlayer />} />
            <Route path="admin" element={<AdminPanel />} />
            <Route path="trilhas" element={<Trails />} />
            <Route path="conhecimento" element={<Knowledge />} />
            <Route path="configuracoes" element={<Settings />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </TenantProvider>
  );
}
