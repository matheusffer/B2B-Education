import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { Tenant } from '@prisma/client';

// Estendendo a tipagem global do Express para incluir o tenantId e o tenant
declare global {
  namespace Express {
    interface Request {
      tenantId?: string;
      tenant?: Tenant;
    }
  }
}

export const tenantMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // 1. Extração do subdomínio
    // Priorizamos um header customizado para facilitar testes no ambiente de desenvolvimento/Postman
    let subdomain = req.headers['x-tenant-subdomain'] as string;

    // Se não houver header, tentamos extrair do hostname (ex: tenant1.dominio.com)
    if (!subdomain) {
      const hostname = req.hostname;
      const parts = hostname.split('.');
      
      // Lógica básica: se tiver mais de um nível e não for www, assumimos o primeiro como subdomínio
      if (parts.length >= 2 && parts[0] !== 'www') {
        subdomain = parts[0];
      }
    }

    // Se ainda assim não identificarmos o subdomínio, barramos a requisição
    if (!subdomain) {
      res.status(400).json({ 
        error: 'Subdomain not provided.',
        message: 'Acesso negado. É necessário acessar via subdomínio válido ou enviar o header x-tenant-subdomain.'
      });
      return;
    }

    // 2. Busca do Tenant no banco de dados
    const tenant = await prisma.tenant.findUnique({
      where: { subdomain }
    });

    // 3. Validações de existência e status
    if (!tenant) {
      res.status(404).json({ error: `Tenant '${subdomain}' not found.` });
      return;
    }

    if (!tenant.active) {
      res.status(403).json({ error: 'Tenant is currently inactive. Please contact support.' });
      return;
    }

    // 4. Injeção no contexto da requisição (req)
    req.tenantId = tenant.id;
    req.tenant = tenant;

    // 5. Segue o fluxo
    next();
  } catch (error) {
    console.error('[TenantMiddleware] Error resolving tenant:', error);
    res.status(500).json({ error: 'Internal server error during tenant resolution.' });
  }
};
