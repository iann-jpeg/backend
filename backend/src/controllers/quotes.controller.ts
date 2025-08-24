import { Controller, Get, Post, Put, Delete, Param, Body, Query, UploadedFile, UseInterceptors, BadRequestException } from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { UploadedFiles } from '@nestjs/common';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { QuotesService } from '../services/quotes.service';
import { CreateQuoteDto, UpdateQuoteDto } from '../config/quote.dto';
import { BaseController } from './base.controller';
import { Public } from '../middleware/public.decorator';

@Controller('quotes')
export class QuotesController extends BaseController {
  constructor(private readonly quotesService: QuotesService) {
    super();
  }

  @Public()
  @Get()
  async findAll(@Query('page') page?: number, @Query('limit') limit?: number) {
    try {
      const quotes = await this.quotesService.findAll({ page, limit });
      return this.handleSuccess(quotes, 'Quotes retrieved successfully');
    } catch (error) {
      return this.handleError(error);
    }
  }

  @Public()
  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const quote = await this.quotesService.findOne(+id);
      if (!quote) {
        throw new BadRequestException('Quote not found');
      }
      return this.handleSuccess(quote, 'Quote retrieved successfully');
    } catch (error) {
      return this.handleError(error);
    }
  }

  @Public()
  @Post()
  @UseInterceptors(
    FilesInterceptor('document', 10, {
      storage: diskStorage({
        destination: './uploads/quotes',
        filename: (req: any, file: any, callback: any) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
          const ext = extname(file.originalname);
          callback(null, `quote-${uniqueSuffix}${ext}`);
        },
      }),
      fileFilter: (req: any, file: any, callback: any) => {
        if (!file.originalname.match(/\.(pdf|jpg|jpeg|png|doc|docx)$/)) {
          return callback(new BadRequestException('Only PDF, JPG, PNG, and DOC files are allowed!'), false);
        }
        callback(null, true);
      },
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit
      },
    })
  )
  async create(@Body() data: CreateQuoteDto, @UploadedFiles() documents?: Express.Multer.File[]) {
    try {
      const quote = await this.quotesService.createWithDocuments(data, documents);
      return this.handleSuccess(quote, 'Quote created successfully');
    } catch (error) {
      return this.handleError(error);
    }
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() data: UpdateQuoteDto) {
    try {
      const quote = await this.quotesService.update(+id, data);
      if (!quote) {
        throw new BadRequestException('Quote not found');
      }
      return this.handleSuccess(quote, 'Quote updated successfully');
    } catch (error) {
      return this.handleError(error);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      const quote = await this.quotesService.remove(+id);
      if (!quote) {
        throw new BadRequestException('Quote not found');
      }
      return this.handleSuccess(null, 'Quote deleted successfully');
    } catch (error) {
      return this.handleError(error);
    }
  }
}
