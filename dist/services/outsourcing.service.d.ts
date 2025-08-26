import { CreateOutsourcingRequestDto, UpdateOutsourcingRequestDto } from '../config/outsourcing.dto';
export declare class OutsourcingService {
    findAll(page?: number, limit?: number, status?: string): Promise<{
        data: any;
        pagination: {
            page: number;
            limit: number;
            total: any;
            totalPages: number;
        };
    }>;
    findOne(id: number): Promise<any>;
    create(data: CreateOutsourcingRequestDto, document?: Express.Multer.File): Promise<{
        success: boolean;
        message: string;
        data: any;
    }>;
    update(id: number, data: UpdateOutsourcingRequestDto): Promise<{
        success: boolean;
        message: string;
        data: any;
    }>;
    remove(id: number): Promise<{
        success: boolean;
        message: string;
    }>;
    updateStatus(id: number, status: string): Promise<{
        success: boolean;
        message: string;
        data: any;
    }>;
}
