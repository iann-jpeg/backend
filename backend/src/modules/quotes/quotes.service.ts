import { Injectable } from '@nestjs/common';
import { prisma } from '../../db/prisma';
import { paginate, handlePrismaError } from '../../lib/utils';

@Injectable()
export class QuotesService {
  async createQuote(formData: any) {
    try {
      const quote = await prisma.quote.create({
        data: {
          ...formData,
          status: 'pending',
        },
      });
      return { success: true, quote };
    } catch (error) {
      return handlePrismaError(error);
    }
  }

  async getQuotes(page = 1, limit = 20) {
    try {
      const { take, skip } = paginate(page, limit);
      const [quotes, total] = await prisma.$transaction([
        prisma.quote.findMany({
          take,
          skip,
          orderBy: { createdAt: 'desc' },
        }),
        prisma.quote.count(),
      ]);
      return { quotes, total };
    } catch (error) {
      return handlePrismaError(error);
    }
  }
}
