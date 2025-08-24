import { OutsourcingService } from './outsourcing.service';
export declare class OutsourcingController {
    private readonly outsourcingService;
    constructor(outsourcingService: OutsourcingService);
    createOutsourcingRequest(body: any): Promise<{
        success: boolean;
        message: any;
    } | {
        success: boolean;
        outsourcing: {
            id: number;
            email: string;
            createdAt: Date;
            updatedAt: Date;
            userId: number | null;
            status: string;
            location: string;
            organizationName: string;
            coreFunctions: string | null;
            address: string | null;
            services: string[];
            natureOfOutsourcing: string;
            budgetRange: string;
        };
    }>;
    getOutsourcingRequests(): Promise<{
        success: boolean;
        message: any;
    } | {
        outsourcing: {
            id: number;
            email: string;
            createdAt: Date;
            updatedAt: Date;
            userId: number | null;
            status: string;
            location: string;
            organizationName: string;
            coreFunctions: string | null;
            address: string | null;
            services: string[];
            natureOfOutsourcing: string;
            budgetRange: string;
        }[];
        total: number;
    }>;
}
