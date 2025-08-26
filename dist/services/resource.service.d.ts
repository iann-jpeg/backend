import { Response } from 'express';
import * as fs from 'fs';
import { CreateResourceDto, UpdateResourceDto } from '../config/resource.dto';
export declare class ResourceService {
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
    findOne(id: number): Promise<any>;
    create(data: CreateResourceDto, file?: Express.Multer.File, createdBy?: number): Promise<{
        success: boolean;
        message: string;
        data: any;
    }>;
    update(id: number, data: UpdateResourceDto): Promise<{
        success: boolean;
        message: string;
        data: any;
    }>;
    remove(id: number): Promise<{
        success: boolean;
        message: string;
    }>;
    downloadResource(id: number, res: Response): Promise<fs.ReadStream>;
    serveFile(filename: string, res: Response): Promise<fs.ReadStream>;
    getCategories(): Promise<{
        success: boolean;
        data: any;
    }>;
}
