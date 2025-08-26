export declare class ConsultationsService {
    createConsultation(data: any): Promise<{
        success: boolean;
        message: any;
    } | {
        success: boolean;
        consultation: {
            name: string;
            id: number;
            userId: number | null;
            status: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            phone: string;
            country: string;
            timezone: string;
            serviceInterest: string;
            scheduledAt: Date | null;
        };
    }>;
    getConsultations(page?: number, limit?: number): Promise<{
        success: boolean;
        message: any;
    } | {
        consultations: {
            name: string;
            id: number;
            userId: number | null;
            status: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            phone: string;
            country: string;
            timezone: string;
            serviceInterest: string;
            scheduledAt: Date | null;
        }[];
        total: number;
    }>;
}
