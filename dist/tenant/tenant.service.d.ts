import { PrismaService } from '../prisma/prisma.service';
import { CreateTenantDto } from './create-tenant.dto';
export declare class TenantService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createTenantDto: CreateTenantDto): Promise<{
        apiKey: string;
        name: string;
        subdomain: string;
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findAll(): Promise<{
        name: string;
        subdomain: string;
        id: string;
        apiKey: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    findOne(id: string): Promise<{
        name: string;
        subdomain: string;
        id: string;
        apiKey: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findByApiKey(apiKey: string): Promise<{
        name: string;
        subdomain: string;
        id: string;
        apiKey: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    private generateApiKey;
    private hashApiKey;
}
