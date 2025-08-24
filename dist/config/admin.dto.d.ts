export declare class UpdateSettingsDto {
    siteName?: string;
    adminEmail?: string;
    maintenanceMode?: boolean;
    emailNotifications?: boolean;
    backupEnabled?: boolean;
    maxFileSize?: number;
    allowedFileTypes?: string[];
}
export declare class UpdateUserStatusDto {
    status?: string;
}
export declare class UpdateClaimStatusDto {
    status?: string;
}
export declare class CreateNotificationDto {
    title?: string;
    message?: string;
    type?: string;
}
