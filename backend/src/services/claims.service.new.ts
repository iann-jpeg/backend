import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { EmailService } from './email.service';
import { CreateClaimDto, UpdateClaimDto } from '../config/claim.dto';

const prisma = new PrismaClient();

@Injectable()
export class ClaimsService {
  constructor(
    private readonly emailService: EmailService
  ) {}

  async findAll({ page = 1, limit = 10 }: { page?: number; limit?: number }) {
    try {
      const skip = (page - 1) * limit;
      const [claims, total] = await Promise.all([
        prisma.claim.findMany({ 
          skip, 
          take: limit,
          orderBy: { createdAt: 'desc' }
        }),
        prisma.claim.count()
      ]);

      return {
        data: claims,
        meta: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error: any) {
      throw new BadRequestException('Failed to fetch claims: ' + error.message);
    }
  }

  async findOne(id: number) {
    try {
      const claim = await prisma.claim.findUnique({ where: { id } });
      if (!claim) throw new BadRequestException('Claim not found');
      return claim;
    } catch (error: any) {
      throw new BadRequestException('Failed to fetch claim: ' + error.message);
    }
  }

  async create(data: any) {
    try {
      // Save to database
      const claim = await prisma.claim.create({ data });

      // Prepare notification message
      const adminMessage = `New claim submitted:\n\n` +
        `Policy Number: ${data.policyNumber}\n` +
        `Claim Type: ${data.claimType}\n` +
        `Date of Incident: ${data.incidentDate}\n` +
        `Estimated Loss: ${data.estimatedLoss}\n` +
        `Description: ${data.description}\n` +
        `Document Path: ${data.documentPath || 'No document attached'}`;

      // Send notifications to admin
      await Promise.allSettled([
        this.emailService.sendMail(
          process.env.ADMIN_EMAIL!,
          'New Claim Submission',
          adminMessage
        )
      ]);

      return claim;
    } catch (error: any) {
      throw new BadRequestException('Failed to create claim: ' + error.message);
    }
  }

  async update(id: number, data: any) {
    try {
      const claim = await prisma.claim.update({ 
        where: { id }, 
        data 
      });

      // Notify admin of update
      await Promise.allSettled([
        this.emailService.sendMail(
          process.env.ADMIN_EMAIL!,
          'Claim Updated',
          `Claim #${id} has been updated.\nUpdated fields: ${Object.keys(data).join(', ')}`
        )
      ]);

      return claim;
    } catch (error: any) {
      throw new BadRequestException('Failed to update claim: ' + error.message);
    }
  }

  async remove(id: number) {
    try {
      await prisma.claim.delete({ where: { id } });
      
      // Notify admin of deletion
      await Promise.allSettled([
        this.emailService.sendMail(
          process.env.ADMIN_EMAIL!,
          'Claim Deleted',
          `Claim #${id} has been deleted from the system.`
        )
      ]);
      
      return true;
    } catch (error: any) {
      throw new BadRequestException('Failed to delete claim: ' + error.message);
    }
  }
}
