import { PrismaService } from '../prisma/prisma.service';
export declare class RateLimitService {
    private prisma;
    constructor(prisma: PrismaService);
    checkRateLimit(tenantId: string, window: 'minute' | 'hour'): Promise<{
        allowed: boolean;
        remaining: number;
        limit: number;
    }>;
    incrementCounter(tenantId: string): Promise<boolean>;
}
