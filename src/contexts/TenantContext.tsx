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
}

const TenantContext = createContext<TenantContextType>({ tenant: null, loading: true, error: null });

export const TenantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tenant, setTenant] = useState<TenantData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Busca as informações do Tenant injetadas pelo backend (Global Props)
    fetch('/api/tenant-info')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch tenant info');
        return res.json();
      })
      .then(data => {
        if (data.success) {
          // O Prisma retorna o JSON como string ou objeto dependendo do driver.
          // Vamos garantir que seja parseado corretamente.
          let parsedSettings = data.data.visualSettings;
          if (typeof parsedSettings === 'string') {
            try { parsedSettings = JSON.parse(parsedSettings); } catch (e) {}
          }
          setTenant({ ...data.data, visualSettings: parsedSettings });
        } else {
          throw new Error(data.message || 'Unknown error');
        }
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <TenantContext.Provider value={{ tenant, loading, error }}>
      {children}
    </TenantContext.Provider>
  );
};

export const useTenant = () => useContext(TenantContext);
