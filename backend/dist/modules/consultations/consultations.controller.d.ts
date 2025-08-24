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
            email: string;
            createdAt: Date;
            updatedAt: Date;
            userId: number | null;
            status: string;
            phone: string;
            country: string | null;
            timezone: string | null;
            scheduledAt: Date | null;
            company: string | null;
            consultationDate: string;
            consultationTime: string;
            message: string;
            serviceType: string;
            duration: number | null;
            meetingLink: string | null;
            meetingType: string | null;
            notes: string | null;
        };
    }>;
    getConsultations(): Promise<{
        success: boolean;
        message: any;
    } | {
        consultations: {
            name: string;
            id: number;
            email: string;
            createdAt: Date;
            updatedAt: Date;
            userId: number | null;
            status: string;
            phone: string;
            country: string | null;
            timezone: string | null;
            scheduledAt: Date | null;
            company: string | null;
            consultationDate: string;
            consultationTime: string;
            message: string;
            serviceType: string;
            duration: number | null;
            meetingLink: string | null;
            meetingType: string | null;
            notes: string | null;
        }[];
        total: number;
    }>;
}
