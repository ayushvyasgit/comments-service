import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { RateLimitService } from '../../rate-limit/rate-limit.service';
import { AuditService } from '../../audit/audit.service';
import { Response } from 'express';

@Injectable()
export class RateLimitGuard implements CanActivate {
  constructor(
    private rateLimitService: RateLimitService,
    private auditService: AuditService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse<Response>();
    const tenant = request.tenant;

    if (!tenant) {
      return true; 
    }

    const minuteCheck = await this.rateLimitService.checkRateLimit(
      tenant.id,
      'minute',
    );

    response.header('X-RateLimit-Limit', minuteCheck.limit.toString());
    response.header('X-RateLimit-Remaining', minuteCheck.remaining.toString());
    response.header('X-RateLimit-Window', 'minute');

    if (!minuteCheck.allowed) {
      // Log rate limit exceeded
      await this.auditService.log({
        tenantId: tenant.id,
        action: 'RATE_LIMIT_EXCEEDED',
        resource: 'api',
        method: request.method,
        path: request.url,
        metadata: {
          window: 'minute',
          limit: minuteCheck.limit,
        },
        success: false,
      });

      throw new HttpException(
        {
          statusCode: HttpStatus.TOO_MANY_REQUESTS,
          message: 'Rate limit exceeded',
          limit: minuteCheck.limit,
          remaining: 0,
          window: 'minute',
        },
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    return true;
  }
}