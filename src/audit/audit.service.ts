import { Injectable } from '@nestjs/common';
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

@Injectable()
export class AuditService {
  constructor(private prisma: PrismaService) {}

  async log(data: AuditLogData) {
    try {
      await this.prisma.auditLog.create({
        data: {
          tenantId: data.tenantId,
          action: data.action as any,
          resource: data.resource,
          resourceId: data.resourceId,
          userId: data.userId,
          userName: data.userName,
          method: data.method,
          path: data.path,
          metadata: data.metadata || {},
          success: data.success ?? true,
          errorMessage: data.errorMessage,
        },
      });
    } catch (error) {
      console.error('Failed to create audit log:', error);
    }
  }

  async getLogs(tenantId: string, options?: {
    action?: string;
    resource?: string;
    userId?: string;
    limit?: number;
  }) {
    const where: any = { tenantId };

    if (options?.action) {
      where.action = options.action;
    }

    if (options?.resource) {
      where.resource = options.resource;
    }

    if (options?.userId) {
      where.userId = options.userId;
    }

    return this.prisma.auditLog.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: options?.limit || 50,
    });
  }
}