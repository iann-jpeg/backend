export declare class PaymentsService {
    createPayment(data: any): Promise<{
        success: boolean;
        message: any;
    } | {
        success: boolean;
        payment: any;
    }>;
    processPayment(id: string, data: any): Promise<{
        success: boolean;
        message: any;
    } | {
        success: boolean;
        payment: any;
    }>;
    getPaymentStatus(id: string): Promise<{
        success: boolean;
        message: any;
    } | {
        id: string;
        status: any;
    }>;
}
