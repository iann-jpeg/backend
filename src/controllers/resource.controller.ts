import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Delete, 
  Param, 
  Body, 
  Query, 
  UseGuards, 
  UploadedFile,
  UseInterceptors,
  Res,
  BadRequestException
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { ResourceService } from '../services/resource.service';
import { CreateResourceDto, UpdateResourceDto } from '../config/resource.dto';
import { JwtAuthGuard } from '../middleware/jwt-auth.guard';
import { RolesGuard } from '../middleware/roles.guard';
import { Roles } from '../middleware/roles.decorator';
import { Public } from '../middleware/public.decorator';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('resources')
export class ResourceController {
  constructor(private readonly resourceService: ResourceService) {}

  @Get()
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('category') category?: string,
    @Query('adminOnly') adminOnly?: boolean,
  ) {
    return this.resourceService.findAll(+page, +limit, category, adminOnly);
  }

  @Get('public')
  @Public()
  async findPublicResources(
    @Query('category') category?: string,
  ) {
    return this.resourceService.findPublicResources(category);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.resourceService.findOne(+id);
  }

  @Get('download/:id')
  async downloadResource(@Param('id') id: string, @Res() res: Response) {
    return this.resourceService.downloadResource(+id, res);
  }

  @Get('serve/:filename')
  @Public()
  async serveFile(@Param('filename') filename: string, @Res() res: Response) {
    return this.resourceService.serveFile(filename, res);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/resources',
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
          const ext = extname(file.originalname);
          callback(null, `resource-${uniqueSuffix}${ext}`);
        },
      }),
      fileFilter: (req, file, callback) => {
        const allowedTypes = /\.(pdf|jpg|jpeg|png|doc|docx|xls|xlsx|zip)$/;
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
    @Body() createResourceDto: CreateResourceDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.resourceService.create(createResourceDto, file);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async update(
    @Param('id') id: string,
    @Body() updateResourceDto: UpdateResourceDto,
  ) {
    return this.resourceService.update(+id, updateResourceDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async remove(@Param('id') id: string) {
    return this.resourceService.remove(+id);
  }
}
