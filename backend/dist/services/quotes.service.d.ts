import { EmailService } from './email.service';
import { CreateQuoteDto, UpdateQuoteDto } from '../config/quote.dto';
export declare class QuotesService {
    private readonly emailService;
    constructor(emailService: EmailService);
    findAll({ page, limit }: {
        page?: number;
        limit?: number;
    }): Promise<{
        data: {
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
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOne(id: number): Promise<{
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
    }>;
    create(data: CreateQuoteDto): Promise<{
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
    }>;
    update(id: number, data: UpdateQuoteDto): Promise<{
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
    }>;
    remove(id: number): Promise<{
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
    }>;
}
