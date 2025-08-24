import { Controller, Post, Get, UploadedFile, UseInterceptors, Body } from '@nestjs/common';
import { QuotesService } from './quotes.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('quotes')
export class QuotesController {
  constructor(private readonly quotesService: QuotesService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async createQuote(@UploadedFile() file: Express.Multer.File, @Body() body: any) {
    return this.quotesService.createQuote({ ...body, file });
  }

  @Get()
  async getQuotes() {
    return this.quotesService.getQuotes();
  }
}
