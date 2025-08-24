import { PaymentService } from '../services/payment.service';
import { CreatePaymentDto, PaymentCallbackDto } from '../config/payment.dto';
export declare class PaymentController {
    private readonly paymentService;
    constructor(paymentService: PaymentService);
    findAll(page?: number, limit?: number, status?: string): Promise<{
        data: ({
            user: {
                name: string;
                id: number;
                email: string;
            } | null;
        } & {
            id: number;
            email: string;
            createdAt: Date;
            updatedAt: Date;
            userId: number | null;
            policyNumber: string | null;
            status: string;
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
    findOne(id: string, req: any): Promise<{
        user: {
            name: string;
            id: number;
            email: string;
        } | null;
    } & {
        id: number;
        email: string;
        createdAt: Date;
        updatedAt: Date;
        userId: number | null;
        policyNumber: string | null;
        status: string;
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
    create(createPaymentDto: CreatePaymentDto): Promise<{
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
    processPayment(id: string): Promise<{
        success: boolean;
        message: string;
        data: {
            id: number;
            email: string;
            createdAt: Date;
            updatedAt: Date;
            userId: number | null;
            policyNumber: string | null;
            status: string;
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
    mpesaCallback(callbackData: PaymentCallbackDto): Promise<{
        success: boolean;
        message: string;
        data: {
            id: number;
            email: string;
            createdAt: Date;
            updatedAt: Date;
            userId: number | null;
            policyNumber: string | null;
            status: string;
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
    paypalCallback(callbackData: PaymentCallbackDto): Promise<{
        success: boolean;
        message: string;
        data: {
            id: number;
            email: string;
            createdAt: Date;
            updatedAt: Date;
            userId: number | null;
            policyNumber: string | null;
            status: string;
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
    cardCallback(callbackData: PaymentCallbackDto): Promise<{
        success: boolean;
        message: string;
        data: {
            id: number;
            email: string;
            createdAt: Date;
            updatedAt: Date;
            userId: number | null;
            policyNumber: string | null;
            status: string;
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
    getPaymentStatus(id: string): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        amount: number;
        paymentMethod: string;
        transactionId: string | null;
    }>;
}
