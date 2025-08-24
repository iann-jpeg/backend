import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class DiasporaService {
  async findAll({ page = 1, limit = 10 }: { page?: number; limit?: number }) {
    return prisma.diasporaRequest.findMany({ skip: (page - 1) * limit, take: limit });
  }
  findOne(id: number) {
    return prisma.diasporaRequest.findUnique({ where: { id } });
  }
  create(data: any) {
    return prisma.diasporaRequest.create({ data });
  }
  update(id: number, data: any) {
    return prisma.diasporaRequest.update({ where: { id }, data });
  }
  remove(id: number) {
    return prisma.diasporaRequest.delete({ where: { id } });
  }
}
