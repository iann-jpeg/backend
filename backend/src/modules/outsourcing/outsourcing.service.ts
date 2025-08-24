import { Injectable } from '@nestjs/common';
import { prisma } from '../../db/prisma';
import { paginate, handlePrismaError } from '../../lib/utils';

@Injectable()
export class OutsourcingService {
  async createOutsourcingRequest(data: any) {
    try {
      const outsourcing = await prisma.outsourcingRequest.create({
        data: {
          ...data,
          status: 'pending',
        },
      });
      return { success: true, outsourcing };
    } catch (error) {
      return handlePrismaError(error);
    }
  }

  async getOutsourcingRequests(page = 1, limit = 20) {
    try {
      const { take, skip } = paginate(page, limit);
      const [outsourcing, total] = await prisma.$transaction([
        prisma.outsourcingRequest.findMany({
          take,
          skip,
          orderBy: { createdAt: 'desc' },
        }),
        prisma.outsourcingRequest.count(),
      ]);
      return { outsourcing, total };
    } catch (error) {
      return handlePrismaError(error);
    }
  }
}
