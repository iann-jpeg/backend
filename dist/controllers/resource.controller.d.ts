import { Response } from 'express';
import { ResourceService } from '../services/resource.service';
import { CreateResourceDto, UpdateResourceDto } from '../config/resource.dto';
export declare class ResourceController {
    private readonly resourceService;
    constructor(resourceService: ResourceService);
    findAll(page?: number, limit?: number, category?: string, adminOnly?: boolean): Promise<{
        data: any;
        pagination: {
            page: number;
            limit: number;
            total: any;
            totalPages: number;
        };
    }>;
    findPublicResources(category?: string): Promise<{
        success: boolean;
        data: any;
    }>;
    findOne(id: string): Promise<any>;
    downloadResource(id: string, res: Response): Promise<import("fs").ReadStream>;
    serveFile(filename: string, res: Response): Promise<import("fs").ReadStream>;
    create(createResourceDto: CreateResourceDto, file?: Express.Multer.File): Promise<{
        success: boolean;
        message: string;
        data: any;
    }>;
    update(id: string, updateResourceDto: UpdateResourceDto): Promise<{
        success: boolean;
        message: string;
        data: any;
    }>;
    remove(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
