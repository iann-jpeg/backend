import { Controller, Post, Get, Body } from '@nestjs/common';
import { DiasporaService } from './diaspora.service';

@Controller('diaspora')
export class DiasporaController {
  constructor(private readonly diasporaService: DiasporaService) {}

  @Post()
  async createDiasporaRequest(@Body() body: any) {
    return this.diasporaService.createDiasporaRequest(body);
  }

  @Get()
  async getDiasporaRequests() {
    return this.diasporaService.getDiasporaRequests();
  }
}
