import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  async createPayment(@Body() body: any) {
    return this.paymentsService.createPayment(body);
  }

  @Post('process/:id')
  async processPayment(@Param('id') id: string, @Body() body: any) {
    return this.paymentsService.processPayment(id, body);
  }

  @Get(':id/status')
  async getPaymentStatus(@Param('id') id: string) {
    return this.paymentsService.getPaymentStatus(id);
  }
}
