import { TenantService } from './tenant.service';
import { CreateTenantDto } from './create-tenant.dto';
export declare class TenantController {
    private readonly tenantService;
    constructor(tenantService: TenantService);
    create(createTenantDto: CreateTenantDto): Promise<{
        apiKey: string;
        id: string;
        subdomain: string;
        name: string;
        plan: import(".prisma/client").$Enums.Plan;
        status: import(".prisma/client").$Enums.TenantStatus;
        rateLimitPerMinute: number;
        rateLimitPerHour: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findAll(): Promise<{
        id: string;
        subdomain: string;
        apiKey: string;
        name: string;
        plan: import(".prisma/client").$Enums.Plan;
        status: import(".prisma/client").$Enums.TenantStatus;
        rateLimitPerMinute: number;
        rateLimitPerHour: number;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        subdomain: string;
        apiKey: string;
        name: string;
        plan: import(".prisma/client").$Enums.Plan;
        status: import(".prisma/client").$Enums.TenantStatus;
        rateLimitPerMinute: number;
        rateLimitPerHour: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
