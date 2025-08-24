"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
let PaymentService = class PaymentService {
    async findAll(page = 1, limit = 10, status) {
        try {
            const skip = (page - 1) * limit;
            const where = status ? { status } : {};
            const [payments, total] = await Promise.all([
                prisma.payment.findMany({
                    skip,
                    take: limit,
                    where,
                    orderBy: { createdAt: 'desc' },
                    include: {
                        user: {
                            select: { id: true, name: true, email: true }
                        }
                    }
                }),
                prisma.payment.count({ where })
            ]);
            return {
                data: payments,
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages: Math.ceil(total / limit)
                }
            };
        }
        catch (error) {
            console.error('Error fetching payments:', error);
            throw new common_1.BadRequestException('Failed to fetch payments');
        }
    }
    async findOne(id, user) {
        try {
            const payment = await prisma.payment.findUnique({
                where: { id },
                include: {
                    user: {
                        select: { id: true, name: true, email: true }
                    }
                }
            });
            if (!payment) {
                throw new common_1.NotFoundException(`Payment with ID ${id} not found`);
            }
            if (user && user.role !== 'ADMIN' && payment.userId !== user.id) {
                throw new common_1.NotFoundException(`Payment with ID ${id} not found`);
            }
            return payment;
        }
        catch (error) {
            console.error('Error fetching payment:', error);
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new common_1.BadRequestException('Failed to fetch payment');
        }
    }
    async create(data) {
        try {
            const transactionId = `TXN${Date.now()}${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
            let payment;
            if (data.paymentMethod === 'mpesa') {
                const mpesaResult = await this.initiateMpesaStkPush(data.phoneNumber || '', data.amount, transactionId);
                payment = await prisma.payment.create({
                    data: Object.assign(Object.assign({}, data), { transactionId, status: mpesaResult.success ? 'processing' : 'failed', metadata: mpesaResult })
                });
            }
            else if (data.paymentMethod === 'paypal') {
                const paypalResult = await this.initiatePaypalPayment(data.amount, transactionId, data.email);
                payment = await prisma.payment.create({
                    data: Object.assign(Object.assign({}, data), { transactionId, status: paypalResult.success ? 'processing' : 'failed', metadata: paypalResult })
                });
            }
            else {
                payment = await prisma.payment.create({
                    data: Object.assign(Object.assign({}, data), { transactionId, status: 'pending' })
                });
            }
            return {
                success: true,
                message: 'Payment initiated successfully',
                data: {
                    id: payment.id,
                    transactionId: payment.transactionId,
                    status: payment.status,
                    amount: payment.amount,
                    paymentMethod: payment.paymentMethod
                }
            };
        }
        catch (error) {
            console.error('Error creating payment:', error);
            throw new common_1.BadRequestException('Failed to initiate payment');
        }
    }
    async initiateMpesaStkPush(phone, amount, transactionId) {
        const consumerKey = process.env.MPESA_CONSUMER_KEY;
        const consumerSecret = process.env.MPESA_CONSUMER_SECRET;
        const shortcode = process.env.MPESA_SHORTCODE;
        const passkey = process.env.MPESA_PASSKEY;
        const callbackUrl = process.env.MPESA_CALLBACK_URL;
        const environment = process.env.MPESA_ENVIRONMENT || 'production';
        return { success: true, message: 'STK Push sent', mpesaCheckoutId: transactionId };
    }
    async initiatePaypalPayment(amount, transactionId, email) {
        const clientId = process.env.PAYPAL_CLIENT_ID;
        const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
        const apiUrl = process.env.PAYPAL_API_URL || 'https://api-m.paypal.com';
        return { success: true, message: 'PayPal payment created', paypalOrderId: transactionId };
    }
    async processPayment(id) {
        try {
            const payment = await prisma.payment.findUnique({
                where: { id }
            });
            if (!payment) {
                throw new common_1.NotFoundException(`Payment with ID ${id} not found`);
            }
            if (payment.status !== 'pending') {
                throw new common_1.BadRequestException('Payment has already been processed');
            }
            await prisma.payment.update({
                where: { id },
                data: { status: 'processing' }
            });
            const isSuccess = await this.simulatePaymentProcessing(payment.paymentMethod);
            const finalStatus = isSuccess ? 'completed' : 'failed';
            const updatedPayment = await prisma.payment.update({
                where: { id },
                data: {
                    status: finalStatus,
                    metadata: {
                        processedAt: new Date(),
                        simulatedResult: isSuccess ? 'success' : 'failed'
                    }
                }
            });
            return {
                success: true,
                message: `Payment ${finalStatus}`,
                data: updatedPayment
            };
        }
        catch (error) {
            console.error('Error processing payment:', error);
            if (error instanceof common_1.NotFoundException || error instanceof common_1.BadRequestException) {
                throw error;
            }
            throw new common_1.BadRequestException('Failed to process payment');
        }
    }
    async simulatePaymentProcessing(paymentMethod) {
        const delay = Math.random() * 2000 + 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
        switch (paymentMethod) {
            case 'mpesa':
                return Math.random() > 0.1;
            case 'card':
                return Math.random() > 0.15;
            case 'paypal':
                return Math.random() > 0.05;
            default:
                return Math.random() > 0.2;
        }
    }
    async handleMpesaCallback(callbackData) {
        return this.handlePaymentCallback(callbackData, 'mpesa');
    }
    async handlePaypalCallback(callbackData) {
        return this.handlePaymentCallback(callbackData, 'paypal');
    }
    async handleCardCallback(callbackData) {
        return this.handlePaymentCallback(callbackData, 'card');
    }
    async handlePaymentCallback(callbackData, expectedMethod) {
        try {
            const payment = await prisma.payment.findFirst({
                where: { transactionId: callbackData.transactionId }
            });
            if (!payment) {
                throw new common_1.NotFoundException('Payment not found');
            }
            if (payment.paymentMethod !== expectedMethod) {
                throw new common_1.BadRequestException('Payment method mismatch');
            }
            const status = callbackData.status === 'success' ? 'completed' : 'failed';
            const updatedPayment = await prisma.payment.update({
                where: { id: payment.id },
                data: {
                    status,
                    metadata: Object.assign(Object.assign({}, payment.metadata), { callbackData, callbackReceivedAt: new Date() })
                }
            });
            return {
                success: true,
                message: 'Callback processed successfully',
                data: updatedPayment
            };
        }
        catch (error) {
            console.error('Error handling payment callback:', error);
            if (error instanceof common_1.NotFoundException || error instanceof common_1.BadRequestException) {
                throw error;
            }
            throw new common_1.BadRequestException('Failed to process payment callback');
        }
    }
    async getPaymentStatus(id) {
        try {
            const payment = await prisma.payment.findUnique({
                where: { id },
                select: {
                    id: true,
                    transactionId: true,
                    status: true,
                    amount: true,
                    paymentMethod: true,
                    createdAt: true,
                    updatedAt: true
                }
            });
            if (!payment) {
                throw new common_1.NotFoundException(`Payment with ID ${id} not found`);
            }
            return payment;
        }
        catch (error) {
            console.error('Error fetching payment status:', error);
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new common_1.BadRequestException('Failed to fetch payment status');
        }
    }
};
exports.PaymentService = PaymentService;
exports.PaymentService = PaymentService = __decorate([
    (0, common_1.Injectable)()
], PaymentService);
//# sourceMappingURL=payment.service.js.map