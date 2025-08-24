import { ResourcesService } from './resources.service';
import { Response } from 'express';
export declare class ResourcesController {
    private readonly resourcesService;
    constructor(resourcesService: ResourcesService);
    getResources(): Promise<{
        success: boolean;
        message: any;
    } | {
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
    }[]>;
    downloadResource(id: string, res: Response): Promise<void>;
}
