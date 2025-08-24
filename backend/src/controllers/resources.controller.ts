import { Controller, Post, Body, Get, Param, BadRequestException, NotFoundException } from '@nestjs/common';
import { Public } from '../middleware/public.decorator';
import { BaseController } from './base.controller';

interface ResourceDownloadRequest {
  resourceType: string;
  email?: string;
  company?: string;
  purpose?: string;
}

interface ResourceData {
  id: string;
  name: string;
  type: string;
  description: string;
  downloadCount: number;
  fileSize: string;
  format: string;
  createdAt: Date;
}

@Controller('resources')
export class ResourceController extends BaseController {
  
  // Mock resource data
  private mockResources: ResourceData[] = [
    {
      id: 'brochure-2024',
      name: 'Company Brochure 2024',
      type: 'brochure',
      description: 'Comprehensive overview of Galloways services and capabilities',
      downloadCount: 245,
      fileSize: '2.5 MB',
      format: 'PDF',
      createdAt: new Date('2024-01-01')
    },
    {
      id: 'service-catalog',
      name: 'Service Catalog',
      type: 'catalog',
      description: 'Detailed catalog of all services offered',
      downloadCount: 189,
      fileSize: '3.2 MB',
      format: 'PDF',
      createdAt: new Date('2024-01-15')
    },
    {
      id: 'case-studies',
      name: 'Case Studies Collection',
      type: 'case-studies',
      description: 'Success stories and project case studies',
      downloadCount: 156,
      fileSize: '4.1 MB',
      format: 'PDF',
      createdAt: new Date('2024-02-01')
    }
  ];

  @Public()
  @Get()
  async getAllResources() {
    try {
      return this.handleSuccess(this.mockResources, 'Resources retrieved successfully');
    } catch (error) {
      return this.handleError(error);
    }
  }

  @Public()
  @Get(':id')
  async getResourceById(@Param('id') id: string) {
    try {
      const resource = this.mockResources.find(r => r.id === id);
      
      if (!resource) {
        throw new NotFoundException(`Resource with ID ${id} not found`);
      }

      return this.handleSuccess(resource, 'Resource retrieved successfully');
    } catch (error) {
      return this.handleError(error);
    }
  }

  @Public()
  @Post('download')
  async downloadResource(@Body() data: ResourceDownloadRequest) {
    try {
      if (!data.resourceType) {
        throw new BadRequestException('Resource type is required');
      }

      // Find the resource
      const resource = this.mockResources.find(r => 
        r.type === data.resourceType || r.id === data.resourceType
      );

      if (!resource) {
        throw new BadRequestException(`Resource type '${data.resourceType}' not found`);
      }

      // Log download request
      const downloadRef = `DL-${Date.now().toString().slice(-8)}`;
      
      console.log('Resource download requested:', {
        downloadRef,
        resourceId: resource.id,
        resourceName: resource.name,
        userEmail: data.email,
        company: data.company,
        purpose: data.purpose,
        timestamp: new Date()
      });

      // Increment download count
      resource.downloadCount += 1;

      // Simulate file generation/retrieval
      const downloadData = {
        downloadRef,
        resourceId: resource.id,
        resourceName: resource.name,
        fileSize: resource.fileSize,
        format: resource.format,
        downloadUrl: `/api/resources/file/${resource.id}/${downloadRef}`,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
        metadata: {
          downloadCount: resource.downloadCount,
          userInfo: {
            email: data.email,
            company: data.company,
            purpose: data.purpose
          }
        }
      };

      return this.handleSuccess(downloadData, `${resource.name} download prepared successfully`);

    } catch (error) {
      console.error('Resource download error:', error);
      return this.handleError(error);
    }
  }

  @Public()
  @Get('file/:resourceId/:downloadRef')
  async getResourceFile(
    @Param('resourceId') resourceId: string,
    @Param('downloadRef') downloadRef: string
  ) {
    try {
      const resource = this.mockResources.find(r => r.id === resourceId);
      
      if (!resource) {
        throw new NotFoundException('Resource not found');
      }

      // In a real implementation, you would serve the actual file
      // For now, return file metadata
      return this.handleSuccess({
        resourceId,
        downloadRef,
        fileName: `${resource.name.replace(/\s+/g, '_')}.pdf`,
        contentType: 'application/pdf',
        fileSize: resource.fileSize,
        message: 'File download would start here in a real implementation'
      }, 'File download initiated');

    } catch (error) {
      return this.handleError(error);
    }
  }

  @Public()
  @Post()
  async createResourceRequest(@Body() data: any) {
    try {
      const requestRef = `REQ-${Date.now().toString().slice(-8)}`;
      
      console.log('Resource request created:', {
        requestRef,
        ...data,
        status: 'PENDING',
        createdAt: new Date()
      });

      return this.handleSuccess({
        requestRef,
        status: 'PENDING',
        ...data,
        message: 'Resource request submitted successfully'
      }, 'Resource request created successfully');

    } catch (error) {
      return this.handleError(error);
    }
  }

  @Public()
  @Get('analytics/downloads')
  async getDownloadAnalytics() {
    try {
      const analytics = {
        totalDownloads: this.mockResources.reduce((sum, r) => sum + r.downloadCount, 0),
        resourceBreakdown: this.mockResources.map(r => ({
          resourceId: r.id,
          name: r.name,
          type: r.type,
          downloadCount: r.downloadCount,
          lastUpdated: r.createdAt
        })),
        topResources: this.mockResources
          .sort((a, b) => b.downloadCount - a.downloadCount)
          .slice(0, 5),
        downloadTrends: {
          thisWeek: Math.floor(Math.random() * 50) + 20,
          lastWeek: Math.floor(Math.random() * 50) + 15,
          thisMonth: Math.floor(Math.random() * 200) + 100,
          lastMonth: Math.floor(Math.random() * 200) + 80
        }
      };

      return this.handleSuccess(analytics, 'Download analytics retrieved successfully');
    } catch (error) {
      return this.handleError(error);
    }
  }
}
