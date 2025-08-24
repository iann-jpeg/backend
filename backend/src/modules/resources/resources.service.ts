import { Injectable } from '@nestjs/common';
import { prisma } from '../../db/prisma';
import { handlePrismaError } from '../../lib/utils';

@Injectable()
export class ResourcesService {
  async getResources() {
    try {
      const resources = await prisma.resource.findMany({
        where: { adminOnly: false },
        orderBy: { createdAt: 'desc' },
      });
      return resources;
    } catch (error) {
      return handlePrismaError(error);
    }
  }

  async downloadResource(id: string) {
    try {
      const resource = await prisma.resource.findUnique({
        where: { id: Number(id) },
      });
      if (!resource) return { success: false, message: 'Not found' };
      // TODO: Stream file from filePath
      return resource;
    } catch (error) {
      return handlePrismaError(error);
    }
  }
}
