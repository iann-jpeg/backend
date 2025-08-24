import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateOutsourcingRequestDto, UpdateOutsourcingRequestDto } from '../config/outsourcing.dto';

const prisma = new PrismaClient();

@Injectable()
export class OutsourcingService {

  async findAll(page: number = 1, limit: number = 10, status?: string) {
    try {
      const skip = (page - 1) * limit;
      const where = status ? { status } : {};

      const [requests, total] = await Promise.all([
        prisma.outsourcingRequest.findMany({
          skip,
          take: limit,
          where,
          orderBy: { createdAt: 'desc' },
          include: {
            user: {
              select: { id: true, name: true, email: true }
            },
            documents: true
          }
        }),
        prisma.outsourcingRequest.count({ where })
      ]);

      return {
        data: requests,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      console.error('Error fetching outsourcing requests:', error);
      throw new BadRequestException('Failed to fetch outsourcing requests');
    }
  }

  async findOne(id: number) {
    try {
      const request = await prisma.outsourcingRequest.findUnique({
        where: { id },
        include: {
          user: {
            select: { id: true, name: true, email: true }
          },
          documents: true
        }
      });

      if (!request) {
        throw new NotFoundException(`Outsourcing request with ID ${id} not found`);
      }

      return request;
    } catch (error) {
      console.error('Error fetching outsourcing request:', error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to fetch outsourcing request');
    }
  }

  async create(data: CreateOutsourcingRequestDto, document?: Express.Multer.File) {
    try {
      const request = await prisma.outsourcingRequest.create({
        data: {
          ...data,
          services: data.services || []
        },
        include: {
          documents: true
        }
      });

      // If a document was uploaded, save it to the documents table
      if (document) {
        await prisma.document.create({
          data: {
            filename: document.filename,
            originalName: document.originalname,
            mimeType: document.mimetype,
            size: document.size,
            path: document.path,
            outsourcingId: request.id
          }
        });
      }

      // Send notification email to admin
      const adminMessage = `New outsourcing request received:

Organization: ${data.organizationName}
Email: ${data.email}
Location: ${data.location}
Services: ${data.services?.join(', ')}
Nature: ${data.natureOfOutsourcing}
Budget: ${data.budgetRange}
Company Size: ${data.companySize || 'Not provided'}
Phone: ${data.phone || 'Not provided'}

Created At: ${new Date().toISOString()}`;

      const clientMessage = `Dear ${data.organizationName},

Thank you for your outsourcing inquiry. We have received your request for the following services:

${data.services?.map(service => `• ${service}`).join('\n')}

Our consultants will review your requirements and contact you within 24-48 hours to discuss your needs in detail.

Best regards,
Galloways Insurance Team`;

      // Note: Email sending would be implemented here
      console.log('Admin notification:', adminMessage);
      console.log('Client confirmation:', clientMessage);

      return {
        success: true,
        message: 'Outsourcing request submitted successfully',
        data: request
      };
    } catch (error) {
      console.error('Error creating outsourcing request:', error);
      throw new BadRequestException('Failed to create outsourcing request');
    }
  }

  async update(id: number, data: UpdateOutsourcingRequestDto) {
    try {
      const existingRequest = await prisma.outsourcingRequest.findUnique({
        where: { id }
      });

      if (!existingRequest) {
        throw new NotFoundException(`Outsourcing request with ID ${id} not found`);
      }

      const updatedRequest = await prisma.outsourcingRequest.update({
        where: { id },
        data: {
          ...data,
          services: data.services || existingRequest.services
        },
        include: {
          user: {
            select: { id: true, name: true, email: true }
          },
          documents: true
        }
      });

      return {
        success: true,
        message: 'Outsourcing request updated successfully',
        data: updatedRequest
      };
    } catch (error) {
      console.error('Error updating outsourcing request:', error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to update outsourcing request');
    }
  }

  async remove(id: number) {
    try {
      const existingRequest = await prisma.outsourcingRequest.findUnique({
        where: { id }
      });

      if (!existingRequest) {
        throw new NotFoundException(`Outsourcing request with ID ${id} not found`);
      }

      await prisma.outsourcingRequest.delete({
        where: { id }
      });

      return {
        success: true,
        message: 'Outsourcing request deleted successfully'
      };
    } catch (error) {
      console.error('Error deleting outsourcing request:', error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to delete outsourcing request');
    }
  }

  async updateStatus(id: number, status: string) {
    try {
      const validStatuses = ['pending', 'in_progress', 'completed', 'cancelled'];
      if (!validStatuses.includes(status)) {
        throw new BadRequestException('Invalid status provided');
      }

      const updatedRequest = await prisma.outsourcingRequest.update({
        where: { id },
        data: { status },
        include: {
          user: {
            select: { id: true, name: true, email: true }
          }
        }
      });

      return {
        success: true,
        message: 'Status updated successfully',
        data: updatedRequest
      };
    } catch (error) {
      console.error('Error updating status:', error);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Failed to update status');
    }
  }
}
