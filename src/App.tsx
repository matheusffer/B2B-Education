import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { TenantProvider } from './contexts/TenantContext';
import TenantLayout from './layouts/TenantLayout';

function Dashboard() {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 max-w-4xl">
      <h2 className="text-3xl font-bold mb-4 tracking-tight text-gray-900">Bem-vindo ao Dashboard</h2>
      <p className="text-gray-600 text-lg leading-relaxed">
        O layout White-label foi carregado com sucesso. As cores e fontes foram injetadas dinamicamente com base nas configurações do seu Tenant.
      </p>
      
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-xl bg-gray-50 border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-2">Trilhas Ativas</h3>
          <p className="text-3xl font-bold text-[var(--color-primary)]">12</p>
        </div>
        <div className="p-6 rounded-xl bg-gray-50 border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-2">Cursos Concluídos</h3>
          <p className="text-3xl font-bold text-[var(--color-primary)]">4</p>
        </div>
        <div className="p-6 rounded-xl bg-gray-50 border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-2">Certificados</h3>
          <p className="text-3xl font-bold text-[var(--color-primary)]">2</p>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <TenantProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<TenantLayout />}>
            <Route index element={<Dashboard />} />
            {/* Futuras rotas: /courses, /trails, etc */}
          </Route>
        </Routes>
      </BrowserRouter>
    </TenantProvider>
  );
}
