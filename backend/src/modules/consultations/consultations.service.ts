import { Injectable } from '@nestjs/common';
import { prisma } from '../../db/prisma';
import { paginate, handlePrismaError } from '../../lib/utils';

@Injectable()
export class ConsultationsService {
  async createConsultation(data: any) {
    try {
      const consultation = await prisma.consultation.create({
        data: {
          ...data,
          status: 'pending',
        },
      });
      return { success: true, consultation };
    } catch (error) {
      return handlePrismaError(error);
    }
  }

  async getConsultations(page = 1, limit = 20) {
    try {
      const { take, skip } = paginate(page, limit);
      const [consultations, total] = await prisma.$transaction([
        prisma.consultation.findMany({
          take,
          skip,
          orderBy: { createdAt: 'desc' },
        }),
        prisma.consultation.count(),
      ]);
      return { consultations, total };
    } catch (error) {
      return handlePrismaError(error);
    }
  }
}
