import { Controller, Get, Post, Put, Delete, Param, Body, Query, UseGuards, UploadedFile, UseInterceptors, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { OutsourcingService } from '../services/outsourcing.service';
import { CreateOutsourcingRequestDto, UpdateOutsourcingRequestDto } from '../config/outsourcing.dto';
import { JwtAuthGuard } from '../middleware/jwt-auth.guard';
import { RolesGuard } from '../middleware/roles.guard';
import { Roles } from '../middleware/roles.decorator';
import { Public } from '../middleware/public.decorator';

@Controller('outsourcing')
export class OutsourcingController {
  constructor(private readonly outsourcingService: OutsourcingService) {}

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('status') status?: string,
  ) {
    return this.outsourcingService.findAll(+page, +limit, status);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async findOne(@Param('id') id: string) {
    return this.outsourcingService.findOne(+id);
  }

  @Public()
  @Post()
  @UseInterceptors(
    FileInterceptor('document', {
      storage: diskStorage({
        destination: './uploads/outsourcing',
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
          const ext = extname(file.originalname);
          callback(null, `outsourcing-${uniqueSuffix}${ext}`);
        },
      }),
      fileFilter: (req, file, callback) => {
        const allowedTypes = /\.(pdf|jpg|jpeg|png|doc|docx)$/;
        if (allowedTypes.test(file.originalname.toLowerCase())) {
          callback(null, true);
        } else {
          callback(new BadRequestException('Invalid file type'), false);
        }
      },
      limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    }),
  )
  async create(
    @Body() createOutsourcingRequestDto: CreateOutsourcingRequestDto,
    @UploadedFile() document?: Express.Multer.File
  ) {
    return this.outsourcingService.create(createOutsourcingRequestDto, document);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async update(
    @Param('id') id: string,
    @Body() updateOutsourcingRequestDto: UpdateOutsourcingRequestDto,
  ) {
    return this.outsourcingService.update(+id, updateOutsourcingRequestDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async remove(@Param('id') id: string) {
    return this.outsourcingService.remove(+id);
  }

  @Put(':id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async updateStatus(
    @Param('id') id: string,
    @Body() body: { status: string }
  ) {
    return this.outsourcingService.updateStatus(+id, body.status);
  }
}
