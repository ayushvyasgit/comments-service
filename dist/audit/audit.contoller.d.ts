import { AuditService } from './audit.service';
export declare class AuditController {
    private readonly auditService;
    constructor(auditService: AuditService);
    getLogs(tenantId: string, action?: string, resource?: string, userId?: string, limit?: string): Promise<{
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
