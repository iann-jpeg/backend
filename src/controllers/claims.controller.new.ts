import { Controller, Get, Post, Put, Delete, Param, Body, Query, UploadedFile, UseInterceptors, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ClaimsService } from '../services/claims.service';
import { CreateClaimDto, UpdateClaimDto } from '../config/claim.dto';

@Controller('claims')
export class ClaimsController {
  constructor(private readonly claimsService: ClaimsService) {}

  @Get()
  async findAll(@Query('page') page?: number, @Query('limit') limit?: number) {
    try {
      const claims = await this.claimsService.findAll({ page, limit });
      return {
        success: true,
        data: claims
      };
    } catch (error: any) {
      throw new BadRequestException(error.message || 'Failed to fetch claims');
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const claim = await this.claimsService.findOne(+id);
      return {
        success: true,
        data: claim
      };
    } catch (error: any) {
      throw new BadRequestException(error.message || 'Failed to fetch claim');
    }
  }

  @Post()
  @UseInterceptors(
    FileInterceptor('document', {
      storage: diskStorage({
        destination: './uploads/claims',
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
          const ext = extname(file.originalname);
          callback(null, `claim-${uniqueSuffix}${ext}`);
        },
      }),
      fileFilter: (req, file, callback) => {
        if (!file.originalname.match(/\.(pdf|jpg|jpeg|png|doc|docx)$/)) {
          return callback(new BadRequestException('Only PDF, JPG, PNG, and DOC files are allowed!'), false);
        }
        callback(null, true);
      },
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit
      },
    }),
  )
  async create(@Body() data: CreateClaimDto, @UploadedFile() document?: Express.Multer.File) {
    try {
      if (document) {
        data.documentPath = document.path;
      }
      const claim = await this.claimsService.create(data);
      return {
        success: true,
        message: 'Claim submitted successfully',
        data: claim
      };
    } catch (error: any) {
      throw new BadRequestException(error.message || 'Failed to submit claim');
    }
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() data: UpdateClaimDto) {
    try {
      const claim = await this.claimsService.update(+id, data);
      return {
        success: true,
        message: 'Claim updated successfully',
        data: claim
      };
    } catch (error: any) {
      throw new BadRequestException(error.message || 'Failed to update claim');
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      await this.claimsService.remove(+id);
      return {
        success: true,
        message: 'Claim deleted successfully'
      };
    } catch (error: any) {
      throw new BadRequestException(error.message || 'Failed to delete claim');
    }
  }
}
