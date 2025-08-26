import { PaymentService } from '../services/payment.service';
import { CreatePaymentDto, PaymentCallbackDto } from '../config/payment.dto';
export declare class PaymentController {
    private readonly paymentService;
    constructor(paymentService: PaymentService);
    findAll(page?: number, limit?: number, status?: string): Promise<{
        data: any;
        pagination: {
            page: number;
            limit: number;
            total: any;
            totalPages: number;
        };
    }>;
    findOne(id: string, req: any): Promise<any>;
    create(createPaymentDto: CreatePaymentDto): Promise<{
        success: boolean;
        message: string;
        data: {
            id: any;
            transactionId: any;
            status: any;
            amount: any;
            paymentMethod: any;
            metadata: any;
        } | null;
    }>;
    initiatePayment(createPaymentDto: CreatePaymentDto): Promise<{
        success: boolean;
        message: string;
        data: {
            id: any;
            transactionId: any;
            status: any;
            amount: any;
            paymentMethod: any;
            metadata: any;
        } | null;
    }>;
    processPayment(id: string): Promise<{
        success: boolean;
        message: string;
        data: any;
    }>;
    mpesaCallback(callbackData: PaymentCallbackDto): Promise<{
        success: boolean;
        message: string;
        data: any;
    }>;
    paypalCallback(callbackData: PaymentCallbackDto): Promise<{
        success: boolean;
        message: string;
        data: any;
    }>;
    cardCallback(callbackData: PaymentCallbackDto): Promise<{
        success: boolean;
        message: string;
        data: any;
    }>;
    paystackCallback(callbackData: any, req: any): Promise<{
        success: boolean;
        message: string;
        event: any;
        data?: undefined;
    } | {
        success: boolean;
        message: string;
        data: {
            id: any;
            transactionId: any;
            status: any;
        };
        event?: undefined;
    }>;
    verifyPayment(reference: string): Promise<{
        success: boolean;
        message: string;
        data?: undefined;
        status?: undefined;
        error?: undefined;
    } | {
        success: boolean;
        message: string;
        data: any;
        status: any;
        error?: undefined;
    } | {
        success: boolean;
        message: string;
        error: any;
        data?: undefined;
        status?: undefined;
    }>;
}
