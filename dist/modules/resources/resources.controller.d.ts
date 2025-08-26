import { ResourcesService } from './resources.service';
import { Response } from 'express';
export declare class ResourcesController {
    private readonly resourcesService;
    constructor(resourcesService: ResourcesService);
    getResources(): Promise<any>;
    downloadResource(id: string, res: Response): Promise<void>;
}
