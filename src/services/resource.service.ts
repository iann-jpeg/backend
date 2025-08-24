import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { Response } from 'express';
import * as path from 'path';
import * as fs from 'fs';
import { PrismaClient } from '@prisma/client';
import { CreateResourceDto, UpdateResourceDto } from '../config/resource.dto';

const prisma = new PrismaClient();

@Injectable()
export class ResourceService {

  async findAll(page: number = 1, limit: number = 10, category?: string, adminOnly?: boolean) {
    try {
      const skip = (page - 1) * limit;
      const where: any = {};
      
      if (category) {
        where.category = category;
      }
      
      if (adminOnly !== undefined) {
        where.adminOnly = adminOnly;
      }

      const [resources, total] = await Promise.all([
        prisma.resource.findMany({
          skip,
          take: limit,
          where,
          orderBy: { createdAt: 'desc' },
          include: {
            creator: {
              select: { id: true, name: true, email: true }
            }
          }
        }),
        prisma.resource.count({ where })
      ]);

      return {
        data: resources,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      console.error('Error fetching resources:', error);
      throw new BadRequestException('Failed to fetch resources');
    }
  }

  async findPublicResources(category?: string) {
    try {
      const where: any = { adminOnly: false };
      
      if (category) {
        where.category = category;
      }

      const resources = await prisma.resource.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          title: true,
          description: true,
          category: true,
          filePath: true,
          fileSize: true,
          createdAt: true
        }
      });

      return {
        success: true,
        data: resources
      };
    } catch (error) {
      console.error('Error fetching public resources:', error);
      throw new BadRequestException('Failed to fetch public resources');
    }
  }

  async findOne(id: number) {
    try {
      const resource = await prisma.resource.findUnique({
        where: { id },
        include: {
          creator: {
            select: { id: true, name: true, email: true }
          }
        }
      });

      if (!resource) {
        throw new NotFoundException(`Resource with ID ${id} not found`);
      }

      return resource;
    } catch (error) {
      console.error('Error fetching resource:', error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to fetch resource');
    }
  }

  async create(data: CreateResourceDto, file?: Express.Multer.File, createdBy?: number) {
    try {
      const resourceData: any = {
        ...data
      };

      if (file) {
        resourceData.filePath = file.filename;
        resourceData.fileSize = file.size;
      }

      if (createdBy) {
        resourceData.createdBy = createdBy;
      }

      const resource = await prisma.resource.create({
        data: resourceData,
        include: {
          creator: {
            select: { id: true, name: true, email: true }
          }
        }
      });

      return {
        success: true,
        message: 'Resource created successfully',
        data: resource
      };
    } catch (error) {
      console.error('Error creating resource:', error);
      throw new BadRequestException('Failed to create resource');
    }
  }

  async update(id: number, data: UpdateResourceDto) {
    try {
      const existingResource = await prisma.resource.findUnique({
        where: { id }
      });

      if (!existingResource) {
        throw new NotFoundException(`Resource with ID ${id} not found`);
      }

      const updatedResource = await prisma.resource.update({
        where: { id },
        data,
        include: {
          creator: {
            select: { id: true, name: true, email: true }
          }
        }
      });

      return {
        success: true,
        message: 'Resource updated successfully',
        data: updatedResource
      };
    } catch (error) {
      console.error('Error updating resource:', error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to update resource');
    }
  }

  async remove(id: number) {
    try {
      const resource = await prisma.resource.findUnique({
        where: { id }
      });

      if (!resource) {
        throw new NotFoundException(`Resource with ID ${id} not found`);
      }

      // Delete file if it exists
      if (resource.filePath) {
        const filePath = path.join('./uploads/resources', resource.filePath);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }

      await prisma.resource.delete({
        where: { id }
      });

      return {
        success: true,
        message: 'Resource deleted successfully'
      };
    } catch (error) {
      console.error('Error deleting resource:', error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to delete resource');
    }
  }

  async downloadResource(id: number, res: Response) {
    try {
      const resource = await prisma.resource.findUnique({
        where: { id }
      });

      if (!resource || !resource.filePath) {
        throw new NotFoundException('Resource file not found');
      }

      const filePath = path.join('./uploads/resources', resource.filePath);
      
      if (!fs.existsSync(filePath)) {
        throw new NotFoundException('Resource file not found on server');
      }

      const stat = fs.statSync(filePath);
      
      res.set({
        'Content-Type': 'application/octet-stream',
        'Content-Disposition': `attachment; filename="${resource.title}"`,
        'Content-Length': stat.size,
      });

      const readStream = fs.createReadStream(filePath);
      readStream.pipe(res);
      
      return readStream;
    } catch (error) {
      console.error('Error downloading resource:', error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to download resource');
    }
  }

  async serveFile(filename: string, res: Response) {
    try {
      // Security: validate filename to prevent path traversal
      if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
        throw new BadRequestException('Invalid filename');
      }

      const filePath = path.join('./uploads/resources', filename);
      
      if (!fs.existsSync(filePath)) {
        throw new NotFoundException('File not found');
      }

      const stat = fs.statSync(filePath);
      const ext = path.extname(filename).toLowerCase();
      
      // Set appropriate content type
      let contentType = 'application/octet-stream';
      if (ext === '.pdf') contentType = 'application/pdf';
      else if (['.jpg', '.jpeg'].includes(ext)) contentType = 'image/jpeg';
      else if (ext === '.png') contentType = 'image/png';
      else if (ext === '.doc') contentType = 'application/msword';
      else if (ext === '.docx') contentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

      res.set({
        'Content-Type': contentType,
        'Content-Length': stat.size,
        'Cache-Control': 'public, max-age=31536000', // Cache for 1 year
      });

      const readStream = fs.createReadStream(filePath);
      readStream.pipe(res);
      
      return readStream;
    } catch (error) {
      console.error('Error serving file:', error);
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Failed to serve file');
    }
  }

  async getCategories() {
    try {
      const categories = await prisma.resource.findMany({
        select: { category: true },
        distinct: ['category'],
        orderBy: { category: 'asc' }
      });

      return {
        success: true,
        data: categories.map((c: any) => c.category)
      };
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw new BadRequestException('Failed to fetch categories');
    }
  }
}
