import { Response } from 'express';
export declare class StaticFilesController {
    downloadFile(filename: string, res: Response): Promise<void>;
    listDownloadableFiles(): Promise<{
        success: boolean;
        data: Array<{
            filename: string;
            displayName: string;
            description: string;
            category: string;
        }>;
        message: string;
    }>;
}
