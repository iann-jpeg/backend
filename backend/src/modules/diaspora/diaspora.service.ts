import { Injectable } from '@nestjs/common';
import { prisma } from '../../db/prisma';
import { paginate, handlePrismaError } from '../../lib/utils';

@Injectable()
export class DiasporaService {
  async createDiasporaRequest(data: any) {
    try {
      const diaspora = await prisma.diasporaRequest.create({
        data: {
          ...data,
          status: 'pending',
        },
      });
      return { success: true, diaspora };
    } catch (error) {
      return handlePrismaError(error);
    }
  }

  async getDiasporaRequests(page = 1, limit = 20) {
    try {
      const { take, skip } = paginate(page, limit);
      const [diaspora, total] = await prisma.$transaction([
        prisma.diasporaRequest.findMany({
          take,
          skip,
          orderBy: { createdAt: 'desc' },
        }),
        prisma.diasporaRequest.count(),
      ]);
      return { diaspora, total };
    } catch (error) {
      return handlePrismaError(error);
    }
  }
}
