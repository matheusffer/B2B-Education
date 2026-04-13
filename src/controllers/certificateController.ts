import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import crypto from 'crypto';

export const issueCertificate = async (req: Request, res: Response): Promise<void> => {
  try {
    const tenantId = req.tenantId;
    
    // 1. Verificação de Segurança do Tenant
    if (!tenantId) {
      res.status(401).json({ error: 'Unauthorized: Tenant not identified in the request context.' });
      return;
    }

    const { userId, trailId } = req.body;

    if (!userId || !trailId) {
      res.status(400).json({ error: 'Missing required fields: userId and trailId.' });
      return;
    }

    // 2. Busca do TrailEnrollment do usuário para essa trilha
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

    // 3. Regra de Segurança: Validação de Progresso
    if (enrollment.progressPercent < 100 && enrollment.status !== 'COMPLETED') {
      res.status(403).json({ 
        error: 'Certificate cannot be issued. Trail is not fully completed.',
        currentProgress: enrollment.progressPercent
      });
      return;
    }

    // 4. Verifica se o certificado já existe para evitar duplicidade
    let certificate = await prisma.certificate.findFirst({
      where: {
        tenantId,
        userId,
        trailId,
      }
    });

    // 5. Geração do Certificado
    if (!certificate) {
      // Gera um código único (Ex: 8A4F-9B2C)
      const uniqueCode = crypto.randomBytes(4).toString('hex').toUpperCase() + '-' + crypto.randomBytes(4).toString('hex').toUpperCase();

      certificate = await prisma.certificate.create({
        data: {
          tenantId,
          userId,
          trailId,
          code: uniqueCode,
        }
      });
    }

    // 6. Retorno dos dados formatados para o frontend
    res.status(200).json({
      success: true,
      data: {
        studentName: enrollment.user.name,
        trailTitle: enrollment.trail.title,
        workloadHours: enrollment.trail.workloadHours,
        validationCode: certificate.code,
        issuedAt: certificate.issuedAt,
      }
    });

  } catch (error) {
    console.error('[CertificateController] Error issuing certificate:', error);
    res.status(500).json({ error: 'Internal server error while issuing certificate.' });
  }
};
