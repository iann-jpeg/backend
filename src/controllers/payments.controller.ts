import { Controller, Post, Body, BadRequestException, Get, Param } from '@nestjs/common';
import { Public } from '../middleware/public.decorator';
import { BaseController } from './base.controller';

interface STKPushRequest {
  phone: string;
  amount: number;
  description: string;
}

interface ConsultationPaymentRequest {
  name: string;
  phone: string;
  amount: number;
  consultationType: string;
  consultationDate: string;
  consultationTime: string;
}

@Controller('payments')
export class PaymentsController extends BaseController {
  
  @Public()
  @Post('mpesa/stk')
  async initiateSTKPush(@Body() data: STKPushRequest) {
    try {
      // Simulate M-PESA STK Push integration
      // In a real implementation, you would integrate with Safaricom's M-PESA API
      
      if (!data.phone || !data.amount) {
        throw new BadRequestException('Phone number and amount are required');
      }

      // Validate phone number format
      const phoneRegex = /^(\+254|254|0)?7\d{8}$/;
      if (!phoneRegex.test(data.phone)) {
        throw new BadRequestException('Invalid phone number format. Use format: +254712345678');
      }

      // Normalize phone number
      let normalizedPhone = data.phone;
      if (normalizedPhone.startsWith('0')) {
        normalizedPhone = '254' + normalizedPhone.substring(1);
      } else if (normalizedPhone.startsWith('+254')) {
        normalizedPhone = normalizedPhone.substring(1);
      }

      // Simulate STK push
      const checkoutRequestId = `STK_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      console.log(`M-PESA STK Push initiated for ${normalizedPhone}, Amount: ${data.amount}, Description: ${data.description}`);
      
      // Simulate async payment processing
      setTimeout(() => {
        console.log(`Payment callback received for ${checkoutRequestId}: SUCCESS`);
      }, 5000);

      return this.handleSuccess({
        checkoutRequestId,
        merchantRequestId: `MERCH_${Date.now()}`,
        responseCode: '0',
        responseDescription: 'Success. Request accepted for processing',
        customerMessage: 'Success. Request accepted for processing'
      }, 'STK Push initiated successfully. Please check your phone and enter your M-PESA PIN.');
      
    } catch (error) {
      console.error('M-PESA STK Push error:', error);
      return this.handleError(error);
    }
  }

  @Public()
  @Get('mpesa/status/:checkoutRequestId')
  async checkPaymentStatus(@Param('checkoutRequestId') checkoutRequestId: string) {
    try {
      // In a real implementation, you would query M-PESA API for transaction status
      
      // Simulate successful payment after some time
      const isOldRequest = Date.now() - parseInt(checkoutRequestId.split('_')[1]) > 30000; // 30 seconds
      
      if (isOldRequest) {
        return this.handleSuccess({
          resultCode: '0',
          resultDesc: 'The service request is processed successfully.',
          callbackMetadata: {
            amount: 2000,
            mpesaReceiptNumber: `OEI2AK4Q16`,
            transactionDate: new Date().toISOString(),
            phoneNumber: '254712345678'
          }
        }, 'Payment completed successfully');
      } else {
        return this.handleSuccess({
          resultCode: '1032',
          resultDesc: 'Request cancelled by user'
        }, 'Payment still pending');
      }
      
    } catch (error) {
      return this.handleError(error);
    }
  }

  @Public()
  @Post('consultation')
  async payForConsultation(@Body() data: ConsultationPaymentRequest) {
    try {
      if (!data.name || !data.phone || !data.amount || !data.consultationType || !data.consultationDate || !data.consultationTime) {
        throw new BadRequestException('All fields are required for consultation payment');
      }

      // First initiate M-PESA payment
      const stkResponse = await this.initiateSTKPush({
        phone: data.phone,
        amount: data.amount,
        description: `Galloways Consultation - ${data.consultationType} on ${data.consultationDate}`
      });

      // Store consultation booking (in real app, save to database)
      const bookingRef = `GC-${Date.now().toString().slice(-8)}`;
      
      console.log('Consultation booking created:', {
        bookingRef,
        ...data,
        paymentStatus: 'PENDING',
        createdAt: new Date()
      });

      // Simulate booking confirmation after payment
      setTimeout(() => {
        console.log(`Consultation ${bookingRef} confirmed after successful payment`);
      }, 10000);

      return this.handleSuccess({
        bookingRef,
        paymentRequest: stkResponse,
        message: 'Consultation booking created. Please complete M-PESA payment to confirm your booking.'
      }, 'Consultation payment initiated successfully');

    } catch (error) {
      console.error('Consultation payment error:', error);
      return this.handleError(error);
    }
  }

  @Public()
  @Post()
  async createPayment(@Body() data: any) {
    try {
      // Generic payment creation for other services
      const paymentRef = `GAL-${Date.now().toString().slice(-8)}`;
      
      console.log('Generic payment created:', {
        paymentRef,
        ...data,
        status: 'PENDING',
        createdAt: new Date()
      });

      return this.handleSuccess({
        paymentRef,
        status: 'PENDING',
        ...data
      }, 'Payment record created successfully');

    } catch (error) {
      return this.handleError(error);
    }
  }
}
