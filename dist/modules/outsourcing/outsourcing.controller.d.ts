import { OutsourcingService } from './outsourcing.service';
export declare class OutsourcingController {
    private readonly outsourcingService;
    constructor(outsourcingService: OutsourcingService);
    createOutsourcingRequest(body: any): Promise<{
        success: boolean;
        message: any;
    } | {
        success: boolean;
        outsourcing: any;
    }>;
    getOutsourcingRequests(): Promise<{
        success: boolean;
        message: any;
    } | {
        outsourcing: any;
        total: any;
    }>;
}
