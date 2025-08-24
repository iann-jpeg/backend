import { Module } from '@nestjs/common';
import { ConsultationsController } from '../controllers/consultations.controller';
import { ConsultationsService } from '../services/consultations.service';
import { EmailService } from '../services/email.service';

@Module({
  controllers: [ConsultationsController],
  providers: [ConsultationsService, EmailService],
})
export class ConsultationsModule {}
