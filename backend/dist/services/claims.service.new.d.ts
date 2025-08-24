import { EmailService } from './email.service';
export declare class ClaimsService {
    private readonly emailService;
    constructor(emailService: EmailService);
    findAll({ page, limit }: {
        page?: number;
        limit?: number;
    }): Promise<{
        data: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            description: string;
            userId: number | null;
            policyNumber: string;
            claimType: string;
            incidentDate: Date;
            estimatedLoss: number;
            status: string;
            submitterEmail: string | null;
            submitterName: string | null;
            submitterPhone: string | null;
        }[];
        meta: {
            total: number;
            page: number;
            limit: number;
            pages: number;
        };
    }>;
    findOne(id: number): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        userId: number | null;
        policyNumber: string;
        claimType: string;
        incidentDate: Date;
        estimatedLoss: number;
        status: string;
        submitterEmail: string | null;
        submitterName: string | null;
        submitterPhone: string | null;
    }>;
    create(data: any): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        userId: number | null;
        policyNumber: string;
        claimType: string;
        incidentDate: Date;
        estimatedLoss: number;
        status: string;
        submitterEmail: string | null;
        submitterName: string | null;
        submitterPhone: string | null;
    }>;
    update(id: number, data: any): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        userId: number | null;
        policyNumber: string;
        claimType: string;
        incidentDate: Date;
        estimatedLoss: number;
        status: string;
        submitterEmail: string | null;
        submitterName: string | null;
        submitterPhone: string | null;
    }>;
    remove(id: number): Promise<boolean>;
}
