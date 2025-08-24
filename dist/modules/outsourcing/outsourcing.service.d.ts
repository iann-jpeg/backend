export declare class OutsourcingService {
    createOutsourcingRequest(data: any): Promise<{
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
    getOutsourcingRequests(page?: number, limit?: number): Promise<{
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
