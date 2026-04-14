import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { enqueueMetadataExtraction } from '../services/metadataQueue';

const prisma = new PrismaClient();

export const courseController = {
  // GET /api/courses
  list: async (req: Request, res: Response) => {
    try {
      const tenantId = req.tenantId; // Injected by tenantMiddleware
      if (!tenantId) {
        return res.status(401).json({ error: 'Tenant context missing' });
      }

      const courses = await prisma.content.findMany({
        where: { tenantId, type: 'VIDEO' }, // mapping "link" back to "VIDEO" based on enum
        orderBy: { updatedAt: 'desc' }
      });
      res.json(courses);
    } catch (error) {
      console.error('Error fetching courses:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  // POST /api/courses
  create: async (req: Request, res: Response) => {
    try {
      const tenantId = req.tenantId;
      const { title, description, link, estimateTime } = req.body;

      if (!title || !link) {
        return res.status(400).json({ error: 'Title and link are required' });
      }

      // We assume user is attached to req, or we use a system user / placeholder for authorId
      // In B2B-Education we need authorId if we have one. Let's assume req.user.id exists
      const authorId = (req as any).user?.id || 'system';

      // Prisma requires us to handle payload
      const course = await prisma.content.create({
        data: {
          tenantId,
          title,
          type: 'VIDEO',
          payload: {
            description,
            link,
            estimateTime: estimateTime || 0 // Inicializa com 0 para a fila processar
          }
        }
      });

      // Enfileira o processamento assíncrono (In-Memory Queue)
      enqueueMetadataExtraction(course.id, tenantId, link, 'VIDEO');

      res.status(201).json({ success: true, course });
    } catch (error) {
      console.error('Error creating course:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
};
