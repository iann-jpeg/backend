import { Module } from '@nestjs/common';
import { OutsourcingController } from '../controllers/outsourcing.controller';
import { OutsourcingService } from '../services/outsourcing.service';

@Module({
  controllers: [OutsourcingController],
  providers: [OutsourcingService],
})
export class OutsourcingModule {}
