import { Controller, Post, Get, Body } from '@nestjs/common';
import { OutsourcingService } from './outsourcing.service';

@Controller('outsourcing')
export class OutsourcingController {
  constructor(private readonly outsourcingService: OutsourcingService) {}

  @Post()
  async createOutsourcingRequest(@Body() body: any) {
    return this.outsourcingService.createOutsourcingRequest(body);
  }

  @Get()
  async getOutsourcingRequests() {
    return this.outsourcingService.getOutsourcingRequests();
  }
}
