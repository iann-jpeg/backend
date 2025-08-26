import { PaymentsService } from './payments.service';
export declare class PaymentsController {
    private readonly paymentsService;
    constructor(paymentsService: PaymentsService);
    createPayment(body: any): Promise<{
        success: boolean;
        message: any;
    } | {
        success: boolean;
        payment: any;
    }>;
    processPayment(id: string, body: any): Promise<{
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
