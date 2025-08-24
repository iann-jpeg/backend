import { Module } from '@nestjs/common';
import { DiasporaController } from '../controllers/diaspora.controller';
import { DiasporaService } from '../services/diaspora.service';

@Module({
  controllers: [DiasporaController],
  providers: [DiasporaService],
})
export class DiasporaModule {}
