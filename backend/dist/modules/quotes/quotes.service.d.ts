export declare class QuotesService {
    createQuote(formData: any): Promise<{
        success: boolean;
        message: any;
    } | {
        success: boolean;
        quote: {
            id: number;
            email: string;
            createdAt: Date;
            updatedAt: Date;
            product: string;
            userId: number | null;
            status: string;
            firstName: string;
            lastName: string;
            phone: string;
            location: string | null;
            budget: string | null;
            coverage: string | null;
            details: string | null;
            contactMethod: string;
            bestTime: string | null;
        };
    }>;
    getQuotes(page?: number, limit?: number): Promise<{
        success: boolean;
        message: any;
    } | {
        quotes: {
            id: number;
            email: string;
            createdAt: Date;
            updatedAt: Date;
            product: string;
            userId: number | null;
            status: string;
            firstName: string;
            lastName: string;
            phone: string;
            location: string | null;
            budget: string | null;
            coverage: string | null;
            details: string | null;
            contactMethod: string;
            bestTime: string | null;
        }[];
        total: number;
    }>;
}
