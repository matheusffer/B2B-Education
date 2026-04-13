import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { tenantMiddleware } from './middlewares/tenantMiddleware';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middlewares globais
  app.use(express.json());

  // ==========================================
  // API ROUTES
  // ==========================================
  const apiRouter = express.Router();

  // Rota de Health Check (Não exige Tenant)
  apiRouter.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Aplica o TenantMiddleware em todas as rotas abaixo desta linha
  apiRouter.use(tenantMiddleware);

  // Rota de teste para validar a injeção do Tenant
  apiRouter.get('/tenant-info', (req, res) => {
    res.json({
      success: true,
      message: 'Tenant successfully identified and injected!',
      data: {
        tenantId: req.tenantId,
        name: req.tenant?.name,
        subdomain: req.tenant?.subdomain,
        visualSettings: req.tenant?.visualSettings
      }
    });
  });

  // Monta o router da API no prefixo /api
  app.use('/api', apiRouter);

  // ==========================================
  // VITE MIDDLEWARE (Frontend)
  // ==========================================
  if (process.env.NODE_ENV !== 'production') {
    // Modo de Desenvolvimento: Integra o Vite ao Express
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Modo de Produção: Serve os arquivos estáticos do build
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  // Inicialização do Servidor
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Error starting server:', err);
});
