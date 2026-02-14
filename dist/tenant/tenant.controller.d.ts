import { TenantService } from './tenant.service';
import { CreateTenantDto } from './create-tenant.dto';
export declare class TenantController {
    private readonly tenantService;
    constructor(tenantService: TenantService);
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
}
