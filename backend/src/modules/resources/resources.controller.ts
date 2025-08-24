import { Controller, Get, Param, Res } from '@nestjs/common';
import { ResourcesService } from './resources.service';
import { Response } from 'express';

@Controller('resources')
export class ResourcesController {
  constructor(private readonly resourcesService: ResourcesService) {}

  @Get('public')
  async getResources() {
    return this.resourcesService.getResources();
  }

  @Get('download/:id')
  async downloadResource(@Param('id') id: string, @Res() res: Response) {
    // TODO: Stream file from storage
    res.setHeader('Content-Type', 'application/pdf');
    res.send(Buffer.from('%PDF-1.4\n%...mock resource pdf...'));
  }
}
