import { PrismaService } from '../prisma/prisma.service';
export interface AuditLogData {
    tenantId: string;
    action: string;
    resource: string;
    resourceId?: string;
    userId?: string;
    userName?: string;
    method?: string;
    path?: string;
    metadata?: any;
    success?: boolean;
    errorMessage?: string;
}
export declare class AuditService {
    private prisma;
    constructor(prisma: PrismaService);
    log(data: AuditLogData): Promise<void>;
    getLogs(tenantId: string, options?: {
        action?: string;
        resource?: string;
        userId?: string;
        limit?: number;
    }): Promise<{
        id: string;
        createdAt: Date;
        tenantId: string;
        path: string | null;
        action: import(".prisma/client").$Enums.AuditAction;
        resource: string;
        resourceId: string | null;
        userId: string | null;
        userName: string | null;
        method: string | null;
        metadata: import("@prisma/client/runtime/library").JsonValue;
        success: boolean;
        errorMessage: string | null;
    }[]>;
}
