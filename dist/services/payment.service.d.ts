import { CreatePaymentDto, PaymentCallbackDto } from '../config/payment.dto';
export declare class PaymentService {
    findAll(page?: number, limit?: number, status?: string): Promise<{
        data: ({
            user: {
                email: string;
                id: number;
                name: string;
            } | null;
        } & {
            email: string;
            status: string;
            createdAt: Date;
            updatedAt: Date;
            id: number;
            userId: number | null;
            policyNumber: string | null;
            clientName: string;
            amount: number;
            paymentMethod: string;
            phoneNumber: string | null;
            cardNumber: string | null;
            expiryDate: string | null;
            cvv: string | null;
            billingPhone: string | null;
            transactionId: string | null;
            metadata: import("@prisma/client/runtime/library").JsonValue | null;
        })[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    findOne(id: number, user?: any): Promise<{
        user: {
            email: string;
            id: number;
            name: string;
        } | null;
    } & {
        email: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        id: number;
        userId: number | null;
        policyNumber: string | null;
        clientName: string;
        amount: number;
        paymentMethod: string;
        phoneNumber: string | null;
        cardNumber: string | null;
        expiryDate: string | null;
        cvv: string | null;
        billingPhone: string | null;
        transactionId: string | null;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
    }>;
    create(data: CreatePaymentDto): Promise<{
        success: boolean;
        message: string;
        data: {
            id: number;
            transactionId: string | null;
            status: string;
            amount: number;
            paymentMethod: string;
        };
    }>;
    initiateMpesaStkPush(phone: string, amount: number, transactionId: string): Promise<{
        success: boolean;
        message: string;
        mpesaCheckoutId: string;
    }>;
    initiatePaypalPayment(amount: number, transactionId: string, email: string): Promise<{
        success: boolean;
        message: string;
        paypalOrderId: string;
    }>;
    processPayment(id: number): Promise<{
        success: boolean;
        message: string;
        data: {
            email: string;
            status: string;
            createdAt: Date;
            updatedAt: Date;
            id: number;
            userId: number | null;
            policyNumber: string | null;
            clientName: string;
            amount: number;
            paymentMethod: string;
            phoneNumber: string | null;
            cardNumber: string | null;
            expiryDate: string | null;
            cvv: string | null;
            billingPhone: string | null;
            transactionId: string | null;
            metadata: import("@prisma/client/runtime/library").JsonValue | null;
        };
    }>;
    private simulatePaymentProcessing;
    handleMpesaCallback(callbackData: PaymentCallbackDto): Promise<{
        success: boolean;
        message: string;
        data: {
            email: string;
            status: string;
            createdAt: Date;
            updatedAt: Date;
            id: number;
            userId: number | null;
            policyNumber: string | null;
            clientName: string;
            amount: number;
            paymentMethod: string;
            phoneNumber: string | null;
            cardNumber: string | null;
            expiryDate: string | null;
            cvv: string | null;
            billingPhone: string | null;
            transactionId: string | null;
            metadata: import("@prisma/client/runtime/library").JsonValue | null;
        };
    }>;
    handlePaypalCallback(callbackData: PaymentCallbackDto): Promise<{
        success: boolean;
        message: string;
        data: {
            email: string;
            status: string;
            createdAt: Date;
            updatedAt: Date;
            id: number;
            userId: number | null;
            policyNumber: string | null;
            clientName: string;
            amount: number;
            paymentMethod: string;
            phoneNumber: string | null;
            cardNumber: string | null;
            expiryDate: string | null;
            cvv: string | null;
            billingPhone: string | null;
            transactionId: string | null;
            metadata: import("@prisma/client/runtime/library").JsonValue | null;
        };
    }>;
    handleCardCallback(callbackData: PaymentCallbackDto): Promise<{
        success: boolean;
        message: string;
        data: {
            email: string;
            status: string;
            createdAt: Date;
            updatedAt: Date;
            id: number;
            userId: number | null;
            policyNumber: string | null;
            clientName: string;
            amount: number;
            paymentMethod: string;
            phoneNumber: string | null;
            cardNumber: string | null;
            expiryDate: string | null;
            cvv: string | null;
            billingPhone: string | null;
            transactionId: string | null;
            metadata: import("@prisma/client/runtime/library").JsonValue | null;
        };
    }>;
    private handlePaymentCallback;
    getPaymentStatus(id: number): Promise<{
        status: string;
        createdAt: Date;
        updatedAt: Date;
        id: number;
        amount: number;
        paymentMethod: string;
        transactionId: string | null;
    }>;
}
