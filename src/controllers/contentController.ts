import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { enqueueMetadataExtraction } from '../services/metadataQueue';
import { ContentType } from '@prisma/client';

export const createContent = async (req: Request, res: Response): Promise<void> => {
  try {
    const tenantId = req.tenantId;
    
    if (!tenantId) {
      res.status(401).json({ error: 'Unauthorized: Tenant not identified.' });
      return;
    }

    const { title, type, url, categoryId } = req.body;

    if (!title || !type || !url) {
      res.status(400).json({ error: 'Missing required fields: title, type, url.' });
      return;
    }

    // 1. Cria o payload inicial com duração 0 (ou null)
    const initialPayload = {
      url,
      duration: 0
    };

    // 2. Salva o conteúdo no banco de dados (rápido, sem bloquear)
    const content = await prisma.content.create({
      data: {
        tenantId,
        title,
        type: type as ContentType,
        categoryId,
        payload: initialPayload
      }
    });

    // 3. Enfileira o processamento assíncrono (In-Memory Queue)
    enqueueMetadataExtraction(content.id, tenantId, url, type);

    // 4. Retorna 202 Accepted imediatamente para o cliente
    res.status(202).json({
      success: true,
      message: 'Content created successfully. Metadata extraction is running in the background.',
      data: content
    });

  } catch (error) {
    console.error('[ContentController] Error creating content:', error);
    res.status(500).json({ error: 'Internal server error while creating content.' });
  }
};
