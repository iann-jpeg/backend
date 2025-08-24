import { Module } from '@nestjs/common';
import { DocumentsController } from '../controllers/documents.controller';

@Module({
  controllers: [DocumentsController],
})
export class DocumentsModule {}
