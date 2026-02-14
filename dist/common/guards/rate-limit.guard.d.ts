import { CanActivate, ExecutionContext } from '@nestjs/common';
import { RateLimitService } from '../../rate-limit/rate-limit.service';
import { AuditService } from '../../audit/audit.service';
export declare class RateLimitGuard implements CanActivate {
    private rateLimitService;
    private auditService;
    constructor(rateLimitService: RateLimitService, auditService: AuditService);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
