export declare class ResourcesService {
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
    downloadResource(id: string): Promise<{
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
    } | {
        success: boolean;
        message: any;
    }>;
}
