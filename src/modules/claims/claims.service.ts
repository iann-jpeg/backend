import { Injectable } from '@nestjs/common';
import { prisma } from '../../db/prisma';
import { paginate, handlePrismaError } from '../../lib/utils';

@Injectable()
export class ClaimsService {
  async createClaim(formData: any) {
    try {
      const claim = await prisma.claim.create({
        data: {
          ...formData,
          status: 'pending',
        },
      });
      return { success: true, claim };
    } catch (error) {
      return handlePrismaError(error);
    }
  }

  async getClaims(page = 1, limit = 20) {
    try {
      const { take, skip } = paginate(page, limit);
      const [claims, total] = await prisma.$transaction([
        prisma.claim.findMany({
          take,
          skip,
          orderBy: { createdAt: 'desc' },
        }),
        prisma.claim.count(),
      ]);
      return { claims, total };
    } catch (error) {
      return handlePrismaError(error);
    }
  }

  async getClaim(id: string) {
    try {
      const claim = await prisma.claim.findUnique({
        where: { id: Number(id) },
      });
      if (!claim) return { success: false, message: 'Not found' };
      return claim;
    } catch (error) {
      return handlePrismaError(error);
    }
  }

  async updateClaimStatus(id: string, status: string) {
    try {
      const claim = await prisma.claim.update({
        where: { id: Number(id) },
        data: { status },
      });
      return { success: true, claim };
    } catch (error) {
      return handlePrismaError(error);
    }
  }
}
