import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreatePaymentDto, PaymentCallbackDto } from '../config/payment.dto';

const prisma = new PrismaClient();

@Injectable()
export class PaymentService {

  async findAll(page: number = 1, limit: number = 10, status?: string) {
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
    } catch (error) {
      console.error('Error fetching payments:', error);
      throw new BadRequestException('Failed to fetch payments');
    }
  }

  async findOne(id: number, user?: any) {
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
        throw new NotFoundException(`Payment with ID ${id} not found`);
      }

      // If not admin, only return payment if it belongs to the user
      if (user && user.role !== 'ADMIN' && payment.userId !== user.id) {
        throw new NotFoundException(`Payment with ID ${id} not found`);
      }

      return payment;
    } catch (error) {
      console.error('Error fetching payment:', error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to fetch payment');
    }
  }

  async create(data: CreatePaymentDto) {
    try {
      // Generate transaction ID
      const transactionId = `TXN${Date.now()}${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
      let payment;
      // M-PESA Integration
      if (data.paymentMethod === 'mpesa') {
        // Call M-PESA STK Push API
        const mpesaResult = await this.initiateMpesaStkPush(data.phoneNumber || '', data.amount, transactionId);
        payment = await prisma.payment.create({
          data: {
            ...data,
            transactionId,
            status: mpesaResult.success ? 'processing' : 'failed',
            metadata: mpesaResult
          }
        });
      } else if (data.paymentMethod === 'paypal') {
        // Call PayPal payment creation API
        const paypalResult = await this.initiatePaypalPayment(data.amount, transactionId, data.email);
        payment = await prisma.payment.create({
          data: {
            ...data,
            transactionId,
            status: paypalResult.success ? 'processing' : 'failed',
            metadata: paypalResult
          }
        });
      } else {
        // Card or other method
        payment = await prisma.payment.create({
          data: {
            ...data,
            transactionId,
            status: 'pending'
          }
        });
      }
      // Send confirmation email to client (existing logic)
      // ...existing code...
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
    } catch (error) {
      console.error('Error creating payment:', error);
      throw new BadRequestException('Failed to initiate payment');
    }
  }

  // M-PESA STK Push API Integration
  async initiateMpesaStkPush(phone: string, amount: number, transactionId: string) {
    // Use environment variables for credentials
    const consumerKey = process.env.MPESA_CONSUMER_KEY;
    const consumerSecret = process.env.MPESA_CONSUMER_SECRET;
    const shortcode = process.env.MPESA_SHORTCODE;
    const passkey = process.env.MPESA_PASSKEY;
    const callbackUrl = process.env.MPESA_CALLBACK_URL;
    const environment = process.env.MPESA_ENVIRONMENT || 'production';
    // TODO: Implement OAuth, STK Push request, handle response
    // For now, return mock result
    return { success: true, message: 'STK Push sent', mpesaCheckoutId: transactionId };
  }

  // PayPal Payment API Integration
  async initiatePaypalPayment(amount: number, transactionId: string, email: string) {
    const clientId = process.env.PAYPAL_CLIENT_ID;
    const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
    const apiUrl = process.env.PAYPAL_API_URL || 'https://api-m.paypal.com';
    // TODO: Implement OAuth, payment creation, handle response
    // For now, return mock result
    return { success: true, message: 'PayPal payment created', paypalOrderId: transactionId };
  }
// M-PESA and PayPal callback endpoints are defined once below, after all other methods.

  async processPayment(id: number) {
    try {
      const payment = await prisma.payment.findUnique({
        where: { id }
      });

      if (!payment) {
        throw new NotFoundException(`Payment with ID ${id} not found`);
      }

      if (payment.status !== 'pending') {
        throw new BadRequestException('Payment has already been processed');
      }

      // Update status to processing
      await prisma.payment.update({
        where: { id },
        data: { status: 'processing' }
      });

      // Simulate payment processing based on payment method
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
    } catch (error) {
      console.error('Error processing payment:', error);
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Failed to process payment');
    }
  }

  private async simulatePaymentProcessing(paymentMethod: string): Promise<boolean> {
    // Simulate different success rates for different payment methods
    const delay = Math.random() * 2000 + 1000; // 1-3 seconds
    await new Promise(resolve => setTimeout(resolve, delay));

    switch (paymentMethod) {
      case 'mpesa':
        return Math.random() > 0.1; // 90% success rate
      case 'card':
        return Math.random() > 0.15; // 85% success rate
      case 'paypal':
        return Math.random() > 0.05; // 95% success rate
      default:
        return Math.random() > 0.2; // 80% success rate
    }
  }

  async handleMpesaCallback(callbackData: PaymentCallbackDto) {
    return this.handlePaymentCallback(callbackData, 'mpesa');
  }

  async handlePaypalCallback(callbackData: PaymentCallbackDto) {
    return this.handlePaymentCallback(callbackData, 'paypal');
  }

  async handleCardCallback(callbackData: PaymentCallbackDto) {
    return this.handlePaymentCallback(callbackData, 'card');
  }

  private async handlePaymentCallback(callbackData: PaymentCallbackDto, expectedMethod: string) {
    try {
      const payment = await prisma.payment.findFirst({
        where: { transactionId: callbackData.transactionId }
      });

      if (!payment) {
        throw new NotFoundException('Payment not found');
      }

      if (payment.paymentMethod !== expectedMethod) {
        throw new BadRequestException('Payment method mismatch');
      }

      const status = callbackData.status === 'success' ? 'completed' : 'failed';
      
      const updatedPayment = await prisma.payment.update({
        where: { id: payment.id },
        data: {
          status,
          metadata: {
            ...payment.metadata as any,
            callbackData,
            callbackReceivedAt: new Date()
          }
        }
      });

      return {
        success: true,
        message: 'Callback processed successfully',
        data: updatedPayment
      };
    } catch (error) {
      console.error('Error handling payment callback:', error);
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Failed to process payment callback');
    }
  }

  async getPaymentStatus(id: number) {
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
        throw new NotFoundException(`Payment with ID ${id} not found`);
      }

      return payment;
    } catch (error) {
      console.error('Error fetching payment status:', error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to fetch payment status');
    }
  }
}
