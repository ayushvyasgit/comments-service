import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RateLimitService {
  constructor(private prisma: PrismaService) {}

  async checkRateLimit(
    tenantId: string,
    window: 'minute' | 'hour',
  ): Promise<{ allowed: boolean; remaining: number; limit: number }> {
    const tenant = await this.prisma.tenant.findUnique({
      where: { id: tenantId },
    });

    if (!tenant) {
      return { allowed: false, remaining: 0, limit: 0 };
    }

    const limit = window === 'minute' 
      ? tenant.rateLimitPerMinute 
      : tenant.rateLimitPerHour;

    const now = new Date();
    const windowStart = new Date(now);
    
    if (window === 'minute') {
      windowStart.setSeconds(0, 0);
    } else {
      windowStart.setMinutes(0, 0, 0);
    }

    // Count requests in current window from audit logs
    const count = await this.prisma.auditLog.count({
      where: {
        tenantId,
        createdAt: {
          gte: windowStart,
        },
        success: true,
      },
    });

    const allowed = count < limit;
    const remaining = Math.max(0, limit - count);

    return { allowed, remaining, limit };
  }

  async incrementCounter(tenantId: string) {
    // This is handled automatically by audit logging
    return true;
  }
}