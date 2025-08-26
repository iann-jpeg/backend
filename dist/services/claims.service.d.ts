import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from './email.service';
import { CreateClaimDto } from '../config/claim.dto';
export declare class ClaimsService {
    private readonly prisma;
    private readonly emailService;
    constructor(prisma: PrismaService, emailService: EmailService);
    findAll({ page, limit }: {
        page?: number;
        limit?: number;
    }): Promise<{
        data: any[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOne(id: number): Promise<{
        documentUrls: any;
        id: number;
        userId: number | null;
        policyNumber: string;
        claimType: string;
        incidentDate: Date;
        estimatedLoss: number;
        description: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        submitterEmail: string | null;
        submitterName: string | null;
        submitterPhone: string | null;
    }>;
    create(data: CreateClaimDto & {
        documentDetails?: any[];
    }): Promise<{
        id: number;
        userId: number | null;
        policyNumber: string;
        claimType: string;
        incidentDate: Date;
        estimatedLoss: number;
        description: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        submitterEmail: string | null;
        submitterName: string | null;
        submitterPhone: string | null;
    }>;
    update(id: number, data: any): Promise<{
        id: number;
        userId: number | null;
        policyNumber: string;
        claimType: string;
        incidentDate: Date;
        estimatedLoss: number;
        description: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        submitterEmail: string | null;
        submitterName: string | null;
        submitterPhone: string | null;
    }>;
    updateStatus(id: number, status: string): Promise<{
        id: number;
        userId: number | null;
        policyNumber: string;
        claimType: string;
        incidentDate: Date;
        estimatedLoss: number;
        description: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        submitterEmail: string | null;
        submitterName: string | null;
        submitterPhone: string | null;
    }>;
    remove(id: number): Promise<boolean>;
}
