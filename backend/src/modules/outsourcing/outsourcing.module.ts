import { Module } from '@nestjs/common';
import { OutsourcingService } from './outsourcing.service';
import { OutsourcingController } from './outsourcing.controller';

@Module({
  providers: [OutsourcingService],
  controllers: [OutsourcingController],
})
export class OutsourcingModule {}
