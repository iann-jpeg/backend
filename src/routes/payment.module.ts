import { Module } from '@nestjs/common';
import { PaymentController } from '../controllers/payment.controller';
import { PaymentsController } from '../controllers/payments.controller';
import { PaymentService } from '../services/payment.service';

@Module({
  controllers: [PaymentController, PaymentsController],
  providers: [PaymentService],
})
export class PaymentModule {}
