import { Module } from '@nestjs/common';
import { QuotesController } from '../controllers/quotes.controller';
import { QuotesService } from '../services/quotes.service';
import { EmailService } from '../services/email.service';

@Module({
  controllers: [QuotesController],
  providers: [QuotesService, EmailService],
})
export class QuotesModule {}
