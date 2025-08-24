import { Controller, Get, Post, Put, Delete, Param, Body, Query, BadRequestException, NotFoundException, ValidationPipe, UsePipes } from '@nestjs/common';
import { Public } from '../middleware/public.decorator';
import { ConsultationsService } from '../services/consultations.service';
import { CreateConsultationDto, UpdateConsultationDto } from '../config/consultation.dto';
import { BaseController } from './base.controller';

@Controller('consultations')
export class ConsultationsController extends BaseController {
  constructor(private readonly consultationsService: ConsultationsService) {
    super();
  }

  @Public()
  @Get()
  async findAll(@Query('page') page?: number, @Query('limit') limit?: number) {
    try {
      const consultations = await this.consultationsService.findAll({ page, limit });
      return this.handleSuccess(consultations, 'Consultations retrieved successfully');
    } catch (error) {
      return this.handleError(error);
    }
  }

  @Public()
  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const consultation = await this.consultationsService.findOne(+id);
      if (!consultation) {
        throw new NotFoundException('Consultation not found');
      }
      return this.handleSuccess(consultation, 'Consultation retrieved successfully');
    } catch (error) {
      return this.handleError(error);
    }
  }

  @Post()
  @Public()
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async create(@Body() data: CreateConsultationDto) {
    try {
      console.log('Received consultation data:', data);
      
      // Validate required fields explicitly
      if (!data.name || !data.email || !data.phone || !data.serviceType || !data.consultationDate || !data.consultationTime || !data.message) {
        throw new BadRequestException('All required fields must be provided: name, email, phone, serviceType, consultationDate, consultationTime, message');
      }

      const consultation = await this.consultationsService.create(data);
      return this.handleSuccess(
        consultation,
        'Your consultation has been booked successfully. You will receive a confirmation email shortly.'
      );
    } catch (error) {
      console.error('Error creating consultation:', error);
      if (error instanceof BadRequestException) {
        throw error;
      }
      if (error instanceof Error) {
        return this.handleError(new BadRequestException(error.message));
      }
      return this.handleError(new BadRequestException('Failed to book consultation. Please try again.'));
    }
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() data: UpdateConsultationDto) {
    try {
      const consultation = await this.consultationsService.update(+id, data);
      if (!consultation) {
        throw new NotFoundException('Consultation not found');
      }
      return this.handleSuccess(consultation, 'Consultation updated successfully');
    } catch (error) {
      return this.handleError(error);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      const consultation = await this.consultationsService.remove(+id);
      if (!consultation) {
        throw new NotFoundException('Consultation not found');
      }
      return this.handleSuccess(null, 'Consultation deleted successfully');
    } catch (error) {
      return this.handleError(error);
    }
  }
}
