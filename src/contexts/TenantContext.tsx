import React, { createContext, useContext, useEffect, useState } from 'react';

interface VisualSettings {
  primary_color: string;
  secondary_color: string;
  font_family: string;
}

interface TenantData {
  tenantId: string;
  name: string;
  subdomain: string;
  logoUrl: string | null;
  visualSettings: VisualSettings | null;
}

interface TenantContextType {
  tenant: TenantData | null;
  loading: boolean;
  error: string | null;
  updateVisualSettings: (settings: Partial<VisualSettings>) => void;
}

const TenantContext = createContext<TenantContextType>({ 
  tenant: null, 
  loading: true, 
  error: null,
  updateVisualSettings: () => {} 
});

export const TenantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tenant, setTenant] = useState<TenantData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const updateVisualSettings = (newSettings: Partial<VisualSettings>) => {
    setTenant(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        visualSettings: {
          ...prev.visualSettings,
          ...newSettings
        } as VisualSettings
      };
    });
  };

  useEffect(() => {
    // Busca as informações do Tenant injetadas pelo backend (Global Props)
    fetch('/api/tenant-info')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch tenant info');
        return res.json();
      })
      .then(data => {
        if (data.success) {
          let parsedSettings = data.data.visualSettings;
          if (typeof parsedSettings === 'string') {
            try { parsedSettings = JSON.parse(parsedSettings); } catch (e) {}
          }
          setTenant({ ...data.data, visualSettings: parsedSettings });
        } else {
          throw new Error(data.message || 'Unknown error');
        }
      })
      .catch(err => {
        console.warn('Usando Tenant de fallback devido a erro na API:', err.message);
        // Fallback visual para o ambiente de desenvolvimento (quando o banco de dados não está conectado)
        setTenant({
          tenantId: 'dev-tenant-123',
          name: 'B2B Education (Dev Mode)',
          subdomain: 'dev',
          logoUrl: null,
          visualSettings: {
            primary_color: '#4F46E5', // Indigo 600
            secondary_color: '#312E81', // Indigo 900
            font_family: 'Inter, sans-serif'
          }
        });
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <TenantContext.Provider value={{ tenant, loading, error, updateVisualSettings }}>
      {children}
    </TenantContext.Provider>
  );
};

export const useTenant = () => useContext(TenantContext);
