import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const quizController = {
  // GET /api/quizzes/:id
  getById: async (req: Request, res: Response) => {
    try {
      const tenantId = req.tenantId;
      const id = req.params.id;
      if (!tenantId) return res.status(401).json({ error: 'Tenant context missing' });

      const quiz = await prisma.quiz.findUnique({
        where: { id, tenantId },
        include: {
          questions: {
            orderBy: { order: 'asc' },
            include: { options: { orderBy: { order: 'asc' } } }
          }
        }
      });
      
      if (!quiz) return res.status(404).json({ error: 'Quiz not found' });
      res.json(quiz);
    } catch (error) {
      console.error('Error fetching quiz details:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  // POST /api/quizzes/:id/attempts
  submitAttempt: async (req: Request, res: Response) => {
    try {
      const tenantId = req.tenantId;
      const quizId = req.params.id;
      const { answers } = req.body; // Array of { questionId, selectedOptionId }
      
      if (!tenantId) return res.status(401).json({ error: 'Tenant context missing' });
      
      // In B2B, ensure we have the user
      const userId = (req as any).user?.id;
      if (!userId) return res.status(401).json({ error: 'User context missing' });

      // Calculate score etc... For now just save attempt
      const attempt = await prisma.quizAttempt.create({
        data: {
          tenantId,
          quizId,
          userId,
          score: 0,
          passed: false,
          startedAt: new Date(),
          completedAt: new Date(),
          answers: {
            create: answers.map((a: any) => ({
              tenantId,
              questionId: a.questionId,
              selectedOptionId: a.selectedOptionId
            }))
          }
        }
      });

      res.status(201).json({ success: true, attempt });
    } catch (error) {
      console.error('Error submitting quiz attempt:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
};
