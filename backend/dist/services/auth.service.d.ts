import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto, LoginDto } from '../config/auth.dto';
export declare class AuthService {
    private prisma;
    private readonly JWT_SECRET;
    private readonly REFRESH_TOKEN_SECRET;
    constructor(prisma: PrismaService);
    register(dto: RegisterDto): Promise<{
        success: boolean;
        message: string;
        user: {
            name: string;
            id: number;
            email: string;
            role: import(".prisma/client").$Enums.Role;
            createdAt: Date;
        };
    }>;
    registerAdmin(dto: RegisterDto): Promise<{
        success: boolean;
        message: string;
        user: {
            name: string;
            id: number;
            email: string;
            role: import(".prisma/client").$Enums.Role;
            createdAt: Date;
        };
    }>;
    login(dto: LoginDto): Promise<{
        success: boolean;
        data: {
            access_token: string;
            refresh_token: string;
            user: {
                name: string;
                id: number;
                email: string;
                role: import(".prisma/client").$Enums.Role;
                createdAt: Date;
            };
        };
    }>;
    logout(user: any): Promise<{
        success: boolean;
        message: string;
    }>;
    refresh(refreshToken: string): Promise<{
        success: boolean;
        data: {
            access_token: string;
            user: {
                name: string;
                id: number;
                email: string;
                role: import(".prisma/client").$Enums.Role;
            };
        };
    }>;
    getProfile(userId: number): Promise<{
        success: boolean;
        data: {
            name: string;
            id: number;
            email: string;
            role: import(".prisma/client").$Enums.Role;
            createdAt: Date;
            updatedAt: Date;
        };
    }>;
    verifyToken(token: string): Promise<any>;
    createInitialAdmin(dto: RegisterDto, setupKey?: string): Promise<{
        success: boolean;
        message: string;
        user: {
            name: string;
            id: number;
            email: string;
            role: import(".prisma/client").$Enums.Role;
            createdAt: Date;
        };
    }>;
    promoteUserToAdmin(userId: number, currentAdminId: number): Promise<{
        success: boolean;
        message: string;
        user: {
            name: string;
            id: number;
            email: string;
            role: import(".prisma/client").$Enums.Role;
            updatedAt: Date;
        };
    }>;
    isAdmin(userId: number): Promise<boolean>;
}
