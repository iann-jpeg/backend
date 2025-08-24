import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class ProductsService {
  async findAll({ search, page = 1, limit = 10 }: { search?: string; page?: number; limit?: number }) {
    const where = search ? { name: { contains: search, mode: 'insensitive' as any } } : {};
    return prisma.product.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
    });
  }
  findOne(id: number) {
    return prisma.product.findUnique({ where: { id } });
  }
  create(data: any) {
    return prisma.product.create({ data });
  }
  update(id: number, data: any) {
    return prisma.product.update({ where: { id }, data });
  }
  remove(id: number) {
    return prisma.product.delete({ where: { id } });
  }
}
