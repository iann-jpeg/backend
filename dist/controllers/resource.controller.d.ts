import { Response } from 'express';
import { ResourceService } from '../services/resource.service';
import { CreateResourceDto, UpdateResourceDto } from '../config/resource.dto';
export declare class ResourceController {
    private readonly resourceService;
    constructor(resourceService: ResourceService);
    findAll(page?: number, limit?: number, category?: string, adminOnly?: boolean): Promise<{
        data: ({
            creator: {
                name: string;
                id: number;
                email: string;
            } | null;
        } & {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            category: string;
            title: string;
            filePath: string | null;
            fileSize: number | null;
            adminOnly: boolean;
            createdBy: number | null;
        })[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    findPublicResources(category?: string): Promise<{
        success: boolean;
        data: {
            id: number;
            createdAt: Date;
            description: string | null;
            category: string;
            title: string;
            filePath: string | null;
            fileSize: number | null;
        }[];
    }>;
    findOne(id: string): Promise<{
        creator: {
            name: string;
            id: number;
            email: string;
        } | null;
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        category: string;
        title: string;
        filePath: string | null;
        fileSize: number | null;
        adminOnly: boolean;
        createdBy: number | null;
    }>;
    downloadResource(id: string, res: Response): Promise<import("fs").ReadStream>;
    serveFile(filename: string, res: Response): Promise<import("fs").ReadStream>;
    create(createResourceDto: CreateResourceDto, file?: Express.Multer.File): Promise<{
        success: boolean;
        message: string;
        data: {
            creator: {
                name: string;
                id: number;
                email: string;
            } | null;
        } & {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            category: string;
            title: string;
            filePath: string | null;
            fileSize: number | null;
            adminOnly: boolean;
            createdBy: number | null;
        };
    }>;
    update(id: string, updateResourceDto: UpdateResourceDto): Promise<{
        success: boolean;
        message: string;
        data: {
            creator: {
                name: string;
                id: number;
                email: string;
            } | null;
        } & {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            category: string;
            title: string;
            filePath: string | null;
            fileSize: number | null;
            adminOnly: boolean;
            createdBy: number | null;
        };
    }>;
    remove(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
