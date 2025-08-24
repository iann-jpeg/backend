import { Controller, Post, Get, Body } from '@nestjs/common';
import { ConsultationsService } from './consultations.service';

@Controller('consultations')
export class ConsultationsController {
  constructor(private readonly consultationsService: ConsultationsService) {}

  @Post()
  async createConsultation(@Body() body: any) {
    return this.consultationsService.createConsultation(body);
  }

  @Get()
  async getConsultations() {
    return this.consultationsService.getConsultations();
  }
}
