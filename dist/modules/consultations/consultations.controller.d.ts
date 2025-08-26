import { ConsultationsService } from './consultations.service';
export declare class ConsultationsController {
    private readonly consultationsService;
    constructor(consultationsService: ConsultationsService);
    createConsultation(body: any): Promise<{
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
    getConsultations(): Promise<{
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
