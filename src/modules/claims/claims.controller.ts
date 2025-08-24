import { Controller, Post, Get, Put, Param, Body, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ClaimsService } from './claims.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('claims')
export class ClaimsController {
  constructor(private readonly claimsService: ClaimsService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async createClaim(@UploadedFile() file: Express.Multer.File, @Body() body: any) {
    return this.claimsService.createClaim({ ...body, file });
  }

  @Get()
  async getClaims() {
    return this.claimsService.getClaims();
  }

  @Get(':id')
  async getClaim(@Param('id') id: string) {
    return this.claimsService.getClaim(id);
  }

  @Put(':id/status')
  async updateClaimStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.claimsService.updateClaimStatus(id, status);
  }
}
