import { EventEmitter } from 'events';
import { PrismaClient } from '@prisma/client';
import { extractDurationFromUrl } from './extractorService';

const prisma = new PrismaClient();

// Criação de um EventEmitter para atuar como nossa fila em memória (In-Memory Queue)
class MetadataQueue extends EventEmitter {}
export const metadataQueue = new MetadataQueue();

// Worker que escuta o evento 'processContent'
metadataQueue.on('processContent', async ({ contentId, tenantId, url, type }) => {
  try {
    console.log(`[MetadataQueue] ⏳ Iniciando processamento em background para o conteúdo: ${contentId} (Tenant: ${tenantId})`);
    
    // 1. Extrai a duração (simulação de I/O pesado)
    const calculatedDuration = await extractDurationFromUrl(url, type);
    
    if (calculatedDuration <= 0) {
      console.warn(`[MetadataQueue] ⚠️ Duração calculada inválida ou zero. Abortando atualização.`);
      return;
    }

    // 2. Busca o conteúdo atualizado no banco (Isolamento por Tenant)
    const content = await prisma.content.findUnique({
      where: { 
        id: contentId,
        tenantId: tenantId // Garantia de segurança multi-tenant
      }
    });

    if (!content) {
      console.warn(`[MetadataQueue] ⚠️ Conteúdo ${contentId} não encontrado no tenant ${tenantId}. Abortando.`);
      return;
    }

    // O payload é do tipo JsonValue no Prisma, fazemos o cast para manipular
    const payload = (content.payload as Record<string, any>) || {};

    // 3. Regra de Negócio Crítica: Anti-Sobrescrita
    // Se a duração já for maior que 0 (seja no campo duration ou estimateTime), 
    // significa que um humano editou manualmente enquanto o job rodava.
    const currentDuration = payload.duration || payload.estimateTime;
    
    if (currentDuration && typeof currentDuration === 'number' && currentDuration > 0) {
      console.log(`[MetadataQueue] 🛑 Conteúdo ${contentId} já possui duração manual (${currentDuration} min). Abortando silenciosamente.`);
      return;
    }

    // 4. Atualiza o conteúdo com o novo metadado
    const updatedPayload = {
      ...payload,
      duration: calculatedDuration,
      estimateTime: calculatedDuration // Mantendo compatibilidade com o frontend atual
    };

    await prisma.content.update({
      where: { 
        id: contentId,
        tenantId: tenantId 
      },
      data: { payload: updatedPayload }
    });

    console.log(`[MetadataQueue] ✅ Sucesso! Duração de ${calculatedDuration} min salva para o conteúdo ${contentId}.`);
  } catch (error) {
    // Tratamento de erro robusto para não derrubar o Node.js
    console.error(`[MetadataQueue] ❌ Erro não tratado ao processar o conteúdo ${contentId}:`, error);
  }
});

/**
 * Função helper para enfileirar o job de extração de metadados.
 */
export const enqueueMetadataExtraction = (contentId: string, tenantId: string, url: string, type: string) => {
  metadataQueue.emit('processContent', { contentId, tenantId, url, type });
};
