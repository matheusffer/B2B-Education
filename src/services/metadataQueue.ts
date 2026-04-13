import { EventEmitter } from 'events';
import { prisma } from '../lib/prisma';
import { extractDurationFromUrl } from './extractorService';

// Criação de um EventEmitter para atuar como nossa fila em memória (In-Memory Queue)
class MetadataQueue extends EventEmitter {}
export const metadataQueue = new MetadataQueue();

// Worker que escuta o evento 'processContent'
metadataQueue.on('processContent', async ({ contentId, tenantId, url, type }) => {
  try {
    console.log(`[MetadataQueue] ⏳ Iniciando processamento em background para o conteúdo: ${contentId}`);
    
    // 1. Extrai a duração (simulação de I/O pesado)
    const calculatedDuration = await extractDurationFromUrl(url, type);
    
    // 2. Busca o conteúdo atualizado no banco (Regra Anti-Sobrescrita)
    const content = await prisma.content.findUnique({
      where: { id: contentId }
    });

    if (!content) {
      console.warn(`[MetadataQueue] ⚠️ Conteúdo ${contentId} não encontrado. Abortando.`);
      return;
    }

    // O payload é do tipo JsonValue no Prisma, fazemos o cast para manipular
    const payload = (content.payload as Record<string, any>) || {};

    // 3. Regra de Negócio: Anti-Sobrescrita
    // Se a duração já for maior que 0, significa que um humano editou manualmente enquanto o job rodava.
    if (payload.duration && typeof payload.duration === 'number' && payload.duration > 0) {
      console.log(`[MetadataQueue] 🛑 Conteúdo ${contentId} já possui duração manual (${payload.duration} min). Abortando silenciosamente.`);
      return;
    }

    // 4. Atualiza o conteúdo com o novo metadado
    const updatedPayload = {
      ...payload,
      duration: calculatedDuration
    };

    await prisma.content.update({
      where: { id: contentId },
      data: { payload: updatedPayload }
    });

    console.log(`[MetadataQueue] ✅ Sucesso! Duração de ${calculatedDuration} min salva para o conteúdo ${contentId}.`);
  } catch (error) {
    console.error(`[MetadataQueue] ❌ Erro ao processar o conteúdo ${contentId}:`, error);
  }
});

/**
 * Função helper para enfileirar o job de extração de metadados.
 */
export const enqueueMetadataExtraction = (contentId: string, tenantId: string, url: string, type: string) => {
  metadataQueue.emit('processContent', { contentId, tenantId, url, type });
};
