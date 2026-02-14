import { PrismaService } from './prisma/prisma.service';
export declare class HealthController {
    private prisma;
    constructor(prisma: PrismaService);
    check(): Promise<{
        status: string;
        timestamp: string;
    }>;
    checkDatabase(): Promise<{
        status: string;
        database: string;
    }>;
}
