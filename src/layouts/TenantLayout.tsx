import React from 'react';
import { Outlet } from 'react-router-dom';
import { useTenant } from '../contexts/TenantContext';
import { Loader2, Menu, Bell, User, BookOpen, LayoutDashboard, GraduationCap } from 'lucide-react';

export default function TenantLayout() {
  const { tenant, loading, error } = useTenant();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (error || !tenant) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="p-4 bg-red-50 text-red-600 rounded-lg shadow border border-red-100">
          Erro ao carregar o Tenant: {error || 'Tenant não encontrado'}
        </div>
      </div>
    );
  }

  // Extrai as configurações visuais (White-label)
  const visualSettings = tenant.visualSettings;
  const primaryColor = visualSettings?.primary_color || '#3B82F6'; // Fallback azul
  const secondaryColor = visualSettings?.secondary_color || '#1E40AF';
  const fontFamily = visualSettings?.font_family || 'Inter, sans-serif';

  // Injeta as variáveis CSS no DOM
  const customStyles = {
    '--color-primary': primaryColor,
    '--color-secondary': secondaryColor,
    fontFamily: fontFamily,
  } as React.CSSProperties;

  return (
    <div style={customStyles} className="min-h-screen flex bg-gray-50 text-gray-900 font-sans">
      {/* Sidebar Lateral */}
      <aside className="w-64 bg-[var(--color-primary)] text-white flex flex-col shadow-xl hidden md:flex">
        <div className="h-16 flex items-center px-6 border-b border-white/10">
          {tenant.logoUrl ? (
            <img src={tenant.logoUrl} alt={tenant.name} className="h-8 max-w-full object-contain" />
          ) : (
            <span className="text-xl font-bold truncate tracking-tight">{tenant.name}</span>
          )}
        </div>
        
        <nav className="flex-1 py-6 px-3 space-y-2">
          <a href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-white/10 font-medium transition-colors">
            <LayoutDashboard className="w-5 h-5 opacity-80" />
            Dashboard
          </a>
          <a href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/5 font-medium transition-colors">
            <BookOpen className="w-5 h-5 opacity-80" />
            Cursos
          </a>
          <a href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/5 font-medium transition-colors">
            <GraduationCap className="w-5 h-5 opacity-80" />
            Trilhas
          </a>
        </nav>
      </aside>

      {/* Área Principal */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header Superior */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shadow-sm z-10">
          <div className="flex items-center gap-4">
            <button className="text-gray-500 hover:text-gray-700 md:hidden">
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-semibold text-gray-800 hidden sm:block">
              Plataforma de Conhecimento
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="text-gray-400 hover:text-gray-600 transition-colors">
              <Bell className="w-5 h-5" />
            </button>
            <div className="w-9 h-9 rounded-full bg-[var(--color-primary)] flex items-center justify-center text-white shadow-sm cursor-pointer hover:opacity-90 transition-opacity">
              <User className="w-5 h-5" />
            </div>
          </div>
        </header>

        {/* Conteúdo da Página (Injetado via React Router) */}
        <main className="flex-1 overflow-auto p-6 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
