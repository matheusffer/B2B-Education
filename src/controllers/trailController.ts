import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const trailController = {
  // GET /api/trails
  list: async (req: Request, res: Response) => {
    try {
      const tenantId = req.tenantId; 
      if (!tenantId) return res.status(401).json({ error: 'Tenant context missing' });

      const trails = await prisma.trail.findMany({
        where: { tenantId },
        orderBy: { updatedAt: 'desc' },
        include: {
          category: true,
          // include other relevant relations as needed
        }
      });
      res.json(trails);
    } catch (error) {
      console.error('Error fetching trails:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  // GET /api/trails/:id
  getById: async (req: Request, res: Response) => {
    try {
      const tenantId = req.tenantId;
      const id = req.params.id;
      if (!tenantId) return res.status(401).json({ error: 'Tenant context missing' });

      // Including relations ported from knowledge-platform
      const trail = await prisma.trail.findUnique({
        where: { id, tenantId },
        include: {
          trailItems: {
            orderBy: { order: 'asc' },
            include: { content: true } // Assuming trail item uses content
          },
          modules: {
            orderBy: { order: 'asc' },
            include: { items: { orderBy: { order: 'asc' }, include: { content: true } } }
          },
          competencies: {
            include: { competency: true }
          },
          badgeTrails: {
            include: { badge: true }
          }
        }
      });
      
      if (!trail) return res.status(404).json({ error: 'Trail not found' });
      res.json(trail);
    } catch (error) {
      console.error('Error fetching trail details:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
};
