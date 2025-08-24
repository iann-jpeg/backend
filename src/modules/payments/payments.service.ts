import { Injectable } from '@nestjs/common';
import { prisma } from '../../db/prisma';
import { paginate, handlePrismaError } from '../../lib/utils';

@Injectable()
export class PaymentsService {
  async createPayment(data: any) {
    try {
      const payment = await prisma.payment.create({
        data: {
          ...data,
          status: 'pending',
        },
      });
      return { success: true, payment };
    } catch (error) {
      return handlePrismaError(error);
    }
  }

  async processPayment(id: string, data: any) {
    try {
      const payment = await prisma.payment.update({
        where: { id: Number(id) },
        data: {
          ...data,
          status: 'completed',
        },
      });
      return { success: true, payment };
    } catch (error) {
      return handlePrismaError(error);
    }
  }

  async getPaymentStatus(id: string) {
    try {
      const payment = await prisma.payment.findUnique({
        where: { id: Number(id) },
      });
      if (!payment) return { success: false, message: 'Not found' };
      return { id, status: payment.status };
    } catch (error) {
      return handlePrismaError(error);
    }
  }
}
