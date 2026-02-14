import { PrismaService } from '../prisma/prisma.service';
import { CreateTenantDto } from './create-tenant.dto';
export declare class TenantService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createTenantDto: CreateTenantDto): Promise<{
        apiKey: string;
        id: string;
        name: string;
        subdomain: string;
        plan: import(".prisma/client").$Enums.Plan;
        status: import(".prisma/client").$Enums.TenantStatus;
        rateLimitPerMinute: number;
        rateLimitPerHour: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findAll(): Promise<{
        id: string;
        name: string;
        subdomain: string;
        apiKey: string;
        plan: import(".prisma/client").$Enums.Plan;
        status: import(".prisma/client").$Enums.TenantStatus;
        rateLimitPerMinute: number;
        rateLimitPerHour: number;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        name: string;
        subdomain: string;
        apiKey: string;
        plan: import(".prisma/client").$Enums.Plan;
        status: import(".prisma/client").$Enums.TenantStatus;
        rateLimitPerMinute: number;
        rateLimitPerHour: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findByApiKey(apiKey: string): Promise<{
        id: string;
        name: string;
        subdomain: string;
        apiKey: string;
        plan: import(".prisma/client").$Enums.Plan;
        status: import(".prisma/client").$Enums.TenantStatus;
        rateLimitPerMinute: number;
        rateLimitPerHour: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
    update(id: string, updateData: any): Promise<{
        id: string;
        name: string;
        subdomain: string;
        apiKey: string;
        plan: import(".prisma/client").$Enums.Plan;
        status: import(".prisma/client").$Enums.TenantStatus;
        rateLimitPerMinute: number;
        rateLimitPerHour: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
    private generateApiKey;
    private hashApiKey;
}
