export declare class OutsourcingService {
    createOutsourcingRequest(data: any): Promise<{
        success: boolean;
        message: any;
    } | {
        success: boolean;
        outsourcing: any;
    }>;
    getOutsourcingRequests(page?: number, limit?: number): Promise<{
        success: boolean;
        message: any;
    } | {
        outsourcing: any;
        total: any;
    }>;
}
