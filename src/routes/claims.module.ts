import { Module } from '@nestjs/common';
import { ClaimsController } from '../controllers/claims.controller';
import { ClaimsService } from '../services/claims.service';
import { EmailService } from '../services/email.service';

@Module({
  controllers: [ClaimsController],
  providers: [ClaimsService, EmailService],
})
export class ClaimsModule {}
