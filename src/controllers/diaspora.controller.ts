import { Controller, Get, Post, Put, Delete, Param, Body, Query, UseGuards } from '@nestjs/common';
import { DiasporaService } from '../services/diaspora.service';
import { JwtAuthGuard } from '../middleware/jwt-auth.guard';
import { CreateDiasporaDto, UpdateDiasporaDto } from '../config/diaspora.dto';
import { Public } from '../middleware/public.decorator';

@Controller('diaspora')
export class DiasporaController {
  constructor(private readonly diasporaService: DiasporaService) {}

  @Public()
  @Get()
  async findAll(@Query('page') page?: number, @Query('limit') limit?: number) {
    return this.diasporaService.findAll({ page, limit });
  }

  @Public()
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.diasporaService.findOne(+id);
  }

  @Public()
  @Post()
  async create(@Body() data: CreateDiasporaDto) {
    return this.diasporaService.create(data);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() data: UpdateDiasporaDto) {
    return this.diasporaService.update(+id, data);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.diasporaService.remove(+id);
  }
}
