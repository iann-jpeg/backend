import { EmailService } from './email.service';
import { CreateClaimDto } from '../config/claim.dto';
export declare class ClaimsService {
    private readonly emailService;
    constructor(emailService: EmailService);
    findAll({ page, limit }: {
        page?: number;
        limit?: number;
    }): Promise<{
        data: {
            documentUrls: string[];
            user: {
                name: string;
                id: number;
                email: string;
            } | null;
            documents: {
                id: number;
                createdAt: Date;
                filename: string;
                originalName: string;
                mimeType: string;
                size: number;
            }[];
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
            totalPages: number;
        };
    }>;
    findOne(id: number): Promise<{
        documentUrls: string[];
        user: {
            name: string;
            id: number;
            email: string;
        } | null;
        documents: {
            id: number;
            createdAt: Date;
            filename: string;
            originalName: string;
            mimeType: string;
            size: number;
        }[];
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
    create(data: CreateClaimDto & {
        documentDetails?: any[];
    }): Promise<{
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
    updateStatus(id: number, status: string): Promise<{
        user: {
            name: string;
            id: number;
            email: string;
        } | null;
    } & {
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
