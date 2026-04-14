import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

export const certificateController = {
  // POST /api/certificates/issue
  issue: async (req: Request, res: Response): Promise<void> => {
    try {
      const tenantId = req.tenantId;
      
      // Segurança Base: Validação do Tenant
      if (!tenantId) {
        res.status(401).json({ error: 'Unauthorized: Tenant context missing.' });
        return;
      }

      const { userId, trailId } = req.body;

      if (!userId || !trailId) {
        res.status(400).json({ error: 'Missing required fields: userId and trailId.' });
        return;
      }

      // Regra 1: Verificação de Progresso
      const enrollment = await prisma.trailEnrollment.findUnique({
        where: {
          userId_trailId: {
            userId,
            trailId,
          }
        },
        include: {
          user: true,
          trail: true,
        }
      });

      // Valida se a matrícula existe e pertence ao mesmo tenant
      if (!enrollment || enrollment.tenantId !== tenantId) {
        res.status(404).json({ error: 'Enrollment not found or does not belong to this tenant.' });
        return;
      }

      // Valida se o progresso é 100% ou o status é COMPLETED
      if (enrollment.progressPercent < 100 && enrollment.status !== 'COMPLETED') {
        res.status(403).json({ 
          error: 'Certificate cannot be issued. Trail is not fully completed.',
          currentProgress: enrollment.progressPercent
        });
        return;
      }

      // Regra 2: Verificação de Duplicidade
      let certificate = await prisma.certificate.findFirst({
        where: {
          tenantId,
          userId,
          trailId,
        },
        include: {
          user: { select: { name: true } },
          trail: { select: { title: true, workloadHours: true } }
        }
      });

      // Se já existe, retorna o existente (HTTP 200)
      if (certificate) {
        res.status(200).json({
          success: true,
          message: 'Certificate already exists.',
          data: {
            id: certificate.id,
            studentName: certificate.user.name,
            trailTitle: certificate.trail.title,
            workloadHours: certificate.trail.workloadHours,
            validationCode: certificate.code,
            issuedAt: certificate.issuedAt,
          }
        });
        return;
      }

      // Emissão: Cria um novo certificado
      // Gera um código único (Ex: 8A4F-9B2C)
      const uniqueCode = crypto.randomBytes(4).toString('hex').toUpperCase() + '-' + crypto.randomBytes(4).toString('hex').toUpperCase();

      certificate = await prisma.certificate.create({
        data: {
          tenantId,
          userId,
          trailId,
          code: uniqueCode,
          issuedAt: new Date(),
        },
        include: {
          user: { select: { name: true } },
          trail: { select: { title: true, workloadHours: true } }
        }
      });

      // Retorno: Dados formatados para o frontend (HTTP 201)
      res.status(201).json({
        success: true,
        message: 'Certificate issued successfully.',
        data: {
          id: certificate.id,
          studentName: certificate.user.name,
          trailTitle: certificate.trail.title,
          workloadHours: certificate.trail.workloadHours,
          validationCode: certificate.code,
          issuedAt: certificate.issuedAt,
        }
      });

    } catch (error) {
      console.error('[CertificateController] Error issuing certificate:', error);
      res.status(500).json({ error: 'Internal server error while issuing certificate.' });
    }
  }
};
