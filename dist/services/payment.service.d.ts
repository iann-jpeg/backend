import { CreatePaymentDto, PaymentCallbackDto } from '../config/payment.dto';
export declare class PaymentService {
    handlePaystackCallback(callbackData: any, signature?: string): Promise<{
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
    findAll(page?: number, limit?: number, status?: string): Promise<{
        data: any;
        pagination: {
            page: number;
            limit: number;
            total: any;
            totalPages: number;
        };
    }>;
    findOne(id: number, user?: any): Promise<any>;
    create(data: CreatePaymentDto): Promise<{
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
    initiatePaystackPayment(amount: number, transactionId: string, email: string): Promise<{
        success: boolean;
        message: string;
        data: any;
        authorization_url: any;
        access_code: any;
        reference: any;
        error?: undefined;
    } | {
        success: boolean;
        message: string;
        error: any;
        data?: undefined;
        authorization_url?: undefined;
        access_code?: undefined;
        reference?: undefined;
    }>;
    verifyPaystackPayment(reference: string): Promise<{
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
    initiateMpesaStkPush(phone: string, amount: number, transactionId: string): Promise<{
        success: boolean;
        message: string;
        mpesaCheckoutId: any;
        merchantRequestId: any;
        response: any;
        error?: undefined;
    } | {
        success: boolean;
        message: string;
        error: string;
        mpesaCheckoutId?: undefined;
        merchantRequestId?: undefined;
        response?: undefined;
    }>;
    processPayment(id: number): Promise<{
        success: boolean;
        message: string;
        data: any;
    }>;
    private simulatePaymentProcessing;
    handleMpesaCallback(callbackData: PaymentCallbackDto): Promise<{
        success: boolean;
        message: string;
        data: any;
    }>;
    handlePaypalCallback(callbackData: PaymentCallbackDto): Promise<{
        success: boolean;
        message: string;
        data: any;
    }>;
    handleCardCallback(callbackData: PaymentCallbackDto): Promise<{
        success: boolean;
        message: string;
        data: any;
    }>;
    private handlePaymentCallback;
    getPaymentStatus(id: number): Promise<any>;
}
