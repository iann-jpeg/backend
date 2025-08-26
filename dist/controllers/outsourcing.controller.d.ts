import { OutsourcingService } from '../services/outsourcing.service';
import { CreateOutsourcingRequestDto, UpdateOutsourcingRequestDto } from '../config/outsourcing.dto';
export declare class OutsourcingController {
    private readonly outsourcingService;
    constructor(outsourcingService: OutsourcingService);
    findAll(page?: number, limit?: number, status?: string): Promise<{
        data: any;
        pagination: {
            page: number;
            limit: number;
            total: any;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<any>;
    create(createOutsourcingRequestDto: CreateOutsourcingRequestDto, document?: Express.Multer.File): Promise<{
        success: boolean;
        message: string;
        data: any;
    }>;
    update(id: string, updateOutsourcingRequestDto: UpdateOutsourcingRequestDto): Promise<{
        success: boolean;
        message: string;
        data: any;
    }>;
    remove(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
    updateStatus(id: string, body: {
        status: string;
    }): Promise<{
        success: boolean;
        message: string;
        data: any;
    }>;
}
