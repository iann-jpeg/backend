import { Module } from '@nestjs/common';
import { DiasporaService } from './diaspora.service';
import { DiasporaController } from './diaspora.controller';

@Module({
  providers: [DiasporaService],
  controllers: [DiasporaController],
})
export class DiasporaModule {}
