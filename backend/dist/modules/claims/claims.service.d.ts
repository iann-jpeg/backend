export declare class ClaimsService {
    createClaim(formData: any): Promise<{
        success: boolean;
        message: any;
    } | {
        success: boolean;
        claim: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            description: string;
            userId: number | null;
            policyNumber: string;
            claimType: string;
            incidentDate: Date;
            estimatedLoss: number;
            status: string;
            submitterEmail: string | null;
            submitterName: string | null;
            submitterPhone: string | null;
        };
    }>;
    getClaims(page?: number, limit?: number): Promise<{
        success: boolean;
        message: any;
    } | {
        claims: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            description: string;
            userId: number | null;
            policyNumber: string;
            claimType: string;
            incidentDate: Date;
            estimatedLoss: number;
            status: string;
            submitterEmail: string | null;
            submitterName: string | null;
            submitterPhone: string | null;
        }[];
        total: number;
    }>;
    getClaim(id: string): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        userId: number | null;
        policyNumber: string;
        claimType: string;
        incidentDate: Date;
        estimatedLoss: number;
        status: string;
        submitterEmail: string | null;
        submitterName: string | null;
        submitterPhone: string | null;
    } | {
        success: boolean;
        message: any;
    }>;
    updateClaimStatus(id: string, status: string): Promise<{
        success: boolean;
        message: any;
    } | {
        success: boolean;
        claim: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            description: string;
            userId: number | null;
            policyNumber: string;
            claimType: string;
            incidentDate: Date;
            estimatedLoss: number;
            status: string;
            submitterEmail: string | null;
            submitterName: string | null;
            submitterPhone: string | null;
        };
    }>;
}
